import { ObstacleManager } from './../ObjectPool/ObjectManager';
import {BackgroundManager} from '../Object/BackgroundManager'

import { Player } from './../Player/Player';
import { DeathState } from './../Player/DeathState';
import { Pause } from '~/Object/Pause';
import { VictoryOverlay } from '~/Object/Win'; 

export class PlayScene extends Phaser.Scene {
    private ObstacleManager:ObstacleManager|undefined
    private player: any;
    private fpsText: Phaser.GameObjects.Text | undefined;
    private offset: number = 128 * 8;
    private EndPortal:number=39180
    private backgroundManager: BackgroundManager | undefined;
    private listGround: Phaser.Physics.Arcade.Sprite[] = [];
    private tilemapSpeed: number =0.9;
    private originalTilemapSpeed: number = 0.9; 
    private tilemapDirection: number = -1;
    private numGround = Math.round(2400 / 128) + 1;
    private pauseManager: Pause | undefined;
    private victoryOverlay: VictoryOverlay | undefined;
    private attemt:number=0;
    // Music property
    private backgroundMusic: Phaser.Sound.BaseSound | undefined;
    private attemptText: Phaser.GameObjects.Text | undefined;
    // Progress bar properties
    private progressBarBg: Phaser.GameObjects.Rectangle | undefined;
    private progressBarFill: Phaser.GameObjects.Rectangle | undefined;
    private HighScore: number=0;
    private currentScore:number=0;
    private endX: number = 0;
    private progressBarWidth: number = 300;
    private progressBarHeight: number = 20;
    private hasWon: boolean = false;
    
    constructor() {
        super('PlayScene');
        this.attemt=0
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const savedHighScore = localStorage.getItem('highScore');
        if (savedHighScore) {
            this.HighScore = parseFloat(savedHighScore);
        }
        // Start background music
        this.startBackgroundMusic();

        this.pauseManager = new Pause(this, (isPaused: boolean) => {
            this.handlePauseStateChange(isPaused);
        });

        // Initialize victory overlay
        this.victoryOverlay = new VictoryOverlay(this);

        this.physics.world.setBounds(0, -this.offset, screenWidth * 3, screenHeight + this.offset);
        this.cameras.main.setBounds(0, -this.offset, screenWidth * 3, screenHeight + this.offset);
        // Initialize managers
        this.backgroundManager = new BackgroundManager(this, this.tilemapSpeed, this.tilemapDirection);
        

        // Create tilemap
       
        
        // Create player
        this.createPlayer(screenWidth, screenHeight);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.06, 0.09); 
        this.cameras.main.setDeadzone(0,100);
        // Create ground
        this.createGround();
        this.ObstacleManager = new ObstacleManager(this, this.player);
        this.createTilemap(screenWidth, screenHeight);
        // Set start position
        
        // Create portal
        
       this.EndPortal= this.endX = 39180;
        
        // Create progress bar
        this.createProgressBar();
        this.fpsText = this.add.text(
                this.cameras.main.width - 120,
                10,
                'FPS: 0',
                { font: '20px Arial', color: '#00ff00', stroke: '#000', strokeThickness: 2 }
            );
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(2000);
  
        
        this.setupCollisions();
            const touchArea = this.add.rectangle(
            screenWidth / 2,
            screenHeight / 2,
            screenWidth,
            screenHeight,
            0xff0000,
            0 
        );
        touchArea.setScrollFactor(0);
        touchArea.setInteractive();

        touchArea.on('pointerdown', () => {
            if (this.player) {
                this.player.triggerJump();
            }
        });
        // Reset victory state
                this.hasWon = false;
                this.attemptText = this.add.text(
            20, 
            60, 
            `Attempt: ${this.attemt}`,
            {
                font: '40px Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        this.attemptText.setScrollFactor(0);
        this.attemptText.setDepth(1002);
    }
    public setAttemt(){
         this.attemt++;
        
    }
    private startBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        this.backgroundMusic = this.sound.add('music', {
            loop: true,
            volume: 0.5
        });
        
        this.backgroundMusic.play();
    }

    private stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    private pauseBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    private resumeBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPaused) {
            this.backgroundMusic.resume();
        }
    }
    
    public setHighScore(del:number){
        this.HighScore=del
        localStorage.setItem('highScore', this.HighScore.toString());

    }
    public getCurrent():number{
        return this.currentScore
    }
    public getHightScore():number{
        return this.HighScore
    }
    
    private createProgressBar() {
        const screenWidth = this.cameras.main.width;
        
        this.progressBarBg = this.add.rectangle(
            screenWidth / 2, 
            30, 
            this.progressBarWidth, 
            this.progressBarHeight, 
            0x333333
        );
        this.progressBarBg.setStrokeStyle(2, 0x666666);
        this.progressBarBg.setScrollFactor(0);
        this.progressBarBg.setDepth(1000); 
        
        this.progressBarFill = this.add.rectangle(
            screenWidth / 2 - this.progressBarWidth / 2 + 2, 
            30, 
            4, 
            this.progressBarHeight - 4, 
            0x00ff00
        );
        this.progressBarFill.setOrigin(0, 0.5);
        this.progressBarFill.setScrollFactor(0); 
        this.progressBarFill.setDepth(1001); 
    }

    private updateProgressBar() {
        if (!this.player || !this.progressBarFill || !this.EndPortal) return;
        
        const playerX = this.player.x;
        const endPortalX = this.EndPortal;
        
        const initialEndPortalX = this.endX; 
        const totalDistance = initialEndPortalX - playerX; 
        const remainingDistance = endPortalX - playerX; 
        
        let progress = Math.max(0, Math.min(100, ((totalDistance - remainingDistance) / totalDistance) * 100));
        this.currentScore = Math.round(progress * 10) / 10;
        
        const fillWidth = Math.max(4, (progress / 100) * (this.progressBarWidth - 4));
        this.progressBarFill.setSize(fillWidth, this.progressBarHeight - 4);
        
        let color = 0x00ff00; 
        this.progressBarFill.setFillStyle(color);
        
        if (this.currentScore >= 100 && !this.hasWon && this.victoryOverlay) {
            this.hasWon = true;
            // Stop music when winning
            this.stopBackgroundMusic();
            this.victoryOverlay.show();
            
            if (this.currentScore > this.HighScore) {
                this.HighScore = this.currentScore;
                localStorage.setItem('highScore', this.HighScore.toString());
            }
        }
    }

    private handlePauseStateChange(isPaused: boolean) {
        if (this.victoryOverlay && this.victoryOverlay.visible) {
            return;
        }
        
        if (isPaused) {
            this.pauseBackgroundMusic();
            
            this.originalTilemapSpeed = this.tilemapSpeed;
            this.tilemapSpeed = 0;
            
            if (this.backgroundManager) {
                this.backgroundManager.setSpeed(0);
            }
            
        } else {
            this.resumeBackgroundMusic();
            
            this.tilemapSpeed = this.originalTilemapSpeed;
            
            if (this.backgroundManager) {
                this.backgroundManager.setSpeed(this.tilemapSpeed);
            }
            
        }
    }

    private createTilemap(screenWidth: number, screenHeight: number) {
        
        
        const map = this.make.tilemap({ key: 'tile' });

        if ( this.ObstacleManager) {
             const offsetX = screenWidth + 300;
             const offsetY = screenHeight - 1024 -65;
            this.ObstacleManager.createObstaclesFromTilemap(map,offsetX,offsetY);

        }
    }

    private createPlayer(screenWidth: number, screenHeight: number) {
        this.player = new Player({
            scene: this,
            x: screenWidth / 4,
            y: screenHeight / 2 ,
            texture: 'logo',
            frame: 0
        });
        
        this.player.on('playerDied', () => {
            this.stopBackgroundMusic();
        });
    }

    private createGround() { 
        this.listGround = [];
        
        for (let i = 0; i <= this.numGround; i++) {
            const x = i * 128 + 64;
            const y =  900- 128 / 2;
            const ground = this.physics.add.staticSprite(x, y, 'ground');
            ground.setImmovable(true);
            
            if (ground.body) {
                ground.body.setSize(128, 128);
            }
            
            this.listGround.push(ground);
        }
    }

    private setupCollisions() {
        if (!this.player) return;
        
        // Ground collisions
        this.listGround.forEach((ground) => {
            this.physics.add.collider(this.player, ground);
        });
        
       
        
        // if (this.layer) {
        //     this.physics.add.collider(this.player, this.layer);
        // }
    }

    update(time: number, delta: number): void {
    if (this.victoryOverlay) {
        this.victoryOverlay.update();
    }

    if (this.fpsText) {
    const fps = (1000 / delta).toFixed(1);
    this.fpsText.setText(`FPS: ${fps}`);
}
    if (this.victoryOverlay && this.victoryOverlay.visible) {
        return;
    }
    
    if (this.pauseManager) {
        this.pauseManager.update();
    }
    
    const currentState = this.player?.getCurrentState();
    const isDeathState = currentState instanceof DeathState;
    
    if (isDeathState) {
        if (this.player) {
            this.player.update(delta);
        }
        
        // Stop background music if playing
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.stopBackgroundMusic();
        }
        
        if (this.pauseManager?.paused) {
            this.pauseManager.forceResume();
        }
        
        return; 
    }
    
    if (!this.pauseManager?.paused) {
        if (this.player) {
            this.player.update(delta);
        }

        this.updateProgressBar();
        
        // Update managers
        if (this.backgroundManager) {
            this.backgroundManager.update(time);
        }
       
        
        let movement = this.tilemapSpeed * this.tilemapDirection*delta;
        
       this.EndPortal+=movement
        
        if(this.ObstacleManager) this.ObstacleManager.update(movement, delta);

        // Update portal positions
       
        
        // Update ground position
        this.updateGround(movement);
    }
    
    this.updateGroundColor(time);
}



private updateGround(movement: number) {
    for (let i = 0; i <= this.numGround; i++) {
        this.listGround[i].x += movement;
        if (this.listGround[i].x + 128 <= 0) {
            this.listGround[i].x = this.numGround * 127;
        }
    }
}

private updateGroundColor(time: number) {
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

    public getPauseManager(): Pause | undefined {
        return this.pauseManager;
    }

    public setTilemapSpeed(speed: number) {
        this.tilemapSpeed = speed;
        this.originalTilemapSpeed = speed;
        
        if (this.backgroundManager &&this.ObstacleManager) {
            this.backgroundManager.setSpeed(speed);
            this.ObstacleManager.setSpeed(speed, this.tilemapDirection);

        }
        
    }

    destroy() {
        this.stopBackgroundMusic();
    }
}