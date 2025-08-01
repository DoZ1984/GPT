const socket = io();
let targetText = '';
let start;

document.addEventListener('DOMContentLoaded', () => {
  const textEl = document.getElementById('text');
  const input = document.getElementById('input');
  const opponent = document.getElementById('opponent');
  const result = document.getElementById('result');

  socket.emit('joinRace');
  socket.on('startRace', text => {
    targetText = text;
    textEl.textContent = text;
    start = Date.now();
  });

  input.addEventListener('input', () => {
    socket.emit('progress', input.value.length);
    const progress = Math.min((input.value.length / targetText.length) * 100, 100);
    result.textContent = `Progreso: ${progress.toFixed(0)}%`;
    if (input.value === targetText) {
      const time = (Date.now() - start) / 1000;
      fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, mode: 'multi' })
      }).then(() => {
        alert(`¡Ganaste! Tiempo: ${time}s`);
        window.location.href = '/scores';
      });
    }
  });

  socket.on('opponentProgress', progress => {
    opponent.textContent = `Tu rival ha escrito ${progress} caracteres`;
  });
});
