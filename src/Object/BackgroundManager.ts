export class BackgroundManager {
    private scene: Phaser.Scene;
    private bg1: Phaser.GameObjects.Image|undefined;
    private bg2: Phaser.GameObjects.Image|undefined;
    private tilemapSpeed: number;
    private tilemapDirection: number;

    constructor(scene: Phaser.Scene, tilemapSpeed: number, tilemapDirection: number) {
        this.scene = scene;
        this.tilemapSpeed = tilemapSpeed;
        this.tilemapDirection = tilemapDirection;
        this.createBackground();
    }

    private createBackground() {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;
        
        this.bg1 = this.scene.add.image(screenWidth / 2, screenHeight / 2, 'chi');
        this.bg1.setDisplaySize(screenWidth, screenHeight + 512);
        this.bg1.setScrollFactor(0);
        
        this.bg2 = this.scene.add.image(screenWidth * 1.5, screenHeight / 2, 'chi');
        this.bg2.setDisplaySize(screenWidth, screenHeight + 512);
        this.bg2.setScrollFactor(0);
    }

    update(time: number) {
        if (!this.bg1 || !this.bg2) return;

        // Color animation
        const speed = 0.0009;
        const t = time * speed;
        const r = Math.floor(Math.sin(t) * 127 + 128);
        const g = 0;
        const b = Math.floor(Math.sin(t + 4) * 127 + 128);
        const color = (r << 16) + (g << 8) + b;
        
        this.bg1.setTint(color);
        this.bg2.setTint(color);
        
        // Scrolling animation
        const scrollSpeed = this.tilemapSpeed * this.tilemapDirection * 0.5;
        const screenWidth = this.scene.cameras.main.width;
        
        this.bg1.x += scrollSpeed;
        this.bg2.x += scrollSpeed;
        
        if (this.bg1.x <= -screenWidth / 2) {
            this.bg1.x = this.bg2.x + screenWidth;
        }
        if (this.bg2.x <= -screenWidth / 2) {
            this.bg2.x = this.bg1.x + screenWidth;
        }
    }
}
