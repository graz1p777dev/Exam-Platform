const params = new URLSearchParams(location.search);
const theme = params.get('theme');

let questions = [];
let index = 0;
let startTime = Date.now();

const quiz = document.getElementById('quiz');
const bar = document.getElementById('bar');
const timer = document.getElementById('timer');

fetch(`data/${theme}.json`)
  .then((r) => r.json())
  .then((d) => {
    questions = d;
    render();
  });

setInterval(() => {
  timer.textContent = `${Math.floor((Date.now() - startTime) / 1000)} сек`;
}, 1000);

function render() {
  const q = questions[index];
  quiz.innerHTML = `
    <h2>${q.question}</h2>
    ${q.answers
      .map(
        (a, i) => `
      <div class="answer" onclick="selectAnswer(${i})">${a}</div>
    `
      )
      .join('')}
  `;
  bar.style.width = (index / questions.length) * 100 + '%';
}

function selectAnswer(i) {
  const q = questions[index];
  const els = document.querySelectorAll('.answer');

  els.forEach((el, idx) => {
    el.onclick = null;
    if (q.correctIndexes.includes(idx)) el.classList.add('correct');
    else el.classList.add('wrong');
  });

  setTimeout(() => {
    index++;
    if (index < questions.length) render();
  }, 900);
}
