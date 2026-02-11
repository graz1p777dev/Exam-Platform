const params = new URLSearchParams(location.search);

const dataFile = params.get('data');
const title = params.get('title');

const titleEl = document.getElementById('themeTitle');
if (titleEl && title) {
  titleEl.textContent = decodeURIComponent(title);
}

function start(mode) {
  let url = `quiz.html?data=${dataFile}&mode=${mode}`;

  if (mode === 3) {
    const limitInput = document.getElementById('limit');
    const limit = parseInt(limitInput.value);
    
    if (!limit || limit <= 0) {
      alert('⚠️ Введите корректное количество вопросов (больше 0)');
      limitInput.focus();
      return;
    }
    
    url += `&limit=${limit}`;
  }

  window.location.href = url;
}
