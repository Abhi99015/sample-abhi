// ========== 1. LOCALSTORAGE MANAGEMENT ==========

const Storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem('cybersafe_' + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem('cybersafe_' + key, JSON.stringify(value));
    } catch (e) {
      console.log('LocalStorage unavailable');
    }
  },
  clear: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cybersafe_')) localStorage.removeItem(key);
      });
    } catch (e) {
      console.log('LocalStorage unavailable');
    }
  }
};

// ========== 2. NAVIGATION SYSTEM ==========

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-page]');
  if (target) {
    e.preventDefault();
    showPage(target.dataset.page);
  }
});

// ========== 3. SCAMS DATABASE (12 Types) ==========

const scamsData = [
  {
    icon: "🔢",
    name: "OTP Scam",
    category: "banking",
    desc: "Fraudsters pretend to be from your bank and trick you into sharing your One-Time Password.",
    signs: [
      "Caller says your account will be blocked",
      "Asks you to read out the OTP",
      "Pressure to act immediately",
      "Threatens to suspend card"
    ],
    tip: "No bank ever asks for your OTP. Hang up and never share it."
  },
  {
    icon: "💸",
    name: "UPI Scam",
    category: "upi",
    desc: "Scammers send fake payment or 'collect' requests so you enter your UPI PIN and lose money.",
    signs: [
      "Request to 'receive' money by entering PIN",
      "Payment sent to you 'by mistake'",
      "Unknown collect request",
      "Stranger asking for UPI help"
    ],
    tip: "You never need a PIN to receive money. Decline unknown requests."
  },
  {
    icon: "🎣",
    name: "Phishing",
    category: "phishing",
    desc: "Fake emails, SMS or websites that look real and steal your login or card details.",
    signs: [
      "Spelling mistakes or odd sender address",
      "Links that don't match the real website",
      "'Account suspended, click here' messages",
      "Urgent action required messages"
    ],
    tip: "Type the official website address yourself instead of clicking links."
  },
  {
    icon: "💼",
    name: "Fake Job Scam",
    category: "jobs",
    desc: "Fake job offers that ask for registration fees, investment, or personal documents.",
    signs: [
      "Job offered without any interview",
      "Asks you to pay a registration fee first",
      "Very high salary for easy work",
      "Work from home with zero experience"
    ],
    tip: "Genuine companies never charge money for a job. Check the company's official site."
  },
  {
    icon: "📱",
    name: "QR Code Scam",
    category: "upi",
    desc: "Fraudsters share QR codes claiming you'll receive money, but scanning one sends money out.",
    signs: [
      "Told to scan a QR code to receive money",
      "QR code sent by an unknown person",
      "Asked to enter your PIN after scanning",
      "QR code found on random posts"
    ],
    tip: "Scanning a QR code is for paying only. Never scan to 'receive' money."
  },
  {
    icon: "☎️",
    name: "Fake Customer Care Scam",
    category: "banking",
    desc: "Fake helpline numbers found online lead to scammers asking for remote access or details.",
    signs: [
      "Number found through a search result or social media",
      "Asks you to install remote-access app",
      "Asks for card details or PIN",
      "Asks to allow screen sharing"
    ],
    tip: "Use only the customer-care number from the official website or your card."
  },
  {
    icon: "💰",
    name: "Investment Scam",
    category: "banking",
    desc: "False promises of high returns on crypto, stocks, or Ponzi schemes.",
    signs: [
      "Guaranteed high returns in short time",
      "Pressure to invest quickly",
      "Recruitment of friends for extra income",
      "Unlicensed investment advisor"
    ],
    tip: "Legitimate investments never guarantee returns. Research before investing."
  },
  {
    icon: "⚖️",
    name: "Digital Arrest Scam",
    category: "phishing",
    desc: "Scammers pose as police/CBI/tax officials claiming you're in legal trouble and demanding payment.",
    signs: [
      "Threat of arrest or legal action",
      "Demand for immediate payment",
      "Video call with fake official",
      "Threatening tone and urgency"
    ],
    tip: "Real officials never call to demand payment. Hang up and call official numbers."
  },
  {
    icon: "📦",
    name: "Parcel/Customs Scam",
    category: "phishing",
    desc: "Fake messages about a pending package requiring payment or verification.",
    signs: [
      "Unexpected package notification",
      "Link to verify or pay customs charges",
      "Urgent action needed message",
      "Sender is not known courier"
    ],
    tip: "Contact the courier directly using official website, never click suspicious links."
  },
  {
    icon: "🎁",
    name: "Lottery/Prize Scam",
    category: "phishing",
    desc: "Notification of winning a prize or lottery you never entered, asking to claim.",
    signs: [
      "Won a prize you never entered",
      "Asked to pay fees to claim prize",
      "Links to suspicious websites",
      "Threatening to expire the offer"
    ],
    tip: "Legitimate lotteries don't ask for payment to claim prizes. Ignore these messages."
  },
  {
    icon: "👥",
    name: "Social Media Account Scam",
    category: "social",
    desc: "Hackers steal your social media account or create fake accounts impersonating you.",
    signs: [
      "Friend requests from your own account",
      "Can't log into your account",
      "Posts you didn't make on your profile",
      "Strangers asking for help from 'your' account"
    ],
    tip: "Use strong passwords, 2FA, and never click suspicious links on social media."
  },
  {
    icon: "💔",
    name: "Romance/Friendship Scam",
    category: "social",
    desc: "Scammers build emotional relationships to eventually ask for money.",
    signs: [
      "Someone online who quickly builds emotional connection",
      "Eventually asks for money for emergency/travel",
      "Refuses video call or reveals contradictions",
      "Keeps asking for more money"
    ],
    tip: "Be cautious of quick relationships. Verify through video calls before sending money."
  }
];

// ========== 4. RENDER SCAMS GRID ==========

function renderScams(filter = 'all', searchTerm = '') {
  const grid = document.getElementById('scamGrid');
  if (!grid) return;

  grid.innerHTML = '';

  let filtered = [...scamsData];

  if (filter !== 'all') {
    filtered = filtered.filter(s => s.category === filter);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.desc.toLowerCase().includes(term)
    );
  }

  filtered.forEach(scam => {
    const card = document.createElement('div');
    card.className = 'scam-card';

    const signsHtml = scam.signs.map(s => `<li>${s}</li>`).join('');
    card.innerHTML = `
      <div class="scam-icon">${scam.icon}</div>
      <h3>${scam.name}</h3>
      <p class="desc">${scam.desc}</p>
      <div class="scam-details">
        <h4>⚠️ Warning Signs</h4>
        <ul>${signsHtml}</ul>
        <div class="tip-box"><b>✅ Safety Tip:</b> ${scam.tip}</div>
      </div>
      <button class="btn learn-btn">Learn More</button>
    `;

    const btn = card.querySelector('.learn-btn');
    const details = card.querySelector('.scam-details');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = details.classList.toggle('open');
      btn.textContent = isOpen ? 'Show Less' : 'Learn More';
      recordScamLearned(scam.name);
    });

    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #a9c3ee; padding: 20px;">No scams found. Try a different search or filter.</p>';
  }
}

function recordScamLearned(scamName) {
  const learned = Storage.get('learnedScams', []);
  if (!learned.includes(scamName)) {
    learned.push(scamName);
    Storage.set('learnedScams', learned);
    updateDashboard();
  }
}

// Initialize search and filters
const scamSearch = document.getElementById('scamSearch');
if (scamSearch) {
  scamSearch.addEventListener('input', (e) => {
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderScams(filter, e.target.value);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const searchTerm = document.getElementById('scamSearch')?.value || '';
    renderScams(btn.dataset.filter, searchTerm);
  });
});

// ========== 5. SAFETY TIPS ==========

const safetyTips = [
  "Never share your OTP (One-Time Password) with anyone, even if they claim to be from your bank.",
  "Always use strong passwords: mix uppercase, lowercase, numbers, and special characters.",
  "Enable two-factor authentication (2FA) on all important accounts for extra security.",
  "Never click on links from unknown senders - type the URL directly into your browser instead.",
  "Verify payment requests by calling the official customer care number, not numbers in messages.",
  "If you're unsure about an offer, check the organization's official website directly.",
  "Keep your software, apps, and operating system updated for security patches.",
  "Be cautious of too-good-to-be-true job offers - legitimate companies conduct proper interviews.",
  "Never share your banking details, card numbers, or CVV with anyone.",
  "Check the sender's email address carefully - scammers often use similar but slightly different addresses.",
  "Don't download files or install apps from unknown sources or suspicious links.",
  "Cover your keyboard when entering PINs at ATMs or public places.",
  "Regularly review your bank statements and transaction history for unauthorized charges.",
  "Use a VPN when connecting to public WiFi networks for safer browsing.",
  "Trust your instincts - if something feels wrong about a message or offer, it probably is."
];

let tipIndex = 0;

function loadTip() {
  tipIndex = Math.floor(Math.random() * safetyTips.length);
  displayTip();
}

function displayTip() {
  const tipDisplay = document.getElementById('tipDisplay');
  if (tipDisplay) {
    tipDisplay.innerHTML = `<p style="font-size: 16px; line-height: 1.6; color: #fff;">${safetyTips[tipIndex]}</p>`;
  }
}

const nextTipBtn = document.getElementById('nextTipBtn');
if (nextTipBtn) {
  nextTipBtn.addEventListener('click', () => {
    tipIndex = (tipIndex + 1) % safetyTips.length;
    displayTip();
  });
}

// ========== 6. QUIZ DATA & FUNCTIONS ==========

const quizData = [
  {
    q: "A caller says he is from your bank and asks for your OTP to 'verify' your account. What should you do?",
    options: ["Share the OTP quickly", "Hang up and never share it", "Share only half the OTP", "Ask him to call later"],
    answer: 1,
    explanation: "Banks NEVER ask for your OTP. Hang up immediately. Your OTP is for your eyes only."
  },
  {
    q: "You get a UPI request saying you will receive a refund if you enter your PIN. What is correct?",
    options: ["Enter the PIN to get the refund", "Ask a friend to enter it", "Decline it - you never need PIN to receive money", "Accept if the amount is small"],
    answer: 2,
    explanation: "You NEVER need to enter your PIN to receive money through UPI. PIN is only for sending money."
  },
  {
    q: "An email says 'Your account is suspended. Click here now!' What is the best action?",
    options: ["Click the link immediately", "Forward it to friends", "Reply with your details", "Ignore the link and visit the official website directly"],
    answer: 3,
    explanation: "Never click links from unknown sources. Always go to the official website directly by typing the URL."
  },
  {
    q: "Which of these is the strongest password?",
    options: ["password123", "Rahul@2024", "Tr33$Bloom!Lake#91", "12345678"],
    answer: 2,
    explanation: "Strong passwords have mix of uppercase, lowercase, numbers, and special characters, and are longer."
  },
  {
    q: "A stranger asks you to scan a QR code to receive money. What does scanning actually do?",
    options: ["Nothing, it is completely safe", "It may send money from your account", "It adds money to your account", "It blocks your account"],
    answer: 1,
    explanation: "Scanning a QR code is typically for PAYING. You never need to scan a QR to RECEIVE money."
  },
  {
    q: "You get a job offer with ₹50,000/month for work-from-home without any interview. What is the risk?",
    options: ["It's a great opportunity", "It's likely a fake job scam asking for registration fees", "You should immediately send your documents", "Interview will come later"],
    answer: 1,
    explanation: "Genuine jobs always have proper interviews and verification. High salary for no work is a red flag."
  },
  {
    q: "What should you do if you receive a message from your own number?",
    options: ["Reply to the message", "Click any links in it", "Your account may be hacked - change password immediately and enable 2FA", "Ignore it, it's normal"],
    answer: 2,
    explanation: "Messages from your own number indicate your account is compromised. Change password and enable 2FA immediately."
  },
  {
    q: "A police officer calls saying you're in legal trouble and demands ₹50,000 immediately. What is this?",
    options: ["A real arrest warrant", "A digital arrest scam", "A legitimate verification call", "A government tax notification"],
    answer: 1,
    explanation: "Real police don't call demanding immediate payment. This is a scam. Hang up and call official numbers if concerned."
  },
  {
    q: "Which is the best way to protect your online accounts?",
    options: ["Use the same password for all accounts", "Write passwords on paper kept in wallet", "Use unique strong passwords and enable 2FA", "Use your name and birthdate as password"],
    answer: 2,
    explanation: "Use unique, strong passwords for each account and enable two-factor authentication for extra security."
  },
  {
    q: "Someone online builds a relationship with you and asks to send money for an emergency. What should you do?",
    options: ["Send money immediately to help", "Ask for a video call to verify and be cautious of this common romance scam", "Send money through untraceable methods", "Give them your bank details"],
    answer: 1,
    explanation: "This is a romance/friendship scam. Verify through video calls and never send money to strangers."
  }
];

let quizCurrent = 0;
let quizScore = 0;
let quizSelected = -1;
let quizLocked = false;

function loadQuizQuestion() {
  const item = quizData[quizCurrent];
  quizSelected = -1;
  quizLocked = false;
  const nextBtn = document.getElementById('nextBtn');
  if (!nextBtn) return;

  nextBtn.disabled = true;
  nextBtn.textContent = quizCurrent === quizData.length - 1 ? 'Finish' : 'Next';

  const quizCount = document.getElementById('quizCount');
  const progressFill = document.getElementById('progressFill');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizOptions = document.getElementById('quizOptions');

  if (quizCount) quizCount.textContent = `Question ${quizCurrent + 1}/${quizData.length}`;
  if (progressFill) progressFill.style.width = (quizCurrent / quizData.length * 100) + '%';
  if (quizQuestion) {
    quizQuestion.textContent = item.q;
    quizQuestion.style.opacity = '1';
  }
  if (quizFeedback) quizFeedback.classList.add('hidden');

  if (quizOptions) {
    quizOptions.innerHTML = '';

    item.options.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        if (quizLocked) return;
        quizSelected = i;
        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        nextBtn.disabled = false;
      });
      quizOptions.appendChild(btn);
    });
  }
}

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (quizSelected === -1 || quizLocked) return;
    quizLocked = true;

    const item = quizData[quizCurrent];
    const isCorrect = quizSelected === item.answer;

    if (isCorrect) quizScore++;

    const feedback = document.getElementById('quizFeedback');
    const quizQuestion = document.getElementById('quizQuestion');

    if (feedback) {
      feedback.classList.remove('hidden', 'incorrect');
      if (!isCorrect) feedback.classList.add('incorrect');
      feedback.innerHTML = `
        <h4>${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</h4>
        <p><strong>Explanation:</strong> ${item.explanation}</p>
      `;
    }

    if (quizQuestion) quizQuestion.style.opacity = '0.6';
    document.querySelectorAll('.option').forEach(o => o.disabled = true);
    nextBtn.disabled = true;

    setTimeout(() => {
      quizCurrent++;
      if (quizCurrent < quizData.length) {
        loadQuizQuestion();
      } else {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = '100%';
        showQuizResult();
      }
    }, 2000);
  });
}

function showQuizResult() {
  const quizBox = document.getElementById('quizBox');
  const quizResult = document.getElementById('quizResult');

  if (quizBox) quizBox.classList.add('hidden');
  if (quizResult) quizResult.classList.remove('hidden');

  const percentage = Math.round((quizScore / quizData.length) * 100);
  const finalScore = document.getElementById('finalScore');
  if (finalScore) finalScore.textContent = `Your Score: ${quizScore}/${quizData.length} (${percentage}%)`;

  let level, advice;
  if (percentage >= 90) {
    level = '🏆 Cyber Safety Expert';
    advice = 'Excellent! You have strong cybersecurity awareness. Keep learning and share your knowledge with others.';
  } else if (percentage >= 70) {
    level = '🟢 Cyber Smart';
    advice = 'Good job! You understand most cybersecurity concepts. Review the areas you need improvement in.';
  } else if (percentage >= 40) {
    level = '🟡 Aware';
    advice = 'You have basic cybersecurity awareness but need to improve. Review the lessons and take the quiz again.';
  } else {
    level = '🔴 Beginner';
    advice = "You're starting your cybersecurity journey. Go through the learning materials and quiz again.";
  }

  const finalLevel = document.getElementById('finalLevel');
  const finalAdvice = document.getElementById('finalAdvice');
  if (finalLevel) finalLevel.textContent = `Your Cyber Safety Level: ${level}`;
  if (finalAdvice) finalAdvice.textContent = advice;

  Storage.set('quizScore', quizScore);
  Storage.set('quizAttempts', (Storage.get('quizAttempts', 0) + 1));
  updateDashboard();
}

const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    quizCurrent = 0;
    quizScore = 0;
    const quizResult = document.getElementById('quizResult');
    const quizBox = document.getElementById('quizBox');
    if (quizResult) quizResult.classList.add('hidden');
    if (quizBox) quizBox.classList.remove('hidden');
    loadQuizQuestion();
  });
}

// ========== 7. SCAM CHECKER ==========

let currentCheckerStep = 1;
let selectedMessageType = '';
let selectedWarnings = [];
let currentMaxPoints = 10;

function startChecker() {
  currentCheckerStep = 1;
  selectedMessageType = '';
  selectedWarnings = [];
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  showCheckerStep(1);
}

function showCheckerStep(step) {
  document.querySelectorAll('.checker-step').forEach(s => s.classList.add('hidden'));
  const stepElement = document.getElementById('step' + step);
  if (stepElement) stepElement.classList.remove('hidden');
}

document.querySelectorAll('.type-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMessageType = card.dataset.type;
    loadWarnings(selectedMessageType);
    showCheckerStep(2);
  });
});

function loadWarnings(messageType) {
  const warnings = {
    sms: [
      { text: "Is the sender unknown?", points: 1 },
      { text: "Is money being requested?", points: 3 },
      { text: "Is an OTP/PIN being requested?", points: 3 },
      { text: "Is there a suspicious link?", points: 2 },
      { text: "Does it create urgency?", points: 2 },
      { text: "Is personal information being requested?", points: 2 },
      { text: "Is the offer too good to be true?", points: 3 }
    ],
    whatsapp: [
      { text: "Is the sender unknown or suspicious?", points: 1 },
      { text: "Does it ask for money or payment?", points: 3 },
      { text: "Is an OTP/PIN being requested?", points: 3 },
      { text: "Does it contain a suspicious link?", points: 2 },
      { text: "Does it create urgency or panic?", points: 2 },
      { text: "Is it a collect request for UPI?", points: 3 },
      { text: "Are you being asked to forward to others?", points: 2 }
    ],
    email: [
      { text: "Is the sender address different from official?", points: 2 },
      { text: "Are there spelling/grammar errors?", points: 1 },
      { text: "Is money or payment being asked?", points: 3 },
      { text: "Does the email ask to click a link or download?", points: 2 },
      { text: "Does it claim urgent action needed?", points: 2 },
      { text: "Does it ask for personal/banking details?", points: 3 },
      { text: "Is the website URL different from official?", points: 2 }
    ],
    call: [
      { text: "Is the caller unknown?", points: 1 },
      { text: "Is an OTP/PIN/password being asked?", points: 3 },
      { text: "Is money or payment being demanded?", points: 3 },
      { text: "Does the caller create urgency/threats?", points: 2 },
      { text: "Are you being asked to grant remote access?", points: 3 },
      { text: "Is the tone aggressive or threatening?", points: 2 },
      { text: "Are banking or personal details being asked?", points: 3 }
    ],
    upi: [
      { text: "Is the payment from an unknown person?", points: 1 },
      { text: "Are you being asked to enter your UPI PIN?", points: 3 },
      { text: "Is it a UPI collect request?", points: 3 },
      { text: "Is the amount unusually large?", points: 2 },
      { text: "Does it claim you received money by mistake?", points: 2 },
      { text: "Is personal/banking info being asked?", points: 3 },
      { text: "Does the payment seem suspicious?", points: 2 }
    ],
    social: [
      { text: "Is the sender unknown or suspicious?", points: 1 },
      { text: "Is money or investment being asked?", points: 3 },
      { text: "Is personal information being asked?", points: 2 },
      { text: "Is there a suspicious link?", points: 2 },
      { text: "Is the message creating urgency?", points: 2 },
      { text: "Is it building romantic/friendly relationship?", points: 2 },
      { text: "Are you asked to move to private chat?", points: 2 }
    ]
  };

  const warningsList = document.getElementById('warningsList');
  if (!warningsList) return;

  warningsList.innerHTML = '';
  selectedWarnings = [];

  const warningsArray = warnings[messageType] || warnings.sms;
  currentMaxPoints = warningsArray.reduce((sum, w) => sum + w.points, 0);

  warningsArray.forEach((warning, index) => {
    const div = document.createElement('div');
    div.className = 'warning-item';
    div.innerHTML = `
      <input type="checkbox" id="warning${index}" name="warning${index}">
      <label for="warning${index}">
        <strong>${warning.text}</strong>
      </label>
    `;

    const checkbox = div.querySelector('input');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedWarnings.push({ text: warning.text, points: warning.points });
      } else {
        selectedWarnings = selectedWarnings.filter(w => w.text !== warning.text);
      }
    });

    warningsList.appendChild(div);
  });
}

const backStep2Btn = document.getElementById('backStep2Btn');
if (backStep2Btn) {
  backStep2Btn.addEventListener('click', () => {
    showCheckerStep(1);
  });
}

const nextStep2Btn = document.getElementById('nextStep2Btn');
if (nextStep2Btn) {
  nextStep2Btn.addEventListener('click', () => {
    if (selectedWarnings.length === 0) {
      alert('Please select at least one warning sign.');
      return;
    }
    calculateRiskScore();
    showCheckerStep(3);
  });
}

function calculateRiskScore() {
  let totalPoints = 0;
  const detectedSigns = [];

  selectedWarnings.forEach(warning => {
    totalPoints += warning.points;
    detectedSigns.push(warning.text);
  });

  let level, css, advice;
  if (totalPoints <= 3) {
    level = "🟢 LOW RISK";
    css = "risk-low";
    advice = "Few warning signs detected, but always stay alert and verify suspicious messages.";
  } else if (totalPoints <= 7) {
    level = "🟡 MEDIUM RISK";
    css = "risk-medium";
    advice = "This message has multiple warning signs. Do not reply, do not click links, and verify through official channels.";
  } else {
    level = "🔴 HIGH RISK";
    css = "risk-high";
    advice = "This is highly likely to be a scam. Do not respond, do not click any links, and block the sender immediately.";
  }

  const signsHtml = detectedSigns.length
    ? `<ul>${detectedSigns.map(s => `<li>${s}</li>`).join('')}</ul>`
    : '<p>No specific warning signs selected.</p>';

  const result = document.getElementById('checkerResult');
  if (!result) return;

  result.className = `panel result ${css}`;
  result.innerHTML = `
    <h3>Risk Analysis Result</h3>
    <div class="risk-label">${level}</div>
    <p><b>Risk Score:</b> ${totalPoints}/${currentMaxPoints}</p>
    <h4>⚠️ Detected Warning Signs:</h4>
    ${signsHtml}
    <h4>📋 Recommended Actions:</h4>
    <ul>
      <li>✅ ${advice}</li>
      <li>✅ Don't share personal information, passwords, or OTPs</li>
      <li>✅ Don't click on any links or download files</li>
      <li>✅ Verify the sender using official contact information</li>
      <li>✅ Report/block the sender on the platform</li>
      <li>✅ If money was lost, contact your bank immediately</li>
    </ul>
  `;
}

const resetCheckerBtn = document.getElementById('resetCheckerBtn');
if (resetCheckerBtn) {
  resetCheckerBtn.addEventListener('click', () => {
    startChecker();
  });
}

// ========== 8. SECURITY TOOLS ==========

const checklistItems = [
  "I don't share OTPs",
  "I don't share UPI PINs",
  "I use strong passwords",
  "I use two-factor authentication",
  "I verify links before clicking",
  "I check the sender before responding",
  "I keep software updated",
  "I avoid unknown downloads",
  "I verify payment requests"
];

const dictionaryTerms = [
  { term: "OTP", definition: "One-Time Password - a unique code sent to your phone/email for verification. Never share it with anyone." },
  { term: "Phishing", definition: "Fraudulent attempts to get your information by pretending to be a trusted source through fake emails, SMS, or websites." },
  { term: "Malware", definition: "Malicious software designed to damage or gain unauthorized access to your device or data." },
  { term: "Firewall", definition: "A security system that monitors and controls incoming and outgoing network traffic on your device or network." },
  { term: "VPN", definition: "Virtual Private Network - encrypts your internet connection for privacy and security, especially on public WiFi." },
  { term: "2FA/2FV", definition: "Two-Factor Authentication - adds an extra security layer by requiring two different verification methods to access your account." },
  { term: "UPI", definition: "Unified Payments Interface - a mobile payment system in India. Never enter your PIN to receive money through UPI." },
  { term: "Social Engineering", definition: "Manipulating people into divulging confidential information by building trust or creating false urgency." },
  { term: "Ransomware", definition: "Malware that encrypts your files and demands payment to unlock them. Keep backups and never pay." },
  { term: "Data Breach", definition: "Unauthorized access to sensitive data. Change passwords immediately if your data is compromised." }
];

function initPasswordChecker() {
  const checkPasswordBtn = document.getElementById('checkPasswordBtn');
  if (!checkPasswordBtn) return;

  checkPasswordBtn.addEventListener('click', () => {
    const password = document.getElementById('passwordInput').value;
    if (!password) {
      alert('Please enter a password to check.');
      return;
    }
    analyzePassword(password);
  });
}

function analyzePassword(password) {
  let strength = 0;
  const criteria = [];

  const checks = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'Contains uppercase letter' },
    { met: /[a-z]/.test(password), text: 'Contains lowercase letter' },
    { met: /[0-9]/.test(password), text: 'Contains numbers' },
    { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), text: 'Contains special characters' }
  ];

  checks.forEach(c => {
    if (c.met) strength++;
    criteria.push(c);
  });

  let strengthLabel, strengthColor;
  if (strength <= 2) {
    strengthLabel = 'Weak';
    strengthColor = 'strength-weak';
  } else if (strength <= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'strength-medium';
  } else {
    strengthLabel = 'Strong';
    strengthColor = 'strength-strong';
  }

  const result = document.getElementById('passwordResult');
  if (!result) return;

  result.classList.remove('hidden');

  const criteriaHtml = criteria.map(c =>
    `<div class="criteria-item ${c.met ? 'met' : 'unmet'}">
      ${c.met ? '✅' : '❌'} ${c.text}
    </div>`
  ).join('');

  result.innerHTML = `
    <div class="strength-label ${strengthColor}">${strengthLabel}</div>
    <div class="strength-bar">
      <div class="strength-fill" style="width: ${(strength / 5) * 100}%"></div>
    </div>
    <div class="criteria-list">
      ${criteriaHtml}
    </div>
    ${strength < 5 ? '<p style="margin-top: 12px; color: #ffb347;">💡 Suggestion: Make your password longer and add more variety of characters.</p>' : ''}
  `;
}

function initChecklist() {
  const container = document.getElementById('checklistContainer');
  if (!container) return;

  container.innerHTML = '';
  const saved = Storage.get('checklist', {});

  checklistItems.forEach((item, index) => {
    const isChecked = saved[index] || false;

    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.innerHTML = `
      <input type="checkbox" id="check${index}" ${isChecked ? 'checked' : ''}>
      <label for="check${index}">${item}</label>
    `;

    const checkbox = div.querySelector('input');
    checkbox.addEventListener('change', () => {
      const checklist = Storage.get('checklist', {});
      checklist[index] = checkbox.checked;
      Storage.set('checklist', checklist);
      updateChecklistProgress();
      updateDashboard();
    });

    container.appendChild(div);
  });

  updateChecklistProgress();
}

function updateChecklistProgress() {
  const checklist = Storage.get('checklist', {});
  const completed = Object.values(checklist).filter(v => v).length;
  const percentage = Math.round((completed / checklistItems.length) * 100);

  const checklistPct = document.getElementById('checklistPct');
  const checklistCount = document.getElementById('checklistCount');
  const safetyPct = document.getElementById('safetyPct');

  if (checklistPct) checklistPct.textContent = percentage + '%';
  if (checklistCount) checklistCount.textContent = completed;
  if (safetyPct) safetyPct.textContent = percentage + '%';
}

function initDictionary() {
  const container = document.getElementById('dictionaryContainer');
  if (!container) return;

  container.innerHTML = '';

  dictionaryTerms.forEach(item => {
    const div = document.createElement('div');
    div.className = 'dict-item';
    div.innerHTML = `
      <div class="dict-term">${item.term}</div>
      <div class="dict-definition">${item.definition}</div>
    `;
    container.appendChild(div);
  });
}

function initializeTools() {
  initPasswordChecker();
  initChecklist();
  initDictionary();
}

// ========== 9. SAFETY SCORE & DASHBOARD ==========

// Quiz score is stored as a raw count (0-10); convert to a percentage here.
function getQuizPercent() {
  const raw = Storage.get('quizScore', 0);
  return Math.round((raw / quizData.length) * 100);
}

function updateSafetyScore() {
  const quizPercent = getQuizPercent();
  const checklistCompleted = Object.values(Storage.get('checklist', {})).filter(v => v).length;
  const checklistScore = Math.round((checklistCompleted / checklistItems.length) * 100);
  const learnedScams = Storage.get('learnedScams', []).length;
  const learnScore = Math.round((learnedScams / scamsData.length) * 100);

  const overallScore = Math.round((quizPercent + checklistScore + learnScore) / 3);

  const overallScoreEl = document.getElementById('overallScore');
  if (overallScoreEl) overallScoreEl.textContent = overallScore;

  const phishingScoreFill = document.getElementById('phishingScoreFill');
  if (phishingScoreFill) phishingScoreFill.style.width = (quizPercent * 0.6) + '%';
  const phishingScorePct = document.getElementById('phishingScorePct');
  if (phishingScorePct) phishingScorePct.textContent = (quizPercent * 0.6).toFixed(0) + '%';

  const upiScoreFill = document.getElementById('upiScoreFill');
  if (upiScoreFill) upiScoreFill.style.width = (checklistScore * 0.6) + '%';
  const upiScorePct = document.getElementById('upiScorePct');
  if (upiScorePct) upiScorePct.textContent = (checklistScore * 0.6).toFixed(0) + '%';

  const socialScoreFill = document.getElementById('socialScoreFill');
  if (socialScoreFill) socialScoreFill.style.width = (learnScore * 0.6) + '%';
  const socialScorePct = document.getElementById('socialScorePct');
  if (socialScorePct) socialScorePct.textContent = (learnScore * 0.6).toFixed(0) + '%';

  Storage.set('safetyScore', overallScore);
}

function updateDashboard() {
  const quizScoreRaw = Storage.get('quizScore', 0);
  const quizAttempts = Storage.get('quizAttempts', 0);
  const checklist = Storage.get('checklist', {});
  const learnedScams = Storage.get('learnedScams', []);

  const quizPercent = getQuizPercent();
  const checklistCompleted = Object.values(checklist).filter(v => v).length;
  const checklistTotal = checklistItems.length;
  const checklistPercent = Math.round((checklistCompleted / checklistTotal) * 100);
  const scamTotal = scamsData.length;
  const learnPercent = Math.round((learnedScams.length / scamTotal) * 100);

  const dashboardScore = Math.round((quizPercent + checklistPercent + learnPercent) / 3);

  const dashboardScoreEl = document.getElementById('dashboardScore');
  if (dashboardScoreEl) dashboardScoreEl.textContent = dashboardScore;

  let rating = 'Beginner';
  if (dashboardScore >= 80) rating = 'Cyber Safety Expert';
  else if (dashboardScore >= 60) rating = 'Cyber Smart';
  else if (dashboardScore >= 40) rating = 'Aware';

  const scoreRating = document.getElementById('scoreRating');
  if (scoreRating) scoreRating.textContent = rating;

  const quizPercentEl = document.getElementById('quizPercent');
  if (quizPercentEl) quizPercentEl.textContent = quizPercent + '%';
  const quizProgressBar = document.getElementById('quizProgressBar');
  if (quizProgressBar) quizProgressBar.style.width = quizPercent + '%';
  const quizDetail = document.getElementById('quizDetail');
  if (quizDetail) quizDetail.textContent = `${quizScoreRaw}/${quizData.length} - ${quizAttempts} attempt${quizAttempts !== 1 ? 's' : ''}`;

  const checklistPercentEl = document.getElementById('checklistPercent');
  if (checklistPercentEl) checklistPercentEl.textContent = checklistPercent + '%';
  const checklistProgressBar = document.getElementById('checklistProgressBar');
  if (checklistProgressBar) checklistProgressBar.style.width = checklistPercent + '%';
  const checklistDetail = document.getElementById('checklistDetail');
  if (checklistDetail) checklistDetail.textContent = `${checklistCompleted}/${checklistTotal} - ${checklistPercent}% complete`;

  const learningPercentEl = document.getElementById('learningPercent');
  if (learningPercentEl) learningPercentEl.textContent = learnPercent + '%';
  const learningProgressBar = document.getElementById('learningProgressBar');
  if (learningProgressBar) learningProgressBar.style.width = learnPercent + '%';
  const learningDetail = document.getElementById('learningDetail');
  if (learningDetail) learningDetail.textContent = `${learnedScams.length}/${scamTotal} - ${learnPercent}% complete`;

  const recommendations = [];
  if (quizAttempts === 0 || quizScoreRaw < 8) recommendations.push('Complete the Cyber Safety Quiz to test your knowledge.');
  if (checklistCompleted < checklistTotal) recommendations.push(`Complete your Safety Checklist (${checklistTotal - checklistCompleted} items remaining).`);
  if (learnedScams.length < scamTotal) recommendations.push(`Explore ${scamTotal - learnedScams.length} more scam types in the Learn section.`);

  const recContainer = document.getElementById('recommendationsContainer');
  if (recContainer) {
    if (recommendations.length === 0) {
      recContainer.innerHTML = '<p style="color: #2ecc71;">🎉 Excellent! You\'re doing great. Keep improving your cyber safety!</p>';
    } else {
      recContainer.innerHTML = recommendations.map(r => `<div class="recommendation">${r}</div>`).join('');
    }
  }

  updateSafetyScore();
}

const clearDataBtn = document.getElementById('clearDataBtn');
if (clearDataBtn) {
  clearDataBtn.addEventListener('click', () => {
    if (confirm('This will clear all your progress data. Are you sure?')) {
      Storage.clear();
      location.reload();
    }
  });
}

// ========== 10. INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
  renderScams();
  loadTip();
  initializeTools();
  loadQuizQuestion();
  startChecker();
  updateDashboard();
});