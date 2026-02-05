const VALID_CODES = ['aizada1987', 'alihan'];

function check() {
  const value = document.getElementById('code').value.trim();
  const error = document.getElementById('error');

  if (VALID_CODES.includes(value)) {
    localStorage.setItem('access', 'true');
    location.href = 'a9F3kQxL2mP8sT.html';
  } else {
    error.textContent = 'Неверный код';
  }
}
