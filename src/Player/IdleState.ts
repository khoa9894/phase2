import { DeathState } from './DeathState';
import { Player } from "./Player";
import { IPlayerState } from "./IPlayerState";

export class IdleState implements IPlayerState {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private Player:Player
    constructor(scene: Phaser.Scene, player: Player) {
        const particles = scene.add.particles('particle'); 
        this.emitter = particles.createEmitter({
            speed: 800,
            lifespan:300,
            scale: { start: 0.7, end: 0.1 },
            rotate: { random: true, start: 0, end: 360 },
            angle: { min: 180, max: 200 },
            blendMode: 'ADD',
            quantity: 2,
            frequency: 20,
            tint: 0x00ff00
        });
        this.Player=player
        this.emitter.stop();
    }

    Enter() { 
         this.emitter.start();
    }

    Exit() {
        this.emitter.stop();
    }
   
    Update( deltaTime: number) {
        const randomY = Phaser.Math.Between(10, 30);
        this.emitter.startFollow(this.Player, -70, randomY);
        
        if(Phaser.Input.Keyboard.JustDown(this.Player.getJumpKey())|| this.Player.isJump){
            this.Player.changeState(this.Player.getJumpState())
        }
    }
}