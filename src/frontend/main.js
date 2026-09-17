const feedback = document.querySelector('#voteFeedback');
const storedVotes = JSON.parse(localStorage.getItem('telasaco-validation-votes') || '[]');

document.querySelectorAll('.vote-button').forEach((button) => {
  const design = button.dataset.design;
  if (storedVotes.includes(design)) {
    button.classList.add('voted');
    button.innerHTML = 'Tu voto está contado <b>✓</b>';
  }

  button.addEventListener('click', () => {
    if (!storedVotes.includes(design)) {
      storedVotes.push(design);
      localStorage.setItem('telasaco-validation-votes', JSON.stringify(storedVotes));
    }
    button.classList.add('voted');
    button.innerHTML = 'Tu voto está contado <b>✓</b>';
    feedback.textContent = 'Gracias. Tu opinión ayuda a decidir qué merece hacerse realidad.';
  });
});
