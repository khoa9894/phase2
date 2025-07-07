import { Rocket } from './Rocket';
import { DeathState } from './DeathState';
import {ImageConstructor} from "../Interface/general"
import { IPlayerState } from "./IPlayerState";
import { IdleState } from "./IdleState";
import { JumpState } from "./JumpState";
export class Player extends Phaser.Physics.Arcade.Sprite{
        //input
      private jumpKey: Phaser.Input.Keyboard.Key;
        //state
      private Idle: IdleState
      private Rocket: Rocket
      private Jump:JumpState
      private currentState:IPlayerState
      private DeathState:DeathState
        static body: any;
      constructor(params: ImageConstructor){
        super(params.scene, params.x, params.y, params.texture, params.frame);
     
     
        //set up scene
        params.scene.add.existing(this);
        params.scene.physics.add.existing(this); 
        this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        //set up player
        this.setPosition(params.x,params.y);
        this.setTint(0x00aa00);
        this.setGravityY(1300); 
        this.setCollideWorldBounds(true); 
        this.setBounce(0); 
        this.setSize(60,60); 
         this.setScale(2)

        // Init state
        this.Idle=new IdleState(params.scene,this)
        this.Jump=new JumpState(params.scene,this)
        this.DeathState=new DeathState(params.scene,this)
        this.Rocket=new Rocket(params.scene,this)

        //set up currentState
        this.Idle.Enter()
        this.currentState=this.Idle
        
    }   
    
    changeState(newState:IPlayerState){
        this.currentState.Exit()
        this.currentState=newState
        this.currentState.Enter()
    }
    update(deltaTime: number): void {
        this.currentState.Update(deltaTime)
    }
    //Getter
disableCollision() {
    if (this.body) {
        this.body.enable = false;
    }
}

enableCollision() {
    if (this.body) {
        this.body.enable = true;
    }
}
    getJumpKey():Phaser.Input.Keyboard.Key {return this.jumpKey}
    getIdleState():IPlayerState{return this.Idle}
    getJumpState():IPlayerState{return this.Jump}
    getRocket():IPlayerState{return this.Rocket}

    getDeathState():IPlayerState{return this.DeathState}
} 
      
