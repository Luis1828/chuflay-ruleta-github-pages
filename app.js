const options = [
  { name: "Ferru", qr: "./assets/qr-ferru.png", link: "" },
  { name: "Pollo", qr: "./assets/qr-pollo.png", link: "" },
  { name: "Piki", qr: "./assets/qr-piki.png", link: "" },
  { name: "Sam", qr: "./assets/qr-sam.png", link: "" },
  { name: "Koca", qr: "./assets/qr-koca.png", link: "" },
];

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const winnerNameEl = document.getElementById("winnerName");
const winnerQrEl = document.getElementById("winnerQr");
const openLinkEl = document.getElementById("openLink");
const copyBtn = document.getElementById("copyName");

const sliceAngle = 360 / options.length;
let currentRotation = 0;
let spinning = false;
let lastWinner = null;

function buildWheelLabels() {
  const radius = 39; // % from center
  const offset = -90 + sliceAngle / 2;
  wheel.querySelectorAll(".slice-label").forEach(el => el.remove());

  options.forEach((opt, i) => {
    const label = document.createElement("div");
    label.className = "slice-label";
    label.textContent = opt.name;
    const angle = offset + i * sliceAngle;
    label.style.transform = `rotate(${angle}deg) translate(${radius}%, -50%) rotate(90deg)`;
    wheel.appendChild(label);
  });
}

function randomIndex() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % options.length;
}

function spinTo(index) {
  const extraTurns = 5 + Math.floor(Math.random() * 2); // 5 or 6 turns
  const centerAngle = index * sliceAngle + sliceAngle / 2;
  const targetRotation = currentRotation + extraTurns * 360 + (360 - centerAngle);
  currentRotation = targetRotation % 360 + Math.floor(targetRotation / 360) * 360;
  wheel.style.transform = `rotate(${targetRotation}deg)`;
}

function showWinner(index) {
  const opt = options[index];
  lastWinner = opt;

  winnerNameEl.textContent = opt.name;
  winnerQrEl.src = opt.qr;
  winnerQrEl.alt = `QR de ${opt.name}`;

  if (opt.link && opt.link.trim()) {
    openLinkEl.href = opt.link;
    openLinkEl.classList.remove("hidden");
  } else {
    openLinkEl.classList.add("hidden");
  }

  resultEl.classList.remove("hidden");
  statusEl.textContent = `${opt.name} fue elegido.`;

  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  spinBtn.disabled = true;
  resultEl.classList.add("hidden");
  statusEl.textContent = "Girando...";
  const index = randomIndex();
  spinTo(index);

  const onEnd = () => {
    wheel.removeEventListener("transitionend", onEnd);
    spinning = false;
    spinBtn.disabled = false;
    showWinner(index);
  };

  wheel.addEventListener("transitionend", onEnd, { once: true });
});

copyBtn.addEventListener("click", async () => {
  if (!lastWinner) return;
  try {
    await navigator.clipboard.writeText(lastWinner.name);
    copyBtn.textContent = "Copiado";
    setTimeout(() => (copyBtn.textContent = "Copiar nombre"), 1200);
  } catch {
    copyBtn.textContent = "No disponible";
    setTimeout(() => (copyBtn.textContent = "Copiar nombre"), 1200);
  }
});

buildWheelLabels();
