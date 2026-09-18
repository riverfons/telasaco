import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, onDisconnect, onValue, ref, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBsmBkQGamfiXTN4OHmT21uxGI7S79OqOU',
  authDomain: 'telasaco.firebaseapp.com',
  databaseURL: 'https://telasaco-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'telasaco'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const feedback = document.querySelector('#voteFeedback');
const voteButtons = document.querySelectorAll('.vote-button');

voteButtons.forEach((button) => {
  button.disabled = true;
});

function markAsVoted(button) {
  button.classList.add('voted');
  button.disabled = true;
  button.setAttribute('aria-pressed', 'true');
  button.innerHTML = 'Tu voto está contado <b>✓</b>';
}

function setupPresence(userId) {
  const connectedRef = ref(db, '.info/connected');
  const myConnectionRef = ref(db, `usuarios_activos/${userId}`);

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
      onDisconnect(myConnectionRef).remove();
      set(myConnectionRef, true);
    }
  });
}

function connectVotes(userId) {
  voteButtons.forEach((button) => {
    const design = button.dataset.design;
    const voteRef = ref(db, `votos/${design}/${userId}`);

    onValue(voteRef, (snapshot) => {
      if (snapshot.val() === true) {
        markAsVoted(button);
      } else if (!button.dataset.submitting) {
        button.disabled = false;
      }
    });

    button.addEventListener('click', async () => {
      button.disabled = true;
      button.dataset.submitting = 'true';

      try {
        await set(voteRef, true);
        markAsVoted(button);
        feedback.textContent = 'Gracias. Tu opinión ayuda a decidir qué merece hacerse realidad.';
      } catch (error) {
        delete button.dataset.submitting;
        button.disabled = false;
        console.error('No se pudo registrar el voto:', error);
        feedback.textContent = 'No hemos podido registrar tu voto. Inténtalo de nuevo.';
      }
    });
  });
}

signInAnonymously(auth)
  .then(({ user }) => {
    setupPresence(user.uid);
    connectVotes(user.uid);
  })
  .catch((error) => {
    console.error('Error al autenticar:', error);
    feedback.textContent = 'No se ha podido conectar para registrar votos.';
  });
