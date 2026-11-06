// Cards for the personal room's own stops: the published papers on the bookshelf and the SaaS vision board.

export const PUBLICATIONS = [
  {
    short: "Smart Wardrobe",
    title: "AI-Powered Smart Wardrobe and Personalized Outfit Recommendation System Using Deep Learning",
    journal: "International Journal of Creative Research Thoughts (IJCRT)",
    journalShort: "IJCRT",
    detail: "Vol. 14, Issue 3 · pp. a437–a444 · Paper ID IJCRT2603057",
    date: "March 2026",
    year: "2026",
    authors: "Mohamed Aazil S, Nithin S, Hariprasath S, Akashraj S",
    summary: "A smart wardrobe that sorts photos of your clothes with a ResNet50 deep learning model and suggests outfits based on body type, skin tone and what you've worn recently. The classifier reached 93.2% validation accuracy and 88.7% on real-world photos.",
    tags: ["Deep Learning", "ResNet50", "CLIP", "Computer Vision", "Recommendation"],
    url: "https://ijcrt.org/viewfulltext.php?&p_id=IJCRT2603057",
    cover: "#7a2e3a",
  },
  {
    short: "Twitter Sentiment",
    title: "Twitter Data for Sentimental Analysis",
    journal: "Mukt Shabd Journal",
    journalShort: "Mukt Shabd",
    detail: "Published 20 September 2023",
    date: "September 2023",
    year: "2023",
    authors: "",
    summary: "Sentiment analysis of tweets about the Covid-19 vaccine. Using Python, NLTK and supervised models (SVM, Naive Bayes and Random Forest), tweets were sorted into positive, negative and neutral, giving a read on public opinion for marketing, research and policy.",
    tags: ["NLP", "NLTK", "SVM", "Naive Bayes", "Random Forest"],
    url: "",
    cover: "#22406e",
  },
  {
    short: "CO2 Capture",
    title: "Advances in CO2 Capture using Absorption and Adsorption Technology: A Review",
    journal: "Journal of Emerging Technologies and Innovative Research (JETIR)",
    journalShort: "JETIR",
    detail: "Vol. 8, Issue 11 · pp. c733–c739 · Paper ID JETIR2111297",
    date: "November 2021",
    year: "2021",
    authors: "Saravanakumar R, Sachin Kumar, Nithin, Aditya Krishna",
    summary: "A review of ways to capture CO2 from power-plant flue gas: absorption with solvents, and adsorption with solid sorbents such as amines, activated carbon and lithium-based silicates, comparing how well each one works.",
    tags: ["Review", "Carbon capture", "Climate"],
    url: "https://www.jetir.org/view?paper=JETIR2111297",
    cover: "#2f5d46",
  },
];

export const ROADMAP = [
  ["Idea", "Finding the problem worth solving, and keeping it under wraps until it's ready.", "Now"],
  ["Build", "Turning it into a product, using what I've learned shipping AI and LLM systems.", "Next"],
  ["Launch", "Putting it in front of the first users and learning fast.", "Soon"],
  ["Scale", "Growing it into a company of my own.", "Goal"],
];

export const EXTRA_SECTIONS = {
  publications: { label: "Papers", color: "#e9c46a", tip: "Journals: my three published papers" },
  future: { label: "Future", color: "#6cc5ff", tip: "Blueprint: what I'm building next" },
  films: { label: "Films", color: "#ff8a5c", tip: "Home cinema: movies and stories" },
  heartbreak: { label: "Torn Pages", color: "#ff6b8b", tip: "Torn Pages: a poster from a sad chapter" },
  phone: { label: "Phone", color: "#7cf2c8", tip: "Unknown caller: click to answer" },
  guestbook: { label: "Guestbook", color: "#f4d35e", tip: "Guestbook: pin a note" },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function mountPublications(root, hooks, openIndex) {
  root.innerHTML = `
    <p class="eyebrow">Publications</p>
    <h2>Three papers, in print</h2>
    <p class="lead">Each journal on the shelf is one of my published papers. Pick one to open it.</p>
    <div class="view"><ul class="projects">${PUBLICATIONS.map((p, i) => `
      <li class="acc in${i === openIndex ? " open" : ""}" style="--i:${i}">
        <button class="acc-head" type="button" aria-expanded="${i === openIndex}" data-i="${i}">
          <span class="thumb" style="background:${p.cover};color:#f4d35e">${esc(p.year.slice(2))}</span>
          <span class="acc-title"><span class="tagline">${esc(p.journalShort)} · ${esc(p.date)}</span><strong>${esc(p.short)}</strong></span>
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div class="acc-body"><div>
          <span class="meta">${esc(p.journal)}<br>${esc(p.detail)}</span>
          <p><strong>${esc(p.title)}</strong></p>
          ${p.authors ? `<p class="sub">${esc(p.authors)}</p>` : ""}
          <p>${esc(p.summary)}</p>
          <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
          ${p.url ? `<div class="actions"><a class="action solid" href="${esc(p.url)}" target="_blank" rel="noopener">Read the paper</a></div>` : ""}
        </div></div>
      </li>`).join("")}</ul></div>`;
  root.querySelectorAll(".acc-head").forEach((b) => b.addEventListener("click", () => {
    const li = b.parentElement, open = !li.classList.contains("open");
    root.querySelectorAll(".acc").forEach((x) => { x.classList.remove("open"); x.querySelector(".acc-head").setAttribute("aria-expanded", "false"); });
    li.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open));
    hooks.journal(open ? Number(b.dataset.i) : null);
  }));
}

export function mountFuture(root, hooks) {
  root.innerHTML = `
    <p class="eyebrow">What's next</p>
    <h2>My own SaaS company</h2>
    <p class="lead">The goal: start a SaaS company of my own, built on a groundbreaking idea. The blueprint’s drawn; the details stay under wraps for now.</p>
    <div class="view">
      <ol class="timeline">${ROADMAP.map(([step, text, when], i) => `
        <li class="acc in${i === 0 ? " open" : ""}" style="--i:${i}">
          <div class="acc-head"><span class="badge">${esc(when)}</span><span class="acc-title"><strong>${esc(step)}</strong><small>${esc(text)}</small></span></div>
        </li>`).join("")}</ol>
      <div class="actions"><button class="action solid" type="button" data-go="contact">Want to hear about it first? Say hi</button></div>
    </div>`;
  root.querySelector("[data-go]").addEventListener("click", () => hooks.go("contact"));
}

export const HEARTBREAK_LINES = [
  ["You handed me the script to a perfect life, then tore up the pages.", ""],
  ["Some stories end before the climax, and you still remember every scene.", ""],
  ["The saddest scenes are the ones you replay alone.", ""],
  ["The heart was made to be broken.", "Oscar Wilde"],
  ["’Tis better to have loved and lost than never to have loved at all.", "Alfred, Lord Tennyson"],
];

export function mountFilms(root) {
  const scenes = [
    ["Scene 01 · Int. room, after midnight", "The writer", "The house is asleep. A cursor blinks. Characters who refuse to leave my head finally get a page of their own."],
    ["Scene 02 · Ext. anywhere, golden hour", "The director", "Everything becomes a frame: the light through a window, a pause before a line, the cut that makes you feel it."],
  ];
  const slate = [["Short film", "In pre-production"], ["Story collection", "Chapter by chapter"], ["Genre", "Quiet, human, hopeful"], ["Release", "When it's ready"]];
  root.innerHTML = `
    <p class="eyebrow">Now showing · Reel one</p>
    <h2>Movies & stories</h2>
    <div class="view reel">
      <p class="logline in" style="--i:0">By day, he teaches machines to understand stories. By night, he writes his own.</p>
      ${scenes.map(([head, title, text], i) => `
      <div class="scene in" style="--i:${i + 1}"><b>${esc(head)}</b><strong>${esc(title)}</strong><span>${esc(text)}</span></div>`).join("")}
      <div class="slate in" style="--i:3">${slate.map(([k, v]) => `<div><small>${esc(k)}</small><em>${esc(v)}</em></div>`).join("")}</div>
      <p class="fade in" style="--i:4">TO BE CONTINUED…</p>
    </div>`;
}

export function mountHeartbreak(root) {
  root.innerHTML = `
    <p class="eyebrow">A sad chapter</p>
    <h2>Torn pages</h2>
    <p class="lead">Every storyteller has a chapter he’d rather not rewrite. These lines kept me company through mine.</p>
    <div class="view">${HEARTBREAK_LINES.map(([line, who], i) => `
      <div class="card static in" style="--i:${i}"><strong>“${esc(line)}”</strong>${who ? `<span>${esc(who)}</span>` : ""}</div>`).join("")}
      <p class="sub">Still writing. The next chapter’s better.</p>
    </div>`;
}

export function mountPhone(root, hooks) {
  root.innerHTML = `
    <p class="eyebrow">Incoming call</p>
    <h2>Hey, you’ve reached me</h2>
    <p class="lead">Sorry I missed you. I’m probably asleep on the sofa after a long training run.</p>
    <div class="view">
      <div class="card static in"><strong>Leave a message after the beep…</strong><span>Or better: pin a note on the guestbook, or drop me an email. I’ll get back to you when I wake up.</span></div>
      <div class="actions"><button class="action solid" type="button" data-go="guestbook">Pin a note</button><button class="action" type="button" data-go="contact">Email me</button></div>
    </div>`;
  root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => hooks.go(b.dataset.go)));
}

// The guestbook card: a short form, and the notes already on the board. Notes are shown with textContent, never as HTML.
export function mountGuestbook(root, { notes, submit }) {
  root.innerHTML = `
    <p class="eyebrow">Guestbook</p>
    <h2>Pin a note</h2>
    <p class="lead">Say hi, leave a thought, or tell me what you liked. Notes go up on the board once I’ve read them.</p>
    <div class="view">
      <form class="letter in" novalidate>
        <label for="gb-name">Your name (optional)</label>
        <input id="gb-name" name="name" maxlength="30" autocomplete="nickname" placeholder="Anonymous">
        <label for="gb-note">Your note</label>
        <textarea id="gb-note" name="message" maxlength="160" rows="3" required placeholder="Loved the room!"></textarea>
        <input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
        <button class="action solid" type="submit">Pin it</button>
        <p class="sub" role="status" aria-live="polite"></p>
      </form>
      <p class="sub">On the board</p>
      <div class="gb-notes"></div>
    </div>`;
  const list = root.querySelector(".gb-notes");
  if (!notes.length) { const empty = document.createElement("p"); empty.className = "sub"; empty.textContent = "No notes yet. Be the first."; list.append(empty); }
  notes.forEach((n, i) => {
    const card = document.createElement("div"); card.className = "card static in"; card.style.setProperty("--i", i);
    const msg = document.createElement("strong"); msg.textContent = n.message;
    const who = document.createElement("span"); who.textContent = "— " + (n.name || "Anonymous");
    card.append(msg, who); list.append(card);
  });
  const form = root.querySelector("form"), status = form.querySelector("[role=status]"), button = form.querySelector("button");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if ((data.message || "").trim().length < 2) { status.textContent = "Write a short note first."; return; }
    button.disabled = true; status.textContent = "Pinning…";
    try { await submit(data); form.reset(); status.textContent = "Thanks! Your note will appear on the board once it’s approved."; }
    catch (err) { status.textContent = err.message; }
    finally { button.disabled = false; }
  });
}
