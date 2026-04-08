import { EventEmitter } from "./EventEmitter";
import { GameSession} from "./GameSession"
import { SynchronizedClock} from "../utils/SynchronizedClock"
import { RoomStatus } from "../App"
import { GameState } from "./GameState";
import { AbstractMesh, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Bot } from "./Bot";
import { Ball } from "../physics/Ball";
import { Environment } from "../physics/Environment";

const farBallStart = new Vector3(0,3,34.5);
const nearBallStart = new Vector3(0,3,-12);

export class LocalSessionManager extends EventEmitter implements GameSession {
    private _gameState: GameState;
    private _clock: SynchronizedClock;
    private _bot: Bot;
    private _served: boolean = true;

    constructor(gameState: GameState, clock: SynchronizedClock) {
        super();
        this._gameState = gameState;
        this._clock = clock;
        this._bot = new Bot();
    }

    public async initialize(): Promise<void> {
        this._gameState.gameStatus = RoomStatus.STARTED;
        this._gameState.teamNear = 0;
        this._gameState.teamFar = 0;
        
        this._clock.setInitialClientClock(0);

        this._setupPlayerAndBot(new Vector3(0, 0.5, -20), new Vector3(0, 0.5, 40));
        this._gameState.ballPos = nearBallStart;
        this._gameState.ballVel = Vector3.Zero();

        this.emit("onGameStatusChange", RoomStatus.STARTED);
        this.emit("onReady");
    }

    public update() {
        const enemyState = this._gameState.players.get("enemy");
        enemyState.pos = this._bot.getNewMeshPos();
        enemyState.rackPos = this._bot.getNewRacketPos();
        enemyState.rackRot = this._bot.getNewRacketRot();
        enemyState.rackSwing = this._bot.getSwingDirection();
    }

    public emitGoalScored(teamNearScored: boolean) {
        if (teamNearScored) this._gameState.teamNear++;
        else this._gameState.teamFar++;

        this.emit('onScoreChange', this._gameState.teamNear, this._gameState.teamFar);

        let ballPos : Vector3;
        if (!this._served) {
          ballPos = nearBallStart;
          this._served = true;
        } else {
          ballPos = farBallStart;
          this._served = false;
        }
        this.emit('onGoalScored', { tick: this._clock.tick, position: ballPos.asArray()});
        if (this._gameState.teamFar >= 3 || this._gameState.teamNear >= 3) {
            this._gameState.gameStatus = RoomStatus.WON;
            this.emit('onGameStatusChange', this._gameState.gameStatus);
        }
    }

    public setupEnemy(scene: Scene, ball: Ball, body: AbstractMesh, handNode: TransformNode, racketNode: TransformNode, env: Environment) {
        this._bot.initializeBot(scene, ball, body, handNode, racketNode, env);
    }

    private _setupPlayerAndBot(playerPos: Vector3, enemyPos: Vector3) {
        const playerId : string = "player";
        this._gameState.players.set(playerId, {isPlayer: true, pos: playerPos,
            rackPos: Vector3.Zero(), rackRot: Quaternion.Identity(),
            sideNear: true, connected: true, rackSwing: Vector3.Zero()});
        this.emit("onPlayerJoined", playerId, playerPos, true)
    
        const enemyId : string = "enemy";
        this._gameState.players.set(enemyId, {isPlayer: false, pos: enemyPos,
            rackPos: Vector3.Zero(), rackRot: Quaternion.Identity(),
            sideNear: false, connected: true, rackSwing: Vector3.Zero()});
        this.emit("onEnemyJoined", enemyId, enemyPos, false);
    }

    public sendRacketImpact(ballState: any) {}
    public sendUpdateBody(pos: any) {}
    public sendUpdateRacket(rackPos: any, rackRot: any) {}
    public setVoluntaryLeave(): void {}
    
    public async leave(): Promise<void> {}

    public async dispose() {
        this.clear();
        this._gameState = null;
        this._clock = null;
        this._bot?.dispose();
        this._bot = null;
    }
}