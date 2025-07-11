import { Trampoline } from './Trampoline';
import { Boost } from './BoostObject';
import { BaseObstacle } from "./BaseObject";
import { SmallTriangle } from './SmallTriangle'; 
import { Triangle } from "./BigTriangle";
import { Cube } from "./Cube";
import { DeathCube } from "./DeathCube";
import { Cook } from "./CookObject";
import { Portal } from "./Portal";
export interface ChunkData {
    id: string;
    startX: number;
    endX: number;
    obstacles: Array<{
        type: string;
        x: number;
        y: number;
        texture?: string;
    }>;
    isActive: boolean;
}
export class ObstacleManager {
    private scene: Phaser.Scene;
    private player: any;
    private obstacles: BaseObstacle[] = [];
    private chunkWidth:number=2000
    private chunkList:ChunkData[]=[]
    private loadDistance: number = 3000; 
    private unloadDistance: number = 4000;
    private ListBigTriangle:Triangle[]=[]
    private ListSmallTriangle:SmallTriangle[]=[]
    private ListCube:Cube[]=[]
    private ListDeathCube:DeathCube[]=[]
    constructor(scene: Phaser.Scene, player: any) {
        this.scene = scene;
        this.player = player;
    }
    private createPool() {
    for (let i = 0; i < 20; i++) {
        const obj = new Triangle(this.scene, this.player, -1000, -1000); 
        obj.setActive(false).setVisible(false);
        this.ListBigTriangle.push(obj);
    }
    for (let i = 0; i < 20; i++) {
        const obj = new SmallTriangle(this.scene, this.player, -1000, -1000);
        obj.setActive(false).setVisible(false);
        this.ListSmallTriangle.push(obj);
    }
    for (let i = 0; i < 20; i++) {
        const obj = new Cube(this.scene, this.player, -1000, -1000, 'cu1');
        obj.setActive(false).setVisible(false);
        this.ListCube.push(obj);
    }
    for (let i = 0; i < 20; i++) {
        const obj = new DeathCube(this.scene, this.player, -1000, -1000, 'meode');
        obj.setActive(false).setVisible(false);
        this.ListDeathCube.push(obj);
    }
}

    private divineChunk(map: Phaser.Tilemaps.Tilemap, offsetX: number, 
        offsetY: number):ChunkData[]{
           const totalWidth=map.width*map.tileWidth
           const numChunks=Math.ceil(totalWidth/this.chunkWidth)
           for(let i=0;i<numChunks;i++){
            const start=offsetX+(i*this.chunkWidth)
            const end=start+this.chunkWidth
            const chunk: ChunkData = {
                id: `chunk_${i}`,
                startX: start,
                endX: end,
                obstacles: [],
                isActive: false
            };
             const startTileX = Math.floor((i * this.chunkWidth) / map.tileWidth);
            const endTileX = Math.min(startTileX + Math.ceil(this.chunkWidth / map.tileWidth), map.width);
            for (let y = 0; y < map.height; y++) {
                for (let x = startTileX; x < endTileX; x++) {
                    const tile = map.getTileAt(x, y);
                    
                    if (tile && tile.properties) {
                        const tileWorldX = offsetX + (x * map.tileWidth);
                        const tileWorldY = offsetY + (y * map.tileHeight);
                        
                        const obstacleData = this.getObstacleDataFromTile(tile, tileWorldX, tileWorldY);
                        if (obstacleData) {
                            chunk.obstacles.push(obstacleData);
                        }
                    }
                }
            }
            
            this.chunkList.push(chunk);
        }
        
        return this.chunkList;
           }
           
    private getObstacleDataFromTile(tile: Phaser.Tilemaps.Tile, x: number, y: number): any {
        if (tile.properties.BigTriangle) {
            return { type: 'BigTriangle', x, y };
        } else if (tile.properties.smallTriangle) {
            return { type: 'smallTriangle', x, y };
        } else if (tile.properties.cube) {
            return { type: 'cube', x, y, texture: 'cu1' };
        } else if (tile.properties.Deathcube) {
            return { type: 'Deathcube', x, y, texture: 'meode' };
        } else if (tile.properties.cook) {
            return { type: 'cook', x, y };
        } else if (tile.properties.cubeUp) {
            return { type: 'cubeUp', x, y, texture: 'chode' };
        } else if (tile.properties.cubeFull) {
            return { type: 'cubeFull', x, y, texture: 'dime' };
        } else if (tile.properties.entry) {
            return { type: 'entry', x, y, texture: 'rocket' };
        } else if (tile.properties.normal) {
            return { type: 'normal', x, y, texture: 'normal' };
        } else if (tile.properties.win) {
            return { type: 'win', x, y, texture: 'end' };
        } else if (tile.properties.boost) {
            return { type: 'boost', x, y: y + 50 };
        } else if (tile.properties.trampoline) {
            return { type: 'trampoline', x, y: y + 50 };
        }
        
        return null;
    }
    public createObstaclesFromTilemap(map: Phaser.Tilemaps.Tilemap, offsetX: number, 
        offsetY: number): void {
            console.log('do')
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                
                if (tile && tile.properties) {
                    const tileWorldX = offsetX + (x * map.tileWidth);
                    const tileWorldY = offsetY + (y * map.tileHeight);
                    
                    let obstacle: BaseObstacle | null = null;
                    
                    if (tile.properties.BigTriangle) {
                        obstacle = new Triangle(this.scene, this.player, tileWorldX, tileWorldY);
                    } else if (tile.properties.smallTriangle) {
                        obstacle = new SmallTriangle(this.scene, this.player, tileWorldX, tileWorldY);
                    } else if (tile.properties.cube) {
                        obstacle = new Cube(this.scene, this.player, tileWorldX, tileWorldY,'cu1');
                    } else if (tile.properties.Deathcube) {
                        obstacle = new DeathCube(this.scene, this.player, tileWorldX, tileWorldY,'meode');
                    }
                    else if(tile.properties.cook){
                        obstacle = new Cook(this.scene, this.player, tileWorldX, tileWorldY);

                    }
                    else if(tile.properties.cubeUp){
                        obstacle = new Cube(this.scene, this.player, tileWorldX, tileWorldY,'chode');
                    }
                    else if(tile.properties.cubeFull){
                        obstacle = new Cube(this.scene, this.player, tileWorldX, tileWorldY,'dime');
                    }
                    else if(tile.properties.entry){
                        obstacle = new Portal(this.scene, this.player, tileWorldX, tileWorldY,'rocket');

                    }
                     else if(tile.properties.normal){
                        obstacle = new Portal(this.scene, this.player, tileWorldX, tileWorldY,'normal');

                    }
                     else if(tile.properties.win){
                        obstacle = new Portal(this.scene, this.player, tileWorldX, tileWorldY,'end');
                        console.log(tileWorldX)

                    }
                    else if(tile.properties.boost){
                         obstacle = new Boost(this.scene, this.player, tileWorldX, tileWorldY+50);

                    }
                    else if(tile.properties.trampoline){
                        obstacle = new Trampoline(this.scene, this.player, tileWorldX, tileWorldY+50);
                    }
                    if (obstacle) {
                        this.obstacles.push(obstacle);
                    }
                }
            }
        }
    }

    public update(movement: number, delta: number): void {
        this.obstacles.forEach(obstacle => {
            obstacle.updatePosition(movement, delta);
        });
    }

    public setSpeed(speed: number, direction: number): void {
        this.obstacles.forEach(obstacle => {
            obstacle.setSpeed(speed, direction);
        });
    }
    public getPoo():number{
        return this.obstacles.length
    }
    public getObstacles(): BaseObstacle[] {
        return this.obstacles;
    }
}