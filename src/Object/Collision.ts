export class CollisionManager {
    private scene: Phaser.Scene;
    private triangleCollisions: Phaser.Physics.Arcade.Sprite[] = [];
    private smallTriangleCollisions: Phaser.Physics.Arcade.Sprite[] = [];
    private cubeCollisions: Phaser.Physics.Arcade.Sprite[] = [];
    private deathZones: Phaser.Physics.Arcade.Sprite[] = [];
    private tilemapSpeed: number;
    private tilemapDirection: number;

    constructor(scene: Phaser.Scene, tilemapSpeed: number, tilemapDirection: number) {
        this.scene = scene;
        this.tilemapSpeed = tilemapSpeed;
        this.tilemapDirection = tilemapDirection;
    }

    createCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        this.createCubeCollisions(map, layer);
        this.createCookCollisions(map, layer);
        this.createTriangleCollisions(map, layer);
        this.createSmallTriangleCollisions(map, layer);
        this.createDeathCubeCollisions(map, layer);
    }

    private createCubeCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.properties && tile.properties.cube) {
                    const tileWorldX = layer.x + (x * map.tileWidth);
                    const tileWorldY = layer.y + (y * map.tileHeight);
                    
                    const platformCollision = this.scene.physics.add.staticSprite(
                        tileWorldX + map.tileWidth/2, 
                        tileWorldY + 34,
                        'top'
                    );
                    
                    platformCollision.setVisible(false);
                    if (platformCollision.body) {
                        platformCollision.body.setSize(100, 32);
                    }
                    this.cubeCollisions.push(platformCollision);
                    
                    const deathZone = this.scene.physics.add.staticSprite(
                        tileWorldX + map.tileWidth / 2, 
                        tileWorldY + map.tileHeight - 36,
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

    private createCookCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.properties && tile.properties.cook) {
                    const tileWorldX = layer.x + (x * map.tileWidth);
                    const tileWorldY = layer.y + (y * map.tileHeight);
                    
                    const platformCollision = this.scene.physics.add.staticSprite(
                        tileWorldX + map.tileWidth/2, 
                        tileWorldY + 110,
                        'top'
                    );
                    
                    platformCollision.setVisible(false);
                    if (platformCollision.body) {
                        platformCollision.body.setSize(20, 32);
                    }
                    this.cubeCollisions.push(platformCollision);
                    
                    const deathZone = this.scene.physics.add.staticSprite(
                        tileWorldX + map.tileWidth / 2 - 30, 
                        tileWorldY + map.tileHeight - 20, 
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

    private createTriangleCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.properties && tile.properties.BigTriangle) {
                    const tileWorldX = layer.x + (x * map.tileWidth);
                    const tileWorldY = layer.y + (y * map.tileHeight);
                    
                    const positions = [
                        { x: tileWorldX + map.tileWidth / 2, y: tileWorldY + 20 },
                        { x: tileWorldX + 16, y: tileWorldY + map.tileHeight - 16 },
                        { x: tileWorldX + map.tileWidth - 16, y: tileWorldY + map.tileHeight - 16 }
                    ];
                    
                    positions.forEach(pos => {
                        const collision = this.scene.physics.add.staticSprite(pos.x, pos.y, '');
                        collision.setVisible(false);
                        if (collision.body) {
                            collision.body.setSize(32, 32);
                        }
                        this.triangleCollisions.push(collision);
                    });
                }
            }
        }
    }

    private createSmallTriangleCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.properties && tile.properties.smallTriangle) {
                    const tileWorldX = layer.x + (x * map.tileWidth);
                    const tileWorldY = layer.y + (y * map.tileHeight);
                    
                    const positions = [
                        { x: tileWorldX + map.tileWidth / 2, y: tileWorldY + 80 },
                        { x: tileWorldX + 30, y: tileWorldY + map.tileHeight - 24 },
                        { x: tileWorldX + map.tileWidth - 30, y: tileWorldY + map.tileHeight - 24 }
                    ];
                    
                    positions.forEach(pos => {
                        const collision = this.scene.physics.add.staticSprite(pos.x, pos.y, '');
                        collision.setVisible(false);
                        if (collision.body) {
                            collision.body.setSize(20, 20);
                        }
                        this.smallTriangleCollisions.push(collision);
                    });
                }
            }
        }
    }

    private createDeathCubeCollisions(map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.properties && tile.properties.Deathcube) {
                    const tileWorldX = layer.x + (x * map.tileWidth);
                    const tileWorldY = layer.y + (y * map.tileHeight);
                    
                    const deathZone = this.scene.physics.add.staticSprite(
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
    setupPlayerCollisions(player: any) {
        // Triangle collisions - death
        this.triangleCollisions.forEach((collision) => {
            this.scene.physics.add.overlap(player, collision, () => {
                this.handlePlayerDeath(player);
            });
        });
        
        // Small triangle collisions - death
        this.smallTriangleCollisions.forEach((collision) => {
            this.scene.physics.add.overlap(player, collision, () => {
                this.handlePlayerDeath(player);
            });
        });
        
        // Cube collisions - solid
        this.cubeCollisions.forEach((collision) => {
            this.scene.physics.add.collider(player, collision);
        });

        // Death zones
        this.deathZones.forEach((deathZone) => {
            this.scene.physics.add.overlap(player, deathZone, () => {
                this.handlePlayerDeath(player);
            });
        });
    }

    private handlePlayerDeath(player: any) {
        console.log("Player died!");
        player.disableCollision();
        player.changeState(player.getDeathState());

        this.scene.time.delayedCall(500, () => {
            this.scene.scene.restart();
        });
    }

    update() {
        const movement = this.tilemapSpeed * this.tilemapDirection;        
        [...this.triangleCollisions, ...this.smallTriangleCollisions, ...this.cubeCollisions, ...this.deathZones]
            .forEach(collision => {
                collision.x += movement;
                if (collision.body) {
                    collision.body.updateFromGameObject();
                }
            });
    }

    getCollisionArrays() {
        return {
            triangleCollisions: this.triangleCollisions,
            smallTriangleCollisions: this.smallTriangleCollisions,
            cubeCollisions: this.cubeCollisions,
            deathZones: this.deathZones
        };
    }
}