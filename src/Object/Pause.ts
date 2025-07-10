export class Pause {
    private scene: Phaser.Scene;
    private pauseButton: Phaser.GameObjects.Image| undefined;
    private pauseOverlay: Phaser.GameObjects.Container| undefined;
    private isPaused: boolean = false;
    private escKey: Phaser.Input.Keyboard.Key| undefined;
    private resumeButton: Phaser.GameObjects.Image| undefined;
    private menuButton: Phaser.GameObjects.Image | undefined;
    
    private onPauseCallback?: (isPaused: boolean) => void;
    
    constructor(scene: Phaser.Scene, onPauseCallback?: (isPaused: boolean) => void) {
        this.scene = scene;
        this.onPauseCallback = onPauseCallback;
        
        this.createPauseButton();
        this.createPauseOverlay();
        this.setupKeyboard();
    }

    private createPauseButton() {
        const screenWidth = this.scene.cameras.main.width;
        
        this.pauseButton = this.scene.add.image(screenWidth - 60, 60, 'pause')
            .setInteractive()
            .setScale(0.8)
            .setScrollFactor(0)
            .setDepth(1000)
            .setOrigin(0.5);
        this.pauseButton.on('pointerover', () => {
            this.pauseButton!.setScale(0.9);
            this.pauseButton!.setTint(0xcccccc);
        });

        this.pauseButton.on('pointerout', () => {
            this.pauseButton!.setScale(0.8);
            this.pauseButton!.clearTint();
        });

        this.pauseButton.on('pointerdown', () => {
            this.pauseButton!.setScale(0.75);
        });
        this.pauseButton.on('pointerup', () => {
            this.togglePause();
        });
    }

    private setupKeyboard() {
        this.escKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    private createPauseOverlay() {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;

        this.pauseOverlay = this.scene.add.container(0, 0);
        this.pauseOverlay.setScrollFactor(0);
        this.pauseOverlay.setDepth(999);
        this.pauseOverlay.setVisible(false);

        // Background overlay
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRect(0, 0, screenWidth, screenHeight);

        // Panel
        const panelWidth = 500;
        const panelHeight = 500;
        const panelX = screenWidth/2 - panelWidth/2;
        const panelY = screenHeight/2 - panelHeight/2;

        const panel = this.scene.add.graphics();
        panel.fillStyle(0x333333, 1);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        panel.lineStyle(3, 0x555555, 1);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

        // Pause title
        const pauseTitle = this.scene.add.text(screenWidth/2, screenHeight/2 - 150, 'PAUSED', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Resume button
        this.resumeButton = this.scene.add.image(screenWidth/2 - 100, screenHeight/2 + 20, 'resume')
         .setOrigin(0.5)
         .setInteractive();

        // Menu button
        this.menuButton = this.scene.add.image(screenWidth/2 + 100, screenHeight/2 + 20, 'menu')
        .setOrigin(0.5)
        .setInteractive();


        this.pauseOverlay.add([background, panel, pauseTitle, this.resumeButton, this.menuButton]);
    }

    private togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.scene.physics.world.pause();
            this.scene.tweens.pauseAll();
            this.scene.anims.pauseAll();
          if(this.pauseOverlay)  this.pauseOverlay.setVisible(true);
        } else {
            // Resume game
            this.scene.physics.world.resume();
            this.scene.tweens.resumeAll();
            this.scene.anims.resumeAll();
          if(this.pauseOverlay)  this.pauseOverlay.setVisible(false);
        }
        
        if (this.onPauseCallback) {
            this.onPauseCallback(this.isPaused);
        }
    }

    private resumeGame() {
                      this.scene.sound.play('click', { volume: 0.7 });

        if (this.isPaused) {
            this.isPaused = false;
            this.scene.physics.world.resume();
            this.scene.tweens.resumeAll();
            this.scene.anims.resumeAll();
            if(this.pauseOverlay) this.pauseOverlay.setVisible(false);
            
            if (this.onPauseCallback) {
                this.onPauseCallback(false);
            }
        }
    }

    private goToMenu() {
        // Reset game state
              this.scene.sound.play('click', { volume: 0.7 });

        if (this.isPaused) {
            this.isPaused = false;
            this.scene.physics.world.resume();
            this.scene.tweens.resumeAll();
            this.scene.anims.resumeAll();
            
            if (this.onPauseCallback) {
                this.onPauseCallback(false);
            }
        }
        
        // Change scene
        this.scene.scene.start('MenuScene');
    }

    public update() {
        // Check ESC key
        if (this.escKey && Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.togglePause();
        }

        if (this.isPaused  &&this.pauseOverlay && this.pauseOverlay.visible) {
            const pointer = this.scene.input.activePointer;
            
            if (pointer.isDown && this.resumeButton) {
                const resumeBounds = this.resumeButton.getBounds();
                if (resumeBounds.contains(pointer.x, pointer.y)) {
                    this.resumeGame();
                }
                
                if(this.menuButton){
                const menuBounds = this.menuButton.getBounds();
                if (menuBounds.contains(pointer.x, pointer.y)) {
                    this.goToMenu();
                }}
            }
        }
    }

    public destroy() {
        if (this.pauseButton) {
            this.pauseButton.destroy();
        }
        if (this.pauseOverlay) {
            this.pauseOverlay.destroy();
        }
    }

    public get paused(): boolean {
        return this.isPaused;
    }

    public forcePause() {
        if (!this.isPaused) {
            this.togglePause();
        }
    }

    public forceResume() {
        if (this.isPaused) {
            this.togglePause();
        }
    }
}