import { Trampoline } from './Trampoline';
import { Boost } from './BoostObject';
import { BaseObstacle } from "./BaseObject";
import { SmallTriangle } from './SmallTriangle'; 
import { Triangle } from "./BigTriangle";
import { Cube } from "./Cube";
import { DeathCube } from "./DeathCube";
import { Cook } from "./CookObject";
import { Portal } from "./Portal";
export class ObstacleManager {
    private scene: Phaser.Scene;
    private player: any;
    private obstacles: BaseObstacle[] = [];

    constructor(scene: Phaser.Scene, player: any) {
        this.scene = scene;
        this.player = player;
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