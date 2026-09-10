// Ahmedabad One Transit PWA Application Logic

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
  });
}

// PWA Install prompt handling
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

// Offline detection
function updateOnlineStatus() {
  const offlineBanner = document.getElementById('offline-banner');
  if (offlineBanner) {
    offlineBanner.style.display = navigator.onLine ? 'none' : 'block';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Station dataset from TransitData
const STATIONS = [
  // Metro East-West Line
  { id: 'ew_1', name: 'Thaltej Gam', line: 'East-West Line', isInterchange: false, x: 50, y: 190 },
  { id: 'ew_2', name: 'Thaltej', line: 'East-West Line', isInterchange: false, x: 100, y: 200 },
  { id: 'ew_3', name: 'Doordarshan Kendra', line: 'East-West Line', isInterchange: false, x: 145, y: 210 },
  { id: 'ew_4', name: 'Gurukul Road', line: 'East-West Line', isInterchange: false, x: 180, y: 220 },
  { id: 'ew_5', name: 'Gujarat University', line: 'East-West Line', isInterchange: false, x: 210, y: 230 },
  { id: 'ew_6', name: 'Commerce Six Road', line: 'East-West Line', isInterchange: false, x: 235, y: 240 },
  { id: 'ew_7', name: 'SP Stadium', line: 'East-West Line', isInterchange: false, x: 255, y: 250 },
  { id: 'ew_8', name: 'Old High Court', line: 'East-West Line', isInterchange: true, x: 275, y: 260 },
  { id: 'ew_9', name: 'Shahpur', line: 'East-West Line', isInterchange: false, x: 300, y: 265 },
  { id: 'ew_10', name: 'Gheekanta', line: 'East-West Line', isInterchange: false, x: 325, y: 270 },
  { id: 'ew_11', name: 'Kalupur Metro Station', line: 'East-West Line', isInterchange: true, x: 350, y: 275 },
  { id: 'ew_12', name: 'Kankariya East', line: 'East-West Line', isInterchange: false, x: 375, y: 280 },
  { id: 'ew_13', name: 'Apparel Park', line: 'East-West Line', isInterchange: false, x: 400, y: 285 },
  { id: 'ew_14', name: 'Amraiwadi', line: 'East-West Line', isInterchange: false, x: 420, y: 290 },
  { id: 'ew_15', name: 'Rabari Colony', line: 'East-West Line', isInterchange: true, x: 440, y: 295 },
  { id: 'ew_16', name: 'Vastral', line: 'East-West Line', isInterchange: false, x: 460, y: 300 },
  { id: 'ew_17', name: 'Vastral Gam', line: 'East-West Line', isInterchange: false, x: 480, y: 310 },

  // Metro North-South Line
  { id: 'ns_1', name: 'Motera Stadium', line: 'North-South Line', isInterchange: false, x: 275, y: 60 },
  { id: 'ns_2', name: 'Sabarmati', line: 'North-South Line', isInterchange: true, x: 275, y: 100 },
  { id: 'ns_3', name: 'AEC', line: 'North-South Line', isInterchange: false, x: 275, y: 130 },
  { id: 'ns_4', name: 'Ranip', line: 'North-South Line', isInterchange: true, x: 275, y: 160 },
  { id: 'ns_5', name: 'Vadaj', line: 'North-South Line', isInterchange: false, x: 275, y: 190 },
  { id: 'ns_6', name: 'Vijaynagar', line: 'North-South Line', isInterchange: false, x: 275, y: 215 },
  { id: 'ns_7', name: 'Usmanpura', line: 'North-South Line', isInterchange: false, x: 275, y: 240 },
  { id: 'ns_9', name: 'Gandhigram', line: 'North-South Line', isInterchange: false, x: 275, y: 290 },
  { id: 'ns_10', name: 'Paldi', line: 'North-South Line', isInterchange: true, x: 275, y: 320 },
  { id: 'ns_11', name: 'Shreyas', line: 'North-South Line', isInterchange: false, x: 275, y: 350 },
  { id: 'ns_12', name: 'Rajiv Nagar', line: 'North-South Line', isInterchange: false, x: 275, y: 380 },
  { id: 'ns_13', name: 'Jivraj Park', line: 'North-South Line', isInterchange: false, x: 275, y: 410 },
  { id: 'ns_14', name: 'APMC', line: 'North-South Line', isInterchange: false, x: 275, y: 445 },

  // BRTS Trunk Stations
  { id: 'brts_1', name: 'RTO Circle', line: 'BRTS Janmarg', isInterchange: false, x: 225, y: 140 },
  { id: 'brts_2', name: 'Memnagar', line: 'BRTS Janmarg', isInterchange: false, x: 190, y: 180 },
  { id: 'brts_3', name: 'Shivranjani', line: 'BRTS Janmarg', isInterchange: false, x: 160, y: 290 },
  { id: 'brts_4', name: 'ISKCON Cross Road', line: 'BRTS Janmarg', isInterchange: false, x: 100, y: 290 },
  { id: 'brts_6', name: 'Anjali (Vasna)', line: 'BRTS Janmarg', isInterchange: false, x: 240, y: 360 },
  { id: 'brts_7', name: 'Geeta Mandir', line: 'BRTS Janmarg', isInterchange: false, x: 320, y: 320 },
  { id: 'brts_8', name: 'Maninagar', line: 'BRTS Janmarg', isInterchange: false, x: 360, y: 370 }
];

// Live Vehicles
const LIVE_VEHICLES = [
  { id: 'M-422', code: 'EW-101', line: 'East-West Line', mode: 'Metro', next: 'Rabari Colony', speed: 54, status: 'ON TIME', progress: 72 },
  { id: 'M-308', code: 'NS-204', line: 'North-South Line', mode: 'Metro', next: 'Old High Court', speed: 48, status: 'ON TIME', progress: 45 },
  { id: 'B-14', code: 'BRTS 04', line: 'RTO -> Maninagar', mode: 'BRTS', next: 'Shivranjani', speed: 36, status: 'ON TIME', progress: 50 },
  { id: 'A-88', code: 'AMTS 138', line: 'Lal Darwaja -> Bopal', mode: 'AMTS', next: 'Nehrunagar', speed: 28, status: 'SLIGHT DELAY', progress: 65 }
];

// Local state
let appState = {
  walletBalance: 450,
  cardBalance: 450,
  activeTicket: {
    id: 'TKT-AHM-9842',
    origin: 'THALTEJ',
    destination: 'OLD HIGH COURT',
    mode: 'Metro',
    platform: '02',
    totalFare: 20,
    passengerCount: 1,
    status: 'ACTIVE',
    validUntil: '3 hours'
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
    { title: 'UPI Top-Up Added', subtitle: 'GPay • Ref #92837', amount: 300, date: 'Yesterday' },
    { title: 'BRTS Journey Fare', subtitle: 'RTO Circle -> Shivranjani', amount: -15, date: '2 days ago' }
  ]
};

// Load saved state from LocalStorage
try {
  const saved = localStorage.getItem('ahmedabad_one_state');
  if (saved) {
    const parsed = JSON.parse(saved);
    appState = { ...appState, ...parsed };
  }
} catch (e) {
  console.warn('LocalStorage error:', e);
}

function saveState() {
  try {
    localStorage.setItem('ahmedabad_one_state', JSON.stringify(appState));
  } catch (e) {}
  renderWalletBalances();
}

function renderWalletBalances() {
  const headerBal = document.getElementById('header-wallet-balance');
  const profileBal = document.getElementById('profile-wallet-balance');
  const cardBal = document.getElementById('pass-card-balance');

  if (headerBal) headerBal.textContent = `₹${appState.walletBalance.toFixed(0)}`;
  if (profileBal) profileBal.textContent = `₹${appState.walletBalance.toFixed(2)}`;
  if (cardBal) cardBal.textContent = `₹${appState.cardBalance.toFixed(2)}`;
}

// Navigation Screen Switcher (Unified for mobile bottom nav and desktop top bar)
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
  } else if (targetScreen === 'screen-profile') {
    renderTransactions();
  }
}

document.querySelectorAll('.nav-item, .top-nav-link').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetScreen = btn.getAttribute('data-screen');
    if (targetScreen) switchScreen(targetScreen);
  });
});

// Top bar shortcuts
document.getElementById('top-wallet-btn')?.addEventListener('click', () => {
  switchScreen('screen-profile');
});
document.getElementById('top-profile-btn')?.addEventListener('click', () => {
  switchScreen('screen-profile');
});

// Modal open & close
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

// Quick action buttons
document.getElementById('hero-book-ticket-btn')?.addEventListener('click', () => openModal('modal-book-ticket'));
document.getElementById('action-book-ticket')?.addEventListener('click', () => openModal('modal-book-ticket'));
document.getElementById('action-trip-planner')?.addEventListener('click', () => openModal('modal-trip-planner'));
document.getElementById('action-timetable')?.addEventListener('click', () => openModal('modal-timetable'));
document.getElementById('action-recharge-pass')?.addEventListener('click', () => {
  document.querySelector('.nav-item[data-screen="screen-passes"]')?.click();
});
document.getElementById('action-travers')?.addEventListener('click', () => openModal('modal-travers'));
document.getElementById('action-onebot')?.addEventListener('click', () => openModal('modal-onebot'));
document.getElementById('home-view-qr-btn')?.addEventListener('click', () => {
  renderActiveQrCode();
  openModal('modal-qr-view');
});
document.getElementById('ticket-tab-book-btn')?.addEventListener('click', () => openModal('modal-book-ticket'));

// Populate station dropdowns
function populateStationSelects() {
  const selects = ['booking-origin-select', 'booking-dest-select', 'planner-origin-select', 'planner-dest-select'];
  selects.forEach((selId) => {
    const el = document.getElementById(selId);
    if (!el) return;
    el.innerHTML = '';
    STATIONS.forEach((st, idx) => {
      const opt = document.createElement('option');
      opt.value = st.name;
      opt.textContent = `${st.name} (${st.line.replace(' Line', '')})`;
      el.appendChild(opt);
    });
  });

  // Default initial values
  const bOrig = document.getElementById('booking-origin-select');
  const bDest = document.getElementById('booking-dest-select');
  if (bOrig) bOrig.value = 'Thaltej';
  if (bDest) bDest.value = 'Old High Court';

  const pOrig = document.getElementById('planner-origin-select');
  const pDest = document.getElementById('planner-dest-select');
  if (pOrig) pOrig.value = 'Motera Stadium';
  if (pDest) pDest.value = 'Kalupur Metro Station';
}

// Booking fare calculation
let currentBookingMode = 'Metro';
let currentPassengerType = 'Single';

function updateBookingFare() {
  const orig = document.getElementById('booking-origin-select')?.value || 'Thaltej';
  const dest = document.getElementById('booking-dest-select')?.value || 'Old High Court';
  const count = parseInt(document.getElementById('passenger-count-input')?.value || '1', 10);

  const origIdx = STATIONS.findIndex((s) => s.name === orig);
  const destIdx = STATIONS.findIndex((s) => s.name === dest);
  const hops = Math.max(1, Math.abs((destIdx === -1 ? 4 : destIdx) - (origIdx === -1 ? 0 : origIdx)));

  let baseFare = currentBookingMode === 'Metro' ? 10 + hops * 2.5 : currentBookingMode === 'BRTS' ? 8 + hops * 1.5 : 6 + hops * 1.2;
  if (currentBookingMode === 'Combo') {
    baseFare = (12 + hops * 2.2) * 0.90; // 10% discount
    document.getElementById('combo-discount-row').style.display = 'flex';
  } else {
    document.getElementById('combo-discount-row').style.display = 'none';
  }

  const multiplier = currentPassengerType === 'Family' ? Math.max(1, count) : 1;
  const total = Math.round(baseFare * multiplier);

  document.getElementById('booking-calc-dist').textContent = `${(hops * 1.6).toFixed(1)} km • ~${Math.round(hops * 2.4 + 4)} mins`;
  document.getElementById('booking-calc-base').textContent = `₹${Math.round(baseFare)}`;
  document.getElementById('booking-calc-total').textContent = `₹${total}`;
}

// Booking modal events
document.querySelectorAll('#modal-mode-selector .segmented-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#modal-mode-selector .segmented-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentBookingMode = btn.getAttribute('data-mode');
    updateBookingFare();
  });
});

document.querySelectorAll('#passenger-type-selector .segmented-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#passenger-type-selector .segmented-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentPassengerType = btn.getAttribute('data-ptype');
    const groupRow = document.getElementById('group-count-group');
    if (groupRow) groupRow.style.display = currentPassengerType === 'Family' ? 'block' : 'none';
    updateBookingFare();
  });
});

document.getElementById('booking-origin-select')?.addEventListener('change', updateBookingFare);
document.getElementById('booking-dest-select')?.addEventListener('change', updateBookingFare);
document.getElementById('passenger-count-input')?.addEventListener('input', updateBookingFare);

// Confirm Booking
document.getElementById('confirm-booking-btn')?.addEventListener('click', () => {
  const orig = document.getElementById('booking-origin-select')?.value || 'Thaltej';
  const dest = document.getElementById('booking-dest-select')?.value || 'Old High Court';
  const count = currentPassengerType === 'Family' ? parseInt(document.getElementById('passenger-count-input')?.value || '2', 10) : 1;
  const fare = parseInt(document.getElementById('booking-calc-total')?.textContent.replace('₹', '') || '20', 10);

  if (appState.walletBalance < fare) {
    alert(`Insufficient wallet balance (₹${appState.walletBalance}). Please recharge your transit wallet!`);
    return;
  }

  // Deduct fare
  appState.walletBalance -= fare;

  const newTicketId = `TKT-AHM-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: newTicketId,
    origin: orig.toUpperCase(),
    destination: dest.toUpperCase(),
    mode: currentBookingMode,
    platform: orig.includes('Thaltej') ? '02' : '01',
    totalFare: fare,
    passengerCount: count,
    status: 'ACTIVE',
    date: 'Just now'
  };

  appState.activeTicket = newTicket;
  appState.tickets.unshift(newTicket);
  appState.transactions.unshift({
    title: `${currentBookingMode} Ticket Booking`,
    subtitle: `${orig} -> ${dest} (${count} Pax)`,
    amount: -fare,
    date: 'Just now'
  });

  saveState();
  closeModal('modal-book-ticket');

  // Update home view
  document.getElementById('home-ticket-number').textContent = newTicket.id;
  document.getElementById('home-ticket-origin').textContent = newTicket.origin;
  document.getElementById('home-ticket-destination').textContent = newTicket.destination;

  renderActiveQrCode();
  openModal('modal-qr-view');
});

// QR Code SVG Generator (Draws high precision QR style pattern)
function renderActiveQrCode() {
  const qrSvg = document.getElementById('modal-qr-svg');
  if (!qrSvg) return;

  const t = appState.activeTicket;
  document.getElementById('modal-qr-ticket-code').textContent = t.id;
  document.getElementById('modal-qr-route').textContent = `${t.origin} -> ${t.destination}`;

  // Generate deterministic dot matrix pattern based on ticket ID
  const size = 21;
  const cellSize = 200 / size;
  let svgContent = `<rect width="200" height="200" fill="#FFFFFF"/>`;

  // Draw 3 corner locator squares
  function drawLocator(x, y) {
    svgContent += `
      <rect x="${x}" y="${y}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#002D62"/>
      <rect x="${x + cellSize}" y="${y + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#FFFFFF"/>
      <rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#002D62"/>
    `;
  }
  drawLocator(0, 0);
  drawLocator(14 * cellSize, 0);
  drawLocator(0, 14 * cellSize);

  // Pseudo-random deterministic data dots
  const seed = t.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) continue;
      const isFilled = ((r * 13 + c * 7 + seed) % 3 === 0);
      if (isFilled) {
        svgContent += `<rect x="${c * cellSize + 0.5}" y="${r * cellSize + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" fill="#002D62"/>`;
      }
    }
  }

  qrSvg.innerHTML = svgContent;
}

// Turnstile Gate Simulation Toast
function triggerGateUnlock(label) {
  const toast = document.getElementById('gate-toast');
  if (!toast) return;
  toast.querySelector('span').textContent = label || 'GATE UNLOCKED — ENJOY YOUR JOURNEY!';
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

document.getElementById('test-qr-gate-btn')?.addEventListener('click', () => {
  triggerGateUnlock('QR VALIDATED — TURNSTILE UNLOCKED');
});
document.getElementById('simulate-gate-tap-btn')?.addEventListener('click', () => {
  triggerGateUnlock('SMART CARD TAPPED — ₹18 DEDUCTED');
});

// Recharge Card
document.getElementById('pass-recharge-modal-btn')?.addEventListener('click', () => {
  const amt = prompt('Enter recharge amount for Smart Card (₹100, ₹200, ₹500):', '200');
  if (amt && !isNaN(amt) && Number(amt) > 0) {
    const val = Number(amt);
    appState.cardBalance += val;
    appState.transactions.unshift({
      title: 'Smart Card Recharge',
      subtitle: 'Pass AHM-8841-2049',
      amount: val,
      date: 'Just now'
    });
    saveState();
    triggerGateUnlock(`CARD RECHARGED WITH ₹${val}!`);
  }
});

// Apply New Pass
document.getElementById('pass-apply-new-btn')?.addEventListener('click', () => {
  alert('New Pass application submitted! Your physical/digital Smart Pass will be provisioned within 24 hours.');
});

// Add Funds to Wallet
document.getElementById('add-wallet-funds-btn')?.addEventListener('click', () => {
  const amt = prompt('Enter amount to add to Transit Wallet:', '300');
  if (amt && !isNaN(amt) && Number(amt) > 0) {
    const val = Number(amt);
    appState.walletBalance += val;
    appState.transactions.unshift({
      title: 'Wallet Top-Up (UPI)',
      subtitle: 'Net Banking / UPI Instant',
      amount: val,
      date: 'Just now'
    });
    saveState();
    triggerGateUnlock(`WALLET TOP-UP OF ₹${val} SUCCESSFUL!`);
  }
});

// Render Live Radar Vehicles
function renderLiveVehicles() {
  const container = document.getElementById('live-vehicles-list');
  if (!container) return;
  container.innerHTML = '';

  LIVE_VEHICLES.forEach((v) => {
    const card = document.createElement('div');
    card.className = 'live-train-card';
    card.innerHTML = `
      <div class="live-train-header">
        <span class="train-badge">${v.code} • ${v.line}</span>
        <span class="train-speed">${v.speed} km/h</span>
      </div>
      <div class="train-route-row">
        <span>Next: <strong>${v.next}</strong></span>
        <span style="color: #10B981;">${v.status}</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-fill" style="width: ${v.progress}%;"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render SVG Transit Map
function renderTransitMap(filter) {
  const svg = document.getElementById('transit-map-svg');
  if (!svg) return;

  let content = '';

  // Background grid
  content += `<defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="500" height="500" fill="url(#grid)" />`;

  // Draw Metro East-West Line (Blue)
  if (filter === 'All' || filter === 'East-West') {
    const ewPoints = STATIONS.filter((s) => s.line === 'East-West Line');
    const pathD = ewPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    content += `<path d="${pathD}" fill="none" stroke="#0284C7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Draw Metro North-South Line (Red)
  if (filter === 'All' || filter === 'North-South') {
    const nsPoints = STATIONS.filter((s) => s.line === 'North-South Line');
    const pathD = nsPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    content += `<path d="${pathD}" fill="none" stroke="#DC2626" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Draw BRTS Janmarg (Orange)
  if (filter === 'All' || filter === 'BRTS') {
    const brtsPoints = STATIONS.filter((s) => s.line === 'BRTS Janmarg');
    const pathD = brtsPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    content += `<path d="${pathD}" fill="none" stroke="#EA580C" stroke-width="5" stroke-dasharray="8 5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Draw Stations
  STATIONS.forEach((s) => {
    const shouldShow = filter === 'All' || (filter === 'Interchange' && s.isInterchange) || s.line.includes(filter);
    if (!shouldShow) return;

    const r = s.isInterchange ? 7 : 4.5;
    const fill = s.isInterchange ? '#FC8712' : '#FFFFFF';
    const stroke = s.isInterchange ? '#FFFFFF' : '#002D62';

    content += `
      <g class="station-node-group" onclick="window.selectMapStation('${s.name}', '${s.line}')" style="cursor: pointer;">
        <circle cx="${s.x}" cy="${s.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />
        <text x="${s.x + 8}" y="${s.y + 3}" fill="#E2E8F0" font-size="9" font-family="Plus Jakarta Sans" font-weight="${s.isInterchange ? 'bold' : 'normal'}">
          ${s.name}
        </text>
      </g>
    `;
  });

  svg.innerHTML = content;
}

window.selectMapStation = function (name, line) {
  const sheet = document.getElementById('station-info-sheet');
  if (!sheet) return;
  document.getElementById('sheet-station-name').textContent = name;
  document.getElementById('sheet-station-line').textContent = line;
  sheet.style.display = 'block';

  document.getElementById('sheet-set-origin-btn').onclick = () => {
    openModal('modal-book-ticket');
    const origSel = document.getElementById('booking-origin-select');
    if (origSel) origSel.value = name;
    updateBookingFare();
  };

  document.getElementById('sheet-set-dest-btn').onclick = () => {
    openModal('modal-book-ticket');
    const destSel = document.getElementById('booking-dest-select');
    if (destSel) destSel.value = name;
    updateBookingFare();
  };
};

document.querySelectorAll('.map-filter-chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.map-filter-chip').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');
    renderTransitMap(f);
  });
});

// Render Tickets History
function renderTicketsHistory() {
  const container = document.getElementById('tickets-history-container');
  if (!container) return;
  container.innerHTML = '';

  appState.tickets.forEach((t) => {
    const card = document.createElement('div');
    card.className = 'ticket-container';
    card.style.marginBottom = '12px';
    card.innerHTML = `
      <div class="ticket-header-pill">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #FC8712;">${t.mode.toUpperCase()} EXPRESS</span>
          <div style="font-size: 13px; font-weight: 700;">${t.id}</div>
        </div>
        <span class="ticket-status-badge" style="background-color: ${t.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${t.status === 'ACTIVE' ? '#10B981' : '#94A3B8'};">
          ${t.status}
        </span>
      </div>
      <div class="ticket-route-box">
        <div class="station-node">
          <span class="label">FROM</span>
          <span class="name" style="font-size: 13px;">${t.origin}</span>
        </div>
        <div style="color: #FC8712;">→</div>
        <div class="station-node" style="text-align: right;">
          <span class="label">TO</span>
          <span class="name" style="font-size: 13px;">${t.destination}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94A3B8;">
        <span>Fare: <strong>₹${t.totalFare}</strong> (${t.passengerCount} Pax)</span>
        <span>${t.date}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Transactions History
function renderTransactions() {
  const container = document.getElementById('wallet-history-list');
  if (!container) return;
  container.innerHTML = '';

  appState.transactions.forEach((tx) => {
    const isCredit = tx.amount > 0;
    const row = document.createElement('div');
    row.style.cssText = 'background: var(--surface-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;';
    row.innerHTML = `
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFF;">${tx.title}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">${tx.subtitle} • ${tx.date}</div>
      </div>
      <span style="font-size: 14px; font-weight: 800; color: ${isCredit ? '#10B981' : '#EF4444'};">
        ${isCredit ? '+' : ''}₹${Math.abs(tx.amount)}
      </span>
    `;
    container.appendChild(row);
  });
}

// Timetable Departures
function renderTimetableDepartures() {
  const container = document.getElementById('timetable-departures-list');
  if (!container) return;
  const departures = [
    { line: 'Metro Blue Line', dest: 'Vastral Gam', time: 'In 3 mins', pf: '02', status: 'ON TIME' },
    { line: 'Metro Red Line', dest: 'Motera Stadium', time: 'In 6 mins', pf: '01', status: 'ON TIME' },
    { line: 'BRTS Janmarg 04', dest: 'RTO Circle', time: 'In 8 mins', pf: 'Bay 1', status: '2m DELAY' },
    { line: 'AMTS Bus 138', dest: 'Lal Darwaja', time: 'In 11 mins', pf: 'Gate 2', status: 'ON TIME' }
  ];

  container.innerHTML = departures.map((d) => `
    <div style="background: var(--surface-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFF;">${d.dest}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">${d.line} • Platform ${d.pf}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 13px; font-weight: 800; color: #FC8712;">${d.time}</div>
        <span style="font-size: 9px; font-weight: 700; color: #10B981;">${d.status}</span>
      </div>
    </div>
  `).join('');
}

// OneBot AI Chat
function sendBotMessage(text) {
  const container = document.getElementById('bot-messages-container');
  if (!container || !text.trim()) return;

  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = text;
  container.appendChild(userBubble);

  let reply = "I can assist you with Metro schedules, BRTS corridors, ticket bookings, and smart card benefits!";
  const q = text.toLowerCase();

  if (q.includes('hour') || q.includes('time') || q.includes('timing')) {
    reply = "Ahmedabad Metro trains operate daily from 06:20 AM to 10:00 PM with 5-minute frequency during peak commute hours.";
  } else if (q.includes('transfer') || q.includes('old high court')) {
    reply = "Old High Court is the bidirectional interchange station between the East-West line and North-South line. Seamless platform transfers take under 2 minutes.";
  } else if (q.includes('discount') || q.includes('combo')) {
    reply = "Choosing the 3-in-1 Combo ticket gives an instant 10% discount across Metro, Janmarg BRTS, and AMTS services.";
  } else if (q.includes('refund') || q.includes('cancel')) {
    reply = "Unused QR tickets can be cancelled within 60 minutes of booking directly from your My Tickets section with an instant wallet refund.";
  }

  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = reply;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  }, 400);

  container.scrollTop = container.scrollHeight;
}

window.sendBotPrompt = function (promptText) {
  sendBotMessage(promptText);
};

document.getElementById('bot-send-btn')?.addEventListener('click', () => {
  const input = document.getElementById('bot-user-input');
  if (input && input.value) {
    sendBotMessage(input.value);
    input.value = '';
  }
});

document.getElementById('bot-user-input')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('bot-send-btn')?.click();
  }
});

// Trip Planner calculation
document.getElementById('calc-plan-btn')?.addEventListener('click', () => {
  const orig = document.getElementById('planner-origin-select')?.value || 'Motera Stadium';
  const dest = document.getElementById('planner-dest-select')?.value || 'Kalupur Metro Station';

  const results = document.getElementById('planner-results');
  results.style.display = 'block';

  document.getElementById('plan-title').textContent = `${orig} ➔ ${dest}`;
  document.getElementById('plan-details').textContent = `Transfer via Old High Court • Travel Time: ~24 mins • Estimated Fare: ₹25`;
});

// Initial startup calls
populateStationSelects();
updateBookingFare();
renderWalletBalances();
renderLiveVehicles();
renderTimetableDepartures();
renderTransitMap('All');
