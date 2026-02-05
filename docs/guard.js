// Разрешаем доступ к quiz.html с параметрами data и mode (для прямых ссылок)
const isQuizWithParams =
  location.pathname.includes('quiz.html') &&
  location.search.includes('data=') &&
  location.search.includes('mode=');

if (localStorage.getItem('access') !== 'true' && !isQuizWithParams) {
  location.href = 'index.html';
}
