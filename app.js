// Ahmedabad One Transit Web Application Logic
// Synchronized with Android Jetpack Compose State & Design

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
  });
}

// PWA Install Prompt Handling
let deferredPrompt;
const installBanner = document.getElementById('install-prompt-banner');
const installBtn = document.getElementById('install-pwa-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) installBanner.style.display = 'flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to install:', outcome);
      deferredPrompt = null;
      installBanner.style.display = 'none';
    }
  });
}

// Offline Detection
function updateOnlineStatus() {
  const offlineBanner = document.getElementById('offline-banner');
  if (offlineBanner) {
    offlineBanner.style.display = navigator.onLine ? 'none' : 'block';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Transit Stations Dataset (Exact from TransitData.kt)
const METRO_EW_STATIONS = [
  { id: 'ew_1', name: 'Thaltej Gam', line: 'East-West Line', isInterchange: false, x: 60, y: 220 },
  { id: 'ew_2', name: 'Thaltej', line: 'East-West Line', isInterchange: false, x: 105, y: 225 },
  { id: 'ew_3', name: 'Doordarshan Kendra', line: 'East-West Line', isInterchange: false, x: 150, y: 230 },
  { id: 'ew_4', name: 'Gurukul Road', line: 'East-West Line', isInterchange: false, x: 190, y: 235 },
  { id: 'ew_5', name: 'Gujarat University', line: 'East-West Line', isInterchange: false, x: 230, y: 240 },
  { id: 'ew_6', name: 'Commerce Six Road', line: 'East-West Line', isInterchange: false, x: 265, y: 245 },
  { id: 'ew_7', name: 'SP Stadium', line: 'East-West Line', isInterchange: false, x: 295, y: 250 },
  { id: 'ew_8', name: 'Old High Court', line: 'East-West Line', isInterchange: true, x: 325, y: 255 },
  { id: 'ew_9', name: 'Shahpur', line: 'East-West Line', isInterchange: false, x: 360, y: 260 },
  { id: 'ew_10', name: 'Gheekanta', line: 'East-West Line', isInterchange: false, x: 395, y: 265 },
  { id: 'ew_11', name: 'Kalupur Metro Station', line: 'East-West Line', isInterchange: true, x: 430, y: 270 },
  { id: 'ew_12', name: 'Kankariya East', line: 'East-West Line', isInterchange: false, x: 460, y: 275 },
  { id: 'ew_13', name: 'Apparel Park', line: 'East-West Line', isInterchange: false, x: 485, y: 280 },
  { id: 'ew_14', name: 'Amraiwadi', line: 'East-West Line', isInterchange: false, x: 510, y: 285 },
  { id: 'ew_15', name: 'Rabari Colony', line: 'East-West Line', isInterchange: true, x: 535, y: 290 },
  { id: 'ew_16', name: 'Vastral', line: 'East-West Line', isInterchange: false, x: 555, y: 295 },
  { id: 'ew_17', name: 'Vastral Gam', line: 'East-West Line', isInterchange: false, x: 575, y: 300 }
];

const METRO_NS_STATIONS = [
  { id: 'ns_1', name: 'Motera Stadium', line: 'North-South Line', isInterchange: false, x: 325, y: 40 },
  { id: 'ns_2', name: 'Sabarmati', line: 'North-South Line', isInterchange: true, x: 325, y: 80 },
  { id: 'ns_3', name: 'AEC', line: 'North-South Line', isInterchange: false, x: 325, y: 115 },
  { id: 'ns_4', name: 'Ranip', line: 'North-South Line', isInterchange: true, x: 325, y: 150 },
  { id: 'ns_5', name: 'Vadaj', line: 'North-South Line', isInterchange: false, x: 325, y: 185 },
  { id: 'ns_6', name: 'Vijaynagar', line: 'North-South Line', isInterchange: false, x: 325, y: 210 },
  { id: 'ns_7', name: 'Usmanpura', line: 'North-South Line', isInterchange: false, x: 325, y: 235 },
  { id: 'ns_8', name: 'Old High Court', line: 'North-South Line', isInterchange: true, x: 325, y: 255 },
  { id: 'ns_9', name: 'Gandhigram', line: 'North-South Line', isInterchange: false, x: 325, y: 285 },
  { id: 'ns_10', name: 'Paldi', line: 'North-South Line', isInterchange: true, x: 325, y: 320 },
  { id: 'ns_11', name: 'Shreyas', line: 'North-South Line', isInterchange: false, x: 325, y: 355 },
  { id: 'ns_12', name: 'Rajiv Nagar', line: 'North-South Line', isInterchange: false, x: 325, y: 390 },
  { id: 'ns_13', name: 'Jivraj Park', line: 'North-South Line', isInterchange: false, x: 325, y: 425 },
  { id: 'ns_14', name: 'APMC', line: 'North-South Line', isInterchange: false, x: 325, y: 460 }
];

const BRTS_STATIONS = [
  { id: 'brts_1', name: 'RTO Circle', line: 'BRTS Janmarg', isInterchange: false, x: 260, y: 150 },
  { id: 'brts_2', name: 'Memnagar', line: 'BRTS Janmarg', isInterchange: false, x: 220, y: 190 },
  { id: 'brts_3', name: 'Shivranjani', line: 'BRTS Janmarg', isInterchange: false, x: 190, y: 300 },
  { id: 'brts_4', name: 'ISKCON Cross Road', line: 'BRTS Janmarg', isInterchange: false, x: 120, y: 300 },
  { id: 'brts_5', name: 'Bopal Approach', line: 'BRTS Janmarg', isInterchange: false, x: 70, y: 300 },
  { id: 'brts_6', name: 'Anjali (Vasna)', line: 'BRTS Janmarg', isInterchange: false, x: 280, y: 370 },
  { id: 'brts_7', name: 'Geeta Mandir', line: 'BRTS Janmarg', isInterchange: false, x: 380, y: 330 },
  { id: 'brts_8', name: 'Maninagar', line: 'BRTS Janmarg', isInterchange: false, x: 420, y: 380 },
  { id: 'brts_10', name: 'Rabari Colony', line: 'BRTS Janmarg', isInterchange: true, x: 535, y: 290 }
];

const ALL_STATIONS = [
  ...METRO_EW_STATIONS,
  ...METRO_NS_STATIONS.filter(s => s.id !== 'ns_8'),
  ...BRTS_STATIONS.filter(s => s.id !== 'brts_10')
];

// Live Vehicles Feed
const LIVE_VEHICLES = [
  { id: 'M-422', code: 'EW-101', line: 'East-West Line', mode: 'Metro', next: 'Rabari Colony', speed: 54, status: 'ON TIME', progress: 72 },
  { id: 'M-308', code: 'NS-204', line: 'North-South Line', mode: 'Metro', next: 'Old High Court', speed: 48, status: 'ON TIME', progress: 45 },
  { id: 'B-14', code: 'BRTS 04', line: 'RTO -> Maninagar', mode: 'BRTS', next: 'Shivranjani', speed: 36, status: 'ON TIME', progress: 50 },
  { id: 'A-88', code: 'AMTS 138', line: 'Lal Darwaja -> Bopal', mode: 'AMTS', next: 'Nehrunagar', speed: 28, status: 'SLIGHT DELAY', progress: 65 }
];

// Global Application State (₹1,210 matching preview)
let appState = {
  walletBalance: 1210.00,
  cardBalance: 1210.00,
  isFamily: false,
  passengerCount: 1,
  origin: 'Thaltej Gam',
  destination: 'Rabari Colony',
  mode: 'Metro',
  darkTheme: false,
  activeTicket: {
    id: 'TKT-AHM-9842',
    origin: 'THALTEJ',
    destination: 'OLD HIGH COURT',
    mode: 'Metro',
    platform: '02',
    totalFare: 20,
    passengerCount: 1,
    status: 'ACTIVE',
    validUntil: '2 hours 45 mins'
  },
  tickets: [
    {
      id: 'TKT-AHM-9842',
      origin: 'THALTEJ',
      destination: 'OLD HIGH COURT',
      mode: 'Metro',
      platform: '02',
      totalFare: 20,
      passengerCount: 1,
      status: 'ACTIVE',
      date: 'Today • 10:15 AM'
    },
    {
      id: 'TKT-AHM-7712',
      origin: 'KALUPUR',
      destination: 'SABARMATI',
      mode: 'Combo',
      platform: '01',
      totalFare: 25,
      passengerCount: 2,
      status: 'COMPLETED',
      date: 'Yesterday • 05:40 PM'
    }
  ],
  transactions: [
    { title: 'Metro Ticket Booking', subtitle: 'Thaltej -> Old High Court', amount: -20, date: 'Today' },
    { title: 'UPI Top-Up Added', subtitle: 'GPay • Ref #92837', amount: 500, date: 'Yesterday' },
    { title: 'BRTS Journey Fare', subtitle: 'RTO Circle -> Shivranjani', amount: -15, date: '2 days ago' }
  ]
};

// LocalStorage Persistence
try {
  const saved = localStorage.getItem('ahmedabad_one_state_v2');
  if (saved) {
    const parsed = JSON.parse(saved);
    appState = { ...appState, ...parsed };
  }
} catch (e) {
  console.warn('LocalStorage error:', e);
}

function saveState() {
  try {
    localStorage.setItem('ahmedabad_one_state_v2', JSON.stringify(appState));
  } catch (e) {}
  renderWalletBalances();
}

function renderWalletBalances() {
  const headerBal = document.getElementById('header-wallet-balance');
  const modalBal = document.getElementById('modal-wallet-balance');
  const passBal = document.getElementById('pass-card-balance');
  const bookingBal = document.getElementById('booking-wallet-display');

  if (headerBal) headerBal.textContent = `₹${Math.round(appState.walletBalance).toLocaleString('en-IN')}`;
  if (modalBal) modalBal.textContent = `₹${appState.walletBalance.toFixed(2)}`;
  if (passBal) passBal.textContent = `₹${appState.cardBalance.toFixed(2)}`;
  if (bookingBal) bookingBal.textContent = `₹${appState.walletBalance.toFixed(2)} Available`;
}

// Fare Calculation Algorithm (Exact from TransitData.kt)
function calculateFare(origin, destination, mode, isFamily, count) {
  if (!origin || !destination || origin === destination) {
    return isFamily ? 30 : 10;
  }
  const origIdx = ALL_STATIONS.findIndex(s => s.name.toLowerCase() === origin.toLowerCase());
  const destIdx = ALL_STATIONS.findIndex(s => s.name.toLowerCase() === destination.toLowerCase());
  const hops = (origIdx !== -1 && destIdx !== -1) ? Math.max(1, Math.abs(destIdx - origIdx)) : 4;

  let baseFare = 10;
  if (mode === 'Metro') {
    baseFare = 5 + Math.min(25, hops * 2);
  } else if (mode === 'BRTS') {
    baseFare = 4 + Math.min(20, hops * 1.5);
  } else if (mode === 'AMTS') {
    baseFare = 3 + Math.min(18, hops * 1.2);
  } else {
    // Combo 3-in-1
    baseFare = 10 + Math.min(35, hops * 2.5);
  }

  const discounted = (mode === 'Combo') ? baseFare * 0.90 : baseFare;
  const multiplier = isFamily ? Math.max(2, count) : 1;
  return Math.round(discounted * multiplier);
}

// Navigation Screen Switcher (Unified Desktop & Mobile)
function switchScreen(targetScreen) {
  document.querySelectorAll('.nav-item').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-screen') === targetScreen);
  });
  document.querySelectorAll('.top-nav-link').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-screen') === targetScreen);
  });
  document.querySelectorAll('.screen-view').forEach((s) => s.classList.remove('active'));

  const screenEl = document.getElementById(targetScreen);
  if (screenEl) {
    screenEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (targetScreen === 'screen-map') {
    renderTransitMap('All');
  } else if (targetScreen === 'screen-tickets') {
    renderTicketsHistory();
  }
}

document.querySelectorAll('.nav-item, .top-nav-link').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetScreen = btn.getAttribute('data-screen');
    if (targetScreen) switchScreen(targetScreen);
  });
});

document.getElementById('top-brand-btn')?.addEventListener('click', () => switchScreen('screen-home'));

// Modals Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('.modal-close-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-close');
    closeModal(id);
  });
});

// Top bar profile and wallet shortcuts
document.getElementById('top-wallet-btn')?.addEventListener('click', () => openModal('modal-profile-wallet'));
document.getElementById('top-profile-btn')?.addEventListener('click', () => openModal('modal-profile-wallet'));

// Home Screen Hero Card Interactions
const heroSingleBtn = document.getElementById('hero-toggle-single');
const heroFamilyBtn = document.getElementById('hero-toggle-family');
const heroCtaLabel = document.getElementById('hero-cta-label');

heroSingleBtn?.addEventListener('click', () => {
  appState.isFamily = false;
  heroSingleBtn.classList.add('active');
  heroFamilyBtn.classList.remove('active');
  if (heroCtaLabel) heroCtaLabel.textContent = 'Select & Book Ticket';
});

heroFamilyBtn?.addEventListener('click', () => {
  appState.isFamily = true;
  appState.passengerCount = Math.max(2, appState.passengerCount);
  heroFamilyBtn.classList.add('active');
  heroSingleBtn.classList.remove('active');
  if (heroCtaLabel) heroCtaLabel.textContent = 'Book Family Tickets (Group)';
});

// Swap stations on Hero
document.getElementById('hero-swap-stations-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const temp = appState.origin;
  appState.origin = appState.destination;
  appState.destination = temp;

  document.getElementById('hero-origin-text').textContent = appState.origin;
  document.getElementById('hero-dest-text').textContent = appState.destination;
});

// Hero rows click to open Booking Modal
document.getElementById('hero-origin-row')?.addEventListener('click', () => {
  openModal('modal-book-ticket');
});
document.getElementById('hero-dest-row')?.addEventListener('click', () => {
  openModal('modal-book-ticket');
});
document.getElementById('hero-book-ticket-btn')?.addEventListener('click', () => {
  openModal('modal-book-ticket');
});

// "Fare Enquiry" Card click
document.getElementById('home-fare-enquiry-btn')?.addEventListener('click', () => {
  updateFareEnquiryCalculation();
  openModal('modal-fare-enquiry');
});

// 4-Grid Action Buttons
document.getElementById('action-trip-planner')?.addEventListener('click', () => openModal('modal-trip-planner'));
document.getElementById('action-timetable')?.addEventListener('click', () => openModal('modal-timetable'));
document.getElementById('action-helpbot')?.addEventListener('click', () => openModal('modal-helpbot'));
document.getElementById('action-travers')?.addEventListener('click', () => openModal('modal-travers'));

// QR View
document.getElementById('home-view-qr-btn')?.addEventListener('click', () => {
  renderActiveQrCode();
  openModal('modal-qr-view');
});
document.getElementById('ticket-tab-book-btn')?.addEventListener('click', () => openModal('modal-book-ticket'));

// Populate Station Dropdowns
function populateAllStationSelects() {
  const selects = [
    'fare-origin-select', 'fare-dest-select',
    'booking-origin-select', 'booking-dest-select',
    'planner-origin-select', 'planner-dest-select'
  ];

  selects.forEach((selId) => {
    const el = document.getElementById(selId);
    if (!el) return;
    el.innerHTML = '';
    ALL_STATIONS.forEach((st) => {
      const opt = document.createElement('option');
      opt.value = st.name;
      opt.textContent = `${st.name} (${st.line})`;
      el.appendChild(opt);
    });
  });

  // Set defaults
  const fareOrig = document.getElementById('fare-origin-select');
  const fareDest = document.getElementById('fare-dest-select');
  const bookOrig = document.getElementById('booking-origin-select');
  const bookDest = document.getElementById('booking-dest-select');
  const planOrig = document.getElementById('planner-origin-select');
  const planDest = document.getElementById('planner-dest-select');

  if (fareOrig) fareOrig.value = 'Thaltej Gam';
  if (fareDest) fareDest.value = 'Rabari Colony';
  if (bookOrig) bookOrig.value = appState.origin;
  if (bookDest) bookDest.value = appState.destination;
  if (planOrig) planOrig.value = 'Thaltej Gam';
  if (planDest) planDest.value = 'Old High Court';
}

// Fare Enquiry Calculation
function updateFareEnquiryCalculation() {
  const orig = document.getElementById('fare-origin-select')?.value || 'Thaltej Gam';
  const dest = document.getElementById('fare-dest-select')?.value || 'Rabari Colony';

  const mPrice = calculateFare(orig, dest, 'Metro', false, 1);
  const bPrice = calculateFare(orig, dest, 'BRTS', false, 1);
  const aPrice = calculateFare(orig, dest, 'AMTS', false, 1);
  const cPrice = calculateFare(orig, dest, 'Combo', false, 1);

  const metroEl = document.getElementById('fare-metro-price');
  const brtsEl = document.getElementById('fare-brts-price');
  const amtsEl = document.getElementById('fare-amts-price');
  const comboEl = document.getElementById('fare-combo-price');

  if (metroEl) metroEl.textContent = `₹${mPrice}`;
  if (brtsEl) brtsEl.textContent = `₹${bPrice}`;
  if (amtsEl) amtsEl.textContent = `₹${aPrice}`;
  if (comboEl) comboEl.textContent = `₹${cPrice}`;
}

document.getElementById('fare-origin-select')?.addEventListener('change', updateFareEnquiryCalculation);
document.getElementById('fare-dest-select')?.addEventListener('change', updateFareEnquiryCalculation);

document.getElementById('fare-swap-btn')?.addEventListener('click', () => {
  const origEl = document.getElementById('fare-origin-select');
  const destEl = document.getElementById('fare-dest-select');
  if (origEl && destEl) {
    const temp = origEl.value;
    origEl.value = destEl.value;
    destEl.value = temp;
    updateFareEnquiryCalculation();
  }
});

document.getElementById('fare-book-route-btn')?.addEventListener('click', () => {
  const orig = document.getElementById('fare-origin-select')?.value;
  const dest = document.getElementById('fare-dest-select')?.value;

  appState.origin = orig;
  appState.destination = dest;
  document.getElementById('hero-origin-text').textContent = orig;
  document.getElementById('hero-dest-text').textContent = dest;

  const bookOrig = document.getElementById('booking-origin-select');
  const bookDest = document.getElementById('booking-dest-select');
  if (bookOrig) bookOrig.value = orig;
  if (bookDest) bookDest.value = dest;

  closeModal('modal-fare-enquiry');
  updateBookingFare();
  openModal('modal-book-ticket');
});

// Booking Modal Controls
let selectedBookingMode = 'Metro';
document.querySelectorAll('#modal-mode-selector .segmented-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#modal-mode-selector .segmented-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedBookingMode = btn.getAttribute('data-mode');
    updateBookingFare();
  });
});

const paxCountEl = document.getElementById('booking-pax-count');
document.getElementById('pax-minus-btn')?.addEventListener('click', () => {
  if (appState.passengerCount > 1) {
    appState.passengerCount--;
    if (paxCountEl) paxCountEl.textContent = appState.passengerCount;
    updateBookingFare();
  }
});

document.getElementById('pax-plus-btn')?.addEventListener('click', () => {
  if (appState.passengerCount < 6) {
    appState.passengerCount++;
    if (paxCountEl) paxCountEl.textContent = appState.passengerCount;
    updateBookingFare();
  }
});

function updateBookingFare() {
  const orig = document.getElementById('booking-origin-select')?.value || appState.origin;
  const dest = document.getElementById('booking-dest-select')?.value || appState.destination;
  const isFam = appState.isFamily || appState.passengerCount > 1;
  const fare = calculateFare(orig, dest, selectedBookingMode, isFam, appState.passengerCount);

  const fareEl = document.getElementById('booking-calculated-fare');
  if (fareEl) fareEl.textContent = `₹${fare.toFixed(2)}`;
}

document.getElementById('booking-origin-select')?.addEventListener('change', updateBookingFare);
document.getElementById('booking-dest-select')?.addEventListener('change', updateBookingFare);

// Confirm Pay & Book
document.getElementById('confirm-pay-book-btn')?.addEventListener('click', () => {
  const orig = document.getElementById('booking-origin-select')?.value || appState.origin;
  const dest = document.getElementById('booking-dest-select')?.value || appState.destination;
  const isFam = appState.isFamily || appState.passengerCount > 1;
  const fare = calculateFare(orig, dest, selectedBookingMode, isFam, appState.passengerCount);

  if (appState.walletBalance < fare) {
    alert(`Insufficient wallet balance. Please add funds.`);
    openModal('modal-profile-wallet');
    return;
  }

  // Deduct fare
  appState.walletBalance -= fare;
  const newTicket = {
    id: `TKT-AHM-${Math.floor(1000 + Math.random() * 9000)}`,
    origin: orig.toUpperCase(),
    destination: dest.toUpperCase(),
    mode: selectedBookingMode,
    platform: '01',
    totalFare: fare,
    passengerCount: appState.passengerCount,
    status: 'ACTIVE',
    date: 'Just Now',
    validUntil: '3 hours'
  };

  appState.activeTicket = newTicket;
  appState.tickets.unshift(newTicket);
  appState.transactions.unshift({
    title: `${selectedBookingMode} Ticket Booking`,
    subtitle: `${orig} -> ${dest}`,
    amount: -fare,
    date: 'Just Now'
  });

  saveState();
  closeModal('modal-book-ticket');
  renderActiveQrCode();
  openModal('modal-qr-view');
});

// Trip Planner Logic
document.getElementById('find-route-btn')?.addEventListener('click', () => {
  const orig = document.getElementById('planner-origin-select')?.value;
  const dest = document.getElementById('planner-dest-select')?.value;
  const resBox = document.getElementById('planner-result-box');
  const stepsList = document.getElementById('planner-steps-list');

  if (resBox && stepsList) {
    resBox.style.display = 'block';
    stepsList.innerHTML = `
      <p>1. Board <strong>Metro Blue Line</strong> at ${orig}.</p>
      <p>2. Arrive at <strong>Old High Court Interchange Station</strong> (Platform 02).</p>
      <p>3. Quick 2-min cross-platform transfer to connecting line.</p>
      <p>4. Reach destination station: <strong>${dest}</strong>.</p>
    `;
  }
});

// HelpBot AI Chat
const helpMessages = document.getElementById('helpbot-messages');
const helpInput = document.getElementById('helpbot-input');
const helpSendBtn = document.getElementById('helpbot-send-btn');

function appendBotReply(userQ) {
  if (!helpMessages) return;

  const userBubble = document.createElement('div');
  userBubble.style.cssText = 'background: var(--brand-secondary); color: white; padding: 10px 14px; border-radius: 12px; align-self: flex-end; max-width: 85%; font-size: 13px;';
  userBubble.textContent = userQ;
  helpMessages.appendChild(userBubble);

  let replyText = "You can use the Ahmedabad One smart card or QR ticket across all Metro, BRTS, and AMTS services.";
  const q = userQ.toLowerCase();
  if (q.includes('airport')) {
    replyText = "To reach Sardar Vallabhbhai Patel Airport, take Metro East-West Line to Kalupur Station, then transfer to AMTS Airport Express Route 138/1.";
  } else if (q.includes('interchange') || q.includes('high court')) {
    replyText = "Old High Court is the primary Metro interchange connecting Blue Line (Thaltej-Vastral) and Red Line (Motera-APMC). Transfer takes under 3 minutes.";
  } else if (q.includes('discount') || q.includes('pass')) {
    replyText = "The Ahmedabad One Smart Pass gives an automatic 10% discount on all Metro and BRTS fares, plus free transfers within 45 minutes.";
  }

  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.style.cssText = 'background: var(--surface-variant); padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%; font-size: 13px; color: var(--text-primary);';
    botBubble.textContent = replyText;
    helpMessages.appendChild(botBubble);
    helpMessages.scrollTop = helpMessages.scrollHeight;
  }, 400);
}

helpSendBtn?.addEventListener('click', () => {
  const text = helpInput?.value.trim();
  if (text) {
    appendBotReply(text);
    if (helpInput) helpInput.value = '';
  }
});

document.querySelectorAll('.help-prompt-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const q = chip.getAttribute('data-q');
    appendBotReply(q);
  });
});

// Daily Travers Tourist Pass Purchase
document.getElementById('confirm-buy-travers-btn')?.addEventListener('click', () => {
  if (appState.walletBalance < 100) {
    alert('Insufficient wallet funds. Please add balance.');
    openModal('modal-profile-wallet');
    return;
  }
  appState.walletBalance -= 100;
  appState.transactions.unshift({
    title: 'Daily Travers 1-Day Tourist Pass',
    subtitle: 'Unlimited 24h Transit',
    amount: -100,
    date: 'Just Now'
  });
  saveState();
  closeModal('modal-travers');
  alert('Daily Travers Pass Activated! Tap your card or QR at any AFC turnstile today.');
});

// QR Code SVG Generator
function renderActiveQrCode() {
  const svg = document.getElementById('turnstile-qr-svg');
  const codeEl = document.getElementById('qr-ticket-code');
  if (codeEl && appState.activeTicket) {
    codeEl.textContent = appState.activeTicket.id;
  }

  if (svg) {
    svg.innerHTML = `
      <rect width="180" height="180" fill="#FFFFFF"></rect>
      <!-- QR Pattern Mock SVG -->
      <rect x="15" y="15" width="40" height="40" fill="#002366"></rect>
      <rect x="23" y="23" width="24" height="24" fill="#FFFFFF"></rect>
      <rect x="29" y="29" width="12" height="12" fill="#002366"></rect>

      <rect x="125" y="15" width="40" height="40" fill="#002366"></rect>
      <rect x="133" y="23" width="24" height="24" fill="#FFFFFF"></rect>
      <rect x="139" y="29" width="12" height="12" fill="#002366"></rect>

      <rect x="15" y="125" width="40" height="40" fill="#002366"></rect>
      <rect x="23" y="133" width="24" height="24" fill="#FFFFFF"></rect>
      <rect x="29" y="139" width="12" height="12" fill="#002366"></rect>

      <!-- Center Logo Accent -->
      <rect x="75" y="75" width="30" height="30" rx="6" fill="#FC8712"></rect>
      <circle cx="90" cy="90" r="6" fill="#FFFFFF"></circle>

      <!-- Data Dots -->
      <circle cx="70" cy="35" r="4" fill="#002366"></circle>
      <circle cx="95" cy="35" r="4" fill="#002366"></circle>
      <circle cx="70" cy="55" r="4" fill="#002366"></circle>
      <circle cx="110" cy="55" r="4" fill="#002366"></circle>
      <circle cx="35" cy="70" r="4" fill="#002366"></circle>
      <circle cx="55" cy="90" r="4" fill="#002366"></circle>
      <circle cx="35" cy="110" r="4" fill="#002366"></circle>
      <circle cx="125" cy="70" r="4" fill="#002366"></circle>
      <circle cx="145" cy="95" r="4" fill="#002366"></circle>
      <circle cx="70" cy="125" r="4" fill="#002366"></circle>
      <circle cx="110" cy="125" r="4" fill="#002366"></circle>
      <circle cx="90" cy="145" r="4" fill="#002366"></circle>
      <circle cx="130" cy="145" r="4" fill="#002366"></circle>
      <circle cx="150" cy="130" r="4" fill="#002366"></circle>
    `;
  }
}

// Turnstile Audio Sound Synthesizer
function playGateBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

document.getElementById('simulate-qr-scan-btn')?.addEventListener('click', () => {
  playGateBeep();
  alert('🟢 Turnstile AFC Gate Opened! Welcome to Ahmedabad Metro.');
  closeModal('modal-qr-view');
});

document.getElementById('simulate-gate-tap-btn')?.addEventListener('click', () => {
  playGateBeep();
  alert('🟢 RuPay Smart Card Validated! Gate open. Fare ₹18 debited with 10% discount.');
});

// Recharge Pass Modal
document.getElementById('pass-recharge-modal-btn')?.addEventListener('click', () => openModal('modal-recharge-pass'));
document.getElementById('profile-add-funds-btn')?.addEventListener('click', () => {
  closeModal('modal-profile-wallet');
  openModal('modal-recharge-pass');
});

let selectedTopUp = 100;
document.querySelectorAll('.recharge-preset').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.recharge-preset').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTopUp = parseInt(btn.getAttribute('data-amount'), 10);
  });
});

document.getElementById('confirm-recharge-pass-btn')?.addEventListener('click', () => {
  const custom = parseInt(document.getElementById('custom-recharge-amount')?.value, 10);
  const amount = custom > 0 ? custom : selectedTopUp;

  appState.walletBalance += amount;
  appState.cardBalance += amount;
  appState.transactions.unshift({
    title: 'UPI Top-Up Added',
    subtitle: 'GPay • Instant Recharge',
    amount: amount,
    date: 'Just Now'
  });

  saveState();
  closeModal('modal-recharge-pass');
  alert(`₹${amount} successfully added to your Transit Wallet & Smart Card!`);
});

// Render Radar Vehicles List
function renderRadarVehicles() {
  const container = document.getElementById('radar-vehicles-list');
  if (!container) return;
  container.innerHTML = '';

  LIVE_VEHICLES.forEach((v) => {
    const div = document.createElement('div');
    div.className = 'radar-item';
    div.innerHTML = `
      <div class="radar-header">
        <span class="vehicle-chip">${v.mode} • ${v.code}</span>
        <span class="radar-status">${v.status}</span>
      </div>
      <div class="radar-body">
        <span>Next: <strong>${v.next}</strong></span>
        <span>${v.speed} km/h</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-fill" style="width: ${v.progress}%;"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Render Tickets History
function renderTicketsHistory() {
  const container = document.getElementById('tickets-history-container');
  if (!container) return;
  container.innerHTML = '';

  appState.tickets.forEach((t) => {
    const card = document.createElement('div');
    card.className = 'ticket-container';
    card.innerHTML = `
      <div class="ticket-header-pill">
        <span style="font-size: 11px; font-weight: 800; color: var(--text-secondary);">${t.id} • ${t.mode.toUpperCase()}</span>
        <span class="ticket-status-badge" style="background: ${t.status === 'ACTIVE' ? '#D1FAE5' : '#F1F5F9'}; color: ${t.status === 'ACTIVE' ? '#065F46' : '#64748B'};">${t.status}</span>
      </div>
      <div class="ticket-route-box">
        <div class="station-node">
          <span class="label">FROM</span>
          <span class="name">${t.origin}</span>
        </div>
        <div style="color: var(--brand-secondary); font-size: 16px; font-weight: 800;">⟶</div>
        <div class="station-node" style="text-align: right;">
          <span class="label">TO</span>
          <span class="name">${t.destination}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: var(--text-secondary);">${t.date} • ₹${t.totalFare}</span>
        <button class="primary-btn" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="renderActiveQrCode(); openModal('modal-qr-view');">
          View QR
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Interactive SVG Transit Map
function renderTransitMap(filter = 'All') {
  const svg = document.getElementById('transit-network-svg');
  if (!svg) return;

  let html = `
    <!-- Background Grid Lines -->
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 35, 102, 0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- East-West Blue Line Track -->
    <path d="M 60 220 L 325 255 L 575 300" fill="none" stroke="#0072CE" stroke-width="6" stroke-linecap="round"/>

    <!-- North-South Red Line Track -->
    <path d="M 325 40 L 325 460" fill="none" stroke="#E31B23" stroke-width="6" stroke-linecap="round"/>

    <!-- BRTS Janmarg Orange Track -->
    <path d="M 70 300 L 190 300 L 260 150 L 380 330 L 535 290" fill="none" stroke="#FF7A00" stroke-width="4" stroke-dasharray="6,4" stroke-linecap="round"/>
  `;

  // Filter stations
  let stationsToDraw = ALL_STATIONS;
  if (filter === 'Metro-EW') stationsToDraw = METRO_EW_STATIONS;
  else if (filter === 'Metro-NS') stationsToDraw = METRO_NS_STATIONS;
  else if (filter === 'BRTS') stationsToDraw = BRTS_STATIONS;
  else if (filter === 'Interchanges') stationsToDraw = ALL_STATIONS.filter(s => s.isInterchange);

  stationsToDraw.forEach((st) => {
    const color = st.isInterchange ? '#FC8712' : (st.line.includes('East-West') ? '#0072CE' : (st.line.includes('North-South') ? '#E31B23' : '#FF7A00'));
    const radius = st.isInterchange ? 7 : 4.5;

    html += `
      <g class="map-station-node" data-station="${st.name}" data-line="${st.line}" style="cursor: pointer;">
        <circle cx="${st.x}" cy="${st.y}" r="${radius + 3}" fill="rgba(255,255,255,0.85)"></circle>
        <circle cx="${st.x}" cy="${st.y}" r="${radius}" fill="${color}" stroke="#FFFFFF" stroke-width="2"></circle>
        <text x="${st.x}" y="${st.y - 9}" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#1A1C20" text-anchor="middle">${st.name}</text>
      </g>
    `;
  });

  svg.innerHTML = html;

  // Add click events to station nodes
  svg.querySelectorAll('.map-station-node').forEach((node) => {
    node.addEventListener('click', () => {
      const name = node.getAttribute('data-station');
      const line = node.getAttribute('data-line');
      const nameEl = document.getElementById('sheet-station-name');
      const lineEl = document.getElementById('sheet-station-line');
      if (nameEl) nameEl.textContent = name;
      if (lineEl) lineEl.textContent = line;
    });
  });
}

// Map filter chips
document.querySelectorAll('.map-filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderTransitMap(chip.getAttribute('data-filter'));
  });
});

// Map station sheet actions
document.getElementById('sheet-set-origin-btn')?.addEventListener('click', () => {
  const name = document.getElementById('sheet-station-name')?.textContent || 'Thaltej Gam';
  appState.origin = name;
  document.getElementById('hero-origin-text').textContent = name;
  alert(`Starting station set to: ${name}`);
  switchScreen('screen-home');
});

document.getElementById('sheet-set-dest-btn')?.addEventListener('click', () => {
  const name = document.getElementById('sheet-station-name')?.textContent || 'Rabari Colony';
  appState.destination = name;
  document.getElementById('hero-dest-text').textContent = name;
  alert(`Destination set to: ${name}`);
  switchScreen('screen-home');
});

// Dark Theme Mode Toggle
const themeToggle = document.getElementById('theme-mode-toggle');
if (themeToggle) {
  themeToggle.checked = appState.darkTheme;
  document.documentElement.setAttribute('data-theme', appState.darkTheme ? 'dark' : 'light');

  themeToggle.addEventListener('change', (e) => {
    appState.darkTheme = e.target.checked;
    document.documentElement.setAttribute('data-theme', appState.darkTheme ? 'dark' : 'light');
    saveState();
  });
}

// Desktop View Mode Switcher (Mobile 1:1 Preview vs Expanded)
const viewMobileBtn = document.getElementById('view-mode-mobile-btn');
const viewWideBtn = document.getElementById('view-mode-wide-btn');

function setViewMode(mode) {
  const isExpanded = mode === 'wide';
  document.body.classList.toggle('view-expanded', isExpanded);
  if (viewMobileBtn) viewMobileBtn.classList.toggle('active', !isExpanded);
  if (viewWideBtn) viewWideBtn.classList.toggle('active', isExpanded);
  try {
    localStorage.setItem('ahmedabad_one_view_mode', mode);
  } catch (e) {}
}

if (viewMobileBtn) {
  viewMobileBtn.addEventListener('click', () => setViewMode('mobile'));
}
if (viewWideBtn) {
  viewWideBtn.addEventListener('click', () => setViewMode('wide'));
}

// Default to mobile view matching AI Studio preview
try {
  const savedViewMode = localStorage.getItem('ahmedabad_one_view_mode') || 'mobile';
  setViewMode(savedViewMode);
} catch (e) {
  setViewMode('mobile');
}

// Initial Boot
populateAllStationSelects();
renderWalletBalances();
renderRadarVehicles();
renderTransitMap('All');
