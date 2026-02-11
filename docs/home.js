const THEMES = {
  'administrativno_protsessualnyy_kodeks_kyrgyzskoy_respubliki.json':
    'Административно-процессуальный кодекс КР',
  'administrativnyh_protsedurah.json': 'Административные процедуры',
  'advokatskoy_deyatelnosti.json': 'Адвокатская деятельность',
  'dohodov.json': 'Доходы',
  'grazhdanskiy_kodeks_kyrgyzskoy_respubliki.json': 'Гражданский кодекс КР',
  'grazhdanskiy_protsessualnyy_kodeks_kyrgyzskoy_respubliki.json':
    'Гражданско-процессуальный кодекс КР',
  'ispolnitelnom_proizvodstve.json': 'Исполнительное производство',
  'kodeks_kr_o_pravonarusheniyah.json': 'Кодекс КР о правонарушениях',
  'kodeks_kyrgyzskoy_respubliki_o_detyah.json': 'Кодекс КР о детях',
  'kodeks_kyrgyzskoy_respubliki_o_nenalogovyh_dohodah.json': 'Кодекс КР о неналоговых доходах',
  'konstitutsionnoe_pravo.json': 'Конституционное право',
  'kyrgyzskoy_respublike.json': 'Государственное устройство КР',
  'kyrgyzskoy_respubliki_o_probatsii.json': 'Закон КР о пробации',
  'mezhdunarodnoe_pravo.json': 'Международное право',
  'nedvizhimoe_imuschestvo_i_sdelok_s_nim.json': 'Недвижимое имущество и сделки с ним',
  'predstavitelstv.json': 'Представительство',
  'semeynyy_kodeks_kyrgyzskoy_respubliki.json': 'Семейный кодекс КР',
  'trudovoy_kodeks_kyrgyzskoy_respubliki.json': 'Трудовой кодекс КР',
  'ugolovno_protsessualnyy_kodeks_kyrgyzskoy_respubliki.json': 'Уголовно-процессуальный кодекс КР',
  'ugolovnyy_kodeks.json': 'Уголовный кодекс КР',
  'zakon_kr_o_garantirovannoy_gosudarstvom_yuridicheskoy_pomoschi.json':
    'Гарантированная государством юридическая помощь',
  'zakon_kr_ob_osnovah_administrativnoy_deyatelnosti.json': 'Основы административной деятельности',
  'zakon_kyrgyzskoy_respubliki_o_bankrotstve_nesostoyatelnosti.json':
    'Банкротство (несостоятельность)',
  'zakon_kyrgyzskoy_respubliki_o_hozyaystvennyh_tovarischestvah_i_obschestvah.json':
    'Хозяйственные товарищества и общества',
  'zakon_kyrgyzskoy_respubliki_o_mediatsii.json': 'Медиация',
  'zakon_kyrgyzskoy_respubliki_o_nekommercheskih_organizatsiyah.json': 'Некоммерческие организации',
  'zakon_kyrgyzskoy_respubliki_o_notariate.json': 'Нотариат',
  'zakon_kyrgyzskoy_respubliki_o_poryadke_rassmotreniya_obrascheniy_grazhdan.json':
    'Порядок рассмотрения обращений граждан',
  'zakon_kyrgyzskoy_respubliki_o_zaloge.json': 'Залог',
  'zakon_kyrgyzskoy_respubliki_ob_aktah_grazhdanskogo_sostoyaniya.json':
    'Акты гражданского состояния',
  'zhilischnyy_kodeks_kyrgyzskoy_respubliki.json': 'Жилищный кодекс КР',
};

const root = document.getElementById('topics');

Object.entries(THEMES).forEach(([file, title]) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${title}</h3>
    <button>Выбрать режим →</button>
  `;
  card.querySelector('button').onclick = () => {
    location.href = `modes.html?data=${file}&title=${encodeURIComponent(title)}`;
  };
  root.appendChild(card);
});
