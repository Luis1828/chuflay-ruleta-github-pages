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
const wheelStartAngle = -90;     // empieza arriba
const pointerAngle = -180;        // puntero fijo arriba
let spinning = false;
let currentRotation = 0;
let lastWinner = null;

function cryptoRandomInt(max) {
  if (!Number.isInteger(max) || max <= 0) throw new Error("max debe ser un entero mayor que 0");

  const range = 0x100000000;
  const limit = Math.floor(range / max) * max;
  const buf = new Uint32Array(1);
  let x;

  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);

  return x % max;
}

function buildWheelLabels() {
  wheel.querySelectorAll(".slice-label").forEach((el) => el.remove());

  options.forEach((opt, i) => {
    const label = document.createElement("div");
    label.className = "slice-label";
    label.textContent = opt.name;

    const angle = wheelStartAngle + i * sliceAngle + sliceAngle / 2;
    label.style.transform = `rotate(${angle}deg) translate(39%, -50%) rotate(90deg)`;

    wheel.appendChild(label);
  });
}

function spinToWinner(index) {
  const extraTurns = 6 + cryptoRandomInt(3); // 6, 7 u 8 vueltas
  const normalized = ((currentRotation % 360) + 360) % 360;
  const segmentCenter = wheelStartAngle + index * sliceAngle + sliceAngle / 2;

  // Queremos que el centro del segmento ganador caiga exactamente en el puntero superior.
  // targetRotation = puntero - centro + vueltas extra
  const delta = ((pointerAngle - segmentCenter - normalized) % 360 + 360) % 360;
  const targetRotation = currentRotation + extraTurns * 360 + delta;

  wheel.style.transform = `rotate(${targetRotation}deg)`;
  currentRotation = targetRotation;
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

  // El ganador se decide antes de la animación.
  const winnerIndex = cryptoRandomInt(options.length);

  // La rueda gira hasta ese resultado exacto.
  spinToWinner(winnerIndex);

  const onEnd = () => {
    wheel.removeEventListener("transitionend", onEnd);
    spinning = false;
    spinBtn.disabled = false;
    showWinner(winnerIndex);
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