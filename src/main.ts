import Phaser from 'phaser'

import {PlayScene} from './scenes/PlayScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: screen.width,
    height: screen.height,
    parent: 'game-container',
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 2400,
        height: 900
    },
    //  fps: {
    //     target: 60,
        
    // },
    physics: {
        default: 'arcade',
        
        arcade: {
            gravity: { y: 800 },
           // debug: true
        }
    },

    scene: [PreloadScene, MenuScene, PlayScene]
}

const game = new Phaser.Game(config)
game.scene.start('PreloadScene')

document.body.style.backgroundColor = '#000'


export default game