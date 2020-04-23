const canvas = document.getElementById('invaders');
const context = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 540;

let timer;
let player;
let aliens;
const sounds = {
    invader1: document.getElementById('invader1'),
    invader2: document.getElementById('invader2'),
    invader3: document.getElementById('invader3'),
    invader4: document.getElementById('invader4'),
    invader_killed: document.getElementById('invader_killed'),
    shoot: document.getElementById('shoot'),
    player_death: document.getElementById('player_death')
};

const MODE_PLAYING = 1;
const MODE_GAME_OVER = 2;
const MODE_PLAYER_DEAD = 3;
const MODE_NEW_WAVE = 4;
const MODE_PAUSE = 5;
let game_mode = MODE_PLAYING;

// chargement de l'image du sprite avant de démarrer le jeu :
const spritesheet = new Image();
spritesheet.src = 'img/spritesheet - Copie.png';

spritesheet.onload = function () { // Fonction exécutée lorsque le nagigateur a fini de charger le PNG

    player = createPlayer();
    aliens = createAliens();

    //Démarrage de la boucle continue
    gameloop();

};

function update() {
    if (Keyboard.P || Keyboard.ECHAP) {
        game_mode = (game_mode === MODE_PAUSE) ? MODE_PLAYING : MODE_NEW_WAVE;
    }
    switch (game_mode) {
        case MODE_PLAYING:
            animatePlayer(); // Fonction qui gère l'animation du joueur
            animateAliens(); // Fonction qui gère l'animation du joueur
            break;
    }
}

function render() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    switch (game_mode) {
        case MODE_PLAYING:
        case MODE_PLAYER_DEAD:
            renderPlayer(); //Dessin du joueur
            renderAliens(); // Dessin du joueur
            break;
        case MODE_PLAYING:
            renderPlayer(); //Dessin du joueur
            renderAliens(); // Dessin du joueur
            break;
        case MODE_PAUSE:
            renderPlayer();
            break;
        case MODE_GAME_OVER:
            renderGameOver(); // Affichage du Game Over à l'écran
            break;
    }
    renderUI(); //Dessin des éléments de l'interface
}

// Fonction gérant la boucle de jeu
function gameloop() {
    update();
    render();

    timer = window.requestAnimationFrame(gameloop);
}

function renderGameOver() {
    context.fillStyle = '#8E49BE';
    context.font = 'normal 24px "Press start 2P", cursive';
    context.textAlign = 'center';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    context.fillStyle = '#E6B5FF';
    context.font = 'normal 12px "Press start 2P", cursive';
    context.textAlign = 'center';
    context.fillText('Press F5', canvas.width / 2, canvas.height / 2 + 25);
}