const texts = [
  'Hola mundo de la mecanografía.',
  'Practica para ser el más rápido.',
  'Too Type Too Furious en acción.'
];
const text = texts[Math.floor(Math.random() * texts.length)];
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('text').textContent = text;
  const input = document.getElementById('input');
  const start = Date.now();
  input.addEventListener('input', () => {
    if (input.value === text) {
      const time = (Date.now() - start) / 1000;
      document.getElementById('result').textContent = `Tiempo: ${time}s`;
    }
  });
});
