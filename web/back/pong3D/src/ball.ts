import { Vector3, TransformNode, Scene } from "@babylonjs/core";

export class Ball {
    private _velocity: Vector3 = Vector3.Zero();
    private _node: TransformNode;
    public  radius: number;
    private _scene: Scene;


    constructor(position: Vector3, velocity: Vector3, diameter: number, scene: Scene) {
        this.radius = diameter / 2;

        const ballNode = new TransformNode("ballNode", this._scene);
        ballNode.position = position;
        this._node = ballNode;
        this._velocity = velocity;
    }

    public dispose() {
        this._node.dispose();
        this._node = null;
    }

    public setVelocity(velocity : Vector3) {
        this._velocity = velocity.clone();
    }

    public setPhysicsBodyPosition(position: Vector3) {
        this._node.position = position.clone();
    }

    public getPhysicsBodyPosition() : Vector3 {
        return this._node.position.clone();
    }

    public getVelocity() : Vector3 {
        return this._velocity.clone();    }
}