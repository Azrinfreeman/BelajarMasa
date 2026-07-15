/**
 * Masa! Interactive Clock & Quiz Game Logic
 * Premium vanilla JavaScript implementation with draggable hands, sound synthesis, and particle celebrations.
 */

// --- Central Application State ---
let currentHour = 12;      // 24-hour format: 0 to 23
let currentMinute = 0;     // Minute format: 0 to 59
let isDragging = false;
let activeDragHand = null; // 'hour' or 'minute'
let prevDragMinute = 0;    // For crossover checks (minute hand crossing 12)
let prevDragHourAngle = 0; // For hour hand crossover checks
let appMode = 'menu';      // 'explore', 'learn', 'quiz', 'practice', 'pvp', or 'menu'
let clockType = 'analog';  // 'analog', 'digital12', 'digital24'
let currentLanguage = 'en'; // 'en' or 'bm'

// --- Translation Dictionary (English and Bahasa Malaysia) ---
const translations = {
  en: {
    subtitle: "Interactive Teaching & Quiz Clock",
    btnHome: "Menu",
    btnExplore: "Explore Mode",
    btnQuiz: "Quiz Mode",
    btnPractice: "Practice",
    btnLearn: "Learn Mode",
    btnLearnStart: "Learn Now! ➔",
    btnPvp: "PvP Battle",
    score: "Score",
    streak: "Streak",
    switchClock: "Switch Clock Type",
    clockAnalog: "Analog",
    clockDigital12: "12h Digital",
    clockDigital24: "24h Digital",
    adjustNeedle: "Adjust Clock Needle",
    adjustSubtitle: "Click plus/minus buttons to adjust time",
    min1: "1 minute",
    min5: "5 minutes",
    min10: "10 minutes",
    min15: "15 minutes",
    min30: "30 minutes",
    hour1: "1 hour",
    btnRandom: "Random",
    btnNow: "Now",
    btnReset: "Reset",
    welcome: "Hey Kiddo! Ready to learn time? 🌟",
    badgeExplore: "FREE PLAY",
    exploreTitle: "Explore Mode",
    exploreDesc: "Play with the clock needles and see the time change!",
    badgeQuiz: "CHALLENGE",
    quizTitle: "Quiz Mode",
    quizDesc: "Test your clock reading skills and win stars!",
    badgePractice: "NO PRESSURE",
    practiceTitle: "Practice Mode",
    practiceDesc: "Learn at your own pace with hints and unlimited retries.",
    badgeLearn: "GUIDED LESSON",
    learnTitle: "Learn Mode",
    learnDesc: "Follow a short guided lesson and master the clock step by step.",
    learnHeader: "Learn to Read Time",
    learnProgress: "Lesson progress",
    learnBack: "Back",
    learnNext: "Next",
    learnSkip: "Skip for now",
    learnAction: "Show me",
    learnActionDone: "I see it!",
    learnStepCount: "Lesson {step} of {total}",
    learnComplete: "Lesson complete! You are ready to practise.",
    learnMasteryEmpty: "Practice a few questions to start building mastery.",
    learnMastery: "Mastery signals: {count} skills tracked",
    learnStepTitles: ["Find the hour", "Count by fives", "Quarter past", "Quarter to", "AM or PM?", "You are ready!"],
    learnStepTexts: ["The short hand tells the hour. Look at the number it points to.", "The long hand tells the minutes. Each clock number counts as five minutes.", "When the minute hand points to 3, it is quarter past the hour.", "When the minute hand points to 9, it is quarter to the next hour.", "AM is morning time. PM is afternoon, evening, or night time.", "Use both hands together, then practise with a few gentle questions."],
    learnStepFocus: ["Short hand = hour", "Long hand = minutes", "3 = 15 minutes", "9 = 45 minutes", "AM / PM", "Hour + minute hands"],
    learnStepActions: ["Highlight the short hand", "Highlight the long hand", "Show quarter past", "Show quarter to", "Show the day part", "Show a complete time"],
    learnStepIcons: ["🕐", "🖐️", "🕞", "🕧", "🌞", "🎓"],
    badgePvp: "2 PLAYERS",
    pvpTitle: "PvP Battle",
    pvpDesc: "Race against a friend to set the correct time!",
    btnPlay: "Let's Play! ➔",
    statsScore: "High Score",
    statsStreak: "Best Streak",
    statsAchievements: "Badges",
    btnTrophy: "Trophy Case",
    btnPlayAgain: "Play Again",
    btnExit: "Exit",
    selectDifficulty: "Choose Difficulty",
    diffEasyTitle: "Easy Mode",
    diffEasyDesc: "O'clock Hours",
    diffMediumTitle: "Medium Mode",
    diffMediumDesc: "Quarters & Halves",
    diffHardTitle: "Hard Mode",
    diffHardDesc: "5-Minute Steps",
    diffMasterTitle: "Master Mode",
    diffMasterDesc: "Exact Minutes",
    summaryCorrect: "Correct",
    summaryStreak: "Best Streak",
    summaryStars3: "Amazing! Perfect time master!",
    summaryStars2: "Great work! Keep practising!",
    summaryStars1: "Good start! You are learning!",
    summaryStars0: "Nice try! Every attempt helps!",
    practiceHintButton: "Show Hint",
    practiceHintHours: "Hint: Start with the short hand. It tells you the hour.",
    practiceHintMinutes: "Hint: Look at the long hand. Each clock number counts 5 minutes.",
    practiceHintQuarters: "Hint: Check if the long hand shows quarter past, half past, or quarter to.",
    practiceSummary: "Practice complete! Every try helps you improve.",
    practiceAdaptiveFresh: "Your practice is adapting to your answers.",
    practiceAdaptiveWeak: "We will revisit skills that need more practice.",
    explanationHour: "Hour hand: {hour}",
    explanationMinutes: "Minute hand: {minutes} minutes",
    checkAnswer: "Check Answer",
    nextQuestion: "Next Question",
    footerText: "Created with absolute attention to detail using HTML, CSS, and JS elements.",
    
    // Dynamic JS translations
    levelTitle: "Level {num}",
    levelNames: [
      "O'clock Hours 🕐",
      "Quarters & Half Hours 🕞",
      "5-Minute Intervals 🕠",
      "Master Chef (Precise Minutes) 🎓"
    ],
    questionCounter: "Question {index}",
    setPrompt: "Set the clock to {time}",
    setHint: "Drag the hands or use the adjustment buttons, then click Check Answer.",
    readPrompt: "What time is shown on the clock dial?",
    readHint: "Read the analog needles and click the correct matching digital display below.",
    correctText: "Correct! 🎉",
    notQuiteText: "Not Quite! ❌",
    correctDesc: "Wonderful job! The clock is indeed showing {time}.",
    incorrectDesc: "The correct answer is {time}.",
    matchedPerfectTitle: "Matched Perfectly! 🏆",
    matchedPerfectDesc: "Sensational! You set the hands exactly to {time}.",
    handsDisagreeTitle: "Not Quite! ⏰",
    handsDisagreeDesc: "Target was {target}, but you set it to {actual}. Try again next time!",
    
    // PvP strings
    pvpRoundIndicator: "ROUND {num}",
    pvpPromptPrefix: "Race to set the clock to {time}!",
    pvpObjectiveTitle: "Speed Duel Mode",
    pvpObjectiveSub: "Head-to-Head Clock Challenge",
    pvpObj: "Objective",
    pvpObjDesc: "Race to answer clock questions before your opponent. First to 5 points wins!",
    pvpSet: "Set the Clock",
    pvpSetDesc: "Use adjustment buttons or drag the hands to match the target time, then hit Submit.",
    pvpRead: "Read the Clock",
    pvpReadDesc: "Look at the dial and tap the correct time from the 4 choices shown below.",
    pvpOne: "One Chance Only",
    pvpOneDesc: "Each player gets one attempt per round. A wrong answer locks you out permanently. Think carefully!",
    pvpStart: "⚡ START BATTLE ⚡",
    pvpExit: "EXIT TO MENU",
    pvpWinnerRound: "{player} WINS THE ROUND!",
    pvpWinnerRoundDesc: "Correct time was {time}. Loading next round...",
    pvpWinnerMatch: "{player} IS THE CHAMPION!",
    pvpWinnerDesc: "You are the ultimate Genius Time Master!",
    pvpPlayAgain: "Play Again 🔄",
    pvpExitDuel: "Exit Duel",
    pvpLockTitle: "ANSWER LOCKED",
    pvpWaiting: "Waiting for opponent...",
    pvpP1Name: "Player 1 (Cyan)",
    pvpP2Name: "Player 2 (Magenta)",
    pvpRoundTie: "⏱️ TIME'S UP! IT'S A TIE!",
    pvpRoundTieDesc: "The correct time was {time}. Next round loading...",
    explainTime: "The short hand shows {hour}. The long hand shows {minutes} minutes."
  },
  bm: {
    subtitle: "Jam Interaktif & Kuiz Belajar",
    btnHome: "Menu",
    btnExplore: "Mod Teroka",
    btnQuiz: "Mod Kuiz",
    btnPractice: "Latihan",
    btnLearn: "Mod Belajar",
    btnLearnStart: "Mula Belajar! ➔",
    btnPvp: "Pertarungan PvP",
    score: "Skor",
    streak: "Rantaian",
    switchClock: "Tukar Jenis Jam",
    clockAnalog: "Analog",
    clockDigital12: "Jam 12j",
    clockDigital24: "Jam 24j",
    adjustNeedle: "Laras Jarum Jam",
    adjustSubtitle: "Klik butang tambah/tolak untuk melaras masa",
    min1: "1 minit",
    min5: "5 minit",
    min10: "10 minit",
    min15: "15 minit",
    min30: "30 minit",
    hour1: "1 jam",
    btnRandom: "Rawak",
    btnNow: "Sekarang",
    btnReset: "Semula",
    welcome: "Hai Adik! Sedia belajar membaca jam? 🌟",
    badgeExplore: "MAIN BEBAS",
    exploreTitle: "Mod Teroka",
    exploreDesc: "Main dengan jarum jam dan lihat perubahan masa!",
    badgeQuiz: "CABARAN",
    quizTitle: "Mod Kuiz",
    quizDesc: "Uji kemahiran membaca jam anda dan menangi bintang!",
    badgePractice: "TANPA TEKANAN",
    practiceTitle: "Mod Latihan",
    practiceDesc: "Belajar mengikut rentak sendiri dengan petunjuk dan cubaan tanpa had.",
    badgeLearn: "PELAJARAN BIMBINGAN",
    learnTitle: "Mod Belajar",
    learnDesc: "Ikuti pelajaran ringkas dan kuasai jam langkah demi langkah.",
    learnHeader: "Belajar Membaca Jam",
    learnProgress: "Kemajuan pelajaran",
    learnBack: "Kembali",
    learnNext: "Seterusnya",
    learnSkip: "Langkau dahulu",
    learnAction: "Tunjukkan",
    learnActionDone: "Saya nampak!",
    learnStepCount: "Pelajaran {step} daripada {total}",
    learnComplete: "Pelajaran selesai! Anda sudah bersedia untuk berlatih.",
    learnMasteryEmpty: "Jawab beberapa soalan untuk mula membina penguasaan.",
    learnMastery: "Isyarat penguasaan: {count} kemahiran dikesan",
    learnStepTitles: ["Cari jam", "Kira lima-lima", "Suku selepas", "Suku sebelum", "AM atau PM?", "Anda sudah bersedia!"],
    learnStepTexts: ["Jarum pendek menunjukkan jam. Lihat nombor yang ditunjukkannya.", "Jarum panjang menunjukkan minit. Setiap nombor jam dikira lima minit.", "Apabila jarum minit menunjuk 3, ia ialah suku selepas jam.", "Apabila jarum minit menunjuk 9, ia ialah suku sebelum jam seterusnya.", "AM ialah waktu pagi. PM ialah petang, malam, atau malam lewat.", "Gunakan kedua-dua jarum bersama-sama, kemudian cuba beberapa soalan."],
    learnStepFocus: ["Jarum pendek = jam", "Jarum panjang = minit", "3 = 15 minit", "9 = 45 minit", "AM / PM", "Jarum jam + minit"],
    learnStepActions: ["Serlahkan jarum pendek", "Serlahkan jarum panjang", "Tunjuk suku selepas", "Tunjuk suku sebelum", "Tunjuk bahagian hari", "Tunjuk masa lengkap"],
    learnStepIcons: ["🕐", "🖐️", "🕞", "🕧", "🌞", "🎓"],
    badgePvp: "2 PEMAIN",
    pvpTitle: "Pertarungan PvP",
    pvpDesc: "Berlumba dengan rakan untuk melaras masa yang betul!",
    btnPlay: "Jom Main! ➔",
    statsScore: "Skor Tinggi",
    statsStreak: "Rantaian Terbaik",
    statsAchievements: "Lencana",
    btnTrophy: "Peti Trofi",
    btnPlayAgain: "Main Lagi",
    btnExit: "Keluar",
    selectDifficulty: "Pilih Tahap Kesukaran",
    diffEasyTitle: "Mod Mudah",
    diffEasyDesc: "Jam Tepat",
    diffMediumTitle: "Mod Sederhana",
    diffMediumDesc: "Suku & Setengah",
    diffHardTitle: "Mod Susah",
    diffHardDesc: "Selang 5 Minit",
    diffMasterTitle: "Mod Pakar",
    diffMasterDesc: "Minit Tepat",
    summaryCorrect: "Betul",
    summaryStreak: "Rantaian Terbaik",
    summaryStars3: "Hebat! Anda pakar masa!",
    summaryStars2: "Syabas! Teruskan berlatih!",
    summaryStars1: "Permulaan yang baik!",
    summaryStars0: "Cuba lagi! Setiap cubaan membantu!",
    practiceHintButton: "Tunjuk Petunjuk",
    practiceHintHours: "Petunjuk: Mulakan dengan jarum pendek. Ia menunjukkan jam.",
    practiceHintMinutes: "Petunjuk: Lihat jarum panjang. Setiap nombor jam dikira 5 minit.",
    practiceHintQuarters: "Petunjuk: Periksa sama ada jarum panjang menunjukkan suku selepas, setengah, atau suku sebelum.",
    practiceSummary: "Latihan selesai! Setiap cubaan membantu anda bertambah baik.",
    practiceAdaptiveFresh: "Latihan anda akan menyesuaikan diri dengan jawapan anda.",
    practiceAdaptiveWeak: "Kita akan mengulang kemahiran yang masih perlu dilatih.",
    explanationHour: "Jarum jam: {hour}",
    explanationMinutes: "Jarum minit: {minutes} minit",
    checkAnswer: "Semak Jawapan",
    nextQuestion: "Soalan Seterusnya",
    footerText: "Dicipta dengan perhatian penuh terhadap perincian menggunakan elemen HTML, CSS, dan JS.",
    
    // Dynamic JS translations
    levelTitle: "Tahap {num}",
    levelNames: [
      "Jam Tepat 🕐",
      "Suku & Setengah Jam 🕞",
      "Selang 5 Minit 🕠",
      "Pakar Jam (Masa Tepat) 🎓"
    ],
    questionCounter: "Soalan {index}",
    setPrompt: "Laraskan jam ke pukul {time}",
    setHint: "Tarik jarum jam atau guna butang laras, kemudian klik Semak Jawapan.",
    readPrompt: "Pukul berapakah yang ditunjukkan pada muka jam?",
    readHint: "Baca jarum analog dan klik paparan digital yang betul di bawah.",
    correctText: "Betul! 🎉",
    notQuiteText: "Kurang Tepat! ❌",
    correctDesc: "Syabas! Jam memang menunjukkan pukul {time}.",
    incorrectDesc: "Jawapan yang betul ialah pukul {time}.",
    matchedPerfectTitle: "Sangat Tepat! 🏆",
    matchedPerfectDesc: "Hebat! Anda melaraskan jarum tepat pada {time}.",
    handsDisagreeTitle: "Kurang Tepat! ⏰",
    handsDisagreeDesc: "Sasaran ialah {target}, tetapi anda melaraskan ke {actual}. Cuba lagi nanti!",
    
    // PvP strings
    pvpRoundIndicator: "PUSINGAN {num}",
    pvpPromptPrefix: "Lumba untuk laras jam ke pukul {time}!",
    pvpObjectiveTitle: "Mod Duel Kelajuan",
    pvpObjectiveSub: "Cabaran Jam Muka-ke-Muka",
    pvpObj: "Objektif",
    pvpObjDesc: "Berlumba jawab soalan jam sebelum lawan anda. Pertama capai 5 mata menang!",
    pvpSet: "Laras Jam",
    pvpSetDesc: "Guna butang laras atau tarik jarum untuk samakan masa sasaran, kemudian klik Hantar.",
    pvpRead: "Baca Jam",
    pvpReadDesc: "Lihat muka jam dan ketik masa yang betul daripada 4 pilihan di bawah.",
    pvpOne: "Satu Peluang Sahaja",
    pvpOneDesc: "Setiap pemain mendapat satu percubaan sahaja setiap pusingan. Jawapan salah mengunci anda terus!",
    pvpStart: "⚡ MULAKAN DUEL ⚡",
    pvpExit: "KELUAR KE MENU",
    pvpWinnerRound: "{player} MENANG PUSINGAN INI!",
    pvpWinnerRoundDesc: "Masa yang betul ialah pukul {time}. Pusingan seterusnya sedang dimuat...",
    pvpWinnerMatch: "{player} ADALAH JUARA!",
    pvpWinnerDesc: "Anda adalah Raja Genius Time Master yang sebenar!",
    pvpPlayAgain: "Main Lagi 🔄",
    pvpExitDuel: "Keluar Duel",
    pvpLockTitle: "JAWAPAN DIKUNCI",
    pvpWaiting: "Menunggu lawan...",
    pvpP1Name: "Pemain 1 (Sian)",
    pvpP2Name: "Pemain 2 (Magenta)",
    pvpRoundTie: "⏱️ TAMAT MASA! SERI!",
    pvpRoundTieDesc: "Masa yang betul ialah pukul {time}. Pusingan seterusnya sedang dimuat...",
    explainTime: "Jarum pendek menunjukkan {hour}. Jarum panjang menunjukkan {minutes} minit."
  }
};

function translatePage(lang) {
  currentLanguage = lang;
  localStorage.setItem('selected-lang', lang);
  
  const dict = translations[lang];
  
  // Go through elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      const iconSpan = el.querySelector('.btn-icon, .lang-icon, .sound-icon, .theme-icon, .logo-icon, .pvp-intro-icon, .pvp-rule-icon');
      if (iconSpan) {
        const iconHtml = iconSpan.outerHTML;
        el.innerHTML = `${iconHtml} ${dict[key]}`;
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update language toggle button icon/text
  const langIcons = document.querySelectorAll('.lang-icon');
  langIcons.forEach(icon => {
    icon.textContent = lang === 'en' ? '🇲🇾' : '🇬🇧'; // flag of the OTHER language
  });
  
  updateMainMenuStats();
  
  // If in quiz or PvP, refresh current prompt translated
  if ((appMode === 'quiz' || appMode === 'practice') && activeQuestion) {
    updateQuizPromptLanguage();
  } else if (appMode === 'learn') {
    renderLearnStep();
  } else if (appMode === 'pvp' && pvpActiveQuestion) {
    updatePvpPromptLanguage();
  }
}

function updateQuizPromptLanguage() {
  const dict = translations[currentLanguage];
  const quizPrompt = document.getElementById('quiz-prompt');
  const quizHint = document.getElementById('quiz-hint');
  
  if (activeQuestion.type === 'set') {
    quizPrompt.textContent = dict.setPrompt.replace('{time}', activeQuestion.timeStr12h);
    quizHint.textContent = dict.setHint;
  } else {
    quizPrompt.textContent = dict.readPrompt;
    quizHint.textContent = dict.readHint;
  }
  
  // Update level text
  const levelText = dict.levelTitle.replace('{num}', quizLevel) + ': ' + dict.levelNames[quizLevel - 1];
  document.getElementById('quiz-level-indicator').textContent = levelText;
}

function updatePvpPromptLanguage() {
  const dict = translations[currentLanguage];
  const hudPrompt = document.getElementById('pvp-shared-prompt');
  
  if (pvpActiveQuestion.type === 'set') {
    hudPrompt.textContent = dict.pvpPromptPrefix.replace('{time}', pvpActiveQuestion.timeStr12h);
  } else {
    hudPrompt.textContent = dict.readPrompt;
  }
}

function toggleLanguage() {
  playClickSound();
  const nextLang = currentLanguage === 'en' ? 'bm' : 'en';
  translatePage(nextLang);
}

function backToMainMenu() {
  playClickSound();
  
  // Hide all gameplay panels
  document.querySelector('.main-content').classList.add('hidden');
  document.getElementById('pvp-container').classList.add('hidden');
  document.getElementById('header-mode-selector').classList.add('hidden');
  document.getElementById('score-board').classList.add('hidden');
  
  // Show menu panel
  document.getElementById('main-menu').classList.remove('hidden');
  
  // Reset PvP timers
  clearInterval(pvpTimerInterval);
  pvpRoundActive = false;
  
  // Reset body active classes
  document.body.classList.remove('pvp-active');
  document.querySelector('.main-content').classList.remove('pvp-layout');
  
  appMode = 'menu';
  updateMainMenuStats();
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (typeof ViewportManager !== 'undefined') ViewportManager.update();
}

function updateMainMenuStats() {
  const highscore = localStorage.getItem('quiz-highscore') || 0;
  const beststreak = localStorage.getItem('quiz-beststreak') || 0;
  let badgesCount = 0;
  try {
    badgesCount = (JSON.parse(localStorage.getItem('unlocked-badges')) || []).length;
  } catch (error) {
    console.warn('Saved badge data was invalid and has been ignored.', error);
  }
  
  document.getElementById('menu-stat-highscore').textContent = highscore;
  document.getElementById('menu-stat-beststreak').textContent = beststreak;
  const badgeTotal = Object.keys(badgesData || {}).length;
  document.getElementById('menu-stat-badges').textContent = `${badgesCount}/${badgeTotal}`;
}

// --- Quiz State ---
let quizLevel = 1;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizStreak = 0;
let activeQuestion = null; // Holds the currently generated question data
let hasCheckedAnswer = false;
let questionStartTime = 0;
let practiceMode = false;
const QUIZ_QUESTION_LIMIT = 10;
const PRACTICE_QUESTION_LIMIT = 5;
let learnStepIndex = 0;
let learnActionDone = false;
const LEARN_STEP_TOTAL = 6;
const MASTERY_STORAGE_KEY = 'clock-mastery-v1';

// --- Sound Synthesizer (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem('sound-muted', isMuted ? 'true' : 'false');
  updateSoundIcon();
  playClickSound();
}

function updateSoundIcon() {
  const soundIcons = document.querySelectorAll('.sound-icon');
  soundIcons.forEach(icon => {
    icon.textContent = isMuted ? '🔇' : '🔊';
  });
}

function playTone(freq, type, duration, delay = 0) {
  if (isMuted) return;
  setTimeout(() => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.value = freq;
      
      // Smooth volume envelope to prevent clicking
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback not fully allowed yet by browser.", e);
    }
  }, delay * 1000);
}

function playSuccessSound() {
  // Ascending major chord notes
  playTone(523.25, 'sine', 0.4, 0);    // C5
  playTone(659.25, 'sine', 0.4, 0.08); // E5
  playTone(783.99, 'sine', 0.5, 0.16); // G5
  playTone(1046.50, 'sine', 0.6, 0.24); // C6
}

function playFailSound() {
  // Low discordant buzzer
  playTone(150, 'sawtooth', 0.3, 0);
  playTone(147, 'sawtooth', 0.35, 0.05);
}

function playClickSound() {
  playTone(800, 'triangle', 0.06, 0);
}

// --- Confetti / Particle Celebrations ---
const canvas = document.getElementById('victory-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    this.color = `hsl(${Math.random() * 360}, 85%, 60%)`;
    this.speedX = Math.random() * 12 - 6;
    this.speedY = Math.random() * -15 - 5;
    this.gravity = 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function triggerCelebration() {
  particles = [];
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;
  
  for (let i = 0; i < 80; i++) {
    particles.push(new ConfettiParticle(startX, startY));
  }
  
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animateParticles();
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles = particles.filter(p => p.opacity > 0);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(animateParticles);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// --- Clock Rendering & SVG Dial Generation ---
function initClockFace(ticksElementId = 'clock-ticks', numbersElementId = 'clock-numbers') {
  const ticksGroup = document.getElementById(ticksElementId);
  const numbersGroup = document.getElementById(numbersElementId);
  if (!ticksGroup || !numbersGroup) return;
  
  ticksGroup.innerHTML = '';
  numbersGroup.innerHTML = '';

  // Generate 60 minute ticks
  for (let i = 0; i < 60; i++) {
    const angle = i * 6; // 360 deg / 60 ticks
    const rad = (angle * Math.PI) / 180;
    
    const isMajor = i % 5 === 0;
    const innerRadius = isMajor ? 165 : 173;
    const outerRadius = 180;
    
    const x1 = 200 + innerRadius * Math.sin(rad);
    const y1 = 200 - innerRadius * Math.cos(rad);
    const x2 = 200 + outerRadius * Math.sin(rad);
    const y2 = 200 - outerRadius * Math.cos(rad);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add('tick-line');
    line.classList.add(isMajor ? 'tick-major' : 'tick-minor');
    ticksGroup.appendChild(line);
  }

  // Generate 12 numbers (1 to 12)
  for (let i = 1; i <= 12; i++) {
    const angle = i * 30; // 360 deg / 12 numbers
    const rad = (angle * Math.PI) / 180;
    const numRadius = 142; // Perfect distance inside ticks
    
    const x = 200 + numRadius * Math.sin(rad);
    const y = 200 - numRadius * Math.cos(rad);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('data-hour', i);
    text.classList.add('clock-number-text');
    text.textContent = i;
    
    numbersGroup.appendChild(text);
  }
}

// --- Visual Clock Repainting ---
function updateClockVisuals(isDraggingState = false) {
  const hourHandGroup = document.getElementById('hour-hand-group');
  const minuteHandGroup = document.getElementById('minute-hand-group');
  const ampmBadge = document.getElementById('ampm-badge');
  const digitalTimeStr = document.getElementById('digital-time-str');
  const digitalAmPmStr = document.getElementById('digital-ampm-str');

  // 1. Highlight active clock number
  const hour12Display = currentHour % 12 === 0 ? 12 : currentHour % 12;
  const numbers = document.querySelectorAll('.clock-number-text');
  numbers.forEach(num => {
    if (parseInt(num.getAttribute('data-hour')) === hour12Display) {
      num.classList.add('highlight');
    } else {
      num.classList.remove('highlight');
    }
  });

  // 2. Set hands degrees
  const mAngle = currentMinute * 6; // 360 / 60
  // Continuous hour movement: 30 deg per hour, plus 0.5 deg per minute (30 / 60)
  const hAngle = (currentHour % 12) * 30 + currentMinute * 0.5;

  // Toggle smooth spring transitions depending on whether dragging or using buttons
  if (isDraggingState) {
    hourHandGroup.classList.remove('animating');
    minuteHandGroup.classList.remove('animating');
  } else {
    hourHandGroup.classList.add('animating');
    minuteHandGroup.classList.add('animating');
  }

  // Rotate SVG Hand elements
  hourHandGroup.setAttribute('transform', `rotate(${hAngle} 200 200)`);
  minuteHandGroup.setAttribute('transform', `rotate(${mAngle} 200 200)`);
  hourHandGroup.setAttribute('aria-valuenow', hour12Display);
  minuteHandGroup.setAttribute('aria-valuenow', currentMinute);
  hourHandGroup.setAttribute('aria-valuetext', `${hour12Display}:${currentMinute.toString().padStart(2, '0')} ${currentHour >= 12 ? 'PM' : 'AM'}`);
  minuteHandGroup.setAttribute('aria-valuetext', `${currentMinute} minutes`);

  // 3. Update floating AM/PM badge
  const isPM = currentHour >= 12;
  ampmBadge.textContent = isPM ? 'PM' : 'AM';
  ampmBadge.style.background = isPM ? 'var(--primary)' : 'var(--accent-blue)';
  ampmBadge.style.boxShadow = isPM ? '0 4px 15px var(--primary-glow)' : '0 4px 15px var(--accent-blue-glow)';

  // 4. Formatting digital overlays
  const minStr = currentMinute.toString().padStart(2, '0');
  
  if (clockType === 'digital12') {
    const formattedHour = hour12Display.toString().padStart(2, '0');
    digitalTimeStr.textContent = `${formattedHour}:${minStr}`;
    digitalAmPmStr.textContent = isPM ? 'PM' : 'AM';
    digitalAmPmStr.style.display = 'inline-block';
  } else if (clockType === 'digital24') {
    const formattedHour24 = currentHour.toString().padStart(2, '0');
    digitalTimeStr.textContent = `${formattedHour24}:${minStr}`;
    digitalAmPmStr.style.display = 'none';
  }
}

// --- Time Adjustment Functions ---
function adjustTime(amount, unit) {
  playClickSound();

  if (unit === 'minute') {
    currentMinute += amount;
    // Handle minute carry over
    while (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour = (currentHour + 1) % 24;
    }
    while (currentMinute < 0) {
      currentMinute += 60;
      currentHour = (currentHour - 1 + 24) % 24;
    }
  } else if (unit === 'hour') {
    currentHour = (currentHour + amount + 24) % 24;
  }

  updateClockVisuals(false);

  // If in quiz mode of "Set the Clock" type, we can optionally clear choices incorrect highlights
  if (appMode === 'quiz' && activeQuestion && activeQuestion.type === 'set') {
    clearFeedbackBox();
  }
}

function setToRandomTime() {
  playClickSound();
  
  // Decide target interval snapping based on active quiz levels (snaps random values nicely)
  let snapMinutes = 1;
  if (appMode === 'quiz') {
    if (quizLevel === 1) snapMinutes = 60;
    else if (quizLevel === 2) snapMinutes = 15;
    else if (quizLevel === 3) snapMinutes = 5;
  } else {
    // explore random: standard 5 min increments for neatness, or random 1 min
    snapMinutes = Math.random() > 0.3 ? 5 : 1;
  }

  currentHour = Math.floor(Math.random() * 24);
  const rawMin = Math.floor(Math.random() * 60);
  currentMinute = Math.round(rawMin / snapMinutes) * snapMinutes;
  if (currentMinute >= 60) {
    currentMinute = 0;
    currentHour = (currentHour + 1) % 24;
  }

  updateClockVisuals(false);
  clearFeedbackBox();
}

function setToNowTime() {
  playClickSound();
  const now = new Date();
  currentHour = now.getHours();
  currentMinute = now.getMinutes();
  updateClockVisuals(false);
  clearFeedbackBox();
}

function resetTo12() {
  playClickSound();
  currentHour = 12; // 12:00 PM
  currentMinute = 0;
  updateClockVisuals(false);
  clearFeedbackBox();
}

// --- Drag & Drop Math Calculations ---
function getAngleFromEvent(event) {
  const clockSvg = document.getElementById('clock-svg');
  const rect = clockSvg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Trigonometric angle relative to center: atan2(dy, dx)
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  let angleRad = Math.atan2(dy, dx);
  let angleDeg = angleRad * (180 / Math.PI);

  // Convert so 12 o'clock is 0 degrees, rotating clockwise
  let clockAngle = angleDeg + 90;
  if (clockAngle < 0) {
    clockAngle += 360;
  }
  return clockAngle;
}

function handleHandKeydown(event, handType) {
  const supportedKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  if (!supportedKeys.includes(event.key)) return;

  event.preventDefault();
  const direction = event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 1 : -1;
  if (handType === 'minute') {
    adjustTime(direction * (event.shiftKey ? 5 : 1), 'minute');
  } else {
    adjustTime(direction, 'hour');
  }
}
function handleDragStart(event, handType) {
  // Allow interaction audio context unlock
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  isDragging = true;
  activeDragHand = handType;
  
  // Save baseline measurements for rollover math
  prevDragMinute = currentMinute;
  prevDragHourAngle = (currentHour % 12) * 30 + currentMinute * 0.5;

  // Add global window tracking listeners
  window.addEventListener('mousemove', handleDragMove, { passive: false });
  window.addEventListener('touchmove', handleDragMove, { passive: false });
  window.addEventListener('mouseup', handleDragEnd);
  window.addEventListener('touchend', handleDragEnd);

  // Prevent selection/scroll triggers
  event.preventDefault();
}

function handleDragMove(event) {
  if (!isDragging) return;
  event.preventDefault(); // Stop mobile scrolling

  const clockAngle = getAngleFromEvent(event);

  if (activeDragHand === 'minute') {
    // 360 deg = 60 mins -> 6 deg = 1 min
    const exactMinutes = clockAngle / 6;
    let roundedMinutes = Math.round(exactMinutes) % 60;

    // Handle crossing the 12 o'clock threshold to increment/decrement hours
    // (If user drags fast, handle boundaries: [45, 59] <=> [0, 15])
    if (prevDragMinute >= 45 && prevDragMinute <= 59 && roundedMinutes >= 0 && roundedMinutes <= 15) {
      currentHour = (currentHour + 1) % 24;
    } else if (prevDragMinute >= 0 && prevDragMinute <= 15 && roundedMinutes >= 45 && roundedMinutes <= 59) {
      currentHour = (currentHour - 1 + 24) % 24;
    }

    currentMinute = roundedMinutes;
    prevDragMinute = currentMinute;

  } else if (activeDragHand === 'hour') {
    // 360 deg = 12 hours -> 30 deg = 1 hour -> 0.5 deg = 1 minute
    // Dragging the hour hand allows setting continuous fractional positions.
    // Total fractional minutes in the active 12-hour block (720 minutes total)
    const exactMinutesFractional = (clockAngle / 360) * 720;
    
    // Snapping: snap hour changes to a nice 1 minute or 5 minute interval based on speed/precision
    let snappedMinutes = Math.round(exactMinutesFractional);
    
    // Safety check for maximum boundaries
    if (snappedMinutes >= 720) snappedMinutes = 0;

    const targetHour12 = Math.floor(snappedMinutes / 60);
    const targetMinute = snappedMinutes % 60;

    // Boundary crossover AM/PM flipping:
    // If the hour hand crosses the 12 (0 deg / 360 deg) boundary, flip AM/PM
    const currentHourAngle = clockAngle;
    const diff = currentHourAngle - prevDragHourAngle;

    // Detect major angle jumps (crossovers)
    if (diff < -300) {
      // Clockwise rollover at 12 o'clock
      currentHour = (currentHour + 12) % 24;
    } else if (diff > 300) {
      // Counter-clockwise roll-back at 12 o'clock
      currentHour = (currentHour - 12 + 24) % 24;
    }

    // Preserve PM state
    const isPM = currentHour >= 12;
    currentHour = (targetHour12 % 12) + (isPM ? 12 : 0);
    currentMinute = targetMinute;
    
    prevDragHourAngle = currentHourAngle;
  }

  updateClockVisuals(true);
}

function handleDragEnd() {
  isDragging = false;
  activeDragHand = null;

  // Repaint clock one last time to ensure spring smooth layout snapping is active
  updateClockVisuals(false);

  // Remove tracking listeners
  window.removeEventListener('mousemove', handleDragMove);
  window.removeEventListener('touchmove', handleDragMove);
  window.removeEventListener('mouseup', handleDragEnd);
  window.removeEventListener('touchend', handleDragEnd);

  // If in quiz "set" mode, clear old wrong highlights
  if (appMode === 'quiz' && activeQuestion && activeQuestion.type === 'set') {
    clearFeedbackBox();
  }
}

// --- Clock Type Toggle Logic ---
function switchClockType(type) {
  playClickSound();
  
  clockType = type;
  localStorage.setItem('clock-type', type);

  // Toggle active button layouts
  document.getElementById('type-analog').classList.remove('active');
  document.getElementById('type-digital-12').classList.remove('active');
  document.getElementById('type-digital-24').classList.remove('active');

  const digitalContainer = document.getElementById('digital-clock-container');

  if (type === 'analog') {
    document.getElementById('type-analog').classList.add('active');
    digitalContainer.classList.add('hidden');
  } else if (type === 'digital12') {
    document.getElementById('type-digital-12').classList.add('active');
    digitalContainer.classList.remove('hidden');
  } else if (type === 'digital24') {
    document.getElementById('type-digital-24').classList.add('active');
    digitalContainer.classList.remove('hidden');
  }

  updateClockVisuals(false);
}

// --- App Mode Selection (Explore vs Quiz) ---
function switchAppMode(mode) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  playClickSound();
  appMode = mode;

  const btnExplore = document.getElementById('btn-explore');
  const btnQuiz = document.getElementById('btn-quiz');
  const btnPractice = document.getElementById('btn-practice');
  const btnLearn = document.getElementById('btn-learn');
  const btnPvp = document.getElementById('btn-pvp');
  const btnHome = document.getElementById('btn-home');
  
  const scoreBoard = document.getElementById('score-board');
  const quizPanel = document.getElementById('quiz-panel');
  const learnPanel = document.getElementById('learn-panel');
  const adjustmentsCard = document.getElementById('adjustments-card');
  
  const leftPanel = document.querySelector('.left-panel');
  const rightPanel = document.querySelector('.right-panel');
  const pvpContainer = document.getElementById('pvp-container');
  const mainMenu = document.getElementById('main-menu');
  const headerModeSelector = document.getElementById('header-mode-selector');

  // Deactivate all buttons
  btnExplore.classList.remove('active');
  btnQuiz.classList.remove('active');
  if (btnPractice) btnPractice.classList.remove('active');
  if (btnLearn) btnLearn.classList.remove('active');
  btnPvp.classList.remove('active');
  if (btnHome) btnHome.classList.remove('active');

  // Hide main menu
  mainMenu.classList.add('hidden');

  // Show header selector in-game
  headerModeSelector.classList.remove('hidden');

  // Reset display states of left/right panels
  leftPanel.classList.remove('hidden');
  rightPanel.classList.remove('hidden');
  scoreBoard.classList.add('hidden');
  quizPanel.classList.add('hidden');
  if (learnPanel) learnPanel.classList.add('hidden');
  pvpContainer.classList.add('hidden');

  const mainContent = document.querySelector('.main-content');
  mainContent.classList.remove('hidden'); // Ensure main-content is visible

  if (mode === 'pvp') {
    mainContent.classList.add('pvp-layout');
    document.body.classList.add('pvp-active');
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } else {
    mainContent.classList.remove('pvp-layout');
    document.body.classList.remove('pvp-active');
    clearInterval(pvpTimerInterval);
    pvpRoundActive = false;
  }

  practiceMode = mode === 'practice';

  if (mode === 'explore') {
    btnExplore.classList.add('active');
    adjustmentsCard.style.opacity = '1';
    adjustmentsCard.style.pointerEvents = 'auto';
  } else if (mode === 'learn') {
    if (btnLearn) btnLearn.classList.add('active');
    leftPanel.classList.add('hidden');
    if (learnPanel) learnPanel.classList.remove('hidden');
    adjustmentsCard.style.opacity = '1';
    adjustmentsCard.style.pointerEvents = 'auto';
    startLearnSession();
  } else if (mode === 'quiz') {
    btnQuiz.classList.add('active');
    scoreBoard.classList.remove('hidden');
    quizPanel.classList.remove('hidden');
    
    // Show difficulty selection screen, hide others
    document.getElementById('quiz-difficulty-screen').classList.remove('hidden');
    document.getElementById('quiz-game-screen').classList.add('hidden');
    document.getElementById('quiz-summary-screen').classList.add('hidden');
  } else if (mode === 'practice') {
    if (btnPractice) btnPractice.classList.add('active');
    scoreBoard.classList.remove('hidden');
    quizPanel.classList.remove('hidden');
    document.getElementById('quiz-difficulty-screen').classList.remove('hidden');
    document.getElementById('quiz-game-screen').classList.add('hidden');
    document.getElementById('quiz-summary-screen').classList.add('hidden');
  } else if (mode === 'pvp') {
    btnPvp.classList.add('active');
    leftPanel.classList.add('hidden');
    rightPanel.classList.add('hidden');
    pvpContainer.classList.remove('hidden');

    document.getElementById('pvp-intro-panel').classList.remove('hidden');
  }

  if (typeof ViewportManager !== 'undefined') ViewportManager.update();
}

const LEARN_STEP_TIMES = [
  { hour: 3, minute: 0 },
  { hour: 3, minute: 25 },
  { hour: 3, minute: 15 },
  { hour: 3, minute: 45 },
  { hour: 7, minute: 0 },
  { hour: 2, minute: 50 }
];

function startLearnSession() {
  const savedStep = parseInt(localStorage.getItem('learn-step-progress') || '0', 10);
  learnStepIndex = Number.isFinite(savedStep) ? Math.min(Math.max(savedStep, 0), LEARN_STEP_TOTAL - 1) : 0;
  learnActionDone = false;
  renderLearnStep();
}

function renderLearnStep() {
  if (appMode !== 'learn') return;
  const dict = translations[currentLanguage];
  const time = LEARN_STEP_TIMES[learnStepIndex];
  const focusHour = learnStepIndex === 0 || learnStepIndex === 4 || learnStepIndex === 5;
  const focusMinute = learnStepIndex === 1 || learnStepIndex === 2 || learnStepIndex === 3;
  const stepCount = document.getElementById('learn-step-count');
  const progressBar = document.getElementById('learn-progress-bar');
  const lessonIcon = document.getElementById('learn-lesson-icon');
  const title = document.getElementById('learn-step-title');
  const text = document.getElementById('learn-step-text');
  const focus = document.getElementById('learn-focus-label');
  const actionButton = document.getElementById('learn-action-btn');
  const feedback = document.getElementById('learn-action-feedback');
  const prevButton = document.getElementById('learn-prev-btn');
  const nextButton = document.getElementById('learn-next-btn');
  const hourHand = document.getElementById('hour-hand-group');
  const minuteHand = document.getElementById('minute-hand-group');

  if (!stepCount || !progressBar || !title || !text || !focus || !actionButton || !feedback) return;

  stepCount.textContent = dict.learnStepCount
    .replace('{step}', learnStepIndex + 1)
    .replace('{total}', LEARN_STEP_TOTAL);
  progressBar.style.width = `${((learnStepIndex + 1) / LEARN_STEP_TOTAL) * 100}%`;
  if (lessonIcon && dict.learnStepIcons) {
    lessonIcon.textContent = dict.learnStepIcons[learnStepIndex];
  }
  title.textContent = dict.learnStepTitles[learnStepIndex];
  text.textContent = dict.learnStepTexts[learnStepIndex];
  focus.textContent = dict.learnStepFocus[learnStepIndex];
  actionButton.textContent = learnActionDone ? dict.learnActionDone : dict.learnStepActions[learnStepIndex];
  actionButton.classList.toggle('done', learnActionDone);
  feedback.classList.toggle('hidden', !learnActionDone);
  if (learnActionDone) feedback.textContent = dict.learnComplete;
  prevButton.disabled = learnStepIndex === 0;
  nextButton.textContent = learnStepIndex === LEARN_STEP_TOTAL - 1 ? dict.btnExit : dict.learnNext;
  nextButton.onclick = learnStepIndex === LEARN_STEP_TOTAL - 1 && learnActionDone ? backToMainMenu : nextLearnStep;

  currentHour = time.hour;
  currentMinute = time.minute;
  updateClockVisuals(false);
  if (hourHand) hourHand.classList.toggle('learn-focus-hand', focusHour);
  if (minuteHand) minuteHand.classList.toggle('learn-focus-hand', focusMinute);
  updateLearnMasterySummary();
}

function handleLearnAction() {
  if (appMode !== 'learn' || learnActionDone) return;
  playClickSound();
  learnActionDone = true;
  localStorage.setItem('learn-step-progress', String(Math.min(learnStepIndex + 1, LEARN_STEP_TOTAL - 1)));
  renderLearnStep();
}

function nextLearnStep() {
  playClickSound();
  if (!learnActionDone) handleLearnAction();
  if (learnStepIndex >= LEARN_STEP_TOTAL - 1) return;
  learnStepIndex += 1;
  learnActionDone = false;
  renderLearnStep();
}

function previousLearnStep() {
  playClickSound();
  if (learnStepIndex <= 0) return;
  learnStepIndex -= 1;
  learnActionDone = false;
  renderLearnStep();
}

function skipLearnLesson() {
  playClickSound();
  localStorage.setItem('learn-skipped', 'true');
  backToMainMenu();
}

function updateLearnMasterySummary() {
  const summary = document.getElementById('learn-mastery-summary');
  if (!summary) return;
  const dict = translations[currentLanguage];
  const tracked = MasteryManager.trackedCount();
  summary.textContent = tracked === 0
    ? dict.learnMasteryEmpty
    : dict.learnMastery.replace('{count}', tracked);
}

function getQuestionSkill(question) {
  if (!question) return 'hour-recognition';
  if (question.type === 'set') {
    return quizLevel === 1 ? 'digital-to-analog' : 'analog-to-digital';
  }
  if (quizLevel === 1) return 'hour-recognition';
  if (quizLevel === 2) return 'quarter-and-half';
  if (quizLevel === 3) return 'five-minute-reading';
  return 'exact-minute-reading';
}
// --- Interactive Learning Game / Quiz Logic ---

function setQuizDifficulty(level) {
  playClickSound();
  quizLevel = level;
  
  // Hide selector, show active game
  document.getElementById('quiz-difficulty-screen').classList.add('hidden');
  document.getElementById('quiz-game-screen').classList.remove('hidden');
  
  // Reset session variables
  quizScore = 0;
  quizStreak = 0;
  currentQuestionIndex = 0;
  
  document.getElementById('score-value').textContent = quizScore;
  document.getElementById('streak-value').textContent = `🔥 ${quizStreak}`;

  // Update level indicator
  const dict = translations[currentLanguage];
  const modeLabel = practiceMode ? `${dict.practiceTitle} • ` : '';
  const levelText = modeLabel + dict.levelTitle.replace('{num}', quizLevel) + ': ' + dict.levelNames[quizLevel - 1];
  document.getElementById('quiz-level-indicator').textContent = levelText;

  const hintButton = document.getElementById('btn-practice-hint');
  if (hintButton) {
    hintButton.classList.toggle('hidden', !practiceMode);
    const hintLabel = hintButton.querySelector('[data-i18n="practiceHintButton"]');
    if (hintLabel) hintLabel.textContent = dict.practiceHintButton;
  }

  const adaptiveMessage = document.getElementById('practice-adaptive-message');
  if (adaptiveMessage) {
    const weakSkills = Object.values(MasteryManager.records).filter(record => record.attempts >= 3 && record.accuracy < 60).length;
    adaptiveMessage.textContent = weakSkills > 0 ? dict.practiceAdaptiveWeak : dict.practiceAdaptiveFresh;
    adaptiveMessage.classList.toggle('hidden', !practiceMode);
  }
  generateQuestion();
}

function handleQuizNextClick() {
  playClickSound();
  const questionLimit = practiceMode ? PRACTICE_QUESTION_LIMIT : QUIZ_QUESTION_LIMIT;
  if (question.skill) return question.skill;
  if (currentQuestionIndex >= questionLimit) {
    showQuizSummary();
  } else {
    generateQuestion();
  }
}

function showQuizSummary() {
  // Hide active game, show summary screen
  document.getElementById('quiz-game-screen').classList.add('hidden');
  const summaryScreen = document.getElementById('quiz-summary-screen');
  summaryScreen.classList.remove('hidden');

  const dict = translations[currentLanguage];

  // Calculate correct answers count based on total score (each correct is 10 points)
  const questionLimit = practiceMode ? PRACTICE_QUESTION_LIMIT : QUIZ_QUESTION_LIMIT;
  const correctCount = Math.min(questionLimit, quizScore / 10);
  
  // Choose rating stars
  let stars = "☆☆☆";
  let headline = "";
  if (correctCount === questionLimit) {
    stars = "⭐⭐⭐";
    headline = dict.summaryStars3;
    triggerCelebration();
  } else if (correctCount >= Math.ceil(questionLimit * 0.7)) {
    stars = "⭐⭐☆";
    headline = dict.summaryStars2;
    triggerCelebration();
  } else if (correctCount >= Math.ceil(questionLimit * 0.4)) {
    stars = "⭐☆☆";
    headline = dict.summaryStars1;
  } else {
    stars = "☆☆☆";
    headline = dict.summaryStars0;
  }

  // Play success sound
  if (!isMuted) {
    if (correctCount >= 7) {
      playSuccessSound();
    } else {
      // Friendly simple melody
      playTone(392, 'sine', 0.2, 0);
      playTone(523, 'sine', 0.4, 0.1);
    }
  }

  document.getElementById('podium-stars').textContent = stars;
  document.getElementById('summary-headline').textContent = headline;
  
  const scoreDesc = currentLanguage === 'en' ? `You scored ${quizScore} points!` : `Anda mendapat ${quizScore} mata!`;
  document.getElementById('summary-subtext').textContent = scoreDesc;
  
  document.getElementById('summary-correct-count').textContent = `${correctCount}/10`;
  document.getElementById('summary-streak-count').textContent = StatsManager.bestStreak;
}

function restartQuizSession() {
  playClickSound();
  document.getElementById('quiz-summary-screen').classList.add('hidden');
  document.getElementById('quiz-difficulty-screen').classList.remove('hidden');
}


function showPracticeHint() {
  if (!practiceMode || !activeQuestion || hasCheckedAnswer) return;

  const dict = translations[currentLanguage];
  const hint = quizLevel === 1
    ? dict.practiceHintHours
    : quizLevel === 2
      ? dict.practiceHintQuarters
      : dict.practiceHintMinutes;
  const hintBox = document.getElementById('practice-hint-message');
  if (hintBox) {
    hintBox.textContent = hint;
    hintBox.classList.remove('hidden');
  }
}
function getAdaptiveSkillPool() {
  if (quizLevel === 1) return ['hour-recognition', 'digital-to-analog'];
  if (quizLevel === 2) return ['quarter-and-half', 'digital-to-analog'];
  if (quizLevel === 3) return ['five-minute-reading', 'digital-to-analog'];
  return ['exact-minute-reading', 'digital-to-analog'];
}

function getSkillWeight(skill) {
  const record = MasteryManager.records[skill];
  if (!record || !record.attempts) return 3;
  if (record.mastered) return 1;
  if (record.accuracy < 60) return 5;
  if (record.accuracy < 85) return 3;
  return 2;
}

function selectAdaptiveSkill() {
  const pool = getAdaptiveSkillPool();
  const weightedPool = [];
  pool.forEach(skill => {
    for (let index = 0; index < getSkillWeight(skill); index++) weightedPool.push(skill);
  });
  return weightedPool[Math.floor(Math.random() * weightedPool.length)] || pool[0];
}
function generateQuestion() {
  currentQuestionIndex++;
  hasCheckedAnswer = false;
  
  const dict = translations[currentLanguage];
  document.getElementById('question-count').textContent = dict.questionCounter.replace('{index}', currentQuestionIndex);
  document.getElementById('btn-submit-answer').classList.remove('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');
  clearFeedbackBox();

  // Pick a skill using local mastery so weaker concepts return more often.
  const adaptiveSkill = selectAdaptiveSkill();
  const qType = adaptiveSkill === 'digital-to-analog' ? 'set' : 'read';

  // Create a target time that matches the selected skill.
  let targetHour = Math.floor(Math.random() * 24);
  let targetMinute = 0;

  if (adaptiveSkill === 'hour-recognition' || adaptiveSkill === 'digital-to-analog') {
    targetMinute = 0;
  } else if (adaptiveSkill === 'quarter-and-half') {
    const options = [0, 15, 30, 45];
    targetMinute = options[Math.floor(Math.random() * options.length)];
  } else if (adaptiveSkill === 'five-minute-reading') {
    targetMinute = Math.floor(Math.random() * 12) * 5;
  } else {
    targetMinute = Math.floor(Math.random() * 60);
}

  const isPM = targetHour >= 12;
  const hour12 = targetHour % 12 === 0 ? 12 : targetHour % 12;
  const ampmStr = isPM ? 'PM' : 'AM';
  const minStr = targetMinute.toString().padStart(2, '0');

  activeQuestion = {
    type: qType,
    skill: adaptiveSkill,
    hour: targetHour,
    minute: targetMinute,
    isPM: isPM,
    hour12: hour12,
    timeStr12h: `${hour12}:${minStr} ${ampmStr}`,
    timeStr24h: `${targetHour.toString().padStart(2, '0')}:${minStr}`
  };

  const adjustmentsCard = document.getElementById('adjustments-card');
  const quizChoices = document.getElementById('quiz-choices');
  const quizActions = document.getElementById('quiz-actions');
  const quizPrompt = document.getElementById('quiz-prompt');
  const quizHint = document.getElementById('quiz-hint');

  if (qType === 'set') {
    // --- "SET THE CLOCK" MODE ---
    adjustmentsCard.style.opacity = '1';
    adjustmentsCard.style.pointerEvents = 'auto';
    quizChoices.classList.add('hidden');
    quizActions.classList.remove('hidden');

    quizPrompt.textContent = dict.setPrompt.replace('{time}', activeQuestion.timeStr12h);
    quizHint.textContent = dict.setHint;
    
    // Move current clock needles far away from target to start
    currentHour = (targetHour + 6) % 24;
    currentMinute = (targetMinute + 30) % 60;
    updateClockVisuals(false);

  } else {
    // --- "READ THE CLOCK" MODE ---
    // Hide manual adjustment cards and checks so they only use choice buttons
    adjustmentsCard.style.opacity = '0.4';
    adjustmentsCard.style.pointerEvents = 'none';
    quizChoices.classList.remove('hidden');
    quizActions.classList.add('hidden'); // Choice buttons are the action

    quizPrompt.textContent = dict.readPrompt;
    quizHint.textContent = dict.readHint;

    // Set clock needles to target exactly
    currentHour = targetHour;
    currentMinute = targetMinute;
    updateClockVisuals(false);

    // Generate multiple choice options (1 correct, 3 distractors)
    const choices = generateMultipleChoiceOptions(activeQuestion);
    quizChoices.innerHTML = '';
    
    choices.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('choice-btn');
      
      const parts = opt.split(' ');
      const timeVal = parts[0];
      const ampmVal = parts[1] || '';

      btn.innerHTML = `${timeVal} <span class="choice-ampm">${ampmVal}</span>`;
      btn.onclick = () => selectChoice(opt, btn);
      quizChoices.appendChild(btn);
    });
  }

  // Set the baseline question start time
  questionStartTime = Date.now();
}

function generateMultipleChoiceOptions(question) {
  const correctOption = question.timeStr12h;
  const set = new Set();
  set.add(correctOption);

  // Distractor generators
  while (set.size < 4) {
    let offsetHour = Math.floor(Math.random() * 5) - 2; // -2 to +2
    let offsetMinute = 0;

    if (quizLevel === 1) {
      offsetMinute = 0;
    } else if (quizLevel === 2) {
      const opts = [-15, 15, 30, -30];
      offsetMinute = opts[Math.floor(Math.random() * opts.length)];
    } else if (quizLevel === 3) {
      offsetMinute = (Math.floor(Math.random() * 5) - 2) * 5; // -10, -5, +5, +10
    } else {
      offsetMinute = Math.floor(Math.random() * 30) - 15;
    }

    let h = (question.hour + offsetHour + 24) % 24;
    let m = (question.minute + offsetMinute + 60) % 60;

    // Swapping hours & minutes is a very clever distractor for learners!
    if (Math.random() > 0.7 && question.minute > 0 && question.minute <= 12) {
      h = question.minute;
      m = question.hour12 * 5;
    }

    const isPMDist = h >= 12;
    const h12Dist = h % 12 === 0 ? 12 : h % 12;
    const ampmDist = isPMDist ? 'PM' : 'AM';
    const mStrDist = m.toString().padStart(2, '0');
    
    set.add(`${h12Dist}:${mStrDist} ${ampmDist}`);
  }

  // Shuffle array
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function getTimeLearningHint(question) {
  const dict = translations[currentLanguage];
  return dict.explainTime
    .replace('{hour}', question.hour12)
    .replace('{minutes}', question.minute);
}


function showLearningExplanation(question) {
  const dict = translations[currentLanguage];
  const explanation = document.getElementById('quiz-explanation-visual');
  if (!explanation) return;

  document.getElementById('explain-hour-value').textContent = dict.explanationHour.replace('{hour}', question.hour12);
  document.getElementById('explain-minute-value').textContent = dict.explanationMinutes.replace('{minutes}', question.minute);
  explanation.classList.remove('hidden');
}
// Choice submission for Read the Clock
function selectChoice(selectedTimeStr, buttonElement) {
  if (hasCheckedAnswer) return;
  hasCheckedAnswer = true;

  const secondsTaken = (Date.now() - questionStartTime) / 1000;

  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackDesc = document.getElementById('feedback-desc');

  const allChoiceBtns = document.querySelectorAll('.choice-btn');
  const dict = translations[currentLanguage];

  if (selectedTimeStr === activeQuestion.timeStr12h) {
    // Correct!
    buttonElement.classList.add('correct');
    playSuccessSound();
    triggerCelebration();

    quizScore += 10;
    quizStreak += 1;

    feedbackBox.className = 'quiz-feedback-box correct-box';
    feedbackIcon.textContent = '🎉';
    feedbackTitle.textContent = dict.correctText;
    feedbackDesc.textContent = dict.correctDesc.replace('{time}', selectedTimeStr);

    // Record stats and achievements
    StatsManager.addAnswer(true, secondsTaken);
    StatsManager.updateStreak(quizStreak);
    StatsManager.updateScore(quizScore);
  } else {
    // Incorrect!
    buttonElement.classList.add('incorrect');
    playFailSound();
    
    quizStreak = 0;

    // Highlight correct button
    allChoiceBtns.forEach(btn => {
      if (btn.textContent.trim().replace('\n', ' ').replace(/\s+/g, ' ') === activeQuestion.timeStr12h) {
        btn.classList.add('correct');
      }
    });

    feedbackBox.className = 'quiz-feedback-box incorrect-box';
    feedbackIcon.textContent = '❌';
    feedbackTitle.textContent = dict.notQuiteText;
    feedbackDesc.textContent = dict.incorrectDesc.replace('{time}', activeQuestion.timeStr12h) + ' ' + getTimeLearningHint(activeQuestion);
    showLearningExplanation(activeQuestion);

    // Record stats
    StatsManager.addAnswer(false);
    StatsManager.updateStreak(0);
  }

  MasteryManager.record(getQuestionSkill(activeQuestion), selectedTimeStr === activeQuestion.timeStr12h);
  // Update headers
  document.getElementById('score-value').textContent = quizScore;
  document.getElementById('streak-value').textContent = `🔥 ${quizStreak}`;

  feedbackBox.classList.remove('hidden');

  // Display next question option
  const quizActions = document.getElementById('quiz-actions');
  quizActions.classList.remove('hidden');
  document.getElementById('btn-submit-answer').classList.add('hidden');
  document.getElementById('btn-next-question').classList.remove('hidden');
}

// Answer check for Set the Clock
function checkSetClockAnswer() {
  if (hasCheckedAnswer) return;
  hasCheckedAnswer = true;

  const secondsTaken = (Date.now() - questionStartTime) / 1000;

  // Target values
  const targetH12 = activeQuestion.hour12;
  const targetMin = activeQuestion.minute;
  const targetIsPM = activeQuestion.isPM;

  // Current user values
  const currH12 = currentHour % 12 === 0 ? 12 : currentHour % 12;
  const currMin = currentMinute;
  const currIsPM = currentHour >= 12;

  const isExactMatch = (targetH12 === currH12 && targetMin === currMin && targetIsPM === currIsPM);

  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackDesc = document.getElementById('feedback-desc');

  const dict = translations[currentLanguage];

  if (isExactMatch) {
    // Correct!
    playSuccessSound();
    triggerCelebration();

    quizScore += 10;
    quizStreak += 1;

    feedbackBox.className = 'quiz-feedback-box correct-box';
    feedbackIcon.textContent = '🏆';
    feedbackTitle.textContent = dict.matchedPerfectTitle;
    feedbackDesc.textContent = dict.matchedPerfectDesc.replace('{time}', activeQuestion.timeStr12h);

    // Record stats and achievements
    StatsManager.addAnswer(true, secondsTaken);
    StatsManager.updateStreak(quizStreak);
    StatsManager.updateScore(quizScore);
  } else {
    // Incorrect!
    playFailSound();
    quizStreak = 0;

    feedbackBox.className = 'quiz-feedback-box incorrect-box';
    feedbackIcon.textContent = '⏰';
    feedbackTitle.textContent = dict.handsDisagreeTitle;
    
    const actualStr = `${currH12}:${currMin.toString().padStart(2,'0')} ${currIsPM ? 'PM' : 'AM'}`;
    feedbackDesc.textContent = dict.handsDisagreeDesc.replace('{target}', activeQuestion.timeStr12h).replace('{actual}', actualStr) + ' ' + getTimeLearningHint(activeQuestion);
    showLearningExplanation(activeQuestion);

    // Record stats
    StatsManager.addAnswer(false);
    StatsManager.updateStreak(0);
  }

  MasteryManager.record(getQuestionSkill(activeQuestion), isExactMatch);
  // Update headers
  document.getElementById('score-value').textContent = quizScore;
  document.getElementById('streak-value').textContent = `🔥 ${quizStreak}`;

  feedbackBox.classList.remove('hidden');
  document.getElementById('btn-submit-answer').classList.add('hidden');
  document.getElementById('btn-next-question').classList.remove('hidden');
}

function clearFeedbackBox() {
  const box = document.getElementById('quiz-feedback');
  box.classList.add('hidden');
  box.className = 'quiz-feedback-box';
  const explanation = document.getElementById('quiz-explanation-visual');
  if (explanation) explanation.classList.add('hidden');
  const hintBox = document.getElementById('practice-hint-message');
  if (hintBox) hintBox.classList.add('hidden');
}

// --- Achievements & Persistent Stats System ---
const badgesData = {
  clock_explorer: {
    icon: "💡",
    en: { name: "Clock Explorer", desc: "You checked explore mode!" },
    bm: { name: "Penjelajah Jam", desc: "Anda melawat mod teroka!" }
  },
  first_star: {
    icon: "🌟",
    en: { name: "First Star", desc: "Answered a question correctly!" },
    bm: { name: "Bintang Pertama", desc: "Menjawab soalan dengan betul!" }
  },
  streak_starter: {
    icon: "🔥",
    en: { name: "Streak Starter", desc: "Correct streak of 3 questions!" },
    bm: { name: "Permulaan Rantai", desc: "Rantaian betul 3 soalan!" }
  },
  streak_master: {
    icon: "👑",
    en: { name: "Streak Master", desc: "Correct streak of 8 questions!" },
    bm: { name: "Raja Rantai", desc: "Rantaian betul 8 soalan!" }
  },
  night_owl: {
    icon: "🦉",
    en: { name: "Night Owl", desc: "Played after 8 PM!" },
    bm: { name: "Burung Hantu", desc: "Bermain selepas pukul 8 malam!" }
  },
  perfect_ten: {
    icon: "💯",
    en: { name: "Perfect Ten", desc: "Scored 100 points in one quiz!" },
    bm: { name: "Markah Penuh", desc: "Dapat 100 mata dalam satu kuiz!" }
  },
  pvp_challenger: {
    icon: "⚔️",
    en: { name: "PVP Challenger", desc: "Completed a speed duel battle!" },
    bm: { name: "Pencabar PVP", desc: "Menamatkan pertarungan duel!" }
  },
  double_five: {
    icon: "⚡",
    en: { name: "Double Five", desc: "Answered correct in under 5s!" },
    bm: { name: "Pantas Kilat", desc: "Menjawab betul dalam masa 5s!" }
  }
};

const MasteryManager = {
  records: {},

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(MASTERY_STORAGE_KEY) || '{}');
      this.records = saved && typeof saved === 'object' ? saved : {};
    } catch (error) {
      console.warn('Saved mastery data was invalid and has been ignored.', error);
      this.records = {};
    }
  },

  save() {
    localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(this.records));
  },

  record(skill, correct) {
    if (!skill) return;
    const current = this.records[skill] || { attempts: 0, correct: 0, streak: 0, mastered: false };
    current.attempts += 1;
    current.correct += correct ? 1 : 0;
    current.streak = correct ? current.streak + 1 : 0;
    current.lastPractised = new Date().toISOString().slice(0, 10);
    current.accuracy = Math.round((current.correct / current.attempts) * 100);
    current.mastered = current.attempts >= 10 && current.accuracy >= 85;
    this.records[skill] = current;
    this.save();
    if (appMode === 'learn') updateLearnMasterySummary();
  },

  trackedCount() {
    return Object.keys(this.records).length;
  }
};
const StatsManager = {
  highscore: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  unlockedBadges: [],

  load() {
    this.highscore = parseInt(localStorage.getItem('quiz-highscore')) || 0;
    this.bestStreak = parseInt(localStorage.getItem('quiz-beststreak')) || 0;
    this.totalAnswered = parseInt(localStorage.getItem('stats-total-answered')) || 0;
    this.totalCorrect = parseInt(localStorage.getItem('stats-total-correct')) || 0;
    try {
      this.unlockedBadges = JSON.parse(localStorage.getItem('unlocked-badges')) || [];
    } catch(e) {
      this.unlockedBadges = [];
    }

    // Check Night Owl badge on startup/load
    const hr = new Date().getHours();
    if (hr >= 20 || hr < 6) {
      this.checkBadge('night_owl');
    }
  },
  
  save() {
    localStorage.setItem('quiz-highscore', this.highscore);
    localStorage.setItem('quiz-beststreak', this.bestStreak);
    localStorage.setItem('stats-total-answered', this.totalAnswered);
    localStorage.setItem('stats-total-correct', this.totalCorrect);
    localStorage.setItem('unlocked-badges', JSON.stringify(this.unlockedBadges));
    
    updateMainMenuStats();
  },

  addAnswer(isCorrect, secondsTaken) {
    this.totalAnswered++;
    if (isCorrect) {
      this.totalCorrect++;
      this.checkBadge('first_star');
      if (secondsTaken !== undefined && secondsTaken < 5) {
        this.checkBadge('double_five');
      }
    }
    this.save();
  },

  updateStreak(streak) {
    if (streak > this.bestStreak) {
      this.bestStreak = streak;
    }
    if (streak >= 3) this.checkBadge('streak_starter');
    if (streak >= 8) this.checkBadge('streak_master');
    this.save();
  },

  updateScore(score) {
    if (score > this.highscore) {
      this.highscore = score;
    }
    if (score >= 100) this.checkBadge('perfect_ten');
    this.save();
  },

  checkBadge(id) {
    if (!this.unlockedBadges.includes(id)) {
      this.unlockedBadges.push(id);
      this.save();
      showBadgeToast(id);
    }
  }
};

function showBadgeToast(id) {
  const badge = badgesData[id];
  if (!badge) return;
  
  const lang = currentLanguage;
  const name = badge[lang].name;
  const desc = badge[lang].desc;
  
  // Play achievement chord chimes
  if (!isMuted) {
    playTone(523.25, 'triangle', 0.12, 0);     // C5
    playTone(659.25, 'triangle', 0.12, 0.08);   // E5
    playTone(783.99, 'triangle', 0.12, 0.16);   // G5
    playTone(1046.50, 'sine', 0.35, 0.24);      // C6
  }

  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'badge-toast';
  toast.innerHTML = `
    <div class="toast-icon">${badge.icon}</div>
    <div class="toast-text">
      <div class="toast-title">${lang === 'en' ? 'Achievement Unlocked!' : 'Lencana Dibuka!'}</div>
      <div class="toast-name">${name}</div>
      <div class="toast-desc">${desc}</div>
    </div>
  `;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3500);
}

function openTrophyCase() {
  playClickSound();
  const dict = translations[currentLanguage];
  
  document.getElementById('trophy-title').textContent = dict.btnTrophy;
  
  const grid = document.getElementById('trophy-grid');
  grid.innerHTML = '';
  
  StatsManager.load();
  
  Object.keys(badgesData).forEach(id => {
    const badge = badgesData[id];
    const isUnlocked = StatsManager.unlockedBadges.includes(id);
    const lang = currentLanguage;
    
    const card = document.createElement('div');
    card.className = `trophy-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    
    card.innerHTML = `
      <div class="trophy-badge-icon">${isUnlocked ? badge.icon : '🔒'}</div>
      <div class="trophy-badge-name">${isUnlocked ? badge[lang].name : (lang === 'en' ? 'Locked 🔒' : 'Terkunci 🔒')}</div>
      <div class="trophy-badge-desc">${isUnlocked ? badge[lang].desc : '???'}</div>
    `;
    grid.appendChild(card);
  });
  
  document.getElementById('trophy-modal').classList.remove('hidden');
}

function closeTrophyCase() {
  playClickSound();
  const trophyModal = document.getElementById('trophy-modal');
  if (trophyModal) {
    trophyModal.classList.add('hidden');
  }
}
window.closeTrophyCase = closeTrophyCase;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const trophyModal = document.getElementById('trophy-modal');
    if (trophyModal && !trophyModal.classList.contains('hidden')) {
      closeTrophyCase();
    }
  }
});

// --- Light/Dark Theme Switcher ---
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-theme');
  const themeIcon = document.querySelector('.theme-icon');

  playClickSound();

  if (isLight) {
    themeIcon.textContent = '☀️';
    localStorage.setItem('selected-theme', 'light');
  } else {
    themeIcon.textContent = '🌙';
    localStorage.setItem('selected-theme', 'dark');
  }
}

// --- Runtime Viewport State Manager (Phase 3) ---
const ViewportManager = {
  rafId: null,
  update() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      const root = document.documentElement;
      const viewport = window.visualViewport;
      const width = Math.round(viewport?.width || window.innerWidth);
      const height = Math.round(viewport?.height || window.innerHeight);
      const isLandscape = window.matchMedia('(orientation: landscape)').matches || width > height;

      root.style.setProperty('--viewport-width', `${width}px`);
      root.style.setProperty('--viewport-height', `${height}px`);
      root.style.setProperty('--viewport-ratio', (width / Math.max(height, 1)).toFixed(3));

      root.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait');

      if (height <= 560) {
        root.setAttribute('data-layout', 'compact');
      } else if (width >= 1600) {
        root.setAttribute('data-layout', 'wide');
      } else {
        root.setAttribute('data-layout', 'standard');
      }

      if (width >= 1920 || (navigator.userAgent && /TV|Android TV|AFT|BRAVIA/i.test(navigator.userAgent))) {
        root.setAttribute('data-display', 'tv-like');
      } else {
        root.setAttribute('data-display', 'touch');
      }

      root.setAttribute('data-app-mode', typeof appMode !== 'undefined' ? appMode : 'menu');
    });
  },
  init() {
    window.addEventListener('resize', () => this.update(), { passive: true });
    window.addEventListener('orientationchange', () => this.update(), { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => this.update(), { passive: true });
    }
    this.update();
  }
};

// --- Initial Startup Bindings ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic viewport tracking
  ViewportManager.init();

  // Initialize dynamic Dial numbers & marks
  initClockFace();

  // Bind increment/decrement buttons
  const adjustBtns = document.querySelectorAll('.adjust-btn');
  adjustBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.getAttribute('data-amount'));
      const unit = btn.getAttribute('data-unit');
      adjustTime(amount, unit);
    });
  });

  // Bind utility buttons
  document.getElementById('btn-random').addEventListener('click', setToRandomTime);
  document.getElementById('btn-now').addEventListener('click', setToNowTime);
  document.getElementById('btn-reset').addEventListener('click', resetTo12);

  // Bind clock type buttons
  document.getElementById('type-analog').addEventListener('click', () => switchClockType('analog'));
  document.getElementById('type-digital-12').addEventListener('click', () => switchClockType('digital12'));
  document.getElementById('type-digital-24').addEventListener('click', () => switchClockType('digital24'));

  // Bind theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Bind language toggle
  document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

  // Bind sound toggle
  document.getElementById('sound-toggle').addEventListener('click', toggleMute);

  // Bind quiz buttons
  document.getElementById('btn-submit-answer').addEventListener('click', checkSetClockAnswer);
  document.getElementById('btn-next-question').addEventListener('click', handleQuizNextClick);

  // Bind drag events to grabs
  const hourGrab = document.querySelector('#hour-hand-group .hand-grab-area');
  const minuteGrab = document.querySelector('#minute-hand-group .hand-grab-area');

  hourGrab.addEventListener('mousedown', (e) => handleDragStart(e, 'hour'));
  hourGrab.addEventListener('touchstart', (e) => handleDragStart(e, 'hour'), { passive: false });
  hourGrab.addEventListener('keydown', (e) => handleHandKeydown(e, 'hour'));
  document.getElementById('hour-hand-group').addEventListener('keydown', (e) => handleHandKeydown(e, 'hour'));

  minuteGrab.addEventListener('mousedown', (e) => handleDragStart(e, 'minute'));
  minuteGrab.addEventListener('touchstart', (e) => handleDragStart(e, 'minute'), { passive: false });
  minuteGrab.addEventListener('keydown', (e) => handleHandKeydown(e, 'minute'));
  document.getElementById('minute-hand-group').addEventListener('keydown', (e) => handleHandKeydown(e, 'minute'));

  // Load stats and achievements
  StatsManager.load();
  MasteryManager.load();

  // Load theme preference
  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.querySelector('.theme-icon').textContent = '☀️';
  }

  // Load sound mute preference
  const savedMute = localStorage.getItem('sound-muted');
  isMuted = savedMute === 'true';
  updateSoundIcon();

  // Load language preference and translate page
  const savedLang = localStorage.getItem('selected-lang') || 'en';
  translatePage(savedLang);

  const savedClockType = localStorage.getItem('clock-type');
  if (['analog', 'digital12', 'digital24'].includes(savedClockType)) {
    switchClockType(savedClockType);
  }

  // Draw initial state
  updateClockVisuals(false);

  // Splash Screen timer (dismiss after 2 seconds)
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
    }
    backToMainMenu();
  }, 2000);
});

// ==========================================================================
// PvP SPEED-DUEL ENGINE & GAME LOOP
// ==========================================================================

let pvpState = {
  p1: {
    hour: 12,
    minute: 0,
    isDragging: false,
    activeDragHand: null,
    prevDragMinute: 0,
    prevDragHourAngle: 0,
    score: 0,
    streak: 0,
    locked: false,
    lockoutTimer: 0,
    lockoutInterval: null
  },
  p2: {
    hour: 12,
    minute: 0,
    isDragging: false,
    activeDragHand: null,
    prevDragMinute: 0,
    prevDragHourAngle: 0,
    score: 0,
    streak: 0,
    locked: false,
    lockoutTimer: 0,
    lockoutInterval: null
  }
};

let pvpRoundNum = 0;
let pvpActiveQuestion = null;
let pvpRoundActive = false;

// Timer state
const PVP_ROUND_TIME_LIMIT = 20; // seconds
let pvpRoundTimeRemaining = PVP_ROUND_TIME_LIMIT;
let pvpTimerInterval = null;

function closePvpIntro() {
  playClickSound();
  document.getElementById('pvp-intro-panel').classList.add('hidden');
  startPvpBattle();
}

function startPvpBattle() {
  // Clear any existing lockout intervals
  clearInterval(pvpState.p1.lockoutInterval);
  clearInterval(pvpState.p2.lockoutInterval);

  // Reset scores and streaks
  pvpState.p1.score = 0;
  pvpState.p1.streak = 0;
  pvpState.p1.locked = false;
  
  pvpState.p2.score = 0;
  pvpState.p2.streak = 0;
  pvpState.p2.locked = false;

  pvpRoundNum = 0;
  pvpRoundActive = true;

  // Refresh HUD displays
  document.getElementById('pvp-p1-score').textContent = '0';
  document.getElementById('pvp-p1-streak').textContent = '0';
  document.getElementById('pvp-p2-score').textContent = '0';
  document.getElementById('pvp-p2-streak').textContent = '0';

  // Hide lockout overlays
  document.getElementById('pvp-p1-lockout').classList.add('hidden');
  document.getElementById('pvp-p2-lockout').classList.add('hidden');
  
  // Hide result modals
  document.getElementById('pvp-round-modal').classList.add('hidden');
  document.getElementById('pvp-match-modal').classList.add('hidden');

  // Generate ticks/numbers for both clocks
  initClockFace('pvp-p1-ticks', 'pvp-p1-numbers');
  initClockFace('pvp-p2-ticks', 'pvp-p2-numbers');

  // Bind drag & adjustment click events
  bindPvpGrabs();

  // Start the very first speed round
  generatePvpQuestion();
}

function bindPvpGrabs() {
  const p1HourGrab = document.querySelector('#pvp-p1-hour-hand .hand-grab-area');
  const p1MinGrab = document.querySelector('#pvp-p1-minute-hand .hand-grab-area');
  const p2HourGrab = document.querySelector('#pvp-p2-hour-hand .hand-grab-area');
  const p2MinGrab = document.querySelector('#pvp-p2-minute-hand .hand-grab-area');

  // Remove existing listeners first by cloning (avoids duplicate events)
  const newP1Hour = p1HourGrab.cloneNode(true);
  p1HourGrab.parentNode.replaceChild(newP1Hour, p1HourGrab);
  const newP1Min = p1MinGrab.cloneNode(true);
  p1MinGrab.parentNode.replaceChild(newP1Min, p1MinGrab);

  const newP2Hour = p2HourGrab.cloneNode(true);
  p2HourGrab.parentNode.replaceChild(newP2Hour, p2HourGrab);
  const newP2Min = p2MinGrab.cloneNode(true);
  p2MinGrab.parentNode.replaceChild(newP2Min, p2MinGrab);

  // Bind Player 1 Interactive Grabs
  document.querySelector('#pvp-p1-hour-hand .hand-grab-area').addEventListener('mousedown', (e) => handlePvpDragStart(e, 'p1', 'hour'));
  document.querySelector('#pvp-p1-hour-hand .hand-grab-area').addEventListener('touchstart', (e) => handlePvpDragStart(e, 'p1', 'hour'), { passive: false });
  document.querySelector('#pvp-p1-minute-hand .hand-grab-area').addEventListener('mousedown', (e) => handlePvpDragStart(e, 'p1', 'minute'));
  document.querySelector('#pvp-p1-minute-hand .hand-grab-area').addEventListener('touchstart', (e) => handlePvpDragStart(e, 'p1', 'minute'), { passive: false });

  // Bind Player 2 Interactive Grabs
  document.querySelector('#pvp-p2-hour-hand .hand-grab-area').addEventListener('mousedown', (e) => handlePvpDragStart(e, 'p2', 'hour'));
  document.querySelector('#pvp-p2-hour-hand .hand-grab-area').addEventListener('touchstart', (e) => handlePvpDragStart(e, 'p2', 'hour'), { passive: false });
  document.querySelector('#pvp-p2-minute-hand .hand-grab-area').addEventListener('mousedown', (e) => handlePvpDragStart(e, 'p2', 'minute'));
  document.querySelector('#pvp-p2-minute-hand .hand-grab-area').addEventListener('touchstart', (e) => handlePvpDragStart(e, 'p2', 'minute'), { passive: false });

  // Bind Adjust buttons
  const pvpAdjustBtns = document.querySelectorAll('.pvp-adjust-btn');
  pvpAdjustBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  const updatedPvpAdjustBtns = document.querySelectorAll('.pvp-adjust-btn');
  updatedPvpAdjustBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const player = btn.getAttribute('data-player');
      const amount = parseInt(btn.getAttribute('data-amount'));
      const unit = btn.getAttribute('data-unit');
      adjustPvpTime(player, amount, unit);
    });
  });
}

function generatePvpQuestion() {
  pvpRoundNum++;
  pvpRoundActive = true;
  
  const dict = translations[currentLanguage];
  document.getElementById('pvp-round-indicator').textContent = dict.pvpRoundIndicator.replace('{num}', pvpRoundNum);
  document.getElementById('pvp-round-modal').classList.add('hidden');

  // Determine difficulty level based on round number
  let level = 1;
  if (pvpRoundNum >= 10) level = 4;      // precise minutes
  else if (pvpRoundNum >= 6) level = 3; // 5 minute snapping
  else if (pvpRoundNum >= 3) level = 2; // quarters and half hours

  // Toss question type
  const qType = Math.random() > 0.5 ? 'set' : 'read';

  let targetHour = Math.floor(Math.random() * 24);
  let targetMinute = 0;

  if (level === 1) {
    targetMinute = 0;
  } else if (level === 2) {
    const options = [0, 15, 30, 45];
    targetMinute = options[Math.floor(Math.random() * options.length)];
  } else if (level === 3) {
    targetMinute = Math.floor(Math.random() * 12) * 5;
  } else {
    targetMinute = Math.floor(Math.random() * 60);
  }

  const isPM = targetHour >= 12;
  const hour12 = targetHour % 12 === 0 ? 12 : targetHour % 12;
  const ampmStr = isPM ? 'PM' : 'AM';
  const minStr = targetMinute.toString().padStart(2, '0');

  pvpActiveQuestion = {
    type: qType,
    hour: targetHour,
    minute: targetMinute,
    isPM: isPM,
    hour12: hour12,
    timeStr12h: `${hour12}:${minStr} ${ampmStr}`,
    timeStr24h: `${targetHour.toString().padStart(2, '0')}:${minStr}`
  };

  // Wire HTML Panels
  const hudPrompt = document.getElementById('pvp-shared-prompt');
  const p1AdjustCard = document.querySelector('#pvp-p1-panel .pvp-adjustments-card');
  const p2AdjustCard = document.querySelector('#pvp-p2-panel .pvp-adjustments-card');
  const p1Choices = document.getElementById('pvp-p1-choices');
  const p2Choices = document.getElementById('pvp-p2-choices');
  const p1SubmitPanel = document.getElementById('pvp-p1-submit-panel');
  const p2SubmitPanel = document.getElementById('pvp-p2-submit-panel');

  if (qType === 'set') {
    hudPrompt.textContent = dict.pvpPromptPrefix.replace('{time}', pvpActiveQuestion.timeStr12h);
    
    p1AdjustCard.style.opacity = '1';
    p1AdjustCard.style.pointerEvents = 'auto';
    p2AdjustCard.style.opacity = '1';
    p2AdjustCard.style.pointerEvents = 'auto';
    
    p1Choices.classList.add('hidden');
    p2Choices.classList.add('hidden');
    p1SubmitPanel.classList.remove('hidden');
    p2SubmitPanel.classList.remove('hidden');

    // Scatter hands
    pvpState.p1.hour = (targetHour + 6) % 24;
    pvpState.p1.minute = (targetMinute + 30) % 60;
    pvpState.p2.hour = (targetHour + 4) % 24;
    pvpState.p2.minute = (targetMinute + 15) % 60;

  } else {
    hudPrompt.textContent = dict.readPrompt;

    p1AdjustCard.style.opacity = '0.4';
    p1AdjustCard.style.pointerEvents = 'none';
    p2AdjustCard.style.opacity = '0.4';
    p2AdjustCard.style.pointerEvents = 'none';

    p1Choices.classList.remove('hidden');
    p2Choices.classList.remove('hidden');
    p1SubmitPanel.classList.add('hidden');
    p2SubmitPanel.classList.add('hidden');

    // Place needles exactly on target
    pvpState.p1.hour = targetHour;
    pvpState.p1.minute = targetMinute;
    pvpState.p2.hour = targetHour;
    pvpState.p2.minute = targetMinute;

    const choices = generateMultipleChoiceOptions(pvpActiveQuestion);
    
    // Setup P1 Choice Buttons
    p1Choices.innerHTML = '';
    choices.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      const parts = opt.split(' ');
      btn.innerHTML = `${parts[0]} <span class="choice-ampm">${parts[1] || ''}</span>`;
      btn.onclick = () => submitPvpChoice('p1', opt, btn);
      p1Choices.appendChild(btn);
    });

    // Setup P2 Choice Buttons
    p2Choices.innerHTML = '';
    choices.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      const parts = opt.split(' ');
      btn.innerHTML = `${parts[0]} <span class="choice-ampm">${parts[1] || ''}</span>`;
      btn.onclick = () => submitPvpChoice('p2', opt, btn);
      p2Choices.appendChild(btn);
    });
  }

  // Update clock rendering
  updatePvpClockVisuals('p1', false);
  updatePvpClockVisuals('p2', false);

  // --- Start round countdown timer ---
  clearInterval(pvpTimerInterval);
  pvpRoundTimeRemaining = PVP_ROUND_TIME_LIMIT;

  const timerBar = document.getElementById('pvp-timer-bar');
  const timerText = document.getElementById('pvp-round-timer-text');
  timerBar.style.width = '100%';
  timerBar.classList.remove('warning');
  timerText.textContent = `${PVP_ROUND_TIME_LIMIT}s`;

  pvpTimerInterval = setInterval(() => {
    pvpRoundTimeRemaining -= 0.1;
    if (pvpRoundTimeRemaining <= 0) {
      pvpRoundTimeRemaining = 0;
      clearInterval(pvpTimerInterval);
      handlePvpRoundTie();
    }

    const pct = Math.max(0, (pvpRoundTimeRemaining / PVP_ROUND_TIME_LIMIT) * 100);
    timerBar.style.width = `${pct}%`;
    timerText.textContent = `${Math.ceil(pvpRoundTimeRemaining)}s`;

    if (pvpRoundTimeRemaining <= 5 && !timerBar.classList.contains('warning')) {
      timerBar.classList.add('warning');
    }
  }, 100);
}

function updatePvpClockVisuals(player, isDraggingState = false) {
  const pState = pvpState[player];
  const hourHandGroup = document.getElementById(`pvp-${player}-hour-hand`);
  const minuteHandGroup = document.getElementById(`pvp-${player}-minute-hand`);
  const ampmBadge = document.getElementById(`pvp-${player}-ampm`);
  const digitalTimeStr = document.getElementById(`pvp-${player}-digital-time`);
  const digitalAmPmStr = document.getElementById(`pvp-${player}-digital-ampm`);

  // Highlight number on dial
  const hour12Display = pState.hour % 12 === 0 ? 12 : pState.hour % 12;
  const numbers = document.querySelectorAll(`#pvp-${player}-numbers .clock-number-text`);
  numbers.forEach(num => {
    if (parseInt(num.getAttribute('data-hour')) === hour12Display) {
      num.classList.add('highlight');
    } else {
      num.classList.remove('highlight');
    }
  });

  const mAngle = pState.minute * 6;
  const hAngle = (pState.hour % 12) * 30 + pState.minute * 0.5;

  if (isDraggingState) {
    hourHandGroup.classList.remove('animating');
    minuteHandGroup.classList.remove('animating');
  } else {
    hourHandGroup.classList.add('animating');
    minuteHandGroup.classList.add('animating');
  }

  hourHandGroup.setAttribute('transform', `rotate(${hAngle} 200 200)`);
  minuteHandGroup.setAttribute('transform', `rotate(${mAngle} 200 200)`);
  const pvpHour12Display = pState.hour % 12 === 0 ? 12 : pState.hour % 12;
  hourHandGroup.setAttribute('aria-valuenow', pvpHour12Display);
  minuteHandGroup.setAttribute('aria-valuenow', pState.minute);
  hourHandGroup.setAttribute('aria-valuetext', `${pvpHour12Display}:${pState.minute.toString().padStart(2, '0')} ${pState.hour >= 12 ? 'PM' : 'AM'}`);
  minuteHandGroup.setAttribute('aria-valuetext', `${pState.minute} minutes`);

  const isPM = pState.hour >= 12;
  ampmBadge.textContent = isPM ? 'PM' : 'AM';
  ampmBadge.style.background = isPM ? 'var(--primary)' : 'var(--accent-blue)';
  ampmBadge.style.boxShadow = isPM ? '0 4px 15px var(--primary-glow)' : '0 4px 15px var(--accent-blue-glow)';

  const minStr = pState.minute.toString().padStart(2, '0');
  const formattedHour = hour12Display.toString().padStart(2, '0');
  digitalTimeStr.textContent = `${formattedHour}:${minStr}`;
  digitalAmPmStr.textContent = isPM ? 'PM' : 'AM';
}

function adjustPvpTime(player, amount, unit) {
  const pState = pvpState[player];
  if (pState.locked) return;
  playClickSound();

  if (unit === 'minute') {
    pState.minute += amount;
    while (pState.minute >= 60) {
      pState.minute -= 60;
      pState.hour = (pState.hour + 1) % 24;
    }
    while (pState.minute < 0) {
      pState.minute += 60;
      pState.hour = (pState.hour - 1 + 24) % 24;
    }
  } else if (unit === 'hour') {
    pState.hour = (pState.hour + amount + 24) % 24;
  }

  updatePvpClockVisuals(player, false);
}

function getPvpAngleFromEvent(event, player) {
  const clockSvg = document.getElementById(`pvp-${player}-clock-svg`);
  const rect = clockSvg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let clientX, clientY;
  if (event.touches) {
    let touch = event.touches[0];
    if (event.changedTouches && event.changedTouches.length > 0) {
      // Trace which touch is inside this player's SVG panel bounds
      for (let i = 0; i < event.changedTouches.length; i++) {
        const t = event.changedTouches[i];
        const target = document.elementFromPoint(t.clientX, t.clientY);
        if (target && target.closest(`#pvp-${player}-clock-svg`)) {
          touch = t;
          break;
        }
      }
    }
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const dx = clientX - centerX;
  const dy = clientY - centerY;
  let angleRad = Math.atan2(dy, dx);
  let angleDeg = angleRad * (180 / Math.PI);

  let clockAngle = angleDeg + 90;
  if (clockAngle < 0) {
    clockAngle += 360;
  }
  return clockAngle;
}

function handlePvpDragStart(event, player, handType) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const pState = pvpState[player];
  if (pState.locked) return;

  pState.isDragging = true;
  pState.activeDragHand = handType;
  pState.prevDragMinute = pState.minute;
  pState.prevDragHourAngle = (pState.hour % 12) * 30 + pState.minute * 0.5;

  const moveHandler = (e) => handlePvpDragMove(e, player);
  const endHandler = () => handlePvpDragEnd(player, moveHandler, endHandler);

  window.addEventListener('mousemove', moveHandler, { passive: false });
  window.addEventListener('touchmove', moveHandler, { passive: false });
  window.addEventListener('mouseup', endHandler);
  window.addEventListener('touchend', endHandler);

  event.preventDefault();
}

function handlePvpDragMove(event, player) {
  const pState = pvpState[player];
  if (!pState.isDragging || pState.locked) return;
  event.preventDefault();

  const clockAngle = getPvpAngleFromEvent(event, player);

  if (pState.activeDragHand === 'minute') {
    const exactMinutes = clockAngle / 6;
    let roundedMinutes = Math.round(exactMinutes) % 60;

    if (pState.prevDragMinute >= 45 && pState.prevDragMinute <= 59 && roundedMinutes >= 0 && roundedMinutes <= 15) {
      pState.hour = (pState.hour + 1) % 24;
    } else if (pState.prevDragMinute >= 0 && pState.prevDragMinute <= 15 && roundedMinutes >= 45 && roundedMinutes <= 59) {
      pState.hour = (pState.hour - 1 + 24) % 24;
    }

    pState.minute = roundedMinutes;
    pState.prevDragMinute = pState.minute;

  } else if (pState.activeDragHand === 'hour') {
    const exactMinutesFractional = (clockAngle / 360) * 720;
    let snappedMinutes = Math.round(exactMinutesFractional);
    if (snappedMinutes >= 720) snappedMinutes = 0;

    const targetHour12 = Math.floor(snappedMinutes / 60);
    const targetMinute = snappedMinutes % 60;

    const currentHourAngle = clockAngle;
    const diff = currentHourAngle - pState.prevDragHourAngle;

    if (diff < -300) {
      pState.hour = (pState.hour + 12) % 24;
    } else if (diff > 300) {
      pState.hour = (pState.hour - 12 + 24) % 24;
    }

    const isPM = pState.hour >= 12;
    pState.hour = (targetHour12 % 12) + (isPM ? 12 : 0);
    pState.minute = targetMinute;
    pState.prevDragHourAngle = currentHourAngle;
  }

  updatePvpClockVisuals(player, true);
}

function handlePvpDragEnd(player, moveHandler, endHandler) {
  const pState = pvpState[player];
  pState.isDragging = false;
  pState.activeDragHand = null;

  updatePvpClockVisuals(player, false);

  window.removeEventListener('mousemove', moveHandler);
  window.removeEventListener('touchmove', moveHandler);
  window.removeEventListener('mouseup', endHandler);
  window.removeEventListener('touchend', endHandler);
}

function submitPvpAnswer(player) {
  if (!pvpRoundActive) return;
  const pState = pvpState[player];
  if (pState.locked) return;

  const currH12 = pState.hour % 12 === 0 ? 12 : pState.hour % 12;
  const currMin = pState.minute;
  const currIsPM = pState.hour >= 12;

  const targetH12 = pvpActiveQuestion.hour12;
  const targetMin = pvpActiveQuestion.minute;
  const targetIsPM = pvpActiveQuestion.isPM;

  const isCorrect = (currH12 === targetH12 && currMin === targetMin && currIsPM === targetIsPM);

  if (isCorrect) {
    handlePvpRoundWin(player);
  } else {
    handlePvpLockout(player);
  }
}

function submitPvpChoice(player, selectedValue, buttonElement) {
  if (!pvpRoundActive) return;
  const pState = pvpState[player];
  if (pState.locked) return;

  const isCorrect = (selectedValue === pvpActiveQuestion.timeStr12h);

  if (isCorrect) {
    buttonElement.classList.add('correct');
    handlePvpRoundWin(player);
  } else {
    buttonElement.classList.add('incorrect');
    handlePvpLockout(player);
  }
}

function handlePvpRoundWin(player) {
  pvpRoundActive = false;
  clearInterval(pvpTimerInterval);
  
  // Custom round-winning chord chimes
  playTone(587.33, 'sine', 0.2, 0);       // D5
  playTone(739.99, 'sine', 0.2, 0.05);    // F#5
  playTone(880, 'sine', 0.2, 0.1);        // A5
  playTone(1174.66, 'sine', 0.3, 0.15);   // D6

  triggerPvpCelebration(player);

  pvpState[player].score++;
  pvpState[player].streak++;
  
  const opponent = (player === 'p1') ? 'p2' : 'p1';
  pvpState[opponent].streak = 0;

  document.getElementById('pvp-p1-score').textContent = pvpState.p1.score;
  document.getElementById('pvp-p1-streak').textContent = pvpState.p1.streak;
  document.getElementById('pvp-p2-score').textContent = pvpState.p2.score;
  document.getElementById('pvp-p2-streak').textContent = pvpState.p2.streak;

  const dict = translations[currentLanguage];
  const pName = (player === 'p1') ? dict.pvpP1Name : dict.pvpP2Name;
  const modal = document.getElementById('pvp-round-modal');
  const title = document.getElementById('pvp-modal-title');
  const desc = document.getElementById('pvp-modal-desc');

  title.textContent = dict.pvpWinnerRound.replace('{player}', pName);
  title.className = `pvp-modal-title ${player === 'p1' ? 'cyan-glow-text' : 'magenta-glow-text'}`;
  desc.textContent = dict.pvpWinnerRoundDesc.replace('{time}', pvpActiveQuestion.timeStr12h);
  modal.classList.remove('hidden');

  if (pvpState[player].score >= 5) {
    setTimeout(() => {
      endPvpMatch(player);
    }, 1500);
  } else {
    setTimeout(() => {
      generatePvpQuestion();
    }, 1800);
  }
}

function triggerPvpCelebration(player) {
  particles = [];
  const startX = (player === 'p1') ? window.innerWidth * 0.25 : window.innerWidth * 0.75;
  const startY = window.innerHeight / 2;
  
  for (let i = 0; i < 80; i++) {
    particles.push(new ConfettiParticle(startX, startY));
  }
  
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animateParticles();
}

function handlePvpLockout(player) {
  const pState = pvpState[player];
  pState.locked = true;

  // Short dual-buzzing warning tones
  playTone(120, 'triangle', 0.4, 0);
  playTone(100, 'triangle', 0.4, 0.08);

  const overlay = document.getElementById(`pvp-${player}-lockout`);
  const timerText = document.getElementById(`pvp-${player}-lockout-timer`);
  overlay.classList.remove('hidden');

  pState.lockoutTimer = 2.0;
  timerText.textContent = '2.0s';

  clearInterval(pState.lockoutInterval);
  pState.lockoutInterval = setInterval(() => {
    pState.lockoutTimer -= 0.1;
    if (pState.lockoutTimer <= 0) {
      clearInterval(pState.lockoutInterval);
      pState.locked = false;
      overlay.classList.add('hidden');
    } else {
      timerText.textContent = `${pState.lockoutTimer.toFixed(1)}s`;
    }
  }, 100);
}

function handlePvpRoundTie() {
  if (!pvpRoundActive) return;
  pvpRoundActive = false;
  clearInterval(pvpTimerInterval);

  // Clear any active lockouts
  clearInterval(pvpState.p1.lockoutInterval);
  clearInterval(pvpState.p2.lockoutInterval);
  pvpState.p1.locked = false;
  pvpState.p2.locked = false;
  document.getElementById('pvp-p1-lockout').classList.add('hidden');
  document.getElementById('pvp-p2-lockout').classList.add('hidden');

  // Timeout buzzer tones
  playTone(200, 'sawtooth', 0.5, 0);
  playTone(150, 'sawtooth', 0.6, 0.15);

  // Reset streaks for both players
  pvpState.p1.streak = 0;
  pvpState.p2.streak = 0;
  document.getElementById('pvp-p1-streak').textContent = '0';
  document.getElementById('pvp-p2-streak').textContent = '0';

  const dict = translations[currentLanguage];
  const modal = document.getElementById('pvp-round-modal');
  const title = document.getElementById('pvp-modal-title');
  const desc = document.getElementById('pvp-modal-desc');

  title.textContent = dict.pvpRoundTie;
  title.className = 'pvp-modal-title yellow-glow-text';
  desc.textContent = dict.pvpRoundTieDesc.replace('{time}', pvpActiveQuestion.timeStr12h);
  modal.classList.remove('hidden');

  // Set timer bar to 0
  const timerBar = document.getElementById('pvp-timer-bar');
  const timerText = document.getElementById('pvp-round-timer-text');
  timerBar.style.width = '0%';
  timerText.textContent = '0s';

  setTimeout(() => {
    generatePvpQuestion();
  }, 2200);
}

function endPvpMatch(winner) {
  pvpRoundActive = false;
  document.getElementById('pvp-round-modal').classList.add('hidden');

  // Trigger PvP Challenger badge
  StatsManager.checkBadge('pvp_challenger');

  // Synthesized grand march melody!
  playTone(523.25, 'triangle', 0.15, 0);     // C5
  playTone(523.25, 'triangle', 0.15, 0.15);
  playTone(523.25, 'triangle', 0.15, 0.3);
  playTone(659.25, 'triangle', 0.3, 0.45);   // E5
  playTone(587.33, 'triangle', 0.3, 0.75);   // D5
  playTone(659.25, 'triangle', 0.3, 1.05);   // E5
  playTone(783.99, 'triangle', 0.6, 1.35);   // G5

  triggerGrandPvpFireworks(winner);

  const dict = translations[currentLanguage];
  const modal = document.getElementById('pvp-match-modal');
  const title = document.getElementById('pvp-victory-winner');
  const winnerName = winner === 'p1' ? dict.pvpP1Name : dict.pvpP2Name;
  title.textContent = dict.pvpWinnerMatch.replace('{player}', winnerName);
  title.className = `pvp-victory-title ${winner === 'p1' ? 'cyan-glow-text' : 'magenta-glow-text'}`;
  modal.classList.remove('hidden');
}

function triggerGrandPvpFireworks(winner) {
  particles = [];
  const startX = (winner === 'p1') ? window.innerWidth * 0.25 : window.innerWidth * 0.75;
  
  for (let b = 0; b < 3; b++) {
    setTimeout(() => {
      const y = window.innerHeight * (0.3 + Math.random() * 0.4);
      const x = startX + (Math.random() * 200 - 100);
      for (let i = 0; i < 60; i++) {
        particles.push(new ConfettiParticle(x, y));
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animateParticles();
    }, b * 400);
  }
}

