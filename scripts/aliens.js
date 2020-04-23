const aliensMap = [
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,

    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,

    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

const NB_ALIENS_PER_LIGN = 11;
const ALIEN_SPACE_X = 35;
const ALIEN_SPACE_Y = 28;

const alienSprites = {

    40:
        [
            { x: 6, y: 3, width: 16, height: 16 },
            { x: 6, y: 25, width: 16, height: 16 }
        ],
    20: [
        { x: 32, y: 3, width: 22, height: 16 },
        { x: 32, y: 25, width: 22, height: 16 }
    ],
    10: [
        { x: 60, y: 3, width: 24, height: 16 },
        { x: 60, y: 25, width: 24, height: 16 }
    ],

};
let lastAlienMovement = 0; //Instant t du dernier mouvement d'aliens
let aliensTimer = 1000; //Intervalle de mouvement d'aliens
let alienExplosion = []; //tableau pour stocker les sprites d'explosion
let alienSoundNb = 1; //Numéro du son d'aliens
let aliensShots = []; //Tableau Tirs d'aliens


function createAliens() {
    const aliens = [];

    for (let i = 0, line = 0; i < aliensMap.length; i++) {
        if (i % NB_ALIENS_PER_LIGN === 0) {
            line++;
        }

        let alienWidth = alienSprites[aliensMap[i]][0].width;
        let alienHeight = alienSprites[aliensMap[i]][0].height;

        aliens.push({
            x: 12 + i % NB_ALIENS_PER_LIGN * ALIEN_SPACE_X + (24 - alienWidth) / 2 | 0,
            y: 100 + line * ALIEN_SPACE_Y,
            width: alienWidth,
            height: alienHeight,
            points: aliensMap[i],
            spriteIndex: 0,
            direction: 1

        });
    }
    return aliens;

}

function animateAliens() {

    if (Date.now() - lastAlienMovement > aliensTimer) {
        lastAlienMovement = Date.now();

        sounds['invader' + alienSoundNb].play();
        alienSoundNb++;
        if (alienSoundNb > 4) {
            alienSoundNb = 1;
        }

        let extremeDownAlien = Math.max(...aliens.map(a => a.y));
        if (extremeDownAlien + 16 >= player.y) {
            player.lives = 0;
            sounds['player_death'].play();
            game_mode = MODE_GAME_OVER;
        }

        //Récupération du x de  l'alien le plus à droite
        let extremeRightAlien = Math.max(...aliens.map(a => a.x)) + ALIEN_SPACE_X;
        let extremeLeftAlien = Math.min(...aliens.map(a => a.x));


        for (let i = 0; i < aliens.length; i++) {

            if (Math.random() > 0.99) {
                createAlienShot(aliens[i]);
            }
            if (
                extremeRightAlien > canvas.width && aliens[i].direction === 1 ||
                extremeLeftAlien <= 0 && aliens[i].direction === -1) {
                aliens[i].direction *= -1;
                aliens[i].y += 22;
            } else {
                aliens[i].x += 12 * aliens[i].direction;
            }

            if (aliens[i].spriteIndex === 0) {
                aliens[i].spriteIndex = 1;
            } else {
                aliens[i].spriteIndex = 0;
            }


        }

    }
    //Vérification tir alien
    if (player.bullet !== null) {
        for (let i = 0; i < aliens.length; i++) {
            if (
                player.bullet.x > aliens[i].x &&
                player.bullet.x <= aliens[i].x + aliens[i].width &&
                player.bullet.y > aliens[i].y &&
                player.bullet.y <= aliens[i].y + aliens[i].height) {
                //Collision
                createExplosion(aliens[i]);
                //Son
                sounds['invader_killed'].play();
                //Augmentation du score du joueur
                player.score += aliens[i].points;
                player.bullet = null;
                //Augmentation cadence aliens
                aliensTimer -= 15

                if (aliensTimer < 75) {
                    aliensTimer = 75;
                    aliens.splice(i, 1);
                    break;
                }
                aliens.splice(i, 1);
                if (aliens.length === 0) {
                    //Régénération d'une nouvelle ligne 
                    aliens = createAliens();
                    aliensTimer = 1000;
                    lastAlienMovement = Date.now();
                    game_mode = MODE_NEW_WAVE;
                    setTimeout(() => {
                        game_mode = MODE_PLAYING;
                    }, 1000);
                }
                break;
            }
        }
    }

    for (let i = 0; i < alienExplosion.length; i++) {
        if (Date.now() - alienExplosion[i].dateCreated > 100) {
            alienExplosion.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < aliensShots.length; i++) {
        aliensShots[i].y += aliensShots[i].speed;

        //Si le tir d'alien déborde en bas du canvas 
        if (aliensShots[i].y > canvas.height) {
            aliensShots.splice(i, 1);
            i--
        }
        else if (
            aliensShots[i].x > player.x &&
            aliensShots[i].x + aliensShots[i].width < player.x + player.sprite.width &&
            aliensShots[i].y + aliensShots[i].height > player.y &&
            aliensShots[i].y < player.y + player.sprite.height
        ) {
            //Moins une vie
            player.lives--;
            if (player.lives === 0) {
                game_mode = MODE_GAME_OVER;
                break;
            }
            //Suppression des tirs d'aliens en cours, et du shoot player
            aliensShots.length = 0;
            player.bullet = null;
            //Boom
            sounds['player_death'].play();
            //Changement mode de jeu pour deux secondes
            game_mode = MODE_PLAYER_DEAD;
            setTimeout(() => {
                //remplacement du joueur a sa position initiale
                player.x = 100;

                game_mode = MODE_PLAYING;
            }, 2000);

        }
    }

} //Fin de la fonction animateAliens


function renderAliens() {
    for (let i = 0; i < aliens.length; i++) {

        let points = aliens[i].points;
        let spriteIndex = aliens[i].spriteIndex;

        context.drawImage(
            spritesheet,

            alienSprites[points][spriteIndex].x,
            alienSprites[points][spriteIndex].y,
            alienSprites[points][spriteIndex].width,
            alienSprites[points][spriteIndex].height,

            aliens[i].x,
            aliens[i].y,
            alienSprites[points][spriteIndex].width,
            alienSprites[points][spriteIndex].height,
        )

    }
    //dessin des explosions
    for (let i = 0; i < alienExplosion.length; i++) {
        context.drawImage(
            spritesheet,
            alienExplosion[i].sprite.x,
            alienExplosion[i].sprite.y,
            alienExplosion[i].sprite.width,
            alienExplosion[i].sprite.height,

            alienExplosion[i].x,
            alienExplosion[i].y,
            alienExplosion[i].sprite.width,
            alienExplosion[i].sprite.height,
        );
    }
    //Dessin des shots des aliens
    for (let i = 0; i < aliensShots.length; i++) {
        context.fillStyle = '#fff';
        context.fillRect(aliensShots[i].x, aliensShots[i].y, aliensShots[i].width, aliensShots[i].height);
    }
}

function createExplosion(alien) {
    alienExplosion.push({
        x: alien.x,
        y: alien.y,
        sprite: {
            x: 88,
            y: 25,
            width: 26,
            height: 16

        },
        dateCreated: Date.now(),
    })
}


function createAlienShot(alien) {
    //Son
    sounds['shoot'].play();
    //Ajout d'un shot alien
    aliensShots.push({
        x: alien.x + alien.width / 2,
        y: alien.y + alien.height / 2,
        width: 4,
        height: 10,
        speed: 5

    })
}