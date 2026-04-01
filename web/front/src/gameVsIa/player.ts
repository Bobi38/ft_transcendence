import { Matrix, Mesh, PhysicsBody, PhysicsEventType, PhysicsMotionType, PhysicsShapeBox, PhysicsViewer, Plane, Quaternion, Scalar, Scene, ShadowGenerator, TransformNode, UniversalCamera, Vector2, Vector3 } from "@babylonjs/core";
import { PlayerInput } from "./playerInput";
import { Room } from "@colyseus/sdk";
import { App } from "./app";
import { BallSnapshot, SnapshotBuffer } from "./snapshots";
import { RacketHistory } from "./RacketHistory";

export class Player extends TransformNode {
    PLAYER_SPEED: number;
    public camera : UniversalCamera;
    public scene: Scene;
    public room: Room;
    private _input : PlayerInput;
    public mesh: Mesh;
    public racket: TransformNode;
    // public racketBody: PhysicsBody;
    public hand_node: TransformNode;
    public sessionId: string;
    private _app : App;
    private _controlsEnabled : boolean = false;
    public racketDimensions: Vector3;
    public racketOffset: Vector3;

    public impactSnapshots : SnapshotBuffer = new SnapshotBuffer();
    public racketHistory : RacketHistory = new RacketHistory();

    constructor(app: App, camera: UniversalCamera, assets, scene: Scene, shadows: ShadowGenerator[], room: Room) {
        super("player", scene);
        this.camera = camera;
        this._app = app;
        this.scene = scene;
        this.room = room;
        this.mesh = assets.mesh;
        this.mesh.parent = this;

        this.hand_node = assets.handNode;
        this.racket = assets.racketNode;
        this.racket.rotationQuaternion = Quaternion.Identity();
        shadows[0].addShadowCaster(this.mesh, true);
        shadows[1].addShadowCaster(this.mesh, true);
        shadows[0].usePercentageCloserFiltering = true;
        shadows[1].usePercentageCloserFiltering = true;
        shadows[0].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        shadows[1].filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        shadows[0].useContactHardeningShadow = true;
        shadows[1].useContactHardeningShadow = true;
        shadows[0].contactHardeningLightSizeUVRatio = 0.05;
        shadows[1].contactHardeningLightSizeUVRatio = 0.05;
    
        this.racketDimensions = new Vector3(2, 3.5, 0.5);
        this.racketOffset = new Vector3(0,1.5,0);
    }

    public getRacketHit() : Vector3 {
        const hitForward = this.camera.getForwardRay().direction.scale(2);
        const mouseDirAvg = (this._input.mouseDirBuffer.reduce((acc: Vector2, curr: Vector2) => curr.add(acc), Vector2.Zero()) as Vector2);
        mouseDirAvg.scaleInPlace(1/this._input.mouseBufferSize).normalize();
        if (mouseDirAvg.lengthSquared() > 0.001) {
            mouseDirAvg.normalize();
        } else {
            mouseDirAvg.set(0,0);
        }
        const hitDirection = new Vector3(mouseDirAvg.x, -mouseDirAvg.y, 0).add(hitForward).normalize();
        console.log(hitDirection);
        const mouseAvgSpeed = this._input.mouseSpeedBuffer.reduce((acc, curr) => acc + curr, 0) / this._input.mouseBufferSize;
        const power = Scalar.SmoothStep(50, 200, mouseAvgSpeed) / 10;
        console.log(mouseAvgSpeed, power);
        const newVel = hitDirection.scale(power);

        return newVel;
    }

    public updateBody() {
        if (!this._controlsEnabled)
            return ;
        this.mesh.moveWithCollisions(this._input.getMoveDirection());

        const playerPos = this.getPlayerPosition();
        //console.log(playerPos);
        //this.room.send("bodyMoved", {position: playerPos.asArray()});
    }

    public updateRacket(tick: number) {
        if (!this._controlsEnabled)
            return ;
        this.racket.position = this._input.getNewRacketPos();
        this.racket.rotationQuaternion = this._input.getNewRacketRot();
        // this.room.send("racketMoved", {position: this.racket.position.asArray(),
        //     rotation: this.racket.rotationQuaternion.asArray()});
        //this.racketHistory.record(tick, this.racket.position, this.racket.rotationQuaternion);
    }

    public getPlayerPosition() : Vector3 {
        return this.mesh.position.clone();
    }

    public setPlayerInput(input: PlayerInput) {
        this._input = input;
    }

    public getHandNode() : TransformNode {
        return this.hand_node;
    }

    public getRacketNode() : TransformNode {
        return this.racket;
    }

    public unlockControls() {
        this._controlsEnabled = true;
    }

    public lockControls() {
        this._controlsEnabled = false;
    }

    public setRacketPos(position: Vector3) {
        this.racket.position = position.clone();
    }

    public getRacketPos() : Vector3 {
        return this.racket.position.clone();
    }

    public setRacketRot(rotation: Quaternion) {
        this.racket.rotationQuaternion = rotation.clone();
    }

    public getRacketRot() : Quaternion {
        return this.racket.rotationQuaternion.clone();
    }

    public getRacketWorldMatrix(): Matrix {
        this.racket.computeWorldMatrix(true);
        return this.racket.getWorldMatrix().clone();
    }
}