import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin, Quaternion} from "@babylonjs/core";
import { Client, Room } from "@colyseus/sdk";
import { Environment } from "./environment";
import { PlayerInput } from "./playerInput";
import { Player } from "./player";
import HavokPhysics from "@babylonjs/havok";
import { Ball } from "./ball";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _environment: Environment;
    private _input: PlayerInput;
    private _player: Player;
    private MAX_SPEED: number = 40;
    private _ball: Ball;
    private _room : Room;
    public assets;


    // private _createCanvas() {
    //     var canvas = document.getElementById("wingame");
    //     canvas.style.width = "100%";
    //     canvas.style.height = "100%";
    //     return canvas;
    // }

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error("Canvas is undefined");
        // create the canvas html element and attach it to the webpage
        this._canvas = canvas

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
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        console.log("iciiiiiiii====   " , `${protocol}//${host}/ws/goat`);
        let colyseusSDK = new Client(`${protocol}//${host}/ws/goat`);
        // let colyseusSDK = new Client("ws://localhost:2567");
        const room = await colyseusSDK.joinOrCreate("my_room");
        console.log("Joined room " + room.roomId);
        this._room = room;
        await this._start();

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
        this._scene.onBeforeStepObservable.add(() => {
            console.log(this._ball.getMeshPosition());
            console.log(this._ball.getVelocity());
        });
        this._ball.setVelocity(new Vector3(0,0,1));
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
        await this._loadCharacterAssets(scene);
        this._input = new PlayerInput(scene);
        await this._initializeGameAsync(scene);
    }

    private async _initializeGameAsync(scene: Scene): Promise<void> {
        let light = new PointLight('PointLight', new Vector3(0,5,0), scene);
        light.diffuse = new Color3(1,1,1);
        light.intensity = 1;
        //light.radius = 0.1;
        //light.radius = 0; 
        //light.includedOnlyMeshes = [];

        let shadow = new ShadowGenerator(1024, light);
        shadow.darkness = 0.4;

        this._player = new Player(this.assets, scene, shadow, this._input)
        
        let ballPos = new Vector3(this._room.state.ball.position.x, this._room.state.ball.position.y, this._room.state.ball.position.z);
        this._ball = new Ball(ballPos, 1, this.MAX_SPEED, shadow, this._scene);
        this._scene.onBeforeRenderObservable.add(() => {
            if (this._ball.getMeshPosition()._z < -23) {
                this._ball.dispose();
                let ballPos = new Vector3(this._room.state.ball.x, this._room.state.ball.y, this._room.state.ball.z);
                this._ball = new Ball(ballPos, 1, this.MAX_SPEED, shadow, this._scene);
            }
        });
    }

    private async _loadCharacterAssets(scene: Scene) {
        async function loadCharacter(): Promise<{mesh: Mesh}> {
            let body = MeshBuilder.CreateCylinder("body", {height: 3, diameter: 1.5}, scene);

            body.isVisible = false;

            body.position = new Vector3(0,1.5,0);
            let bodymtl = new StandardMaterial("red", scene);
            bodymtl.diffuseColor = Color3.Red();
            body.material = bodymtl;
            body.isPickable = false;
            const hand_node = new TransformNode("hand_node", scene)
            hand_node.position = new Vector3(0.4, 2, 1);
            const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.5});
            hand.material = bodymtl;

            let racketmtl = new StandardMaterial("white", scene);
            racketmtl.diffuseColor = new Color3(0.4,0.2,0);
            let stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.2, height: 0.8});
            stick.position._y = 0.4;
            stick.material = racketmtl;
            const racket = MeshBuilder.CreateCylinder("racket", {diameter: 1, height: 0.2});
            racket.material = racketmtl;
            racket.position._y = 0.7;
            //racket.rotation = new Vector3(Math.PI / 2, 0, 0);
            racket.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
            
            let racketRoot = new TransformNode("racketRoot", scene);
    
            racket.parent = stick;
            stick.parent = hand;
            hand.parent = racketRoot;
            racketRoot.parent = hand_node;
            hand_node.parent = body;

            
            return { mesh: body};
        }
        return loadCharacter().then((assets) => {
            this.assets = assets;
        })
    }
}
