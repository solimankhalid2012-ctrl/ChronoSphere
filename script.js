/* =====================================================
   ChronoSphere v5 · Final Interactions
   ===================================================== */

// ===== 1) تحديث الساعات الصغيرة =====
const smallClocks = document.querySelectorAll('.clock-card');

function updateSmallClocks() {
  smallClocks.forEach(card => {
    const tz = card.dataset.tz;
    const timeEl = card.querySelector('.card-time');
    const dateEl = card.querySelector('.card-date');
    const now = new Date();

    const newTime = now.toLocaleTimeString('en-GB', {
      timeZone: tz,
      hour12: false
    });

    if (timeEl.textContent !== newTime) {
      timeEl.textContent = newTime;
      timeEl.classList.remove('tick');
      void timeEl.offsetWidth;
      timeEl.classList.add('tick');
    }

    dateEl.textContent = now.toLocaleDateString('ar-EG', {
      timeZone: tz,
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  });
}

updateSmallClocks();
setInterval(updateSmallClocks, 1000);

// ===== 2) مؤشر الماوس =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, .clock-card, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== 3) تفاعل البطاقات =====
smallClocks.forEach(card => {
  const glow = card.querySelector('.card-glow');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    glow.style.setProperty('--mx', `${x}px`);
    glow.style.setProperty('--my', `${y}px`);

    card.style.transform = `translateY(-10px) scale(1.02) perspective(800px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== 4) 🎬 Theater Mode =====
const theater = document.getElementById('theater');
const theaterBackdrop = document.getElementById('theaterBackdrop');
const theaterClose = document.getElementById('theaterClose');
const theaterFlag = document.getElementById('theaterFlag');
const theaterCity = document.getElementById('theaterCity');
const theaterDate = document.getElementById('theaterDate');
const theaterTz = document.getElementById('theaterTz');
const theaterClock = document.getElementById('theaterClock');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

let activeTz = null;
let theaterInterval = null;

const allDigits = theaterClock.querySelectorAll('.digit');

function setDigit(el, newVal) {
  if (el.textContent === newVal) return;
  el.textContent = newVal;
  el.classList.remove('flip');
  void el.offsetWidth;
  el.classList.add('flip');
}

function openTheater(card) {
  activeTz = card.dataset.tz;
  theaterFlag.textContent = card.dataset.flag;
  theaterCity.textContent = card.dataset.city;
  theaterTz.textContent = activeTz;

  allDigits.forEach(d => d.textContent = '0');

  theater.classList.add('active');
  document.body.classList.add('theater-open');

  updateTheaterClock();

  if (theaterInterval) clearInterval(theaterInterval);
  theaterInterval = setInterval(updateTheaterClock, 1000);
}

function closeTheater() {
  theater.classList.remove('active');
  document.body.classList.remove('theater-open');
  activeTz = null;
  if (theaterInterval) {
    clearInterval(theaterInterval);
    theaterInterval = null;
  }
}

function updateTheaterClock() {
  if (!activeTz) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', {
    timeZone: activeTz,
    hour12: false
  });

  const [h, m, s] = timeStr.split(':');

  const hDigits = theaterClock.querySelectorAll('[data-type="h"]');
  const mDigits = theaterClock.querySelectorAll('[data-type="m"]');
  const sDigits = theaterClock.querySelectorAll('[data-type="s"]');

  setDigit(hDigits[0], h[0]);
  setDigit(hDigits[1], h[1]);
  setDigit(mDigits[0], m[0]);
  setDigit(mDigits[1], m[1]);
  setDigit(sDigits[0], s[0]);
  setDigit(sDigits[1], s[1]);

  theaterDate.textContent = now.toLocaleDateString('ar-EG', {
    timeZone: activeTz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalSeconds = (+h) * 3600 + (+m) * 60 + (+s);
  const percent = (totalSeconds / 86400) * 100;

  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent.toFixed(1)}%`;
}

smallClocks.forEach(card => {
  card.addEventListener('click', () => openTheater(card));
});

theaterClose.addEventListener('click', closeTheater);
theaterBackdrop.addEventListener('click', closeTheater);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && theater.classList.contains('active')) {
    closeTheater();
  }
});

// ===== 5) Parallax =====
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});