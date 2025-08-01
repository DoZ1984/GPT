const socket = io();
let targetText = '';
let start;

document.addEventListener('DOMContentLoaded', () => {
  const textEl = document.getElementById('text');
  const input = document.getElementById('input');
  const opponent = document.getElementById('opponent');

  socket.emit('joinRace');
  socket.on('startRace', text => {
    targetText = text;
    textEl.textContent = text;
    start = Date.now();
  });

  input.addEventListener('input', () => {
    socket.emit('progress', input.value.length);
    if (input.value === targetText) {
      const time = (Date.now() - start) / 1000;
      alert(`¡Ganaste! Tiempo: ${time}s`);
    }
  });

  socket.on('opponentProgress', progress => {
    opponent.textContent = `Tu rival ha escrito ${progress} caracteres`;
  });
});
