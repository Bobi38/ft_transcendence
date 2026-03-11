import { AdvancedDynamicTexture, Rectangle, Control, StackPanel, TextBlock, Button } from "@babylonjs/gui";

export class GUI {
    private _waiting4Player : AdvancedDynamicTexture;
    private _score : AdvancedDynamicTexture;
    private _scoreText : TextBlock;
    private _isPlayerNear : boolean;
    private _end : AdvancedDynamicTexture;
    private _playerDisconnected : AdvancedDynamicTexture = null;

    constructor () {
    }

    private _gameOverUI(text: string) {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._end = ui;

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
            console.log("Return to menu clicked");
});

panel.addControl(menuBtn);
    }

    public addWaitingUI() {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._waiting4Player = ui;

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
        waitingText.text = "Waiting for a second player";
        waitingText.color = "white";
        waitingText.fontSize = 36;
        waitingText.fontFamily = "Inter";
        waitingText.height = "50px";
        waitingText.fontWeight = "bold";

        panel.addControl(waitingText);

        let dots = 0;
        setInterval(() => {
            dots = (dots + 1) % 4;
            waitingText.text = "Waiting for a second player" + ".".repeat(dots);
        }, 500);
    }

    public disposeWaitingUI() {
        this._waiting4Player.dispose();
        this._waiting4Player = null;
    }

    public addScoreUI(isNear: boolean) {
        this._isPlayerNear = isNear;
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
        this._scoreText.text = "0 : 0";
        this._scoreText.color = "white";
        this._scoreText.fontSize = 14;
        this._scoreText.fontWeight = "bold";
        this._scoreText.width = "70px";
        this._scoreText.fontFamily = "Inter";
        this._scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        stack.addControl(this._scoreText);
    }

    public updateScoreUI(scoreNear: number, scoreFar: number) {
        if (this._isPlayerNear)
            this._scoreText.text = scoreNear.toString() + ' : ' + scoreFar.toString();
        else
            this._scoreText.text = scoreFar.toString() + ' : ' + scoreNear.toString();
    }

    public addEndUI(scoreNear: number, scoreFar: number) {
        if (this._isPlayerNear && scoreNear >= 3 || !this._isPlayerNear && scoreFar >= 3)
            this._gameOverUI("Congratulations! You win");
        else
            this._gameOverUI("Loser lol");
    }

    public addPlayerDisconnectedUI() {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._playerDisconnected = ui;

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

    public disposePlayerDisconnectedUI() {
        this._playerDisconnected.dispose();
        this._playerDisconnected = null;
    }

    public getIsPlayerDisconnectedUIShown() : boolean {
        return (this._playerDisconnected != null)
    }

    public addOtherPlayerDisconnectUI() {
        this._gameOverUI("Other player disconnected");
    }
}