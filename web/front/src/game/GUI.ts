import { AdvancedDynamicTexture, Rectangle, Control, StackPanel, TextBlock } from "@babylonjs/gui";

export class GUI {
    private _waiting4Player;

    constructor () {
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
    }

    public showScoreUI(scoreNear: number, scoreFar: number) {

    }
}