import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";

export class PlayerCamera {
    private _camera : UniversalCamera;
    private _rootPos : Vector3;

    constructor(scene: Scene) {
        this._rootPos = new Vector3(0,3,-23);
        this._camera = new UniversalCamera("cam", this._rootPos, scene);
        this._camera.fov = 0.47;
        scene.activeCamera = this._camera;
    }

    public updateCamera(playerPos: Vector3) {
        const cameraOffset = new Vector3(0,3,-23);
        let newPos = playerPos.add(this._rootPos);
        this._camera.position = Vector3.Lerp(this._camera.position, newPos, 0.4);
    }

    public getUniversalCamera() : UniversalCamera {
        return this._camera;
    }
}