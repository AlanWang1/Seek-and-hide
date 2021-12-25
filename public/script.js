class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.spotlight = null;
        this.cursors = null;
    }
    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create ()
    {
        const background = "sky"
        const x = 400
		const y = 300

        // Create normal background and tinted cover layer on top of normal
		const reveal = this.add.image(x, y, background)
		this.cover = this.add.image(x, y, background)
		this.cover.setTint(0x004c99)

		const width = this.cover.width
		const height = this.cover.height

        // create rendertexture for overall scene
		const rt = this.make.renderTexture({
			width,
			height,
			add: false
		})

        // create maskImage specifically for cover layer
		const maskImage = this.make.image({
			x,
			y,
			key: rt.texture.key,
			add: false
		})

        // Create tint on cover
		this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)
		this.cover.mask.invertAlpha = true

		reveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)

		this.light = this.add.circle(0, 0, 30, 0x000000, 1)
		this.light.visible = false

		this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this)

		this.renderTexture = rt

        // Create hider player and movement keys
        this.spotlight = this.physics.add.image(x, y, 'star');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spotlight.setCollideWorldBounds(true);

        console.log(this.spotlight.getBounds());
        console.log(this.light.getBounds());
    }
    handlePointerMove(pointer)
    {
        const x = pointer.x - this.cover.x + this.cover.width * 0.5;
        const y = pointer.y - this.cover.y + this.cover.height * 0.5
        this.renderTexture.clear();
        this.renderTexture.draw(this.light, x ,y);
    }

    update() {
        const lightBounds = this.light.getBounds();
        const spotlightBounds = this.spotlight.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(lightBounds, spotlightBounds)) {
            console.log("found you");
        } else {
            console.log(lightBounds.x - spotlightBounds.x, lightBounds.y - spotlightBounds.y);
        }
        this.spotlight.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.spotlight.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown) {
            this.spotlight.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            this.spotlight.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown) {
            this.spotlight.setVelocityY(300);
        }
    }
}
var config = {
    type: Phaser.AUTO,
    parent: "game-div",
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }, 
    scene: [GameScene] 
};

var game = new Phaser.Game(config);
