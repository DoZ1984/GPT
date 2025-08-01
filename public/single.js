let text = '';
document.addEventListener('DOMContentLoaded', () => {
  fetch('/text')
    .then(r => r.text())
    .then(t => {
      text = t;
      document.getElementById('text').textContent = text;
    });
  const input = document.getElementById('input');
  let start;
  input.addEventListener('input', () => {
    if (!start) start = Date.now();
    if (input.value === text) {
      const time = (Date.now() - start) / 1000;
      fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, mode: 'single' })
      }).then(() => {
        document.getElementById('result').textContent = `Tiempo: ${time}s`;
        window.location.href = '/scores';
      });
    }
  });
});
