import { AdvancedDynamicTexture, Rectangle, Control, StackPanel, TextBlock, Button } from "@babylonjs/gui";
import { GameSession } from "../sessions/GameSession";

export class GUI {
    private _session : GameSession;
    private _ui: AdvancedDynamicTexture | null = null;
    private _score : AdvancedDynamicTexture;
    private _scoreText : TextBlock;
    private _playerDisconnected : AdvancedDynamicTexture | null = null;
    private _disposing : boolean = false;
    private _interval: number | null = null;
    private _onReturnToMenu?: () => void;
    private _onReload?: () => void;

    constructor (session: GameSession, onReturnToMenu?: () => void, onReload?: () => void) {
        this._session = session;
        this._onReload = onReload;
        this._onReturnToMenu = onReturnToMenu;
    }

    private _setAndDispose(newUi : AdvancedDynamicTexture | null) {
        if (this._ui) {
            this._ui.dispose();
        }
        clearInterval(this._interval);
        this._ui = newUi;
    }

    private _gameOverUI(text: string) {
        if (this._disposing)
            return ;
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
            localStorage.removeItem("reconnectionGameToken");
            if (this._onReload) {
                this._session.setVoluntaryLeave();
                this._onReload();
                }
            else {
                this._session.leave();
                window.location.reload();
            }
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
            if (this._onReturnToMenu) {
                this._session.setVoluntaryLeave();
                this._onReturnToMenu();
            }
            else
                window.location.href = "/";
            console.log("Return to menu clicked");
        });
        panel.addControl(menuBtn);
    }

    private _waitingUI(text: string) {
        if (this._disposing)
            return ;
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
        this._interval = (
            setInterval(() => {
            dots = (dots + 1) % 4;
            waitingText.text = text + ".".repeat(dots);
        }, 500)) as unknown as number;
    }

    public showWaitingUI() {
        this._waitingUI("Waiting for a second player");
    }

    public showAwaitingReconnectionUI() {
        this._waitingUI("Waiting for player reconnection");
    }

    public addScoreUI(isNear: boolean, scoreNear: number, scoreFar: number) {
        if (this._disposing)
            return ;
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
        if (this._disposing)
            return ;
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
        this._interval = setInterval(() => {
            dots = (dots + 1) % 4;
            waitingText.text = "Player has disconnected. Standby" + ".".repeat(dots);
        }, 500) as unknown as number;
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
            this._setAndDispose(null);
        }
    }

    public dispose() {
        this._setAndDispose(null);
        this._disposing = true;

        this._session = null;
        this._score?.dispose();
        this._score = null;

        this._playerDisconnected?.dispose();
        this._playerDisconnected = null;

        this._scoreText?.dispose();
        this._scoreText = null;

        this._onReturnToMenu = null;
        this._onReload = null;
    }
}