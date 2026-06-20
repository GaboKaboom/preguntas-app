const STORAGE_KEY = 'qna-app-v1';
const CODE_KEY = 'qna-admin-code';
const DEFAULT_CODE = 'GABO2026';

const questionForm = document.getElementById('questionForm');
const adminCodeForm = document.getElementById('adminCodeForm');
const adminSetupForm = document.getElementById('adminSetupForm');
const questionsContainer = document.getElementById('questionsContainer');
const questionsCount = document.getElementById('questionsCount');
const authStatus = document.getElementById('authStatus');
const logoutBtn = document.getElementById('logoutBtn');
const messageBox = document.getElementById('messageBox');

const questionNameInput = document.getElementById('questionName');
const questionTextInput = document.getElementById('questionText');
const adminCodeInput = document.getElementById('adminCodeInput');
const setupCodeInput = document.getElementById('setupCodeInput');

let state = {
  code: localStorage.getItem(CODE_KEY) || DEFAULT_CODE,
  authenticated: false,
  questions: loadQuestions()
};

function loadQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveQuestions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.questions));
}

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message-box ${type === 'error' ? 'error' : ''}`;
  messageBox.classList.remove('hidden');
}

function hideMessage() {
  messageBox.classList.add('hidden');
}

function setAuthStatus(isAuthenticated) {
  state.authenticated = isAuthenticated;
  authStatus.textContent = isAuthenticated ? 'Estado: sesión activa' : 'Estado: sin sesión activa';
  authStatus.classList.toggle('active', isAuthenticated);
  logoutBtn.classList.toggle('hidden', !isAuthenticated);
  adminSetupForm.classList.toggle('hidden', !isAuthenticated);

  if (!isAuthenticated) {
    adminCodeInput.value = '';
    setupCodeInput.value = '';
  }
}

function setCode(code) {
  const normalized = code.trim();
  if (!normalized) {
    showMessage('El código no puede estar vacío.', 'error');
    return false;
  }

  if (!state.authenticated) {
    showMessage('Debes iniciar sesión con el código actual para cambiarlo.', 'error');
    return false;
  }

  state.code = normalized;
  localStorage.setItem(CODE_KEY, normalized);
  setupCodeInput.value = '';
  showMessage('Código actualizado correctamente.');
  return true;
}

function loginAdmin() {
  const entered = adminCodeInput.value.trim();

  if (!entered) {
    showMessage('Ingresa un código para continuar.', 'error');
    return;
  }

  if (entered === state.code) {
    setAuthStatus(true);
    showMessage('Sesión abierta correctamente.');
  } else {
    setAuthStatus(false);
    showMessage('Código incorrecto. Inténtalo de nuevo.', 'error');
  }
}

function logoutAdmin() {
  setAuthStatus(false);
  showMessage('Sesión cerrada.');
}

function createQuestionCard(question) {
  const card = document.createElement('article');
  card.className = 'question-card';

  const answered = Boolean(question.answer?.trim());
  const statusClass = answered ? 'answered' : 'pending';
  const statusText = answered ? 'Respondida' : 'Pendiente';

  const date = new Date(question.createdAt).toLocaleString('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  card.innerHTML = `
    <div class="question-meta">
      <div>
        <strong>${escapeHTML(question.name || 'Anónimo')}</strong>
        <span class="muted-text">${date}</span>
      </div>
      <span class="status-pill ${statusClass}">${statusText}</span>
    </div>
    <p class="question-text">${escapeHTML(question.question)}</p>
    ${answered ? `<p class="answer-preview"><strong>Respuesta:</strong> ${escapeHTML(question.answer)}</p>` : ''}
    <form class="answer-form stacked-form">
      <label>
        Respuesta
        <textarea name="answer" rows="4" maxlength="500" placeholder="Escribe la respuesta para esta pregunta" ${answered ? 'disabled' : ''}>${answered ? escapeHTML(question.answer) : ''}</textarea>
      </label>
      <div class="form-actions">
        <button type="submit" class="primary-btn" ${answered ? 'disabled' : ''}>Guardar respuesta</button>
      </div>
    </form>
  `;

  card.querySelector('.answer-form').addEventListener('submit', (event) => {
    event.preventDefault();

    if (!state.authenticated) {
      showMessage('Debes iniciar sesión con el código para responder.', 'error');
      return;
    }

    const textarea = card.querySelector('textarea[name="answer"]');
    const answer = textarea.value.trim();

    if (!answer) {
      showMessage('Escribe una respuesta antes de guardar.', 'error');
      return;
    }

    question.answer = answer;
    question.answeredAt = new Date().toISOString();
    question.answeredBy = 'Moderador';
    saveQuestions();
    renderQuestions();
    showMessage('Respuesta guardada correctamente.');
  });

  return card;
}

function renderQuestions() {
  questionsContainer.innerHTML = '';

  const sortedQuestions = [...state.questions].sort((a, b) => {
    if (a.answer && !b.answer) return 1;
    if (!a.answer && b.answer) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  questionsCount.textContent = sortedQuestions.length;

  if (!sortedQuestions.length) {
    questionsContainer.innerHTML = '<p class="muted-text">Aún no hay preguntas. ¡Puedes ser el primero en enviar una!</p>';
    return;
  }

  sortedQuestions.forEach((question) => {
    questionsContainer.appendChild(createQuestionCard(question));
  });
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  hideMessage();

  const name = questionNameInput.value.trim() || 'Anónimo';
  const question = questionTextInput.value.trim();

  if (!question) {
    showMessage('Escribe una pregunta válida.', 'error');
    return;
  }

  state.questions.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    question,
    createdAt: new Date().toISOString(),
    answer: '',
    answeredBy: '',
    answeredAt: null
  });

  saveQuestions();
  renderQuestions();
  questionForm.reset();
  showMessage('Pregunta enviada correctamente.');
});

adminCodeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginAdmin();
});

adminSetupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  setCode(setupCodeInput.value);
});

logoutBtn.addEventListener('click', logoutAdmin);

setAuthStatus(false);
renderQuestions();

