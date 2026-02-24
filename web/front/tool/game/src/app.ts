import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, Mesh, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, HavokPlugin } from "@babylonjs/core";
import { Environment } from "./environment";
import { PlayerInput } from "./playerInput";
import { Player } from "./player";
import HavokPhysics from "@babylonjs/havok";

class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _environment: Environment;
    private _input: PlayerInput;
    private _player: Player;
    public assets;


    private _createCanvas() {
        var canvas = document.getElementById("wingame");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        return canvas;
    }

    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = this._createCanvas() as HTMLCanvasElement;

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
        this._engine.hideLoadingUI();
    }

    private async _setupGame() {
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0.015, 0.015, 0.2);
        this._scene = scene;

        const environment = new Environment(scene);
        this._environment = environment;

        const havokInstance = await HavokPhysics();
        const havokPlugin = new HavokPlugin(true, havokInstance);
        this._scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
        
        await this._environment.load();
        await this._loadCharacterAssets(scene);
        this._input = new PlayerInput(scene);
        await this._initializeGameAsync(scene);
    }

    private async _initializeGameAsync(scene: Scene): Promise<void> {
        let light = new PointLight('PointLight', new Vector3(0,5,5), scene);
        light.diffuse = new Color3(1,1,1);
        light.intensity = 1;
        light.radius = 0.1;

        let shadow = new ShadowGenerator(1024, light);
        shadow.darkness = 0.4;

        this._player = new Player(this.assets, scene, shadow, this._input);
    }

    private async _loadCharacterAssets(scene: Scene) {
        async function loadCharacter(): Promise<{mesh: Mesh}> {
            let body = MeshBuilder.CreateCylinder("body", {height: 3, diameter: 1.5}, scene);
            body.position = new Vector3(0,1.5,0);
            let bodymtl = new StandardMaterial("red", scene);
            bodymtl.diffuseColor = Color3.Red();
            body.material = bodymtl;
            body.isPickable = false;
            const hand_node = new TransformNode("hand_node", scene)
            hand_node.position = new Vector3(0.4, 2, 1);
            const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.5});
            hand.material = bodymtl;
            let stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.2, height: 0.8});
            stick.position._y = 0.4;
            const racket = MeshBuilder.CreateCylinder("racket", {diameter: 1, height: 0.2});
            racket.position._y = 0.7;
            racket.rotation = new Vector3(Math.PI / 2, 0, 0);

            racket.parent = stick;
            stick.parent = hand;
            hand.parent = hand_node;
            hand_node.parent = body;
            return { mesh: body};
        }
        return loadCharacter().then((assets) => {
            this.assets = assets;
        })
    }
}
export const app = new App();
