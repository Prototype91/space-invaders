function renderUI() {
    context.fillStyle = '#85079E';
    context.font = 'normal 20px "Press start 2P", cursive';
    context.textAlign = 'left';
    context.fillText('SCORE: ' + player.score, 20, 40);

    context.fillStyle = '#85079E';
    context.font = 'normal 20px "Press start 2P", cursive';
    context.textAlign = 'right';
    context.fillText('LIVES: ' + player.lives, 460, 40);

    context.strokeStyle = '#85079E';
    context.moveTo(20, canvas.height - 40);
    context.lineTo(canvas.width - 20, canvas.height - 40);
    context.stroke();
}
