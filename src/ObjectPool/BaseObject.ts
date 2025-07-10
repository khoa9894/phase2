export abstract class BaseObstacle extends Phaser.Physics.Arcade.Sprite {
    public scene: Phaser.Scene;
    protected player: any;
    protected tilemapSpeed: number = 1;
    protected tilemapDirection: number = -1;
    
    constructor(scene: Phaser.Scene, player: any, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.player = player;
        scene.physics.add.existing(this);
        scene.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    }

    protected abstract setupPhysics(): void;
    protected abstract setupCollisions(): void;
    
    public updatePosition(movement: number, delta: number): void {
        this.x += movement * delta;
        if (this.body) {
            this.body.updateFromGameObject();
        }
    }

    public setSpeed(speed: number, direction: number): void {
        this.tilemapSpeed = speed;
        this.tilemapDirection = direction;
    }

    protected handlePlayerCollision(): void {
            this.scene.physics.world.pause();

         if(this.scene.scene.key == 'PlayScene'){
        const playScene = this.scene as any;
        playScene.setAttemt()
        const currentScore = playScene.getCurrent();
        const highScore = playScene.getHightScore();
    
        if (currentScore > highScore) {
            playScene.setHighScore(currentScore);

            // Show new high score text
            const screenWidth = this.scene.cameras.main.width;
            const screenHeight = this.scene.cameras.main.height;
            
            const newHighScoreText = this.scene.add.text(
                screenWidth / 2, 
                screenHeight / 2 - 100, 
                `NEW HIGH SCORE!\n${currentScore}%`, 
                {
                    fontSize: '32px',
                    color: '#ffff00',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    align: 'center'
                }
            );
            newHighScoreText.setOrigin(0.5);
            newHighScoreText.setScrollFactor(0);
            newHighScoreText.setDepth(1000);
            
            // Add glow effect
            newHighScoreText.setStroke('#ff8800', 4);
            
            // Animation effect
            this.scene.tweens.add({
                targets: newHighScoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
                repeat: 2,
                ease: 'Power2'
            });
            
            this.scene.time.delayedCall(3000, () => {
                this.scene.tweens.add({
                    targets: newHighScoreText,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        newHighScoreText.destroy();
                    }
                });
            });
        }
    }
    this.player.disableCollision();
    this.player.changeState(this.player.getDeathState());
    
    this.scene.time.delayedCall(500, () => {
        this.scene.scene.restart();
    });
}}