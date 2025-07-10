import {BaseObstacle} from './BaseObject'

export class SmallTriangle extends BaseObstacle {
    private collisionPoints: Phaser.Physics.Arcade.Sprite[] = [];

    constructor(scene: Phaser.Scene, player: any, x: number, y: number) {
        super(scene, player, x, y, 'lon4');
         this.setupPhysics()
        this.setupCollisions()
    }

    protected setupPhysics(): void {
        this.setImmovable(true);
        
        const positions = [
            { x: this.x, y: this.y },
            { x: this.x - 30, y: this.y + 40 },
            { x: this.x + 30, y: this.y + 40 }
        ];
        
        positions.forEach(pos => {
            const collision = this.scene.physics.add.staticSprite(pos.x, pos.y, '');
            collision.setVisible(false);
            if (collision.body) {
                collision.body.setSize(10, 10);
            }
            this.collisionPoints.push(collision);
        });
    }

    protected setupCollisions(): void {
        this.collisionPoints.forEach(point => {
            this.scene.physics.add.overlap(this.player, point, () => {
                this.handlePlayerCollision();
            });
        });
    }

    public updatePosition(movement: number, delta: number): void {
        super.updatePosition(movement, delta);
        
        const positions = [
            { x: this.x, y: this.y+20 },
            { x: this.x - 20, y: this.y + 44 },
            { x: this.x + 20, y: this.y + 44 }
        ];
        this.collisionPoints.forEach((point, idx) => {
        point.x = positions[idx].x;
        point.y = positions[idx].y;
        if (point.body) {
            point.body.updateFromGameObject();
        }
    });
    }
}
