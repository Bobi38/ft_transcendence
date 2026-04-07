import { AdvancedDynamicTexture, Rectangle, Control, StackPanel, TextBlock, Button } from "@babylonjs/gui";
import { Room } from "@colyseus/sdk";
import { NetworkManager } from "./NetworkManager";

export class GUI {
    private _network : NetworkManager;
    private _ui: AdvancedDynamicTexture = null;
    private _score : AdvancedDynamicTexture;
    private _scoreText : TextBlock;
    private _playerDisconnected : AdvancedDynamicTexture = null;

    constructor (network: NetworkManager) {
        this._network = network;
    }

    private _setAndDispose(newUi : AdvancedDynamicTexture) {
        if (this._ui) {
            this._ui.dispose();
        }
        this._ui = newUi;
    }

    private _gameOverUI(text: string) {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._setAndDispose(ui);

        const banner = new Rectangle();
        banner.width = "500px";
        banner.height = "200px";
        banner.cornerRadius = 25;
        banner.thickness = 2;
        banner.color = "white";
        banner.background = "rgba(0,0,0,0.45)";
        banner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        banner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        ui.addControl(banner);

        const panel = new StackPanel();
        banner.addControl(panel);

        const endText = new TextBlock();
        endText.text = text;
        endText.color = "white";
        endText.fontSize = 36;
        endText.fontFamily = "Inter";
        endText.height = "50px";
        endText.fontWeight = "bold";

        panel.addControl(endText);
        const newGameBtn = Button.CreateSimpleButton("newGameBtn", "New Game");
        newGameBtn.width = "220px";
        newGameBtn.height = "45px";
        newGameBtn.color = "white";
        newGameBtn.cornerRadius = 12;
        newGameBtn.background = "#4CAF50";

        newGameBtn.onPointerClickObservable.add(() => {
            this._room.leave(true);
            localStorage.removeItem("reconnectionGameToken");
            window.location.reload();
            console.log("New Game clicked");
        });

        panel.addControl(newGameBtn);

        const menuBtn = Button.CreateSimpleButton("menuBtn", "Return to Menu");
        menuBtn.width = "220px";
        menuBtn.height = "45px";
        menuBtn.color = "white";
        menuBtn.cornerRadius = 12;
        menuBtn.background = "#f44336";

        menuBtn.onPointerClickObservable.add(() => {
            window.location.href = "/";
            console.log("Return to menu clicked");
        });
        panel.addControl(menuBtn);
    }

    private _waitingUI(text: string) {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._setAndDispose(ui);

        const banner = new Rectangle();
        banner.width = "600px";
        banner.height = "100px";
        banner.cornerRadius = 25;
        banner.thickness = 2;
        banner.color = "white";
        banner.background = "rgba(0,0,0,0.45)";
        banner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        banner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        ui.addControl(banner);

        const panel = new StackPanel();
        banner.addControl(panel);

        const waitingText = new TextBlock();
        waitingText.text = text;
        waitingText.color = "white";
        waitingText.fontSize = 36;
        waitingText.fontFamily = "Inter";
        waitingText.height = "50px";
        waitingText.fontWeight = "bold";

        panel.addControl(waitingText);

        let dots = 0;
        setInterval(() => {
            dots = (dots + 1) % 4;
            waitingText.text = text + ".".repeat(dots);
        }, 500);
    }

    public showWaitingUI() {
        this._waitingUI("Waiting for a second player");
    }

    public showAwaitingReconnectionUI() {
        this._waitingUI("Waiting for player reconnection");
    }

    public addScoreUI(isNear: boolean, scoreNear: number, scoreFar: number) {
        this._score = AdvancedDynamicTexture.CreateFullscreenUI("ui");

        const scorePanel = new Rectangle();
        scorePanel.width = "160px";
        scorePanel.height = "50px";
        scorePanel.cornerRadius = 12;
        scorePanel.color = "#ffffff";
        scorePanel.thickness = 1;
        scorePanel.background = "#1e1e1ecc";
        scorePanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        scorePanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        scorePanel.top = "20px";
        scorePanel.left = "-20px";
        this._score.addControl(scorePanel);

        const stack = new StackPanel();
        stack.isVertical = false;
        stack.paddingLeft = "12px";
        stack.paddingRight = "12px";
        scorePanel.addControl(stack);

        const scoreLabel = new TextBlock();
        scoreLabel.text = "SCORE";
        scoreLabel.color = "#bbbbbb";
        scoreLabel.fontSize = 14;
        scoreLabel.width = "70px";
        scoreLabel.fontFamily = "Inter";
        scoreLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        stack.addControl(scoreLabel);

        this._scoreText = new TextBlock();
        if (isNear)
            this._scoreText.text = scoreNear.toString() + ' : ' + scoreFar.toString();
        else
            this._scoreText.text = scoreFar.toString() + ' : ' + scoreNear.toString();
        this._scoreText.color = "white";
        this._scoreText.fontSize = 14;
        this._scoreText.fontWeight = "bold";
        this._scoreText.width = "70px";
        this._scoreText.fontFamily = "Inter";
        this._scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        stack.addControl(this._scoreText);
    }

    public updateScoreUI(isNear: boolean, scoreNear: number, scoreFar: number) {
        if (isNear)
            this._scoreText.text = scoreNear.toString() + ' : ' + scoreFar.toString();
        else
            this._scoreText.text = scoreFar.toString() + ' : ' + scoreNear.toString();
    }

    public showEndUI(isNear: boolean, scoreNear: number, scoreFar: number) {
        if (isNear && scoreNear >= 3 || !isNear && scoreFar >= 3)
            this._gameOverUI("Congratulations! You win");
        else
            this._gameOverUI("Loser lol");
    }

    public showPlayerDisconnectedUI() {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._setAndDispose(ui);

        const banner = new Rectangle();
        banner.width = "500px";
        banner.height = "100px";
        banner.cornerRadius = 25;
        banner.thickness = 2;
        banner.color = "white";
        banner.background = "rgba(0,0,0,0.45)";
        banner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        banner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        ui.addControl(banner);

        const panel = new StackPanel();
        banner.addControl(panel);

        const waitingText = new TextBlock();
        waitingText.text = "Player has disconnected. Standby";
        waitingText.color = "white";
        waitingText.fontSize = 36;
        waitingText.fontFamily = "Inter";
        waitingText.height = "50px";
        waitingText.fontWeight = "bold";

        panel.addControl(waitingText);

        let dots = 0;
        setInterval(() => {
            dots = (dots + 1) % 4;
            waitingText.text = "Player has disconnected. Standby" + ".".repeat(dots);
        }, 500);
    }

    public getIsPlayerDisconnectedUIShown() : boolean {
        return (this._playerDisconnected != null)
    }

    public showOtherPlayerDisconnectUI() {
        this._gameOverUI("Other player disconnected");
    }

    public showFailedReconnectionUI() {
        this._gameOverUI("Failed to reconnect to room");
    }

    public showNoUI() {
        if (this._ui) {
            this._ui.dispose();
        }
    }
}