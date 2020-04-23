function createPlayer() {

    // Création d'un objets littéral JS représentant le joueur et ses propriétés
    const player = {
        x: 100,
        y: 450,
        speed: 3,
        lives: 3,
        score: 0,
        sprite: {
            img: spritesheet,
            offsetX: 88,
            offsetY: 3,
            width: 26,
            height: 16
        },
        bullet: null
    };
    return player;
}

function animatePlayer() {
    // Mouvement horizontale
    if (Keyboard.RIGHT) {
        player.x += player.speed;
    }
    if (Keyboard.LEFT) {
        player.x -= player.speed;
    }

    //  gestion du debordement d'écran
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.sprite.width > canvas.width) {
        player.x = canvas.width - player.sprite.width;
    }

    //Si le joueur tire
    if (Keyboard.SPACE) {
        if (player.bullet === null) {
            player.bullet = {
                x: player.x + player.sprite.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 15,
                color: '#FBBC89',
                speed: 9
            };
            sounds['shoot'].play();
        }
    }

    if (player.bullet !== null) {
        player.bullet.y -= player.bullet.speed;
        if (player.bullet.y + player.bullet.height < 0) {
            player.bullet = null;
        }
    }
}

function renderPlayer() {
    context.drawImage(

        player.sprite.img,
        player.sprite.offsetX,
        player.sprite.offsetY,
        player.sprite.width,
        player.sprite.height,

        player.x,
        player.y,
        player.sprite.width,
        player.sprite.height
    );

    //Dessin du shoot joueur
    if (player.bullet !== null) {
        context.fillStyle = player.bullet.color;
        context.fillRect(
            player.bullet.x,
            player.bullet.y,
            player.bullet.width,
            player.bullet.height
        );
    }
}