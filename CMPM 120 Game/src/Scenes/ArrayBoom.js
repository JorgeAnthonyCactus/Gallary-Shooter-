class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");



        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.my.sprite.enemies = []; 
        this.timesPlayed = 0; // This is used to keep track of how many times the game has been played
        this.maxBullets = 10;           // Don't create more than this many bullets
        this.playerLives = 3;
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlasXML("spaceshipParts", "sheet.png", "sheet.xml");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "spaceshipParts", "playerShip1_blue.png");
        my.sprite.player.setScale(.75);

        //my.sprite.seedBomber = this.add.sprite(game.config.width/2, 80, "spaceshipParts", "enemyBlack4.png");
        //my.sprite.seedBomber.setScale(.75);

        //here we are going to make the 3 lanes for the enimies
        my.sprite.enemies[0] = this.add.sprite(50, 120, "spaceshipParts", "enemyBlack4.png");
        my.sprite.enemies[0].setScale(.75);
        my.sprite.enemies[1] = this.add.sprite(207, 120, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[1].setScale(.75);
        my.sprite.enemies[2] = this.add.sprite(375, 120, "spaceshipParts", "enemyGreen3.png");
        my.sprite.enemies[2].setScale(.75);
        my.sprite.enemies[3] = this.add.sprite(532, 120, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[3].setScale(.75);
        my.sprite.enemies[4] = this.add.sprite(700, 120, "spaceshipParts", "enemyBlack4.png");
        my.sprite.enemies[4].setScale(.75);
        my.sprite.enemies[5] = this.add.sprite(50, 200, "spaceshipParts", "enemyBlack4.png");
        my.sprite.enemies[5].setScale(.75);
        my.sprite.enemies[6] = this.add.sprite(207, 200, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[6].setScale(.75);
        my.sprite.enemies[7] = this.add.sprite(375, 200, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[7].setScale(.75);
        my.sprite.enemies[8] = this.add.sprite(532, 200, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[8].setScale(.75);
        my.sprite.enemies[9] = this.add.sprite(700, 200, "spaceshipParts", "enemyBlack4.png");
        my.sprite.enemies[9].setScale(.75);
        my.sprite.enemies[10] = this.add.sprite(50, 280, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[10].setScale(.75);
        my.sprite.enemies[11] = this.add.sprite(207, 280, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[11].setScale(.75);
        my.sprite.enemies[12] = this.add.sprite(375, 280, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[12].setScale(.75);
        my.sprite.enemies[13] = this.add.sprite(532, 280, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[13].setScale(.75);
        my.sprite.enemies[14] = this.add.sprite(700, 280, "spaceshipParts", "enemyRed1.png");
        my.sprite.enemies[14].setScale(.75);

        my.sprite.enemies[0].scorePoints = 50;
        my.sprite.enemies[1].scorePoints = 25;
        my.sprite.enemies[2].scorePoints = 100;
        my.sprite.enemies[3].scorePoints = 25;
        my.sprite.enemies[4].scorePoints = 50;
        my.sprite.enemies[5].scorePoints = 50;
        my.sprite.enemies[6].scorePoints = 25;
        my.sprite.enemies[7].scorePoints = 25;
        my.sprite.enemies[8].scorePoints = 25;
        my.sprite.enemies[9].scorePoints = 50;
        my.sprite.enemies[10].scorePoints = 25;
        my.sprite.enemies[11].scorePoints = 25;
        my.sprite.enemies[12].scorePoints = 25;
        my.sprite.enemies[13].scorePoints = 25;
        my.sprite.enemies[14].scorePoints = 25;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        // Put score on screen
        my.text.score = this.add.bitmapText(450, 0, "rocketSquare", "Score " + this.myScore);

        // Put title on screen
        this.add.text(35, 5, "LIVES", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

    }

    update() {
        let my = this.my;

        
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        
        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                let bullet = this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "spaceshipParts", "laserBlue01.png" );
                bullet.setScale(0.75);
                my.sprite.bullet.push(bullet);
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

    
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemies) {
                if (this.collides(bullet, enemy)) {
                    // start animation
                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    enemy.y = -100;
                    // Update score
                    this.myScore += enemy.scorePoints;
                    console.log(enemy.scorePoints);
                    this.updateScore();
                    // Play sound
                    this.sound.play("dadada", {
                        volume: .003   // Can adjust volume using this, goes from 0 to 1
                    });
                }
            }
        }

        
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("fixedArrayBullet");
        }

        if (this.enemyCheck()){
            for (let bullet of my.sprite.bullet) {
                bullet.y = -100;
            }
            this.timesPlayed++;
            this.scene.restart()
        }

    }

    enemyCheck(){
        for (let enemy of this.my.sprite.enemies) {
            if (enemy.y > 0) {return false;}
            }
            return true;
        }
    
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
}