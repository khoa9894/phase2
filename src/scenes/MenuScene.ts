import {BackgroundManager} from '../Object/BackgroundManager'

export class MenuScene extends Phaser.Scene {
    private backgroundManager: BackgroundManager|undefined;
    private listGround: Phaser.Physics.Arcade.Sprite[] = [];
    private tilemapSpeed: number = 6;
    private tilemapDirection: number = -1;
    private numGround = Math.round(2400 / 128) + 1;
    private menuMusic: Phaser.Sound.BaseSound | undefined; 

    constructor() {
        super('MenuScene');
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        this.backgroundManager = new BackgroundManager(this, this.tilemapSpeed, this.tilemapDirection);
        
        const logo = this.add.image(screenWidth/2, screenHeight/4, 'name');
        logo.setScale(2);
        this.playMenuMusic();

        this.createPlayButton(screenWidth, screenHeight);

        this.createGround();
        const savedHighScore = localStorage.getItem('highScore');
const highScore = savedHighScore ? parseFloat(savedHighScore) : 0;

this.add.text(
    this.cameras.main.width-300, 
    30,
    `High Score: ${highScore}`,
    {
        font: '32px Arial',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
    }
).setScrollFactor(0).setDepth(1000);
    }
   private playMenuMusic() {
           this.sound.stopAll();


        this.menuMusic = this.sound.add('menuSound', {
            volume: 0.5, 
            loop: true 
        });
        
        this.menuMusic.play();
    }
    private createPlayButton(screenWidth: number, screenHeight: number) {
        const playButton = this.add.image(screenWidth/2, screenHeight/2, 'butt')
            .setInteractive() 
            .setScale(2); 

        // Hover effects
        playButton.on('pointerover', () => {
            playButton.setScale(2.1); 
        });

        playButton.on('pointerout', () => {
            playButton.setScale(2); 
            playButton.clearTint(); 
        });



        playButton.on('pointerup', () => {       
        this.sound.play('click', { volume: 0.7 });
     if (this.menuMusic) {
            this.menuMusic.stop();
        }
            this.time.delayedCall(100, () => {
                this.scene.start('PlayScene');
            });
        });

    }
    
    private createGround() { 
        this.listGround = []
        
        for (let i = 0; i <= this.numGround; i++) {
            const x = i * 128+64;
            const y = 900- 128 / 2;
            const ground = this.physics.add.staticSprite(x, y, 'ground');
            ground.setImmovable(true);
            
            if (ground.body) {
                ground.body.setSize(128, 128);
            }
            
            this.listGround.push(ground);
        }
    }

    update(time: number, delta: number): void {
        // Update managers
        if(this.backgroundManager) this.backgroundManager.update(time);
        
        let movement = this.tilemapSpeed * this.tilemapDirection;
        
        for (let i = 0; i <= this.numGround; i++) {
            this.listGround[i].x += movement;
            if(this.listGround[i].x + 128 < 0){
                this.listGround[i].x = this.numGround * 128;
            }
        }
        
        // Update ground color
        if (this.listGround.length > 0) {
            const speed = 0.0009;
            const t = time * speed;
            const r = Math.floor(Math.sin(t) * 127 + 128);
            const g = 0;
            const b = Math.floor(Math.sin(t + 4) * 127 + 128);
            const color = (r << 16) + (g << 8) + b;
            
            this.listGround.forEach((ground) => {
                ground.setTint(color);
            });
        }
    }
}