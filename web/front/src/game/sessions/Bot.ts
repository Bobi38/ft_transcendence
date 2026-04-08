import { AbstractEngine, AbstractMesh, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Ball } from "../physics/Ball";
import { Environment } from "../physics/Environment";

enum SwingState {
    IDLE,
    WIND_UP,
    STRIKE,
    FOLLOW_THROUGH
}

const SWING_START_DIST : number = 15;

export class Bot {
    private _moveDirection : Vector3 = Vector3.Zero();
    private _newRacketPos : Vector3 = Vector3.Zero();
    private _newRacketRot : Quaternion = Quaternion.Identity();

    private _engine : AbstractEngine;
    private _ball : Ball;
    private _body: AbstractMesh;
    private _handNode : TransformNode;
    private _racket : TransformNode;
    private _movingTarget : Vector3;
    private _predictedBallPos : Vector3;
    private _timeToImpact : number;
    private _swingState: SwingState = SwingState.IDLE;
    private _swingTimer: number = 0;
    private _swingDirection: Vector3 = Vector3.Zero();
    private _wallMin: Vector3;
    private _wallMax: Vector3;

    constructor() {}

    public initializeBot(scene: Scene, ball: Ball, body: AbstractMesh, handNode: TransformNode, racketNode: TransformNode, env: Environment) {
        this._engine = scene.getEngine();
        this._body = body;
        this._ball = ball;
        this._handNode = handNode;
        this._racket = racketNode;
        this._wallMin = env.wallMin;
        this._wallMax = env.wallMax;

        scene.onBeforeRenderObservable.add(() => {
            this._predictBallTarget();
            this._swingRacketTarget();
            this._movementBody();
            this._movementRacket();
        })
    }

    private _predictBallTarget() {
        const ballPos = this._ball.getPhysicsBodyPosition();
        const ballVel = this._ball.getVelocity();
        
        this._timeToImpact = (this._handNode.absolutePosition.z - ballPos.z) / ballVel.z;

        let predictedX = ballPos.x + (ballVel.x * this._timeToImpact);
        let predictedY = ballPos.y + (ballVel.y * this._timeToImpact);
        if (ballVel.z == 0) {
            predictedX = ballPos.x;
            predictedY = ballPos.y;
        }

        this._predictedBallPos = new Vector3(predictedX, predictedY, this._handNode.position.z);
        //console.log(this._predictedBallPos);
    }

    private _swingRacketTarget() {
        if (this._swingState != SwingState.IDLE)
            this._swingTimer += this._engine.getDeltaTime() / 1000;
        const ballPos = this._ball.getPhysicsBodyPosition();

        switch (this._swingState) {
            case SwingState.IDLE:
                const handPos = this._handNode.absolutePosition;
                const distance = Vector3.Distance(ballPos, handPos);
                if (distance <= SWING_START_DIST) {
                    this._swingState = SwingState.WIND_UP;
                    this._swingTimer = 0;
                    this._swingDirection = this._predictedBallPos.subtract(handPos);
                    const ballVel = this._ball.getVelocity();
            
                    if (ballVel.lengthSquared() > 0.1) {
                        this._swingDirection = new Vector3(ballVel.x, ballVel.y, 0).normalize();
                    } else {
                        const dirToBall = ballPos.subtract(this._handNode.absolutePosition);
                        this._swingDirection = Vector3.Cross(dirToBall, Vector3.Up()).normalize();
                    }
                }
                this._movingTarget = this._predictedBallPos;
                break;
            case SwingState.WIND_UP:
                if (this._swingTimer >= 1) { // Wind-up lasts 0.4 seconds
                    this._swingState = SwingState.STRIKE;
                } else {
                    const offset = this._swingDirection.scale(-10);
                    //offset.y -= 1.5; 
                    this._movingTarget = this._predictedBallPos.add(offset);
                }
                break;
            case SwingState.STRIKE:
                if (this._swingTimer > 1.2) { // Strike lasts 0.2 seconds (0.4 to 0.6)
                    this._swingState = SwingState.FOLLOW_THROUGH;
                } else {
                    this._movingTarget = this._predictedBallPos;
                }
                break;
            case SwingState.FOLLOW_THROUGH:
                if (this._swingTimer > 2) { // Follow-through ends at 1.0 seconds
                    this._swingState = SwingState.IDLE;
                } else {
                    const offset = this._swingDirection.scale(10);
                    //offset.y += 2; 
                    this._movingTarget = this._predictedBallPos.add(offset);
                }
                break;
        }
    }

    private _movementBody() {
        let horizontal = Vector3.Zero();
        const deadzone = 1;

        if (this._predictedBallPos.x > this._handNode.absolutePosition.x + deadzone) {
            horizontal = Vector3.Lerp(horizontal, new Vector3(1, 0, 0), 0.2);
        } 
        else if (this._predictedBallPos.x < this._handNode.absolutePosition.x - deadzone) {
            horizontal = Vector3.Lerp(horizontal, new Vector3(-1, 0, 0), 0.2);
        } else {
            horizontal = Vector3.Zero();
        }
        this._moveDirection = horizontal;//.normalize();
    }

    private _movementRacket() {
        const invertedWorldMatrix = this._handNode.computeWorldMatrix(true).clone().invert();
        const localTargetPos = Vector3.TransformCoordinates(this._movingTarget, invertedWorldMatrix);
        const relativePos = localTargetPos.subtract(this._handNode.position);

        const maxRadius : number = 5; 
        relativePos.normalize().scaleInPlace(maxRadius);

        const oldPos = this._racket.position;
        this._newRacketPos = Vector3.Lerp(oldPos, relativePos, 0.15);// relativePos;

        const localAxisY = relativePos.clone().normalize(); 
        let movementDir = relativePos.subtract(oldPos);
        let localAxisX: Vector3;
        
        if (movementDir.lengthSquared() < 0.001) {
            localAxisX = Vector3.Cross(localAxisY, Vector3.RightHandedForwardReadOnly);
        } else {
            localAxisX = Vector3.Cross(localAxisY, movementDir);
        }
        
        if (localAxisX.lengthSquared() < 0.001) {
            localAxisX = Vector3.Cross(localAxisY, new Vector3(0, 1, 0));
            if (localAxisX.lengthSquared() < 0.001) {
                localAxisX = Vector3.Cross(localAxisY, new Vector3(1, 0, 0));
            }
        }
        
        localAxisX.normalize();
        const localAxisZ = Vector3.Cross(localAxisX, localAxisY).normalize();
        const targetRotation = Quaternion.RotationQuaternionFromAxis(localAxisX, localAxisY, localAxisZ);

        if (!this._racket.rotationQuaternion) {
            this._newRacketRot = targetRotation;
        } else {
            this._newRacketRot = Quaternion.Slerp(this._racket.rotationQuaternion, targetRotation, 0.2);
        }
    }

    public getNewMeshPos() {
        const newPos = this._moveDirection.clone().add(this._body.position);
        const bodySize : number = 1.;
        if (newPos.x - bodySize < this._wallMin.x)
            newPos.x = this._wallMin.x + bodySize;
        if (newPos.x + bodySize > this._wallMax.x)
            newPos.x = this._wallMax.x - bodySize;
        return newPos;
    }

    public getNewRacketPos() : Vector3 {
        return this._newRacketPos.clone();
    }

    public getNewRacketRot() : Quaternion {
        return this._newRacketRot.clone();
    }

    public getSwingDirection() : Vector3 {
        return this._swingDirection.clone();
    }

    public dispose() {
        this._engine = null;
        this._ball = null;
        this._body = null;
        this._handNode = null;
        this._racket = null;
    }
}