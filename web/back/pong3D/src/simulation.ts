import { Scene, NullEngine, ArcRotateCamera, Vector3, Engine } from "@babylonjs/core";
import { Ball } from "./ball.js";
import { Environment } from "./environment.js";
import { MyRoomState, RoomStatus } from "./rooms/schema/MyRoomState.js";
import { SnapshotBuffer, BallSnapshot } from "./snapshots.js";
import { MyRoom, PlayerStats } from "./rooms/MyRoom.js";

const TIMESTEP : number = 1/60;

export class Simulation {
    private _room : MyRoom;
    private _state : MyRoomState;
    private _scene : Scene;
    private _engine: NullEngine;
    private _ball: Ball;
    private _environment: Environment = new Environment();
    private _tick: number = 0;
    private _impactSnapshots : SnapshotBuffer = new SnapshotBuffer();
    private _snapshotToSend : BallSnapshot;
    private _pendingImpact : BallSnapshot = null;
    private _served : boolean = true;
    private _timeEnd: number;
    private _matchStats = new Map<string, PlayerStats>();


    constructor(room: MyRoom, state: MyRoomState, matchStats: Map<string, PlayerStats>) {
        this._room = room;
        this._state = state;
        this._matchStats = matchStats;
        const engine = new NullEngine();
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), scene); //necessary for scene.render()
        this._scene = scene;
        this._engine = engine;
        this._ball = new Ball(new Vector3(state.ball.position.x, state.ball.position.y, state.ball.position.z),
          Vector3.Zero(), 1, scene);
        this._runSimulation();
    }

    private async _runSimulation() {
        this._engine.runRenderLoop(() => {
          if (this._state.roomStatus == RoomStatus.STARTED) {
            this._checkPendingImpacts();
            this._executeStep();
            const racketImpact = this._impactSnapshots.getSnapshotAtTick(this._tick)
            if (racketImpact && racketImpact.snapshot && racketImpact.snapshot.tick === this._tick) {
              this._ball.setPhysicsBodyPosition(racketImpact.snapshot.position.clone());
              this._ball.setVelocity(racketImpact.snapshot.velocity.clone());
            }
            this._checkWallCollision();
            this._checkIfPointWon();
            this._snapshotToSend = {tick: this._tick,position: this._ball.getPhysicsBodyPosition(), velocity: this._ball.getVelocity()};
            this._tick++;
          }
          this._scene.render();
        });
      }

    private _executeStep() {
        const oldPos = this._ball.getPhysicsBodyPosition();
        const newPos = oldPos.add(this._ball.getVelocity().scale(TIMESTEP));
        this._ball.setPhysicsBodyPosition(newPos);
    }

    public _checkWallCollision() {
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

  private _checkPendingImpacts() {
    if (!this._pendingImpact)
      return ;
    const ticksToResimulate = this._tick - this._pendingImpact.tick;
    console.log("tick:", this._tick, "impactTick:", this._pendingImpact.tick, "ticks to resim:", ticksToResimulate);
    if (ticksToResimulate <= 0) {
      this._impactSnapshots.saveSnapshot(this._pendingImpact.tick, this._pendingImpact.position, this._pendingImpact.velocity);
    } else {
      this._ball.setPhysicsBodyPosition(this._pendingImpact.position);
      this._ball.setVelocity(this._pendingImpact.velocity);
      for (let i = 0; i < ticksToResimulate; i++) {
          this._executeStep();
          this._checkWallCollision();
      }
    }
    this._pendingImpact = null;
  }

  // private _checkIfPointWon() {
  //   let ballPos = this._ball.getPhysicsBodyPosition();
  //     if (ballPos.z < -33) {
  //       console.log("Team Far won a point");
  //       this._state.score.teamFar++;
  //       this._matchStats.get()
  //       this._room.getTokens().get(this._room.getFar()).score++;
  //       if (this._state.score.teamFar >= 3) {
  //         this._state.roomStatus = RoomStatus.WON;
  //         this._room.getTokens().get(this._room.getFar()).hasWon = true;
  //         this._timeEnd = Date.now();
  //       }
  //     }
  //     else if (ballPos.z > 50) {
  //       console.log("Team Near won a point");
  //       this._state.score.teamNear++;
  //       this._room.getTokens().get(this._room.getNear()).score++;
  //       if (this._state.score.teamNear >= 3) {
  //         this._state.roomStatus = RoomStatus.WON;
  //         this._room.getTokens().get(this._room.getNear()).hasWon = true;
  //         this._timeEnd = Date.now();
  //       }
  //     }
  //     if (ballPos.z < -33 || ballPos.z > 50) {
  //       this._ball.setVelocity(Vector3.Zero());
  //       //this._ball.setAngularVelocity(Vector3.Zero());
  //       this._state.ball.velocity.x = 0;
  //       this._state.ball.velocity.y = 0;
  //       this._state.ball.velocity.z = 0;
  //       this._state.ball.position.x = 0;
  //       this._state.ball.position.y = 3;
  //       if (!this._served) {
  //         ballPos = new Vector3(0,3,-12);
  //         this._ball.setPhysicsBodyPosition(ballPos);
  //         this._state.ball.position.z = -12;
  //         this._served = true;
  //       } else {
  //         ballPos = new Vector3(0,3,34.5);
  //         this._ball.setPhysicsBodyPosition(ballPos);
  //         this._state.ball.position.z = 34.5;
  //         this._served = false;
  //       }
        
  //       this._room.broadcast('Goal!', {tick: this._tick, position: ballPos.asArray()},{ afterNextPatch: true });
  //     }
  // }

  private _checkIfPointWon() {
    let ballPos = this._ball.getPhysicsBodyPosition();
    let pointScored = false;
    let winningSide: "near" | "far" | null = null;

    if (ballPos.z < -33) {
        winningSide = "far";
    } else if (ballPos.z > 50) {
        winningSide = "near";
    }

    if (winningSide) {
        pointScored = true;
        const winnerStats = Array.from(this._matchStats.values()).find(s => s.side === winningSide);

        if (winnerStats) {
            winnerStats.score++;
            console.log(`Team ${winningSide} (${winnerStats.id}) won a point. Score: ${winnerStats.score}`);

            if (winningSide === "far") {
                this._state.score.teamFar++;
                if (this._state.score.teamFar >= 3) {
                    winnerStats.hasWon = true;
                    this._state.roomStatus = RoomStatus.WON;
                    this._timeEnd = Date.now();
                }
            } else {
                this._state.score.teamNear++;
                if (this._state.score.teamNear >= 3) {
                    winnerStats.hasWon = true;
                    this._state.roomStatus = RoomStatus.WON;
                    this._timeEnd = Date.now();
                }
            }
        }
    }

    if (pointScored) {
        this._resetBallAfterGoal(ballPos);
    }
}

private _resetBallAfterGoal(ballPos: Vector3) {
    this._ball.setVelocity(Vector3.Zero());
    this._state.ball.velocity.x = 0;
    this._state.ball.velocity.y = 0;
    this._state.ball.velocity.z = 0;
    this._state.ball.position.x = 0;
    this._state.ball.position.y = 3;


    if (!this._served) {
        ballPos = new Vector3(0, 3, -12);
        this._state.ball.position.z = -12;
        this._served = true;
    } else {
        ballPos = new Vector3(0, 3, 34.5);
        this._state.ball.position.z = 34.5;
        this._served = false;
    }
    this._ball.setPhysicsBodyPosition(ballPos);
    
    this._room.broadcast('Goal!', { tick: this._tick, position: ballPos.asArray() }, { afterNextPatch: true });
}



  public dispose() {
    this._ball.dispose();

    if (this._scene) {
        this._scene.dispose();
        this._scene = null;
    }
    this._engine.dispose();
    this._engine = null;
  }

  public getTick() : number {
    return this._tick;
  }

  public setPendingImpact(impact: BallSnapshot) {
    this._pendingImpact = impact;
  }

  public getSnapshotToSend() : BallSnapshot {
    return this._snapshotToSend;
  }

  public getEngine() : Engine {
    return this._engine;
  }

  public getTimeEnd() : number {
    return this._timeEnd;
  }
}