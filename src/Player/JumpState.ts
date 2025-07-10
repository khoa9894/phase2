import { Player } from "./Player";
import { IPlayerState } from "./IPlayerState";

export class JumpState implements IPlayerState {
    private isOnGround: boolean = false;
    private isRotating: boolean = false;
    private targetAngle: number = 0;
    private Player: Player;
    private startAngle: number = 0; 
    private rotationSpeed: number = 720; 

    constructor(scene: Phaser.Scene, player: Player) {
        this.Player = player;
    }

    Enter() {
        this.Player.setVelocityY(-1100);
        this.isRotating = true;
        this.Player.isJump=false;
        this.startAngle = this.Player.angle;
        this.targetAngle = this.startAngle + 180;
    }

    Exit() {
                this.Player.isJump=false;
        this.isRotating = false;
    }

    Update(deltaTime: number) {
        this.isOnGround = this.Player.body.blocked.down;
        
        if (this.isRotating) {
            const rotationThisFrame = this.rotationSpeed * (deltaTime / 1000);
            
            const currentProgress = this.Player.angle + rotationThisFrame;
            
            if (currentProgress < this.targetAngle) {
                this.Player.angle = currentProgress;
            } else {
                this.Player.angle = this.targetAngle;
                this.isRotating = false;
            }
        }
        
        if (this.isOnGround && !this.isRotating) {
            this.Player.changeState(this.Player.getIdleState());
        }
    }
} 