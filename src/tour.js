// The robot's guided tour for first-time visitors.
const STORAGE_KEY = "room-tour-seen";

const STEPS = [
  { say: "Shh, he's asleep. The models are still training. I'm his robot. Want me to show you what he's built?", primary: "Show me", secondary: "I'll look around myself" },
  { key: "projects", say: "Everything he's built runs on this monitor. Open a project, like the AI Hiring Platform or DocuMentor, and watch it work." },
  { key: "experience", say: "One note on this board for every job, with what he actually shipped there." },
  { key: "skills", say: "This rack runs his skills. Pick one and it shows you where he used it. Receipts included." },
  { key: "certificates", say: "One book for every certificate. Open one and it shows where he used it. He did the homework too." },
  { key: "contact", say: "Want to reach him? Leave a letter in the mailbox. I'll make sure he sees it when he wakes up." },
  { key: "about", say: "And that's Nithin. Click him to read about him. Don't worry, he won't wake up." },
  { say: "That's the tour. Click anything in the room, or use the menu below. Click me if you want to go round again.", primary: "Start exploring" },
];

export function hasSeenTour() {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
}

export function createTour({ anchors, project, setPointing }) {
  const bubble = document.createElement("div");
  bubble.id = "bubble";
  bubble.setAttribute("role", "dialog");
  bubble.setAttribute("aria-label", "Guided tour");
  bubble.setAttribute("aria-live", "polite");
  const ring = document.createElement("div");
  ring.id = "ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.append(ring, bubble);

  let index = -1;
  const isActive = () => index >= 0;

  function end() {
    if (index < 0) return;
    index = -1;
    bubble.classList.remove("show");
    ring.classList.remove("show");
    setPointing(null, "home");
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* the tour simply shows again next time */ }
  }

  function show(i) {
    index = i;
    const step = STEPS[i];
    const numbered = i > 0 && i < STEPS.length - 1;
    bubble.innerHTML = `
      <p>${step.say}</p>
      <div class="bubble-actions">
        ${numbered ? `<span class="count">${i} of ${STEPS.length - 2}</span>` : ""}
        ${numbered || step.secondary ? `<button type="button" class="quiet" data-act="skip">${step.secondary ?? "Skip"}</button>` : ""}
        <button type="button" class="go" data-act="next">${step.primary ?? "Next"}</button>
      </div>`;
    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");
    bubble.querySelector('[data-act="next"]').addEventListener("click", () => (i >= STEPS.length - 1 ? end() : show(i + 1)));
    bubble.querySelector('[data-act="skip"]')?.addEventListener("click", end);
    bubble.querySelector('[data-act="next"]').focus({ preventScroll: true });
    ring.classList.toggle("show", Boolean(step.key));
    setPointing(step.key ? anchors[step.key] : "wave", step.key ?? "home");
  }

  function place() {
    if (!isActive()) return;
    const step = STEPS[index];
    if (step.key) {
      const p = project(anchors[step.key]);
      ring.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
  }

  return { start: () => show(0), end, place, isActive };
}
