import {BaseObstacle} from './BaseObject'
export class Triangle extends BaseObstacle {
    private collisionPoints: Phaser.Physics.Arcade.Sprite[] = [];
    
    constructor(scene: Phaser.Scene, player: any, x: number, y: number) {
        super(scene, player, x, y, 'lonbu'); 
        this.setupPhysics()
        this.setupCollisions()
    }

    protected setupPhysics(): void {
        this.setImmovable(true);
        
        const positions = [
            { x: this.x, y: this.y - 50 }, // Top
            { x: this.x - 50, y: this.y + 50 }, // Bottom left
            { x: this.x + 50, y: this.y + 50 }  // Bottom right
        ];
        
        positions.forEach(pos => {
            const collision = this.scene.physics.add.staticSprite(pos.x, pos.y, '');
            collision.setVisible(false);
            if (collision.body) {
                collision.body.setSize(32, 32);
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
        { x: this.x, y: this.y - 50 },
        { x: this.x - 50, y: this.y + 50 },
        { x: this.x + 50, y: this.y + 50 }
    ];

    this.collisionPoints.forEach((point, idx) => {
        point.x = positions[idx].x;
        point.y = positions[idx].y;
        if (point.body) {
            point.body.updateFromGameObject();
        }
    });
}}