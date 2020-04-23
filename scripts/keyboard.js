const Keyboard = {};

const keyMap = {
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    32: 'SPACE',
    27: 'ECHAP',
    80: 'P'
};

// Gestionnaire d'évènement :
document.addEventListener('keydown', onKey);
document.addEventListener('keyup', onKey);

function onKey(event) {
    // event.keycode : 37, 38
    // event.type : 'keydown, 'keyup'  
    Keyboard[keyMap[event.keyCode]] = (event.type === 'keydown');
}

/* function onKeyDown(event) {

    if(event.keyCode == 37) {Keyboard.LEFT = true;}
    if(event.keyCode == 38) {Keyboard.UP = true;}
    if(event.keyCode == 39) {Keyboard.RIGHT = true;}
    if(event.keyCode == 40) {Keyboard.DOWN = true;}

}
function onKeyUp(event) {

    if(event.keyCode == 37) {Keyboard.LEFT = false;}
    if(event.keyCode == 38) {Keyboard.UP = false;}
    if(event.keyCode == 39) {Keyboard.RIGHT = false;}
    if(event.keyCode == 40) {Keyboard.DOWN = false;}

} */