import { Player } from "~/Player/Player";
import {BaseObstacle} from './BaseObject'


export class Portal extends BaseObstacle {
    protected player: Player;
    public type:string;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Phaser.Scene, player: Player,x:number,y:number,type:string) {
        super(scene,player, x, y,'portal')
        this.player = player;

        const particles = scene.add.particles('particle'); 
        this.emitter = particles.createEmitter({
            speed: 800,
            lifespan: 300,
            scale: { start: 0.7, end: 0.1 },
            rotate: { random: true, start: 0, end: 360 },
            angle: { min: 180, max: 200 },
            blendMode: 'ADD',
            quantity: 10,
            frequency: 20,
            tint: 0x00ff00
        });
        this.setScale(2.4)
        this.body.setSize(this.width,this.height)
        this.type=type
        this.setupCollisions()

    }
public updatePosition(movement: number, delta: number): void {
    super.updatePosition(movement,delta)
    const randomY= Phaser.Math.Between(-70, 200)
    this.emitter.startFollow(this,-80,randomY)
}    
    protected setupPhysics(): void {
    }

    protected setupCollisions(): void {
           this.scene.physics.add.overlap(this.player, this, () => {
                if(this.type=='rocket')
                this.player.changeState(this.player.getRocket());
                else if(this.type=='normal')
                 {
                    if(Phaser.Input.Keyboard.JustDown(this.player.getJumpKey())){
                    this.player.changeState(this.player.getIdleState())}
                    else  
                    this.player.changeState(this.player.getIdleState())
                }
                else if((this.type=='end'))
                    console.log(this.x)
                }
                

            );
        }


   

   
}