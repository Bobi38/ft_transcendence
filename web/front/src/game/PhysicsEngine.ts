import { Vector3 } from "@babylonjs/core";
import { Ball } from "./Ball";
import { BallSnapshot, SnapshotBuffer } from "./Snapshots";
import { SynchronizedClock } from "./SynchronizedClock";
import { NetworkSessionManager } from "./NetworkSessionManager";
import { Player } from "./Player";
import { Environment } from "./Environment";
import { Enemy } from "./Enemy";
import { PlayerCamera } from "./PlayerCamera";
import { RacketHistory } from "./RacketHistory";
import { GameSession } from "./GameSession";
import { Character } from "./Character";

const TIMESTEP = 1/60;

export class PhysicsEngine {
    private _clock: SynchronizedClock;
    private _session: GameSession;
    private _ball: Ball;
    private _player: Player;
    private _enemy: Enemy;
    private _camera: PlayerCamera;
    private _environment: Environment;
    private _pendingImpact : BallSnapshot = null;
    private _impactSnapshots : SnapshotBuffer = new SnapshotBuffer();
    private _racketHistory : RacketHistory = new RacketHistory();
    private _isResimming : boolean = false;
    private _isOffline : boolean;


    constructor(clock: SynchronizedClock, session: GameSession, isOffline: boolean) {
        this._clock = clock;
        this._session = session;
        this._isOffline = isOffline;
    }

    
    public stepPhysics(deltaTime: number) {
        this._clock.updateAccumulator(deltaTime);
            this._checkPendingImpact();
            this._ball.correctPosAndVel();
            while (this._clock.getAccumulator() >= TIMESTEP * 1000) {
                this._updatePlayerAndEnemy();
                this._executeStep();
                this._checkRacketCollision();
                this._checkWallCollision();
                this._ball.snapshots.saveSnapshot({tick: this._clock.tick, position: this._ball.getPhysicsBodyPosition(), velocity: this._ball.getVelocity()});
                this._clock.tick++;
                this._clock.setbackAccumulator();
            }
            this._ball.smoothPosition();
    }

    private _checkPendingImpact() {
        if (!this._pendingImpact)
            return ;
        const preRollbackPos = this._ball.getPhysicsBodyPosition();
        this.resimulatePhysicTicks(this._pendingImpact);
        const postRollbackPos = this._ball.getPhysicsBodyPosition();
        const teleportDelta = preRollbackPos.subtract(postRollbackPos);
        this._ball.visualOffset.addInPlace(teleportDelta);
        console.log("Other player hit the ball");
        this._pendingImpact = null;
    }

    private _updatePlayerAndEnemy() {
        if (this._player) {
            this._player.updateBody();
            const racketMove = this._player.updateRacket();
            if (racketMove)
                this._racketHistory.record(racketMove);
            this._camera.updateCamera(this._player.getPlayerPosition());
        }
        if (this._enemy) {
            this._enemy.updateBody();
            this._enemy.updateRacket();
        }
    }

    private _executeStep() {
        const oldPos = this._ball.getPhysicsBodyPosition();
        const newPos = oldPos.add(this._ball.getVelocity().scale(TIMESTEP));
        this._ball.setPhysicsBodyPosition(newPos);
    }

    private _checkRacketCollision(impactSnapshot? : BallSnapshot) {
    this._collideWithRacket(this._player, false, impactSnapshot);

    if (this._isOffline && this._enemy) {
        this._collideWithRacket(this._enemy, true);
    }
}

    private _collideWithRacket(racketHolder: Character, isBot: boolean, impactSnapshot?: BallSnapshot) {
        const ballPos = this._ball.getPhysicsBodyPosition();
        const racketWorldMatrix = racketHolder.getRacketWorldMatrix();
        const invRacketMatrix = racketWorldMatrix.clone().invert();
        const localBallPos = Vector3.TransformCoordinates(ballPos, invRacketMatrix);
        localBallPos.subtractInPlace(this._player.racketOffset);

        const halfWidth = this._player.racketDimensions.x / 2;
        const halfHeight = this._player.racketDimensions.y / 2;
        const halfDepth = this._player.racketDimensions.z / 2;

        const closestX = Math.max(-halfWidth,  Math.min(localBallPos.x, halfWidth));
        const closestY = Math.max(-halfHeight, Math.min(localBallPos.y, halfHeight));
        const closestZ = Math.max(-halfDepth,  Math.min(localBallPos.z, halfDepth));
        const closest = new Vector3(closestX, closestY, closestZ);
        const distanceSquared = localBallPos.subtract(closest).lengthSquared();

        if (distanceSquared < (this._ball.radius ** 2)) {
            let newVel : Vector3;
            if (this._isResimming) {
                newVel = impactSnapshot.velocity;
            } else {
                newVel = racketHolder.getRacketHit();
            }
            this._ball.setVelocity(newVel);
            if (!this._isResimming && !isBot && !this._isOffline) {
                const snapshot = {position: ballPos, velocity: newVel, tick: this._clock.tick};
                this._session.sendRacketImpact(snapshot);
                this._impactSnapshots.saveSnapshot(snapshot);
                this._ball.ignoreServerAfter = this._clock.tick;
            }
        }
    }

    private _checkWallCollision() {
        const ballPos = this._ball.getPhysicsBodyPosition();
        const radius = this._ball.radius;
        const min = this._environment.wallMin;
        const max = this._environment.wallMax;

        const ballVel : Vector3 = this._ball.getVelocity();
        if (ballPos.x - radius < min.x) {
            ballPos.x = min.x + radius;
            ballVel.x *= -1;
        } else if (ballPos.x + radius > max.x) {
            ballPos.x = max.x - radius;
            ballVel.x *= -1;
        }

        if (ballPos.y - radius < min.y) {
            ballPos.y = min.y + radius;
            ballVel.y *= -1;
        } else if (ballPos.y + radius > max.y) {
            ballPos.y = max.y - radius;
            ballVel.y *= -1;
        }

        this._ball.setPhysicsBodyPosition(ballPos);
        this._ball.setVelocity(ballVel);
    }

    public resimulatePhysicTicks(correction: BallSnapshot) {
        const startingTick = correction.tick;
        const ticksToResimulate = this._clock.tick - startingTick;
        this._ball.setPhysicsBodyPosition(correction.position);
        this._ball.setVelocity(correction.velocity);
        this._ball.snapshots.clearAfterTickIncluded(startingTick);
        this._ball.snapshots.saveSnapshot(correction);
        this._isResimming = true;
        for (let i = 1; i < ticksToResimulate; i++) {
            const simulatingTick = startingTick + i;
            const historicalRacket = this._racketHistory.get(simulatingTick);
            if (historicalRacket) {
                this._player.setRacketPos(historicalRacket.position);
                this._player.setRacketRot(historicalRacket.rotation);
            }
            this._executeStep();
            const impactSnapshot = this._impactSnapshots.getSnapshotAtTick(simulatingTick);
            if (impactSnapshot)
                this._checkRacketCollision(impactSnapshot.snapshot);
            this._checkWallCollision();
            this._ball.snapshots.saveSnapshot({tick: simulatingTick, position: this._ball.getPhysicsBodyPosition(), velocity: this._ball.getVelocity()});
        }
        this._isResimming = false;
    }

    public updatePhysicsOnGoalScored(goalData: any) {
        const tick = goalData.tick;
        const newPos = new Vector3(goalData.position[0], goalData.position[1], goalData.position[2]);
        this._ball.setPhysicsBodyPosition(newPos);
        this._ball.setMeshPosition(Vector3.Zero());
        this._ball.setVelocity(Vector3.Zero());
        //this._ball.setAngularVelocity(Vector3.Zero());
        this._ball.ignoreServerUntil = tick;
        this._ball.snapshots.dispose();
        console.log("A point has been won at tick:", this._clock.tick, "and server tick:", tick);
    }

    public updateBallOnOpponentHit(hitData: any) {
        const ballPos = new Vector3(hitData.position[0], hitData.position[1], hitData.position[2]);
        const ballVel = new Vector3(hitData.velocity[0], hitData.velocity[1], hitData.velocity[2]);
        this._pendingImpact = {tick: hitData.tick, position: ballPos, velocity: ballVel};
    }

    public updateFlagsOnImpactResponse(tick: number) {
        this._ball.recentImpact = false;
        this._ball.ignoreServerAfter = null;
        this._ball.ignoreServerUntil = tick;
        console.log("server acknowledges impact at tick:", tick);
    }

    public setBall(ball: Ball) {
        this._ball = ball;
    }

    public setPlayer(player: Player) {
        this._player = player;
    }

    public setCamera(camera: PlayerCamera) {
        this._camera = camera;
    }

    public setEnemy(enemy: Enemy) {
        this._enemy = enemy;
    }

    public async setEnvironment(env: Environment) {
        this._environment = env;
        await this._environment.load();
    }
}