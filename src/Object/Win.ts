export class VictoryOverlay {
    private scene: Phaser.Scene;
    private victoryOverlay: Phaser.GameObjects.Container | undefined;
    private isVisible: boolean = false;
    private replayButton: Phaser.GameObjects.Image | undefined;
    private menuButton: Phaser.GameObjects.Image | undefined;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createVictoryOverlay();
    }

    private createVictoryOverlay() {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;

        this.victoryOverlay = this.scene.add.container(0, 0);
        this.victoryOverlay.setScrollFactor(0);
        this.victoryOverlay.setDepth(1500); 
        this.victoryOverlay.setVisible(false);

        // Background overlay
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRect(0, 0, screenWidth, screenHeight);

        // Panel
        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = screenWidth/2 - panelWidth/2;
        const panelY = screenHeight/2 - panelHeight/2;

        const panel = this.scene.add.graphics();
        panel.fillStyle(0x1a5d1a, 1); 
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        panel.lineStyle(3, 0x2e8b2e, 1); 
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

        // Congratulations title
        const congratsTitle = this.scene.add.text(screenWidth/2, screenHeight/2 - 80, 'CONGRATULATIONS!', {
            fontSize: '42px',
            color: '#ffff00', 
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.replayButton = this.scene.add.image(screenWidth/2 - 100, screenHeight/2 + 50, 'replay')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(1.2);

        // Menu button
        this.menuButton = this.scene.add.image(screenWidth/2 + 100, screenHeight/2 + 50, 'menu')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(1);

     

        this.victoryOverlay.add([background, panel, congratsTitle, this.replayButton, this.menuButton]);
    }



    public show() {
        if (this.victoryOverlay && !this.isVisible) {
            this.isVisible = true;
            this.victoryOverlay.setVisible(true);
            
            // Pause the game
            this.scene.physics.world.pause();
            this.scene.tweens.pauseAll();
            this.scene.anims.pauseAll();
        }
    }

    public hide() {
        if (this.victoryOverlay && this.isVisible) {
            this.isVisible = false;
            this.victoryOverlay.setVisible(false);
            
            // Resume the game
            this.scene.physics.world.resume();
            this.scene.tweens.resumeAll();
            this.scene.anims.resumeAll();
        }
    }

    public update() {
        if (this.isVisible && this.victoryOverlay && this.victoryOverlay.visible) {
            const pointer = this.scene.input.activePointer;
            
            if (pointer.isDown) {
                // Check replay button
                if (this.replayButton) {
                    const replayBounds = this.replayButton.getBounds();
                    if (replayBounds.contains(pointer.x, pointer.y)) {
                        this.scene.sound.play('click', { volume: 0.7 });

                        this.replayGame();
                    }
                }
                
                // Check menu button
                if (this.menuButton) {
                    const menuBounds = this.menuButton.getBounds();
                    if (menuBounds.contains(pointer.x, pointer.y)) {
                              this.scene.sound.play('click', { volume: 0.7 });

                        this.goToMenu();
                    }
                }
            }
        }
    }

    private replayGame() {
        // Reset game state

        this.hide();
        
        // Restart current scene
        this.scene.scene.restart();
    }

    private goToMenu() {
        // Reset game state

        this.hide();
        
        // Change to menu scene
        this.scene.scene.start('MenuScene');
    }

    public destroy() {
        if (this.victoryOverlay) {
            this.victoryOverlay.destroy();
        }
    }

    public get visible(): boolean {
        return this.isVisible;
    }
}