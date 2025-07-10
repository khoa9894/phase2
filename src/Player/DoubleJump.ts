import { Player } from "./Player";
import { IPlayerState } from "./IPlayerState";

export class DoubleJump implements IPlayerState {
    private isOnGround: boolean = false;
    private Player: Player;
    private isRotating: boolean = false;
    private targetAngle: number = 0;
     private startAngle: number = 0; 
    private rotationSpeed: number = 720; 
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    constructor(scene: Phaser.Scene, player: Player) {
        this.Player = player;
          const particles = scene.add.particles('particle'); 
        this.emitter = particles.createEmitter({
           speed: { min: 300, max: 500 },
            lifespan: 600,
            scale: { start: 0.4, end: 0.1 },
            tint: 0xff4400, 
            angle: { min: 160, max: 200 }, 
            quantity: 5,
            frequency: 30,
            blendMode: 'ADD',
            alpha: { start: 1, end: 0 }
        });
                this.emitter.stop();

    }

    Enter() {
    this.Player.body.checkCollision.down = false;
    this.Player.body.checkCollision.up = false;
    this.Player.isJump=false
    this.Player.setVelocityY(-1600);
    this.emitter.start();
    this.Player.scene.time.delayedCall(100, () => {
    this.Player.body.checkCollision.down = true;
    this.Player.body.checkCollision.up = true;
    });
    this.isRotating = true;
        
        this.startAngle = this.Player.angle;
        this.targetAngle = this.startAngle + 180;

    }

    Exit() {
            this.Player.isJump=false

        this.emitter.stop();
                this.isRotating = false;

    }

    Update(deltaTime: number) {
         const randomY = Phaser.Math.Between(10, 30);
        this.emitter.startFollow(this.Player, -70, randomY);        
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
