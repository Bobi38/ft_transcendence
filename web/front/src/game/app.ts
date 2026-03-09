import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin, Quaternion, Epsilon, UniversalCamera} from "@babylonjs/core";
import { Callbacks, Client, Room } from "@colyseus/sdk";
import { Environment } from "./environment";
import { PlayerInput } from "./playerInput";
import { Player } from "./player";
import HavokPhysics from "@babylonjs/havok";
import { Ball } from "./ball";
import { MyRoomState } from "./schema/MyRoomState";
import { StateCallbackStrategy } from "@colyseus/schema";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _environment: Environment;
    private _player: Player;
    private _camera: UniversalCamera;
    private MAX_SPEED: number = 40;
    private _ball: Ball;
    private _room : Room<MyRoomState>;
    private _callback : StateCallbackStrategy<MyRoomState>;
    private _shadow : ShadowGenerator;
    public playerAssets;
    public enemyAssets;

    // private _createCanvas() {
    //     var canvas = document.getElementById("wingame");
    //     canvas.style.width = "100%";
    //     canvas.style.height = "100%";
    //     return canvas;
    // }

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error("Canvas is undefined");
        // create the canvas html element and attach it to the webpage
        this._canvas = canvas;

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true, {adaptToDeviceRatio: true});
        this._scene = new Scene(this._engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && (ev.key === "I" || ev.key === "i")) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        this._main();
    }

    private async _main(): Promise<void> {
        let colyseusSDK = new Client("ws://localhost:2567");
        const room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room");
        console.log("Joined room " + room.roomId);
        this._room = room;
        const callback = Callbacks.get(room);
        this._callback = callback;
        await this._start();

        callback.listen("started", () => {
            if (!this._room.state.started)
                return ;
            console.log("Game has started");
            this._player.unlockControls();
        });

        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private async _start() : Promise<void> {
        this._engine.displayLoadingUI();
        await this._setupGame();
        await this._scene.whenReadyAsync();
        // this._scene.onBeforePhysicsObservable.add(() => {
        //     console.log(this._ball.getMeshPosition());
        //     console.log(this._ball.getVelocity());
        // });
        this._engine.hideLoadingUI();
    }


    private async _setupGame() {
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0.015, 0.015, 0.2);
        this._scene = scene;

        const environment = new Environment(scene);
        this._environment = environment;

        const havokInstance = await HavokPhysics({
            locateFile: (file) => `/node_modules/@babylonjs/havok/lib/esm/${file}`
        });
        const havokPlugin = new HavokPlugin(true, havokInstance);
        havokPlugin.setTimeStep(1/60);
        this._scene.enablePhysics(new Vector3(0, 0, 0), havokPlugin); //no gravity (middle value at 0)

        await this._environment.load();
        this._shadow = await this._initializeGameAsync(scene);

        this._callback.onAdd("players", (player, sessionId) => {
            console.log("player added:", sessionId);
            if (sessionId === this._room.sessionId) {
                const playerPos = new Vector3(player.position.x, player.position.y, player.position.z);
                console.log(playerPos);
                this._setupPlayer(playerPos, player.sideNear);
            }
            else {
                const enemyPos = new Vector3(player.position.x, player.position.y, player.position.z);
                console.log(enemyPos);
                this._setupEnemy(enemyPos, player.sideNear);
            }
        });
    }

    private async _initializeGameAsync(scene: Scene): Promise<ShadowGenerator> {
        let light = new PointLight('PointLight', new Vector3(0,5,0), scene);
        light.diffuse = new Color3(1,1,1);
        light.intensity = 1;

        let shadow = new ShadowGenerator(1024, light);
        shadow.darkness = 0.4;
        
        let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
        this._ball = new Ball(ballPos, 1, this.MAX_SPEED, shadow, this._scene);
        this._scene.onBeforeRenderObservable.add(() => {
            if (this._ball.getMeshPosition()._z < -23) {
                this._ball.dispose();
                let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
                this._ball = new Ball(ballPos, 1, this.MAX_SPEED, shadow, this._scene);
            }
        });
        
        this._callback.onChange(this._room.state.ball.position, () => {
            const newPos = new Vector3(this._room.state.ball.position.x,this._room.state.ball.position.y,this._room.state.ball.position.z);
            //console.log(this._ball.getMeshPosition());
            //this._ball.setMeshPosition(newPos);
            this._ball.positionError = newPos.subtract(this._ball.getMeshPosition());
            //console.log(newPos);
            //console.log("something happened");
        });
        this._callback.onChange(this._room.state.ball.velocity, () => {
            const newVel = new Vector3(this._room.state.ball.velocity.x,this._room.state.ball.velocity.y,this._room.state.ball.velocity.z);
            this._ball.setVelocity(newVel);
        });
        this._scene.onBeforeRenderObservable.add(() => {
            console.log(this._ball.positionError);
            if (!this._ball.positionError)
                return ;
            const patchRate = 0.05; //in seconds
            const dt = this._engine.getDeltaTime() / 1000; // time between frames in seconds
            const fractionElapsed = patchRate / dt;
            const correctionFactor = 1 - Math.pow(0.05, fractionElapsed);
            const ballPos = this._ball.getMeshPosition();
            this._ball.setMeshPosition(ballPos.add(this._ball.positionError.scale(correctionFactor)));
            this._ball.positionError.scaleInPlace(1 - correctionFactor);
            if (this._ball.positionError.lengthSquared() < Epsilon)
                this._ball.positionError = null;
        });
        return shadow;
    }

    private _updateCamera(isNearSide: boolean) {
        let cameraOffset;
        if (isNearSide)
            cameraOffset = new Vector3(0,3,-23);
        else
            cameraOffset = new Vector3(0,3,33);
        let newPos = this._player.getPlayerPosition().add(cameraOffset);
        this._camera.position = Vector3.Lerp(this._camera.position, newPos, 0.4);
    }

    private _setupPlayerCamera(isNearSide: boolean) {
        if (isNearSide)
            this._camera = new UniversalCamera("cam", new Vector3(0,3,-23), this._scene);
        else {
            this._camera = new UniversalCamera("cam", new Vector3(0,3, 33), this._scene);
            this._camera.rotation = new Vector3(0, Math.PI, 0);
        }
        this._camera.fov = 0.47;
        this._scene.activeCamera = this._camera;
    }

    private async _setupPlayer(position: Vector3, isNearSide: boolean) {
        this.playerAssets = await this._loadCharacterAssets(position);
        this._setupPlayerCamera(isNearSide);
        this._player = new Player(this.playerAssets, this._scene, this._shadow, this._room);
        this._player.setPlayerInput(
            new PlayerInput(this._scene, this._camera, this._player.getHandNode(), this._player.getRacketNode()));
        this._scene.registerBeforeRender(() => {
            this._player.updateBody();
            this._player.updateRacket();
            this._updateCamera(isNearSide);
        });
    }

    private async _setupEnemy(position: Vector3, isNearSide: boolean) {
        this.enemyAssets = await this._loadCharacterAssets(position);
    }

        private async _loadCharacterAssets(position: Vector3): Promise<{mesh: Mesh, handNode: TransformNode, racketNode: TransformNode}> {
            let body = MeshBuilder.CreateCylinder("body", {height: 3, diameter: 1.5}, this._scene);

            body.isVisible = false;

            body.position = position;
            let bodymtl = new StandardMaterial("red", this._scene);
            bodymtl.diffuseColor = Color3.Red();
            body.material = bodymtl;
            body.isPickable = false;
            const hand_node = new TransformNode("hand_node", this._scene)
            hand_node.position = new Vector3(0.4, 2, 1);
            const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.5});
            hand.material = bodymtl;

            let racketmtl = new StandardMaterial("white", this._scene);
            racketmtl.diffuseColor = new Color3(0.4,0.2,0);
            let stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.2, height: 0.8});
            stick.position._y = 0.4;
            stick.material = racketmtl;
            const racket = MeshBuilder.CreateCylinder("racket", {diameter: 1, height: 0.2});
            racket.material = racketmtl;
            racket.position._y = 0.7;
            //racket.rotation = new Vector3(Math.PI / 2, 0, 0);
            racket.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
            
            let racketRoot = new TransformNode("racketRoot", this._scene);
    
            racket.parent = stick;
            stick.parent = hand;
            hand.parent = racketRoot;
            racketRoot.parent = hand_node;
            hand_node.parent = body;
            return { mesh: body, handNode: hand_node, racketNode: racketRoot};
        }
}
