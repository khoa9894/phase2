import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
 	width: window.innerWidth,
	height: window.innerHeight,
	parent: 'game-container', 
	
	physics: {
		default: 'arcade',
		
		arcade: {
			gravity: { y: 800 },
			// debug:true
		}
	},

	scene: [HelloWorldScene]
}

const game = new Phaser.Game(config)

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.alignItems = 'center'
document.body.style.minHeight = '100vh'
document.body.style.backgroundColor = '#000'

export default game
