import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui"
import { Engine, Scene, Vector3, MeshBuilder, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, TransformNode, Quaternion, SpotLight, DirectionalLight, HemisphericLight, ImportMeshAsync, AbstractMesh, Matrix } from "@babylonjs/core";
import { Environment } from "./environment";
import { PlayerInput } from "./playerInput";
import { Player } from "./player";
import { Ball } from "./ball";
import { GUI } from "./GUI";
import { PlayerCamera } from "./PlayerCamera";
import { Enemy } from "./enemy";

export enum RoomStatus {
  WAITING = 0,
  STARTED = 1,
  WON = 2,
  PLAYER_DISCONNECTED = 3,
  AWAITING_RECONNECTION = 4
}

const TIMESTEP : number = 1/60;

export class App {
    private _roomStatus: RoomStatus = RoomStatus.STARTED;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _environment: Environment;
    private _player: Player;
    private _enemy: Enemy;
    private _camera: PlayerCamera;
    private _ball: Ball;
    private _shadows : ShadowGenerator[] = [];
    private _ui : GUI;
    private _served : boolean = true;
    private _score : number[] = [0,0];


    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) throw new Error("Canvas is undefined");
        this._canvas = canvas;

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

        this._main();
    }
    
    private async _main(): Promise<void> {
        this._engine.displayLoadingUI();
        this._ui = new GUI();
        
        await this._setupGameAssets()
        await this._scene.whenReadyAsync();
        this._engine.hideLoadingUI();
        
        this._engine.runRenderLoop(() => {
            console.log("still here");
            if (this._roomStatus == RoomStatus.STARTED) {
                this._updatePlayerAndEnemy();
                this._executeStep();
                this._checkRacketCollision(this._player.getRacketWorldMatrix(), this._player.racketDimensions, this._player.racketOffset, true);
                this._checkRacketCollision(this._enemy.getRacketWorldMatrix(), this._enemy.racketDimensions, this._enemy.racketOffset, false);
                this._checkWallCollision();
                this._checkIfPointWon();
            }
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    public _executeStep() {
        const oldPos = this._ball.getPhysicsBodyPosition();
        const newPos = oldPos.add(this._ball.getVelocity().scale(TIMESTEP));
        this._ball.setPhysicsBodyPosition(newPos);
    }

    public _checkRacketCollision(racketWorldMatrix: Matrix, racketDimensions: Vector3, racketOffset: Vector3, isPlayer: boolean) {
        const ballPos = this._ball.getPhysicsBodyPosition();
    
        //const racketWorldMatrix = this._player.getRacketWorldMatrix();
        const invRacketMatrix = racketWorldMatrix.clone().invert();
        const localBallPos = Vector3.TransformCoordinates(ballPos, invRacketMatrix);
        localBallPos.subtractInPlace(racketOffset);

        const halfWidth = racketDimensions.x / 2;
        const halfHeight = racketDimensions.y / 2;
        const halfDepth = racketDimensions.z / 2;

        const closestX = Math.max(-halfWidth,  Math.min(localBallPos.x, halfWidth));
        const closestY = Math.max(-halfHeight, Math.min(localBallPos.y, halfHeight));
        const closestZ = Math.max(-halfDepth,  Math.min(localBallPos.z, halfDepth));
        const closest = new Vector3(closestX, closestY, closestZ);
        const distanceSquared = localBallPos.subtract(closest).lengthSquared();

        if (distanceSquared < (this._ball.radius ** 2)) {
            let newVel : Vector3;
            if (isPlayer)
                newVel = this._player.getRacketHit();
            else
                newVel = this._enemy.getRacketHit();
            this._ball.setVelocity(newVel);
        }
    }

    public _checkWallCollision(){
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


    private async _setupGameAssets() {
        this._scene.clearColor = new Color4(0.015, 0.015, 0.2);
        this._environment = new Environment(this._scene);
        this._initLightAndBall(this._scene);

        let playerAssets;
        let enemyAssets;
        await Promise.all([
            playerAssets = await this._loadCharacterAssets(new Vector3(0, 0.5, -20), true),
            enemyAssets = await this._loadCharacterAssets(new Vector3(0, 0.5, 40), false),
            await this._environment.load()
        ]);
        this._camera = new PlayerCamera(this._scene);
        this._player = new Player(this._camera.getUniversalCamera(), playerAssets, this._scene, this._shadows);
        this._player.setPlayerInput(
            new PlayerInput(this._scene, this._camera, this._player.getHandNode(), this._player.getRacketNode()));

        this._enemy = new Enemy(this._scene, enemyAssets, this._shadows, this._ball);
    }


    private _initLightAndBall(scene: Scene) {
        let light1 = new PointLight('light1', new Vector3(0,6,-10), this._scene);
        light1.diffuse = new Color3(1,1,1);
        light1.intensity = 0.4;
        let shadow1 = new ShadowGenerator(2048, light1);
        shadow1.darkness = 0.1;
        this._shadows.push(shadow1);
        let light2 = new PointLight('light2', new Vector3(0,6,30), this._scene);
        light2.diffuse = new Color3(1,1,1);
        light2.intensity = 0.5;
        let light3 = new HemisphericLight("Light3", new Vector3(0,1,0), scene);
        light3.intensity = 0.6;
        light3.groundColor = new Color3(0.5, 0.5, 0.5);
        let shadow2 = new ShadowGenerator(2048, light2);
        shadow2.darkness = 0.1;
        this._shadows.push(shadow2);

        let ballPos = new Vector3(0,3,-12);
        let ballVel = Vector3.Zero();
        this._ball = new Ball(ballPos, ballVel, 1, this._shadows, this._scene);        
    }

    private _updatePlayerAndEnemy() {
        if (this._player) {
            this._player.updateBody();
            this._player.updateRacket();
            this._camera.updateCamera(this._player.getPlayerPosition());
        }
        if (this._enemy) {
            this._enemy.updateBody();
            this._enemy.updateRacket();
        }
    }

    private async _loadCharacterAssets(position: Vector3, isPlayer: boolean): Promise<{mesh: AbstractMesh, handNode: TransformNode, racketNode: TransformNode}> {
        let assets = await ImportMeshAsync("/media/mii.glb", this._scene);
        const body = assets.meshes[0];        

        if (isPlayer) {
            assets.meshes.forEach((m) => {
                m.isVisible = false;
            });
        }
        body.rotate(new Vector3(0,1,0), Math.PI);
        // if (isPlayer && !isNearSide) {
        //     body.rotate(new Vector3(0,1,0), Math.PI);
        // }
        // if (!isPlayer && !isNearSide) {
        //     body.rotate(new Vector3(0,1,0), Math.PI);
        // }

        body.position = position;
        let bodymtl = new StandardMaterial("red", this._scene);
        bodymtl.diffuseColor = Color3.Red();
        body.material = bodymtl;
        body.isPickable = false;
        const hand_node = new TransformNode("hand_node", this._scene)
        hand_node.position = new Vector3(0.4, 2, 0);
        const hand = MeshBuilder.CreateSphere("hand", {diameter: 0.8});
        hand.material = bodymtl;

        let racketmtl = new StandardMaterial("white", this._scene);
        racketmtl.diffuseColor = new Color3(0.4,0.2,0);
        let stick = MeshBuilder.CreateCylinder("stick", {diameter: 0.4, height: 1.2});
        stick.position._y = 0.8;
        stick.material = racketmtl;
        const racket = MeshBuilder.CreateCylinder("racket", {diameter: 2, height: 0.4});
        racket.material = racketmtl;
        racket.position._y = 1.2;
        racket.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
        
        let racketRoot = new TransformNode("racketRoot", this._scene);

        racket.parent = stick;
        stick.parent = hand;
        hand.parent = racketRoot;
        racketRoot.parent = hand_node;
        hand_node.parent = body;
        return { mesh: body, handNode: hand_node, racketNode: racketRoot};
    }

    private _checkIfPointWon() {
        let ballPos = this._ball.getPhysicsBodyPosition();
        if (ballPos.z < -33) {
            console.log("Team Far won a point");
            this._score[1]++;
            this._ui.updateScoreUI(this._score[0], this._score[1]);
            if (this._score[1] >= 3) {
                this._roomStatus = RoomStatus.WON;
                this._player.lockControls();
                this._ui.showEndUI(this._score[0], this._score[1]);
            }
        }
        else if (ballPos.z > 50) {
            console.log("Team Near won a point");
            this._score[0]++;
            this._ui.updateScoreUI(this._score[0], this._score[1]);
            if (this._score[0] >= 3) {
                this._roomStatus = RoomStatus.WON;
                this._player.lockControls();
                this._ui.showEndUI(this._score[0], this._score[1]);
            }
        }
        if (ballPos.z < -33 || ballPos.z > 50) {
            this._ball.setVelocity(Vector3.Zero());
            //this._ball.setAngularVelocity(Vector3.Zero());
            if (!this._served) {
                ballPos = new Vector3(0,3,-12);
                this._ball.setPhysicsBodyPosition(ballPos);
                this._served = true;
            } else {
                ballPos = new Vector3(0,3,34.5);
                this._ball.setPhysicsBodyPosition(ballPos);
                this._served = false;
            }
        }
    }

    public dispose() {
        this._scene.dispose();
        this._engine.dispose();
    }

    public getPlayer() : Player {
        return this._player;
    }

    public getEngine() : Engine {
        return this._engine;
    }
}