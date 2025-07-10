import { DoubleJump } from './DoubleJump';
import { Rocket } from './Rocket';
import { DeathState } from './DeathState';
import {ImageConstructor} from "../Interface/general"
import { IPlayerState } from "./IPlayerState";
import { IdleState } from "./IdleState";
import { JumpState } from "./JumpState";
import { Jampo } from './Jampo';
export class Player extends Phaser.Physics.Arcade.Sprite{
        //input
      private jumpKey: Phaser.Input.Keyboard.Key;
        //state
     public isJump:boolean=false
      private Idle: IdleState
      private Rocket: Rocket
      private Jump:JumpState
      private DoubleJump:DoubleJump
      private currentState:IPlayerState
      private DeathState:DeathState
      private Jampo:Jampo
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
        this.setGravityY(2300); 
        this.setBounce(0); 
        this.setSize(60,60); 
         this.setScale(2)

        // Init state
        this.Idle=new IdleState(params.scene,this)
        this.Jump=new JumpState(params.scene,this)
        this.Jampo=new Jampo(params.scene,this)

        this.DeathState=new DeathState(params.scene,this)
        this.Rocket=new Rocket(params.scene,this)

        this.DoubleJump=new DoubleJump(params.scene,this)
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
public triggerJump(): void {
    this.isJump=true
}
enableCollision() {
    if (this.body) {
        this.body.enable = true;
    }
}
    getJumpKey():Phaser.Input.Keyboard.Key {return this.jumpKey}
    getDoubleJump():IPlayerState{return this.DoubleJump}
    getIdleState():IPlayerState{return this.Idle}
    getJumpState():IPlayerState{return this.Jump}
    getRocket():IPlayerState{return this.Rocket}
    getCurrentState():IPlayerState{return this.currentState}
    getDeathState():IPlayerState{return this.DeathState}
     getJampo():IPlayerState{return this.Jampo}
} 
      
