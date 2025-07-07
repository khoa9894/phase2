import {BackgroundManager} from '../Object/BackgroundManager'

export class MenuScene extends Phaser.Scene {
    private backgroundManager: BackgroundManager|undefined;
    private listGround: Phaser.Physics.Arcade.Sprite[] = [];
    private tilemapSpeed: number = 6;
    private tilemapDirection: number = -1;
    private numGround = Math.round(window.innerWidth / 128)+1;

    constructor() {
        super('MenuScene');
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        this.backgroundManager = new BackgroundManager(this, this.tilemapSpeed, this.tilemapDirection);
        
        const logo = this.add.image(screenWidth/2, screenHeight/4, 'name');
        logo.setScale(2);

        this.createPlayButton(screenWidth, screenHeight);

        // Create ground
        this.createGround();
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
            this.time.delayedCall(100, () => {
                this.scene.start('PlayScene');
            });
        });

    }
    
    private createGround() { 
        this.listGround = []
        
        for (let i = 0; i <= this.numGround; i++) {
            const x = i * 128+64;
            const y = window.innerHeight - 128 / 2;
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