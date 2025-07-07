export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        console.log("PreloadScene started");

         
        // Load player assets
        this.load.image('logo', 'assets/player.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('particle', 'assets/particle_00_001.png');

        // Load terrain assets
        this.load.image('cu1', 'assets/cu1.png');
        this.load.image('top', 'assets/top.png');
        this.load.image('bot', 'assets/bot.png');
        this.load.image('chode', 'assets/chode.png');
        this.load.image('lonbu', 'assets/lonbu.png');
        this.load.image('lon4', 'assets/lon4.png');
        this.load.image('cook', 'assets/cook.png');
        this.load.image('dime', 'assets/dime.png');
        this.load.image('meode', 'assets/meode.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('portal', 'assets/portal.png');
        this.load.image('name', 'assets/name.png');
        this.load.image('butt', 'assets/butt.png');

        // Load background assets
        this.load.image('chi1', 'assets/game_bg_01_001-hd.png');
        this.load.image('chi', 'assets/haha.png');
        this.load.tilemapTiledJSON('tile', 'tiles/shit.tmj');
        this.createLoadingBar();
    }

    private createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        
        const loadingText = this.add.text(width/2, height/2 - 50, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
    }

    create() {
        this.time.delayedCall(2000, () => {
        this.scene.start('MenuScene');
    });  
    }
}