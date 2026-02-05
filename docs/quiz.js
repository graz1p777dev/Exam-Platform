const params = new URLSearchParams(location.search);
const file = params.get('data');
const mode = Number(params.get('mode'));
const limit = Number(params.get('limit'));

let questions = [];
let index = 0;
let score = 0;

// ===== TIMER =====
let seconds = 0;
let timerId = null;

function startTimer() {
  timerId = setInterval(() => {
    seconds++;
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = `${seconds} сек`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

// ===== LOAD QUESTIONS =====
// Определяем базовый путь для GitHub Pages
const basePath = location.pathname.includes('/Exam-Platform/') ? '/Exam-Platform/' : '';
const dataPath = `${basePath}data/${file}`;

fetch(dataPath)
  .then((r) => {
    if (!r.ok) throw new Error(`Ошибка загрузки: ${r.status}`);
    return r.json();
  })
  .then((data) => {
    questions = [...data];

    if (mode === 2 || mode === 3) {
      questions.sort(() => Math.random() - 0.5);
    }

    if (mode === 3 && limit) {
      questions = questions.slice(0, limit);
    }

    if (![1, 6].includes(mode)) {
      startTimer();
    }

    updateProgress();
    render();
  })
  .catch((error) => {
    console.error('Ошибка загрузки:', error);
    const root = document.getElementById('quiz');
    root.innerHTML = `
      <h2>Ошибка загрузки вопросов</h2>
      <p>Не удалось загрузить данные: ${error.message}</p>
      <p>Путь: ${dataPath}</p>
      <button onclick="location.href='a9F3kQxL2mP8sT.html'">Вернуться к темам</button>
    `;
  });

// ===== RENDER =====
function render() {
  if (!questions.length || index >= questions.length) {
    document.getElementById('quiz').innerHTML = '<h2>Нет вопросов для отображения</h2>';
    return;
  }

  const q = questions[index];
  const root = document.getElementById('quiz');

  root.innerHTML = `
    <h2>${q.question}</h2>

    ${q.answers
      .map((a, i) => {
        const isCorrect = q.correctIndexes.includes(i);

        if (mode === 6) {
          return `
            <div class="answer ${isCorrect ? 'correct' : ''}">
              ${a}
            </div>
          `;
        }

        return `
          <button class="answer" onclick="pick(${i})">
            ${a}
          </button>
        `;
      })
      .join('')}

    ${mode === 6 ? `<button class="next-btn" onclick="next()">Следующий вопрос</button>` : ''}
  `;
}

// ===== ANSWER PICK =====
function pick(i) {
  if (mode === 6) return;

  const q = questions[index];
  const answers = document.querySelectorAll('.answer');

  // Режим обучения
  if (mode === 1) {
    answers.forEach((el, idx) => {
      if (q.correctIndexes.includes(idx)) {
        el.classList.add('correct');
      } else {
        el.classList.add('wrong');
      }
      el.onclick = null;
    });
  }

  if (q.correctIndexes.includes(i)) {
    score++;
  }

  setTimeout(
    () => {
      index++;
      updateProgress();

      if (index < questions.length) {
        render();
      } else {
        finish();
      }
    },
    mode === 1 ? 900 : 300
  );
}

// ===== NEXT (MODE 6) =====
function next() {
  index++;
  updateProgress();

  if (index < questions.length) {
    render();
  } else {
    finish();
  }
}

// ===== PROGRESS BAR =====
function updateProgress() {
  const bar = document.getElementById('bar');
  if (!bar) return;

  if (mode === 1) {
    bar.style.width = '0%';
    return;
  }

  const percent = (index / questions.length) * 100;
  bar.style.width = `${percent}%`;
}

// ===== FINISH =====
function finish() {
  stopTimer();

  const quiz = document.getElementById('quiz');

  if (mode === 6) {
    quiz.innerHTML = `
      <h2>Просмотр завершён</h2>
      <p>Вы просмотрели все вопросы выбранной темы.</p>
      <button onclick="location.href='a9F3kQxL2mP8sT.html'">К темам</button>
    `;
    return;
  }

  quiz.innerHTML = `
    <h2>Экзамен завершён</h2>
    <p>Правильных ответов: <b>${score}</b> из <b>${questions.length}</b></p>
    ${mode !== 1 ? `<p>Время выполнения: <b>${seconds} сек</b></p>` : ''}
    <button onclick="location.href='a9F3kQxL2mP8sT.html'">К темам</button>
  `;
}
