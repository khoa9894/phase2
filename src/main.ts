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

// Debug: Thêm border cho canvas
game.events.once('ready', () => {
    const canvas = game.canvas
    if (canvas) {
        canvas.style.border = '2px solid red'
        canvas.style.boxSizing = 'border-box'
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height)
        console.log('Canvas display size:', canvas.style.width, 'x', canvas.style.height)
    }
})

export default game