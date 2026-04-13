const UNITS = [
  {
    id: "u1",
    title: "Von Neumann architecture",
    sub: "Functional units, ISA, registers & addressing",
    icon: "🖥",
    color: "c1",
    topics: [
      "Functional units of Von Neumann architecture",
      "Arithmetic Logic Unit (ALU)",
      "Data paths and their role",
      "Registers — types and purpose",
      "Instruction Set Architecture (ISA)",
      "Addressing modes — immediate, direct, indirect, register, etc.",
    ]
  },
  {
    id: "u2",
    title: "Data representation & arithmetic",
    sub: "Integers, floating point, characters & hardware arithmetic",
    icon: "🔢",
    color: "c2",
    topics: [
      "Overview of integer data representation",
      "Fixed and floating point number systems",
      "Non-numeric data — characters, strings, records, arrays",
      "Integer addition and subtraction",
      "Ripple carry adder",
      "Carry look-ahead adder",
      "Multiplication — shift-and-add method",
      "Booth's multiplier algorithm",
      "Integer division hardware",
      "Floating point arithmetic (IEEE 754)",
    ]
  },
  {
    id: "u3",
    title: "Pipelining & parallelism",
    sub: "ILP, hazards, dynamic scheduling & superscalar",
    icon: "⚙",
    color: "c3",
    topics: [
      "Overview of pipelining",
      "Throughput and speedup analysis",
      "Pipelined data path and control",
      "Data dependency and data hazards",
      "Control hazards (branch hazards)",
      "Structural hazards",
      "Instruction level parallelism (ILP) — concepts and challenges",
      "Compiler techniques for exposing ILP",
      "Dynamic scheduling (Tomasulo's algorithm)",
      "VLIW architecture",
      "Superscalar architecture",
      "Overview of thread level parallelism",
    ]
  },
  {
    id: "u4",
    title: "Memory system & I/O",
    sub: "Cache, virtual memory, disk & I/O techniques",
    icon: "💾",
    color: "c4",
    topics: [
      "Temporal and spatial locality principles",
      "Cache memories — address mapping",
      "Cache block size, replacement and store policy",
      "Virtual memory — page table",
      "Translation Lookaside Buffer (TLB)",
      "Disk organization",
      "Data access from disk drive",
      "Programmed I/O",
      "Interrupt-driven I/O",
      "Handshaking",
      "Direct Memory Access (DMA)",
      "Interrupts — types and handling",
    ]
  }
];

const COLOR_MAP = {
  c1: { text: "var(--c1)", bg: "var(--c1-bg)", check: "#178B5A" },
  c2: { text: "var(--c2)", bg: "var(--c2-bg)", check: "#B75A0D" },
  c3: { text: "var(--c3)", bg: "var(--c3-bg)", check: "#1A5FAB" },
  c4: { text: "var(--c4)", bg: "var(--c4-bg)", check: "#7A2E9C" },
};

let state = {};

function loadState() {
  try {
    state = JSON.parse(localStorage.getItem("syllabus_v1") || "{}");
  } catch {
    state = {};
  }
}

function saveState() {
  try {
    localStorage.setItem("syllabus_v1", JSON.stringify(state));
  } catch {}
}

function toggleTopic(uid, idx) {
  const key = uid + "_" + idx;
  state[key] = !state[key];
  saveState();
  render();
}

function resetAll() {
  if (!confirm("Reset all progress?")) return;
  state = {};
  saveState();
  render();
}

function toggleUnit(uid) {
  const el = document.getElementById("unit_" + uid);
  el.classList.toggle("open");
}

function render() {
  const container = document.getElementById("units-container");
  let totalAll = 0, doneAll = 0;

  UNITS.forEach(u => {
    const c = COLOR_MAP[u.color];
    let done = 0;
    u.topics.forEach((_, i) => { if (state[u.id + "_" + i]) done++; });
    totalAll += u.topics.length;
    doneAll += done;
    const pct = u.topics.length ? Math.round(done / u.topics.length * 100) : 0;

    const existing = document.getElementById("unit_" + u.id);
    if (existing) {
      existing.querySelector(".unit-pct").textContent = pct + "%";
      existing.querySelector(".unit-pct").style.color = c.text;
      existing.querySelector(".unit-mini-fill").style.width = pct + "%";
      existing.querySelector(".unit-sub").textContent = done + " / " + u.topics.length + " topics";
      u.topics.forEach((t, i) => {
        const chk = existing.querySelector(`[data-idx="${i}"] .check`);
        const lbl = existing.querySelector(`[data-idx="${i}"] .topic-label`);
        const isDone = !!state[u.id + "_" + i];
        chk.classList.toggle("done", isDone);
        chk.style.background = isDone ? c.check : "";
        lbl.classList.toggle("done", isDone);
      });
    } else {
      const div = document.createElement("div");
      div.className = "unit";
      div.id = "unit_" + u.id;
      div.innerHTML = `
        <div class="unit-header" onclick="toggleUnit('${u.id}')">
          <div class="unit-icon" style="background:${c.bg};color:${c.text}">${u.icon}</div>
          <div class="unit-meta">
            <div class="unit-title">${u.title}</div>
            <div class="unit-sub">${done} / ${u.topics.length} topics</div>
          </div>
          <div class="unit-progress">
            <div class="unit-pct" style="color:${c.text}">${pct}%</div>
            <div class="unit-mini-bar">
              <div class="unit-mini-fill" style="background:${c.text};width:${pct}%"></div>
            </div>
          </div>
          <div class="chevron">›</div>
        </div>
        <div class="topics">
          ${u.topics.map((t, i) => `
            <div class="topic" data-idx="${i}" onclick="toggleTopic('${u.id}', ${i})">
              <div class="check" style="${state[u.id + '_' + i] ? 'background:' + c.check + ';border-color:transparent' : ''}">
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="topic-label ${state[u.id + '_' + i] ? 'done' : ''}">${t}</div>
            </div>
          `).join("")}
        </div>
      `;
      container.appendChild(div);
    }
  });

  const pct = totalAll ? Math.round(doneAll / totalAll * 100) : 0;
  document.getElementById("main-bar").style.width = pct + "%";
  document.getElementById("main-label").textContent = doneAll + " of " + totalAll + " topics completed";
  document.getElementById("s-total").textContent = totalAll;
  document.getElementById("s-done").textContent = doneAll;
  document.getElementById("s-rem").textContent = totalAll - doneAll;
  document.getElementById("s-pct").textContent = pct + "%";
}

// Init
loadState();
render();