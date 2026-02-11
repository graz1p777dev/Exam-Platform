const VALID_CODES = ['aizada1987', 'alihan'];

function check() {
  const input = document.getElementById('code');
  const value = input.value.trim();
  const error = document.getElementById('error');
  const btn = document.querySelector('.btn-primary');

  if (!value) {
    error.textContent = 'Введите код доступа';
    return;
  }

  // Показываем загрузку
  btn.textContent = 'Проверка...';
  btn.disabled = true;

  setTimeout(() => {
    if (VALID_CODES.includes(value)) {
      localStorage.setItem('access', 'true');
      btn.textContent = 'Успешно! Переход...';
      setTimeout(() => {
        location.href = 'a9F3kQxL2mP8sT.html';
      }, 500);
    } else {
      error.textContent = '❌ Неверный код доступа';
      btn.textContent = 'Войти';
      btn.disabled = false;
      input.value = '';
      input.focus();
    }
  }, 800);
}

// Обработка Enter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('code');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      check();
    }
  });
  input.focus();
});
