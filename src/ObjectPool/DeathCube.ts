import {BaseObstacle} from './BaseObject'

export class DeathCube extends BaseObstacle {
    constructor(scene: Phaser.Scene, player: any, x: number, y: number,texture:string) {
        super(scene, player, x, y, texture);
         this.setupPhysics()
        this.setupCollisions()
    }

    protected setupPhysics(): void {
        this.setImmovable(true);
        if (this.body) {
            this.body.setSize(this.width, this.height);
        }
    }

    protected setupCollisions(): void {
        this.scene.physics.add.overlap(this.player, this, () => {
            this.handlePlayerCollision();
        });
    }
}