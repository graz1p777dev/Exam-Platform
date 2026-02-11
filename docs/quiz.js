const params = new URLSearchParams(location.search);
const file = params.get('data');
const mode = Number(params.get('mode'));
const limit = Number(params.get('limit'));

let questions = [];
let index = 0;
let score = 0;
let selected = [];
let pickLocked = false;

// ===== TIMER =====
let seconds = 0;
let timerId = null;

function startTimer() {
  timerId = setInterval(() => {
    seconds++;
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = `⏱️ ${seconds} сек`;
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// ===== LOAD QUESTIONS =====
const basePath = location.pathname.includes('/Exam-Platform/') ? '/Exam-Platform/' : '';
const dataPath = `${basePath}data/${file}`;

fetch(dataPath)
  .then((r) => {
    if (!r.ok) throw new Error(`Ошибка загрузки: ${r.status}`);
    return r.json();
  })
  .then((data) => {
    questions = [...data];

    // Перемешиваем для режимов 2 и 3
    if (mode === 2 || mode === 3) {
      questions.sort(() => Math.random() - 0.5);
    }

    // Ограничиваем для режима 3
    if (mode === 3 && limit) {
      questions = questions.slice(0, Math.min(limit, questions.length));
    }

    // Запускаем таймер (кроме режимов 1 и 6)
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
      <div class="finish-screen">
        <h2>❌ Ошибка загрузки вопросов</h2>
        <p style="color: var(--text-secondary); margin: 20px 0;">
          Не удалось загрузить данные: ${error.message}
        </p>
        <p style="color: var(--text-muted); font-size: 14px;">
          Путь: ${dataPath}
        </p>
        <button class="btn-primary" onclick="location.href='a9F3kQxL2mP8sT.html'" style="margin-top: 24px;">
          Вернуться к темам
        </button>
      </div>
    `;
  });

// ===== RENDER =====
function render() {
  if (!questions.length || index >= questions.length) {
    document.getElementById('quiz').innerHTML = `
      <div class="finish-screen">
        <h2>⚠️ Нет вопросов для отображения</h2>
      </div>
    `;
    return;
  }

  const q = questions[index];
  const root = document.getElementById('quiz');
  selected = [];
  pickLocked = false;

  // Режим 6 - показываем правильные ответы сразу
  if (mode === 6) {
    root.innerHTML = `
      <h2>${q.question}</h2>
      <div class="answers-container">
        ${q.answers
          .map((a, i) => {
            const isCorrect = q.correctIndexes.includes(i);
            return `
              <div class="answer ${isCorrect ? 'correct' : ''}" style="cursor: default;">
                ${a}
              </div>
            `;
          })
          .join('')}
      </div>
      <button class="next-btn" onclick="next()">Следующий вопрос →</button>
    `;
    return;
  }

  // Режимы 1, 2, 5 - множественный выбор
  if ([1, 2, 5].includes(mode)) {
    root.innerHTML = `
      <h2>${q.question}</h2>
      <div class="answers-container">
        ${q.answers
          .map((a, i) => `
            <button class="answer" id="answer-${i}" onclick="toggleAnswer(${i})">
              ${a}
            </button>
          `)
          .join('')}
      </div>
      <button class="next-btn" onclick="submitAnswer()">Проверить ответ</button>
    `;
    return;
  }

  // Режимы 3, 4 - одиночный выбор
  root.innerHTML = `
    <h2>${q.question}</h2>
    <div class="answers-container">
      ${q.answers
        .map((a, i) => `
          <button class="answer" onclick="pick(${i})">
            ${a}
          </button>
        `)
        .join('')}
    </div>
  `;
}

// ===== TOGGLE ANSWER (для режимов 1, 2, 5) =====
function toggleAnswer(i) {
  const btn = document.getElementById(`answer-${i}`);
  if (!btn) return;

  if (selected.includes(i)) {
    selected = selected.filter((idx) => idx !== i);
    btn.classList.remove('selected');
  } else {
    selected.push(i);
    btn.classList.add('selected');
  }
}

// ===== SUBMIT ANSWER (для режимов 1, 2, 5) =====
function submitAnswer() {
  if (selected.length === 0) {
    alert('⚠️ Выберите хотя бы один ответ');
    return;
  }

  const q = questions[index];
  const answers = document.querySelectorAll('.answer');

  // Проверяем правильность
  const sortedSelected = [...selected].sort((a, b) => a - b);
  const sortedCorrect = [...q.correctIndexes].sort((a, b) => a - b);
  const isCorrect =
    sortedSelected.length === sortedCorrect.length &&
    sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

  if (isCorrect) {
    score++;
  }

  // Показываем результаты
  answers.forEach((el, idx) => {
    el.onclick = null;
    el.disabled = true;

    if (q.correctIndexes.includes(idx)) {
      el.classList.add('correct');
      el.classList.remove('selected', 'wrong');
    } else if (selected.includes(idx)) {
      el.classList.add('wrong');
      el.classList.remove('selected');
    }
  });

  // Заменяем кнопку "Проверить" на "Далее"
  const submitBtn = document.querySelector('.next-btn');
  if (submitBtn) {
    submitBtn.textContent = 'Следующий вопрос →';
    submitBtn.onclick = () => {
      index++;
      updateProgress();
      if (index < questions.length) {
        render();
      } else {
        finish();
      }
    };
  }
}

// ===== PICK ANSWER (для режимов 3, 4) =====
function pick(i) {
  if (pickLocked) return;
  pickLocked = true;

  const answers = document.querySelectorAll('.answer');
  const q = questions[index];

  // Показываем выбранный ответ
  answers.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === i) {
      btn.classList.add('selected');
    }
  });

  // Проверяем правильность после небольшой задержки
  setTimeout(() => {
    answers.forEach((btn, idx) => {
      if (q.correctIndexes.includes(idx)) {
        btn.classList.add('correct');
        btn.classList.remove('selected');
      } else if (idx === i) {
        btn.classList.add('wrong');
        btn.classList.remove('selected');
      }
    });

    if (q.correctIndexes.includes(i)) {
      score++;
    }

    // Переход к следующему вопросу
    setTimeout(() => {
      index++;
      updateProgress();

      if (index < questions.length) {
        render();
      } else {
        finish();
      }
    }, 1500);
  }, 300);
}

// ===== NEXT (для режима 6) =====
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

  const percent = Math.round((index / questions.length) * 100);
  bar.style.width = `${percent}%`;
}

// ===== FINISH =====
function finish() {
  stopTimer();

  const quiz = document.getElementById('quiz');

  // Режим 6 - просто завершение просмотра
  if (mode === 6) {
    quiz.innerHTML = `
      <div class="finish-screen">
        <h2>✅ Просмотр завершён</h2>
        <p style="color: var(--text-secondary); margin: 20px 0; font-size: 18px;">
          Вы просмотрели все вопросы выбранной темы.
        </p>
        <button class="btn-primary" onclick="location.href='a9F3kQxL2mP8sT.html'">
          Вернуться к темам
        </button>
      </div>
    `;
    return;
  }

  // Вычисляем процент правильных ответов
  const percentage = Math.round((score / questions.length) * 100);
  let emoji = '🎉';
  let message = 'Отличный результат!';

  if (percentage >= 90) {
    emoji = '🏆';
    message = 'Превосходно!';
  } else if (percentage >= 70) {
    emoji = '🎯';
    message = 'Хороший результат!';
  } else if (percentage >= 50) {
    emoji = '📚';
    message = 'Неплохо, но есть над чем работать';
  } else {
    emoji = '💪';
    message = 'Продолжайте учиться!';
  }

  quiz.innerHTML = `
    <div class="finish-screen">
      <div style="font-size: 72px; margin-bottom: 16px;">${emoji}</div>
      <h2>${message}</h2>
      
      <div class="stats">
        <div class="stat-card">
          <div class="label">Правильных ответов</div>
          <div class="value">${score} / ${questions.length}</div>
        </div>
        
        <div class="stat-card">
          <div class="label">Процент успеха</div>
          <div class="value">${percentage}%</div>
        </div>
        
        ${mode !== 1 ? `
          <div class="stat-card">
            <div class="label">Время выполнения</div>
            <div class="value">${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}</div>
          </div>
        ` : ''}
      </div>

      <button class="btn-primary" onclick="location.href='a9F3kQxL2mP8sT.html'" style="margin-top: 32px;">
        Вернуться к темам
      </button>
    </div>
  `;
}
