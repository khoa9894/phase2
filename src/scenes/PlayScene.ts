import {BackgroundManager} from '../Object/BackgroundManager'
import {CollisionManager} from '../Object/Collision'
import {CameraController} from '../Object/Camera'
import { Player } from './../Player/Player';
import { DeathState } from './../Player/DeathState';


export class PlayScene extends Phaser.Scene {
    private player: any;
    private offset:number=128*8
    private backgroundManager: BackgroundManager|undefined;
    private collisionManager: CollisionManager|undefined;
    private layer: Phaser.Tilemaps.TilemapLayer|undefined;
    private listGround: Phaser.Physics.Arcade.Sprite[] = [];
    private portal: Phaser.Physics.Arcade.Sprite|undefined;
    private tilemapSpeed: number = 8   ;
    private tilemapDirection: number = -1;
    private numGround = Math.round(window.innerWidth / 128)+1 ;

    constructor() {
        super('PlayScene');
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        this.physics.world.setBounds(0, 0, screenWidth * 3, screenHeight+this.offset);
        this.cameras.main.setBounds(0, 0, screenWidth * 3, screenHeight+this.offset);
        // Initialize managers
        this.backgroundManager = new BackgroundManager(this, this.tilemapSpeed, this.tilemapDirection);
        this.collisionManager = new CollisionManager(this, this.tilemapSpeed, this.tilemapDirection);
        
        // Create tilemap
        this.createTilemap(screenWidth, screenHeight);
        // Create player
        this.createPlayer(screenWidth, screenHeight);
                this.cameras.main.startFollow(this.player)
                this.cameras.main.setLerp(0.003, 0.006); 

        // Create ground
        this.createGround();
        
        // Create portal
        this.createPortal(screenWidth, screenHeight);
        
        // Setup collisions
        this.setupCollisions();
    }

    private createTilemap(screenWidth: number, screenHeight: number) {
        const map = this.make.tilemap({ key: 'tile' });
        
        const lonTileset = map.addTilesetImage('lonbu', 'lonbu');
        const lonnhoTileset = map.addTilesetImage('lon4', 'lon4');
        const chodeTileset = map.addTilesetImage('chode', 'chode');
        const cookTileset = map.addTilesetImage('cook', 'cook');
        const meodeTileset = map.addTilesetImage('meode', 'meode');
        const cu1Tileset = map.addTilesetImage('cu1', 'cu1');
        const dimeTileset = map.addTilesetImage('dime', 'dime');
        
        // Create tile layer
        this.layer = map.createLayer('Tile Layer 1', 
            [lonTileset, chodeTileset, lonnhoTileset, cookTileset, meodeTileset, cu1Tileset, dimeTileset]);
        
        if (this.layer) {
            this.layer.setPosition(screenWidth + 300, screenHeight - 1024 - 128+this.offset);
           if(this.collisionManager) this.collisionManager.createCollisions(map, this.layer);
        }
    }

    private createPlayer(screenWidth: number, screenHeight: number) {
        this.player = new Player({
            scene: this,
            x: screenWidth / 4,
            y: screenHeight / 2+this.offset ,
            texture: 'logo',
            frame: 0
        });
    }

    private createGround() { 
        this.listGround = []
        
        for (let i = 0; i <= this.numGround; i++) {
            const x = i * 128+64;
            const y = window.innerHeight - 128 / 2+this.offset;
            const ground = this.physics.add.staticSprite(x, y, 'ground');
            ground.setImmovable(true);
            
            if (ground.body) {
                ground.body.setSize(128, 128);
            }
            
            this.listGround.push(ground);
        }
    }

    private createPortal(screenWidth: number, screenHeight: number) {
        this.portal = this.physics.add.staticSprite(
            128 * 176,
            screenHeight - 128 * 5+this.offset-60,
            'portal'
        );
        this.portal.setScale(2.4);
        
        if (this.portal.body) {
            this.portal.body.setSize(this.portal.width, this.portal.height);
        }
    }

    private setupCollisions() {
        if (!this.player) return;
        
        // Ground collisions
        this.listGround.forEach((ground) => {
            this.physics.add.collider(this.player, ground);
        });
        
        // Portal overlap
        if (this.portal) {
            this.physics.add.overlap(this.player, this.portal, () => {
                this.player.changeState(this.player.getRocket());
            });
        }
        
        // Layer collision
       if(this.layer) this.physics.add.collider(this.player, this.layer);
        
        // Setup collision manager
      if(this.collisionManager)  this.collisionManager.setupPlayerCollisions(this.player);
    }

    update(time: number, delta: number): void {
        
        // Update player
        if (this.player) {
            this.player.update(delta);
        }
        
        // Update managers
       if(this.backgroundManager) this.backgroundManager.update(time);
     if(this.collisionManager)   this.collisionManager.update();
   //  if(this.cameraController)   this.cameraController.update();
        
        let movement = this.tilemapSpeed * this.tilemapDirection;
        const currentState = this.player.getCurrentState();
         const isRocketState = currentState instanceof DeathState;  
         if(isRocketState) movement=0
        if (this.layer) {
            this.layer.x += movement;
        }
        
        // Update portal position
        if (this.portal) {
            this.portal.x += movement;
            if (this.portal.body) {
                this.portal.body.updateFromGameObject();
            } 
        }
        //Update ground postiton
        for (let i = 0; i <= this.numGround; i++) {
            this.listGround[i].x+=movement 
            if(this.listGround[i].x+128  < 0){
                this.listGround[i].x=this.numGround*128 
            }
        }
        // Update ground color
        if (this.listGround.length > 0) {
            const speed = 0.0009;
            const t = time * speed;
            const r = Math.floor(Math.sin(t) * 127 + 128);
            const g = 0;
            const b = Math.floor(Math.sin(t + 4) * 127 + 128);
            const color = (r << 16) + (g << 8) + b;
            
            this.listGround.forEach((ground) => {
                ground.setTint(color);
            });
        }
    }
}