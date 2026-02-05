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
    const limit = document.getElementById('limit').value;
    if (!limit || limit <= 0) {
      alert('Введите количество вопросов');
      return;
    }
    url += `&limit=${limit}`;
  }

  window.location.href = url;
}
