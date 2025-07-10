import {BaseObstacle} from './BaseObject'
export class Cube extends BaseObstacle {
    private platformCollision: Phaser.Physics.Arcade.Sprite | undefined;
    private deathZone: Phaser.Physics.Arcade.Sprite|undefined;

    constructor(scene: Phaser.Scene, player: any, x: number, y: number,texture:string) {
        super(scene, player, x, y, texture);
         this.setupPhysics()
        this.setupCollisions()
    }

    protected setupPhysics(): void {
        this.setImmovable(true);
        
        // Platform collision (top)
        this.platformCollision = this.scene.physics.add.staticSprite(
            this.x, 
            this.y - 40, 
            'top'
        );
        this.platformCollision.setVisible(false);
        if (this.platformCollision.body) {
            this.platformCollision.body.setSize(100, 32);
        }
        
        this.deathZone = this.scene.physics.add.staticSprite(
            this.x, 
            this.y + 30, 
            'bot'
        );
        this.deathZone.setVisible(false);
        if (this.deathZone.body) {
            this.deathZone.body.setSize(100, 32);
        }
    }

    protected setupCollisions(): void {
      if( this.platformCollision)  this.scene.physics.add.collider(this.player, this.platformCollision);
        
        if( this.deathZone){
        this.scene.physics.add.overlap(this.player, this.deathZone, () => {
            this.handlePlayerCollision();
        });}
    }

    public updatePosition(movement: number, delta: number): void {
        super.updatePosition(movement, delta);
        if(this.platformCollision && this.deathZone){
        this.platformCollision.x = this.x;
        this.platformCollision.y = this.y - 40;
        this.deathZone.x = this.x;
        this.deathZone.y = this.y + 30;
        
        if (this.platformCollision.body) {
            this.platformCollision.body.updateFromGameObject();
        }
        if (this.deathZone.body) {
            this.deathZone.body.updateFromGameObject();
        }
        }
       
    }
    
}