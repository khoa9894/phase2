import { Player } from "~/Player/Player";
import { Rocket } from '~/Player/Rocket';

export class CameraController {
    private scene: Phaser.Scene;
    private player: Player;
    private cameraFollowThreshold: number = 0.2;
    private initialCameraY: number = 0;
    private defaultZoom: number = 1;
    private rocketZoom: number = 0.8 
    private currentZoom: number = 1;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.setupCamera();
    }

    private setupCamera() {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;
        
        this.cameraFollowThreshold = screenHeight * 0.1;
        this.initialCameraY = screenHeight / 2;
        
        this.scene.physics.world.setBounds(0, -500, screenWidth * 3, screenHeight + 1000);
        this.scene.cameras.main.setBounds(0, -500, screenWidth * 3, screenHeight + 1000);
        
        this.scene.cameras.main.setScroll(0, this.initialCameraY - screenHeight / 2);
        this.scene.cameras.main.setZoom(this.defaultZoom);
        this.currentZoom = this.defaultZoom;
    }

    update() {
        if (!this.player) return;
        
        this.updateZoom();
        this.updateCameraPosition();
    }

    private updateZoom() {
    const currentState = this.player.getCurrentState();
        const isRocketState = currentState instanceof Rocket;       
         const targetZoom = isRocketState ? this.rocketZoom : this.defaultZoom;
        
        if (Math.abs(this.currentZoom - targetZoom) > 0.01) {
            const zoomLerpFactor = 0.02;
            this.currentZoom = Phaser.Math.Linear(this.currentZoom, targetZoom, zoomLerpFactor);
            this.scene.cameras.main.setZoom(this.currentZoom);
        }
    }

    private updateCameraPosition() {
        const screenHeight = this.scene.cameras.main.height;
        const playerY = this.player.y;
        
        if (playerY < this.cameraFollowThreshold) {
            const targetCameraY = playerY;
            const newScrollY = targetCameraY - screenHeight / 2;
            
            const lerpFactor = 0.003;
            const currentScrollY = this.scene.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, newScrollY, lerpFactor);
            
            this.scene.cameras.main.setScroll(this.scene.cameras.main.scrollX, smoothScrollY);
        }
        else if (playerY > screenHeight - this.cameraFollowThreshold) {
            const targetCameraY = playerY;
            const newScrollY = targetCameraY - screenHeight / 2;
            
            const lerpFactor = 0.003;
            const currentScrollY = this.scene.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, newScrollY, lerpFactor);
            
            this.scene.cameras.main.setScroll(this.scene.cameras.main.scrollX, smoothScrollY);
        }
        else {
            const targetScrollY = this.initialCameraY - screenHeight / 2;
            const lerpFactor = 0.05;
            const currentScrollY = this.scene.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, targetScrollY, lerpFactor);
            
            this.scene.cameras.main.setScroll(this.scene.cameras.main.scrollX, smoothScrollY);
        }
    }

    public setRocketZoom(zoom: number) {
        this.rocketZoom = zoom;
    }

    public setDefaultZoom(zoom: number) {
        this.defaultZoom = zoom;
    }
}