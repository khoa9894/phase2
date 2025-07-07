import { IPlayerState } from "./IPlayerState";
import { Player } from "./Player";

export class DeathState implements IPlayerState {
    private scene: Phaser.Scene;
    private player: Player;
    private deathParticles: Phaser.GameObjects.Group;
    private deathTimer: number = 0;
    private readonly DEATH_DURATION = 1000; 
    private readonly PARTICLE_COUNT = 22;
    private readonly EXPLOSION_FORCE = 300;
    
    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.deathParticles = this.scene.add.group();
    }
    
    Enter(): void {
        this.deathTimer = 0;
        
        // Stop player movement
        this.player.setVelocity(0, 0);
        this.player.setAcceleration(0, 0);
        this.createExplosionEffect();
        this.player.setVisible(false);
    }
    
    Update(deltaTime: number): void {
        this.deathTimer += deltaTime;
        
        // Update particle positions and fade them out
        this.deathParticles.children.entries.forEach((particle: any) => {
            if (particle.active) {
                // Apply gravity to particles
                particle.velocityY += 800 * (deltaTime / 1000);
                
                // Update position
                particle.x += particle.velocityX * (deltaTime / 1000);
                particle.y -= particle.velocityY * (deltaTime / 1000);
                
                // Fade out over time
                const fadeProgress = this.deathTimer / this.DEATH_DURATION;
                particle.alpha = Math.max(0, 1 - fadeProgress);
                
                // Rotate particles
                particle.rotation += particle.rotationSpeed * (deltaTime / 1000);
                
                if (particle.alpha <= 0 || particle.y > this.scene.cameras.main.height + 150+128*8) {
                    particle.destroy();
                }
            }
        });
        
        if (this.deathTimer >= this.DEATH_DURATION) {
            this.respawnPlayer();
        }
    }
    
    Exit(): void {
        console.log("Player exited Death state");
        
        this.deathParticles.clear(true, true);
        
        this.player.setVisible(true);
        
        this.player.setAlpha(1);
        this.player.setTint(0x00ff00); 
    }
    
    private createExplosionEffect(): void {
        const playerX = this.player.x;
        const playerY = this.player.y;
                for (let i = 0; i < this.PARTICLE_COUNT; i++) {
            const angle = (i / this.PARTICLE_COUNT) * Math.PI * 2;
            const randomAngle = angle + (Math.random() - 0.5) * 0.5;
            
            const particle = this.scene.add.rectangle(
                playerX + (Math.random() - 0.5) * 10, 
                playerY + (Math.random() - 0.5) * 10,
                8 + Math.random() * 8,  
                8 + Math.random() * 8,
                0xFFFF00 
            );
                        
            const velocity = this.EXPLOSION_FORCE + Math.random() * 100;
            (particle as any).velocityX = Math.cos(randomAngle) * velocity;
            (particle as any).velocityY = Math.sin(randomAngle) * velocity - 200; 
            
            // Add rotation
            (particle as any).rotationSpeed = (Math.random() - 0.5) * 10;
            
            this.deathParticles.add(particle);
        }
        
        this.createSparkEffect(playerX, playerY);
    }
    
    private createSparkEffect(x: number, y: number): void {
        for (let i = 0; i < 8; i++) {
            const spark = this.scene.add.circle(
                x + (Math.random() - 0.5) * 0.1,
                y + (Math.random() - 0.5) * 0.1,
                2 + Math.random() * 3,
                0xffff00
            );
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 200 + Math.random() * 150;
            
            (spark as any).velocityX = Math.cos(angle) * velocity;
            (spark as any).velocityY = Math.sin(angle) * velocity - 100;
            (spark as any).rotationSpeed = (Math.random() - 0.5) * 15;
            console.log('s',spark.x,spark.y)
            this.deathParticles.add(spark);
        }
    }
    
    private respawnPlayer(): void {
        this.player.setPosition(300, 0);
        this.player.setVelocity(0, 0);
        
        this.player.setAlpha(0.5);
        this.scene.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            yoyo: true,
            repeat: 2
        });
        
        // Change back to idle state
        this.player.changeState(this.player.getIdleState());
    }
}