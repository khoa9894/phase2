import { Player } from './../Player/Player';
import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene
{   
    private Player: Player | undefined
    private bg1: Phaser.GameObjects.Image | undefined
    private bg2: Phaser.GameObjects.Image | undefined
    private layer: Phaser.Tilemaps.TilemapLayer | undefined
    private listGround: Phaser.Physics.Arcade.Sprite[] = []
    private portal: Phaser.Physics.Arcade.Sprite  | undefined
    private triangleCollisions: Phaser.Physics.Arcade.Sprite[] = []
    private smallTriangleCollisions: Phaser.Physics.Arcade.Sprite[] = []
    private cubeCollisions: Phaser.Physics.Arcade.Sprite[] = []
    private deathZones: Phaser.Physics.Arcade.Sprite[] = []
    private tilemapSpeed: number = 6.5
    private tilemapDirection: number = -1 
    
    // Camera follow properties
    private cameraFollowThreshold: number = 0.1
    private initialCameraY: number = 0
    
    constructor()
    {
        super('hello-world')
    }

    preload() {
        //load player
        this.load.image('logo', '../assets/player.png');
        this.load.image('ship', '../assets/ship.png');
        this.load.image('particle','../assets/particle_00_001.png')
        //load terrain
        this.load.image('cu1','../assets/cu1.png')
        this.load.image('top','../assets/top.png')
        this.load.image('bot','../assets/bot.png')

        this.load.image('chode','../assets/chode.png')
        this.load.image('lonbu','../assets/lonbu.png')
        this.load.image('lon4','../assets/lon4.png')
        this.load.image('cook','../assets/cook.png')
        this.load.image('dime','../assets/dime.png')
        this.load.image('meode','../assets/meode.png')
        this.load.image('ground','../assets/ground.png')
        this.load.image('portal','../assets/portal.png')
        //load background
        this.load.image('chi1','../assets/game_bg_01_001-hd.png')
        this.load.image('chi','../assets/haha.png')
        this.load.tilemapTiledJSON('tile','../tiles/shit.tmj')
    } 

    create() 
    {   
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Set camera follow threshold và initial position
        this.cameraFollowThreshold = screenHeight * 0.1; // 30% từ trên xuống
        this.initialCameraY = screenHeight / 2;
        
        // Set world bounds và camera bounds
        this.physics.world.setBounds(0, -500, screenWidth * 3, screenHeight + 1000);
        this.cameras.main.setBounds(0, -500, screenWidth * 3, screenHeight + 1000);
        
        // Set camera position ban đầu
        this.cameras.main.setScroll(0, this.initialCameraY - screenHeight / 2);
        
        // Set up parallax background - đặt liền nhau
        this.bg1 = this.add.image(screenWidth / 2, screenHeight / 2, 'chi')
        this.bg1.setDisplaySize(screenWidth, screenHeight + 512)
        this.bg1.setScrollFactor(0)
        
        this.bg2 = this.add.image(screenWidth * 1.5, screenHeight / 2, 'chi')
        this.bg2.setDisplaySize(screenWidth, screenHeight + 512)
        this.bg2.setScrollFactor(0) 
        
        // Create the tilemap
        const map = this.make.tilemap({key:'tile'})
        
        // Add tilesets
        const lonTileset = map.addTilesetImage('lonbu', 'lonbu')  
        const lonnhoTileset = map.addTilesetImage('lon4', 'lon4')
        const chodeTileset=map.addTilesetImage('chode','chode')
        const cookTileset=map.addTilesetImage('cook','cook')
        const meodeTileset=map.addTilesetImage('meode','meode')
        const cu1Tileset=map.addTilesetImage('cu1','cu1')
        const dimeTileset=map.addTilesetImage('dime','dime')
        
        // Create tile layer
        this.layer = map.createLayer('Tile Layer 1', [lonTileset, chodeTileset, lonnhoTileset,cookTileset,meodeTileset,cu1Tileset,dimeTileset])
        
        // Create collision objects group
        if (this.layer) {
            this.layer.setPosition(screenWidth+300, screenHeight - 1024-128) 
            this.createCubeCollisions(map, this.layer)
            this.createCookCollisions(map,this.layer)
            this.createTriangleCollisions(map, this.layer)
            this.createSmallTriangleCollisions(map, this.layer)
            this.createDeathCubeCollisions(map, this.layer)
        }
    
        // Create player
        this.Player = new Player({
            scene: this,
            x: screenWidth / 4, 
            y: screenHeight / 2,
            texture: 'logo',
            frame: 0
        });
        
        // Create ground
        const numGround=Math.round(window.innerWidth/128)
        for(let i=0;i<=numGround;i++){
            const x=i*128
            const y=window.innerHeight-128/2
            const hi = this.physics.add.staticSprite(x, y, 'ground')
            hi.setImmovable(true)
            // Set collision body size
            if (hi.body) {
                hi.body.setSize(128, 128)
            }
            
            this.listGround.push(hi)       
        }
        this.portal = this.physics.add.staticSprite(
                            128*176, 
                            screenHeight-128*5, 
                            'portal'
                        );
                        this.portal.setScale(1.8)
        if (this.portal.body) {
        this.portal.body.setSize(this.portal.width, this.portal.height);
    }
    
    if (this.Player && this.portal) {
        this.physics.add.overlap(
            this.Player as Phaser.GameObjects.GameObject, 
            this.portal, 
            () => {
                this.Player?.changeState(this.Player.getRocket());
            }
        );
    }
        if (this.Player) {
            this.listGround.forEach((ground) => {
                this.physics.add.collider(this.Player as Phaser.GameObjects.GameObject, ground)
            })
            
          //  Add collision với triangle collision boxes
            this.triangleCollisions.forEach((collision) => {
                this.physics.add.overlap(this.Player as Phaser.GameObjects.GameObject, collision, () => {
                    this.handlePlayerDeath()
                })
            })
            
            // Add collision với small triangle collision boxes
            this.smallTriangleCollisions.forEach((collision) => {
                this.physics.add.overlap(this.Player as Phaser.GameObjects.GameObject, collision, () => {
                    this.handlePlayerDeath()
                })
            })
            
            this.cubeCollisions.forEach((collision) => {
                this.physics.add.collider(this.Player as Phaser.GameObjects.GameObject, collision)
            })
    
            this.deathZones.forEach((deathZone) => {
                this.physics.add.overlap(this.Player as Phaser.GameObjects.GameObject, deathZone, () => {
                    this.handlePlayerDeath()
                })
            })
        }
        
        // Add collisions with layer
        this.physics.add.collider(this.Player, this.layer)
    }

    private updateCameraFollow(): void {
        if (!this.Player) return;
        
        const screenHeight = this.cameras.main.height;
        const playerY = this.Player.y;
        
        if (playerY < this.cameraFollowThreshold) {
            const targetCameraY = playerY;
            const newScrollY = targetCameraY - screenHeight / 2;
            
            const lerpFactor = 0.009;
            const currentScrollY = this.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, newScrollY, lerpFactor);
            
            this.cameras.main.setScroll(this.cameras.main.scrollX, smoothScrollY);
        }
        // Kiểm tra nếu player rơi xuống dưới ngưỡng
        else if (playerY > screenHeight - this.cameraFollowThreshold) {
            const targetCameraY = playerY;
            const newScrollY = targetCameraY - screenHeight / 2;
            
            const lerpFactor = 0.005;
            const currentScrollY = this.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, newScrollY, lerpFactor);
            
            this.cameras.main.setScroll(this.cameras.main.scrollX, smoothScrollY);
        }
        else {
            const targetScrollY = this.initialCameraY - screenHeight / 2;
            const lerpFactor = 0.05; // Chậm hơn khi về vị trí ban đầu
            const currentScrollY = this.cameras.main.scrollY;
            const smoothScrollY = Phaser.Math.Linear(currentScrollY, targetScrollY, lerpFactor);
            
            this.cameras.main.setScroll(this.cameras.main.scrollX, smoothScrollY);
        }
    }
    
    createCookCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile) {
                    const hasCube = tile.properties && tile.properties.cook;
                    
                    if (hasCube) {
                        const tileWorldX = layer.x + (x * map.tileWidth);
                        const tileWorldY = layer.y + (y * map.tileHeight);
                        
                        const platformCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth/2, 
                            tileWorldY+110 ,
                            'top'
                        );
                        
                        // Cấu hình platform collision
                        platformCollision.setVisible(false);
                        if (platformCollision.body) {
                            platformCollision.body.setSize(20, 32);
                        }
                        this.cubeCollisions.push(platformCollision);
                        
                        const deathZone = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth / 2-30, 
                            tileWorldY + map.tileHeight -20, 
                            ''
                        );
                        deathZone.setVisible(false);
                        if (deathZone.body) {
                            deathZone.body.setSize(map.tileWidth, 32);
                        }
                        this.deathZones.push(deathZone);
                    }
                }
            }
        }
    }
    
    createCubeCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile) {
                    const hasCube = tile.properties && tile.properties.cube;
                    
                    if (hasCube) {
                        const tileWorldX = layer.x + (x * map.tileWidth);
                        const tileWorldY = layer.y + (y * map.tileHeight);
                        
                        const platformCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth/2, 
                            tileWorldY + 34,
                            'top'
                        );
                        
                        // Cấu hình platform collision
                        platformCollision.setVisible(false);
                        if (platformCollision.body) {
                            platformCollision.body.setSize(100, 32);
                        }
                        this.cubeCollisions.push(platformCollision);
                        
                        const deathZone = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth / 2, 
                            tileWorldY + map.tileHeight - 36, // Phần dưới của cube
                            'bot'
                        );
                        deathZone.setVisible(false);
                        if (deathZone.body) {
                            deathZone.body.setSize(map.tileWidth - 20, 32);
                        }
                        this.deathZones.push(deathZone);
                    }
                }
            }
        }
    }

    createDeathCubeCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile) {
                    const hasDeathCube = tile.properties && tile.properties.Deathcube;
                    
                    if (hasDeathCube) {
                        const tileWorldX = layer.x + (x * map.tileWidth);
                        const tileWorldY = layer.y + (y * map.tileHeight);
                        
                        const deathZone = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth / 2, 
                            tileWorldY + map.tileHeight / 2,
                            'meode'
                        );
                        
                        deathZone.setVisible(false);
                        if (deathZone.body) {
                            deathZone.body.setSize(map.tileWidth, map.tileHeight);
                        }
                        this.deathZones.push(deathZone);
                    }
                }
            }
        }
    }

    handlePlayerDeath() {
        console.log("Player died!");
        this.Player?.disableCollision()
        this.Player?.changeState(this.Player.getDeathState())

        this.time.delayedCall(500, () => {
            this.scene.restart();
        });
    }
    
    createTriangleCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        // Duyệt qua tất cả tiles trong layer
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile) {
                    const hasBigTriangle = tile.properties && tile.properties.BigTriangle;
                    
                    if (hasBigTriangle) {
                        const tileWorldX = layer.x + (x * map.tileWidth);
                        const tileWorldY = layer.y + (y * map.tileHeight);
                        const topCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth / 2, 
                            tileWorldY + 20, 
                            ''
                        );
                        
                        const bottomLeftCollision = this.physics.add.staticSprite(
                            tileWorldX + 16, 
                            tileWorldY + map.tileHeight - 16, 
                            ''
                        );
                        
                        const bottomRightCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth - 16, 
                            tileWorldY + map.tileHeight - 16, 
                            ''
                        );
                        
                        const collisionBoxes = [topCollision, bottomLeftCollision, bottomRightCollision];
                        
                        collisionBoxes.forEach(box => {
                            box.setVisible(false); 
                            if (box.body) {
                                box.body.setSize(32, 32);
                            }
                            this.triangleCollisions.push(box);
                        });
                    }
                }
            }
        }
    }
    
    createSmallTriangleCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile) {
                    const hasSmallTriangle = tile.properties && tile.properties.smallTriangle;
                    
                    if (hasSmallTriangle) {
                        const tileWorldX = layer.x + (x * map.tileWidth);
                        const tileWorldY = layer.y + (y * map.tileHeight);
                        
                        const topCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth / 2, 
                            tileWorldY + 80, 
                            ''
                        );
                        
                        const bottomLeftCollision = this.physics.add.staticSprite(
                            tileWorldX + 30, 
                            tileWorldY + map.tileHeight - 24, 
                            ''
                        );
                        
                        const bottomRightCollision = this.physics.add.staticSprite(
                            tileWorldX + map.tileWidth - 30, 
                            tileWorldY + map.tileHeight - 24, 
                            ''
                        );
                        
                        const collisionBoxes = [topCollision, bottomLeftCollision, bottomRightCollision];
                        
                        collisionBoxes.forEach(box => {
                            box.setVisible(false); 
                            if (box.body) {
                                box.body.setSize(20, 20); 
                            }
                            this.smallTriangleCollisions.push(box);
                        });
                    }
                }
            }
        }
    }
     
    update(time: number, delta: number): void {
        if (this.Player) {
            this.Player.update(delta);
             this.updateCameraFollow();
        }
        
        const movement = this.tilemapSpeed * this.tilemapDirection;
        
        if (this.layer) {
            this.layer.x += movement;
        }
        
        this.triangleCollisions.forEach(collision => {
            collision.x += movement;
            if (collision.body) {
                collision.body.updateFromGameObject();
            }
        });
        
        this.smallTriangleCollisions.forEach(collision => {
            collision.x += movement;
            if (collision.body) {
                collision.body.updateFromGameObject();
            }
        });
        if(this.portal){
        this.portal.x+=movement
         if (this.portal.body) {
            this.portal.body.updateFromGameObject();
        }}
        // Background animation - infinite scrolling
        if (this.bg1 && this.bg2) {
            const speed = 0.0009 
            const t = time * speed;

            const r = Math.floor(Math.sin(t) * 127 + 128);
            const g = 0
            const b = Math.floor(Math.sin(t + 4) * 127 + 128);

            const color = (r << 16) + (g << 8) + b;
            this.bg1.setTint(color);
            this.bg2.setTint(color);
            this.listGround.forEach((ground) => {
                ground.setTint(color);
            });
            
            this.cubeCollisions.forEach(collision => {
                collision.x += movement;
                if (collision.body) {
                    collision.body.updateFromGameObject();
                }
            });
    
            this.deathZones.forEach(deathZone => {
                deathZone.x += movement;
                if (deathZone.body) {
                    deathZone.body.updateFromGameObject();
                }
            });
            
            const scrollSpeed = this.tilemapSpeed * this.tilemapDirection * 0.5; 
            const screenWidth = this.cameras.main.width;
            
            this.bg1.x += scrollSpeed;
            this.bg2.x += scrollSpeed;
            
            if (this.bg1.x <= -screenWidth / 2) { 
                this.bg1.x = this.bg2.x + screenWidth; 
            }
            if (this.bg2.x <= -screenWidth / 2) {
                this.bg2.x = this.bg1.x + screenWidth; 
            }
        }
    }
}