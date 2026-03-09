import { Mesh, Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core";
import { Room } from "@colyseus/sdk";

export class Enemy extends TransformNode {
    private _mesh : Mesh;
    private _room : Room;
    private _newPos: Vector3;
    
    constructor(scene: Scene, assets, shadow: ShadowGenerator, room: Room) {
        super("enemy", scene);
        this._mesh = assets.mesh;
        this._room = room;
        this._newPos = this._mesh.position;
        shadow.addShadowCaster(this._mesh, true);
    }

    public updatePosition(newPos: Vector3) {
        this._newPos = newPos.clone();
    }

    public updateBody() {
        //this._mesh.position = this._newPos.clone();
        //console.log(this._mesh.position);
        this._mesh.position = Vector3.Lerp(this._mesh.position, this._newPos, 0.4);
    }
}