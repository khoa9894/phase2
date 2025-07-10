import { Player } from "~/Player/Player";
import {BaseObstacle} from './BaseObject'


export class Boost extends BaseObstacle {
    protected player: Player;

    constructor(scene: Phaser.Scene, player: Player, x: number, y: number) {
        super(scene, player, x, y, 'boost')
        this.player = player;
        this.setScale(2.4)
        this.body.setSize(50, 50)
        this.setupCollisions()
    }
    protected setupPhysics(): void{}
    protected setupCollisions(): void {
        this.scene.physics.add.overlap(this.player, this, () => {
            if ( this.player.getCurrentState() == this.player.getIdleState()) {
                this.player.changeState(this.player.getDoubleJump());
                
            }
        });
    }
}