import { Player } from "./Player";
import { IPlayerState } from "./IPlayerState";

export class Rocket implements IPlayerState {
   
    private Player: Player;
    private thrustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private isThrusting: boolean = false;
    private thrustPower: number = 1500; 
    private maxUpwardSpeed: number = -600; 
    private gravityScale: number = 500; 
   // private size:{x:0,y:0}
    constructor(scene: Phaser.Scene, player: Player) {
        this.Player = player;
        
        const particles = scene.add.particles('particle');
        this.thrustEmitter = particles.createEmitter({
            speed: { min: 150, max: 300 },
            lifespan: 300,
            scale: { start: 0.4, end: 0.1 },
            tint: 0xff4400, 
            angle: { min: 160, max: 200 }, 
            quantity: 5,
            frequency: 30,
            blendMode: 'ADD',
            alpha: { start: 1, end: 0 }
        });
        this.thrustEmitter.stop();
    }

    Update(deltaTime: number) {
        const jumpKey = this.Player.getJumpKey();
        
        if (jumpKey.isDown) {
            this.handleThrust();
        } else {
            this.handleNoThrust();
        }
        
        if (this.Player.body.velocity.y < this.maxUpwardSpeed) {
            this.Player.setVelocityY(this.maxUpwardSpeed);
        }
        const velocityY = this.Player.body.velocity.y;
        if (velocityY < -100) {
            this.Player.setRotation(-0.5);
        } else if (velocityY > 100) {
            this.Player.setRotation(0.5);
        } else {
            this.Player.setRotation(0);
        }
    }

    private handleThrust() {
        if (!this.isThrusting) {
            this.isThrusting = true;
            this.thrustEmitter.start();
        }
        this.Player.setAccelerationY(-this.thrustPower);
        
        const currentVelocityY = this.Player.body.velocity.y;
        if (currentVelocityY > -200) {
            this.Player.setVelocityY(currentVelocityY - 50);
        }
        
        this.thrustEmitter.startFollow(this.Player, 0, 35);
        
        this.thrustEmitter.setQuantity(8);
        this.thrustEmitter.setFrequency(20);
    }

    private handleNoThrust() {
        if (this.isThrusting) {
            this.isThrusting = false;
            this.thrustEmitter.stop();
        }
        
        this.Player.setAccelerationY(0);
    }

    Enter() {
        console.log('Entering Rocket Mode');
        this.Player.setTexture('ship');
        
        this.Player.setGravityY(this.gravityScale);
        
        this.isThrusting = false;
        this.Player.setRotation(0);
        this.Player.enableCollision();
        this.Player.body.setSize(80,43)

        this.Player.setVelocityY(0);
        this.Player.setAccelerationY(0);
    }

    Exit() {
        console.log('Exiting Rocket Mode');
        this.Player.setTexture('logo');
        
        this.thrustEmitter.stop();
        this.isThrusting = false;
        
        this.Player.setAccelerationY(0);
        this.Player.setRotation(0);
        this.Player.body.setSize(122,120)

        this.Player.setGravityY(1300);
    }
}