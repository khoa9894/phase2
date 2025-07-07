import {ImageConstructor} from "../Interface/general"

export abstract class Object extends Phaser.Physics.Arcade.Image{
    constructor(params: ImageConstructor){
        super(params.scene, params.x, params.y, params.texture, params.frame);
     

        //set up scene
        params.scene.add.existing(this);
        params.scene.physics.add.existing(this); 
        
    }
}