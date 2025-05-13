let highScore = 0;
class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlasXML("spaceshipParts", "sheet.png", "sheet.xml");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;
        my.sprite.displayShip = this.add.sprite(game.config.width/2, 600, "spaceshipParts", "playerShip1_blue.png");

        my.text.welcomeScreen = this.add.bitmapText(275, 100, "rocketSquare", "AI ATTACK!");

        
        my.text.startButton = this.add.bitmapText(150, 400, "rocketSquare", "Press SPACE to Start");

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        let my = this.my;
        
        my.text.highScores = this.add.bitmapText(200, 250, "rocketSquare", "High Score: " + highScore);
        
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.scene.switch('GameScene');
        }

    }
}