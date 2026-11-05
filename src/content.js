// Content and interactive cards for each object in the 3D room.
const gh = (repo) => `https://github.com/nithinskumar866/${repo}`;
export const RESUME = "/Nithin_S_Resume.pdf";
export const EMAIL = "nithinsofficial86@gmail.com";

export const EXPERIENCE = [
  {
    company: "Techwaukee India", role: "AI Application Developer Intern", year: "2026", period: "Jul to Oct 2026", place: "Coimbatore",
    intro: "Owned the LLM workstream of a live AI-powered recruitment product, alongside the core engineering team.",
    points: [
      "Fine-tuned LLMs with LoRA/PEFT, then used distillation and quantisation to cut model size and inference cost.",
      "Built RAG pipelines and an agentic RAG approach that plans retrieval, calls tools and self-checks answers.",
      "Developed LLM extraction and classification over unstructured documents.",
      "Wrote evaluation harnesses for retrieval quality, answer accuracy and agent reasoning.",
    ],
    stack: ["LoRA / PEFT", "Quantisation", "LangChain", "LangGraph", "Agentic RAG", "Evaluation"],
  },
  {
    company: "VOIS", role: "Blockchain Intern", year: "2025", period: "Jan to Mar 2025", place: "Remote",
    intro: "Built a decentralised land registry to make property transactions more secure and transparent.",
    points: ["Designed Solidity smart contracts that automate land registration.", "Developed and deployed the registry system on Ethereum."],
    stack: ["Solidity", "Ethereum"],
  },
  {
    company: "CodeClause", role: "AI Intern", year: "2025", period: "Jan to Feb 2025", place: "Remote",
    intro: "Built an NLP system that analyses CVs and predicts personality traits such as conscientiousness and openness.",
    points: ["Combined spaCy text processing with scikit-learn classification models."],
    stack: ["Python", "spaCy", "scikit-learn"],
  },
  {
    company: "Rius Technology", role: "Intern", year: "2023", period: "Aug to Oct 2023", place: "Bangalore",
    intro: "Developed a machine learning model to predict depression rates in married couples.",
    points: [],
    stack: ["Python", "Machine Learning"],
  },
];

export const PROJECTS = [
  { id: "hiring", title: "AI Hiring Intelligence Platform", cat: "agents", tag: "Agentic RAG", tagline: "Candidate scores that trace back to evidence.", img: "/projects/hiring-dashboard.png", alt: "Dashboard with fictional sample data", problem: "Resume screening tools produce scores that recruiters can't check or trust.", points: ["Scores follow Requirement, Evidence, then Reasoning.", "Authenticity checks flag skills listed but never demonstrated.", "Model Lab compares embedding models; Prompt Lab tests prompts rule by rule."], stack: ["LangGraph", "FastAPI", "FAISS", "Qdrant", "React", "ASP.NET Core"], code: gh("code_clause_2-golden---CC3598") },
  { id: "agenttest", title: "agenttest", cat: "agents", tag: "Agent testing", tagline: "pytest for AI agents.", problem: "Agents fail in ways unit tests miss: hallucinations, tool loops, broken JSON and flaky answers.", points: ["Runs any agent through one API and traces every step.", "Simulates tool failures across frameworks.", "The judge must quote evidence, and each quote is verified in code."], stack: ["Python", "pytest", "LangGraph", "CrewAI", "OpenAI Agents SDK"], code: gh("agent_test_pip") },
  { id: "investo", title: "Investo", cat: "fullstack", tag: "Full stack", tagline: "Matches startups with investors, and explains why.", img: "/projects/investo-matches.png", alt: "Investo ranked investor matches", problem: "Early fundraising is scattered across email threads and shared folders.", points: ["Weighted match scoring across nine factors.", "AI explanations from a local language model.", "Chat, meetings, data rooms and a deal pipeline in one product."], stack: ["Django", "Next.js", "PostgreSQL", "Redis", "Ollama"], code: gh("investo-platform"), demo: "https://investo-demo.vercel.app", note: "College project. All money is simulated." },
  { id: "agentcorp", title: "AgentCorp", cat: "agents", tag: "Multi-agent", tagline: "A services company run by Google ADK agents.", problem: "Can each department of a company become an agent with a clean handoff?", points: ["A PM agent turns client conversations into a versioned spec.", "A developer agent designs the architecture from that spec.", "24 deterministic tests that need no API key."], stack: ["Python", "Google ADK"], code: gh("agent_Agile_ai") },
  { id: "homework", title: "AI Students Homework Comparison", cat: "agents", tag: "LangChain", tagline: "Checks tutors' notes against the textbook.", problem: "Homework should match what was actually taught that day.", points: ["Analyses textbook content and tutors' notes for the lesson.", "Generates homework and question patterns through structured prompting."], stack: ["Python", "LangChain", "Flask"], code: gh("AIdoccreator"), demo: "https://ai-homework.vercel.app" },
  { id: "style", title: "Style Matrix", cat: "fullstack", tag: "Computer vision", tagline: "An AI wardrobe assistant, built as a team.", img: "/projects/style-outfits.png", alt: "Outfit suggestions from sample images", problem: "Choosing outfits from a real wardrobe, including what's in the wash.", points: ["A ResNet50 sorts items into 50 clothing categories.", "Plain-text prompts return ranked outfits.", "My merged work includes the API and Supabase connectivity."], stack: ["FastAPI", "React", "ResNet50", "Supabase"], code: "https://github.com/MohamedAazil/style-matrix" },
  { id: "models", title: "15 Machine Learning Models", cat: "ml", tag: "Core ML", tagline: "One repo for each core algorithm.", problem: "Building a working understanding of the core algorithms by implementing each one.", points: ["Covers classification, regression, clustering and dimensionality reduction.", "Tuned with hyperparameter search and feature selection."], stack: ["Python", "scikit-learn"], code: "https://github.com/nithinskumar866?tab=repositories" },
  { id: "land", title: "Decentralised Land Registry", cat: "fullstack", tag: "Web3", tagline: "Tamper-proof land records on Ethereum.", problem: "Land records are vulnerable to fraud and heavy on paperwork.", points: ["Solidity contracts automate registration and verify ownership.", "Records are stored immutably on Ethereum."], stack: ["Solidity", "Ethereum", "React"], code: gh("edunet-voisl_and_reg") },
  { id: "linkbery", title: "Linkbery", cat: "fullstack", tag: "Web", tagline: "Courses from many platforms, in one place.", problem: "Finding a course means searching several platforms one at a time.", points: ["Scraped courses from Coursera, Udemy and Scrimba.", "Serves them by category through Firebase."], stack: ["JavaScript", "Firebase"], code: gh("linkbery-groupproject") },
  { id: "folio", title: "Portfolio (Vue & Django)", cat: "fullstack", tag: "Web", tagline: "An earlier portfolio with auth and project management.", problem: "Managing portfolio content without editing code.", points: ["Vue.js frontend and Django backend, with authentication."], stack: ["Vue.js", "Django"], code: gh("django-portfolio-") },
];

const CATEGORIES = [["all", "All"], ["agents", "Agents & LLM"], ["fullstack", "Full stack"], ["ml", "Machine learning"]];

export const SKILLS = [
  { name: "LLM Engineering", items: { "Fine-tuning (LoRA, PEFT)": ["Techwaukee India"], "Knowledge Distillation": ["Techwaukee India"], Quantisation: ["Techwaukee India"], "Prompt Engineering": ["Techwaukee India", "AI Hiring Platform", "AgentCorp", "Homework Comparison"], "LLM Evaluation": ["Techwaukee India", "agenttest", "AI Hiring Platform"], "Synthetic Data": ["Techwaukee India"], "Hugging Face": ["Techwaukee India"] } },
  { name: "Agentic AI & RAG", items: { LangChain: ["Techwaukee India", "Homework Comparison"], LangGraph: ["Techwaukee India", "AI Hiring Platform", "agenttest"], "Agentic RAG": ["Techwaukee India", "AI Hiring Platform"], OpenClaw: [], "Mastra AI": [], "Vector Databases": ["Techwaukee India", "AI Hiring Platform", "Style Matrix"], "Agent Memory": ["Techwaukee India"], "Tool Calling": ["Techwaukee India", "agenttest", "AgentCorp"] } },
  { name: "ML & NLP", items: { "scikit-learn": ["CodeClause", "15 ML Models"], spaCy: ["CodeClause"], Classification: ["CodeClause", "15 ML Models", "Rius Technology"], Regression: ["15 ML Models"], Clustering: ["15 ML Models"], "Feature Selection": ["15 ML Models"] } },
  { name: "Languages", items: { Python: ["Techwaukee India", "agenttest", "Investo", "15 ML Models"], SQL: ["Investo", "Style Matrix"], JavaScript: ["Linkbery", "Land Registry"], Java: ["Java programs"] } },
  { name: "Backend & Web", items: { Django: ["Investo", "Portfolio (Vue & Django)"], "REST APIs": ["Investo", "Style Matrix"], Firebase: ["Linkbery"], "Vue.js": ["Portfolio (Vue & Django)"], Bootstrap: ["Rathinam AI & DS site"] } },
  { name: "Tools & Data", items: { Git: ["All projects"], "Power BI": ["DataCamp certificate"], Figma: [] } },
];

export const CERTS = [
  ["IBM AI Engineering (Professional)", "IBM, Coursera"], ["Zero to Hero in LangChain", "Udemy"], ["Professional Data Scientist, Power BI", "DataCamp"], ["Associate Data Scientist", "DataCamp"],
  ["Data Scientist", "DataCamp"], ["Python & Django Complete Web Development", "Udemy"], ["Complete JavaScript & React Core", "Udemy"], ["Java DSA: Mastering the Fundamentals", "Online course"],
];

export const FOCUS = [
  ["LLM engineering", "Fine-tuning with LoRA and PEFT, plus distillation and quantisation to cut size and inference cost."],
  ["Agentic AI & RAG", "Retrieval pipelines and agents that plan steps, call tools and check their own answers."],
  ["Evaluation", "Harnesses that measure retrieval quality, answer accuracy and agent reasoning."],
  ["ML foundations", "Supervised and unsupervised modelling, feature selection and hyperparameter tuning."],
];

export const SECTIONS = {
  about: { label: "About", tip: "Nithin, fast asleep: about him", color: "#ffc48a", eyebrow: "Asleep on the sofa", title: "Hi, I'm Nithin", lead: "A 2026 AI & Data Science graduate building production LLM and agentic AI systems." },
  projects: { label: "Projects", tip: "The monitor: projects", color: "#6cc5ff", eyebrow: "On the monitor", title: "Things I've built", lead: "Open a project to see it on the monitor in the room." },
  experience: { label: "Experience", tip: "The pinboard: experience", color: "#e8b06f", eyebrow: "On the pinboard", title: "Where I've worked", lead: "Open a job and its note lifts off the board." },
  skills: { label: "Skills", tip: "The server rack: skills", color: "#9be26e", eyebrow: "In the server rack", title: "What runs here", lead: "Choose a skill to see where I've used it." },
  certificates: { label: "Certificates", tip: "The bookshelf: certificates", color: "#f4907a", eyebrow: "On the bookshelf", title: "One book per certificate", lead: "Hover or tap a certificate to pull its book off the shelf." },
  contact: { label: "Contact", tip: "The mailbox: contact", color: "#8aaeff", eyebrow: "In the mailbox", title: "Drop me a letter", lead: "I'm looking for AI and LLM engineering roles." },
};
export const SECTION_ORDER = Object.keys(SECTIONS);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const chips = (list) => `<div class="tags">${list.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;
const external = (href, text, cls = "action") => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${text}<span aria-hidden="true"> &#8599;</span></a>`;
const chevron = `<span class="chev" aria-hidden="true"></span>`;

const VIEWS = {
  about: () => `
    <dl class="stats">${[[4, "Internships"], [10, "Projects"], [15, "ML models"], [8, "Certificates"]].map(([n, l], i) => `<div class="stat in" style="--i:${i}"><dd data-count="${n}">${n}</dd><dt>${l}</dt></div>`).join("")}</dl>
    <h3 class="sub">What I work on</h3>
    <div class="grid2">${FOCUS.map(([t, d], i) => `<button type="button" class="tile in" style="--i:${i + 3}" aria-pressed="${i === 0}"><strong>${esc(t)}</strong><span>${esc(d)}</span></button>`).join("")}</div>
    <div class="card static in" style="--i:8"><small>Education, Nov 2022 to May 2026</small><strong>B.Tech. in AI &amp; Data Science</strong><span>Rathinam Technical Campus, Coimbatore</span></div>
    <a class="action solid in" style="--i:9" href="${RESUME}" download>Download my resume</a>`,

  experience: () => `<ol class="timeline">${EXPERIENCE.map((job, i) => `
    <li class="acc in ${i === 0 ? "open" : ""}" style="--i:${i}" data-index="${i}">
      <button type="button" class="acc-head" aria-expanded="${i === 0}">
        <span class="badge">${job.year}</span>
        <span class="acc-title"><strong>${esc(job.company)}</strong><small>${esc(job.role)}</small></span>
        ${chevron}
      </button>
      <div class="acc-body"><div>
        <small class="meta">${job.period} &middot; ${job.place}</small>
        <p>${esc(job.intro)}</p>
        ${job.points.length ? `<ul>${job.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        ${chips(job.stack)}
      </div></div>
    </li>`).join("")}</ol>`,

  projects: () => `
    <div class="filters" role="group" aria-label="Filter projects">${CATEGORIES.map(([id, l], i) => `<button type="button" data-cat="${id}" aria-pressed="${i === 0}">${esc(l)}</button>`).join("")}</div>
    <div class="projects">${PROJECTS.map((p, i) => `
      <article class="acc project in" style="--i:${i}" data-cat="${p.cat}" data-id="${p.id}">
        <button type="button" class="acc-head" aria-expanded="false">
          ${p.img ? `<img src="${p.img}" alt="" loading="lazy">` : `<span class="thumb" aria-hidden="true">${esc(p.title.slice(0, 2))}</span>`}
          <span class="acc-title"><small class="tagline">${esc(p.tag)}</small><strong>${esc(p.title)}</strong><small>${esc(p.tagline)}</small></span>
          ${chevron}
        </button>
        <div class="acc-body"><div>
          ${p.img ? `<img class="wide" src="${p.img}" alt="${esc(p.alt)}" loading="lazy">` : ""}
          <p>${esc(p.problem)}</p>
          <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          ${chips(p.stack)}
          ${p.note ? `<small class="meta">${esc(p.note)}</small>` : ""}
          <div class="actions">${external(p.code, "View code")}${p.demo ? external(p.demo, "Live demo", "action solid") : ""}</div>
        </div></div>
      </article>`).join("")}</div>`,

  skills: () => `
    <div class="filters" role="group" aria-label="Skill groups">${SKILLS.map((g, i) => `<button type="button" data-group="${i}" aria-pressed="${i === 0}">${esc(g.name)}</button>`).join("")}</div>
    <div class="skill-list" id="skill-list"></div>
    <div class="evidence" id="evidence" aria-live="polite"></div>`,

  certificates: () => `<ul class="certs">${CERTS.map(([n, by], i) => `
    <li class="in" style="--i:${i}"><button type="button" class="cert" data-book="${i}" aria-pressed="false"><span class="spine" style="--book:${["#2a9d8f", "#e9c46a", "#d9583f", "#f6efe2", "#3d5a80", "#e07a5f", "#81b29a", "#c8a2c8"][i]}"></span><span class="acc-title"><strong>${esc(n)}</strong><small>${esc(by)}</small></span></button></li>`).join("")}</ul>`,

  contact: () => `
    <button type="button" class="mail in" id="copy" style="--i:0"><small>Email, click to copy</small><strong>${EMAIL}</strong><span id="copied">Copy</span></button>
    <form class="letter in" id="letter" style="--i:1">
      <label for="l-name">Your name</label><input id="l-name" required autocomplete="name">
      <label for="l-msg">Your message</label><textarea id="l-msg" rows="4" required></textarea>
      <button class="action solid" type="submit">Open in my email app</button>
    </form>
    <div class="grid2 in" style="--i:2">
      ${external("https://github.com/nithinskumar866", "GitHub")}${external("https://www.linkedin.com/in/nithin-s-52292b278", "LinkedIn")}
      ${external("https://leetcode.com/u/nithinsofficial86/", "LeetCode")}<a class="action" href="${RESUME}" download>Resume</a>
    </div>`,
};

function wireAccordion(root, onOpen) {
  const items = [...root.querySelectorAll(".acc")];
  items.forEach((item, i) => {
    item.querySelector(".acc-head").addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");
      items.forEach((other) => { other.classList.remove("open"); other.querySelector(".acc-head").setAttribute("aria-expanded", "false"); });
      if (willOpen) { item.classList.add("open"); item.querySelector(".acc-head").setAttribute("aria-expanded", "true"); }
      onOpen(willOpen ? i : null, item);
      if (willOpen) setTimeout(() => item.scrollIntoView({ block: "nearest", behavior: "smooth" }), 420);
    });
  });
}

const WIRES = {
  about(root) {
    const tiles = [...root.querySelectorAll(".tile")];
    tiles.forEach((t) => t.addEventListener("click", () => tiles.forEach((o) => o.setAttribute("aria-pressed", String(o === t)))));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.querySelectorAll("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count), start = performance.now();
      const tick = (now) => { const k = Math.min((now - start) / 900, 1); el.textContent = Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  },
  experience(root, hooks) {
    wireAccordion(root, (i) => hooks.note(i));
    hooks.note(0);
  },
  projects(root, hooks) {
    wireAccordion(root, (i, item) => hooks.project(i === null ? null : PROJECTS.find((p) => p.id === item.dataset.id)));
    const buttons = [...root.querySelectorAll("[data-cat]:not(article)")];
    buttons.forEach((b) => b.addEventListener("click", () => {
      buttons.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      root.querySelectorAll("article").forEach((a) => { a.hidden = b.dataset.cat !== "all" && a.dataset.cat !== b.dataset.cat; });
    }));
  },
  skills(root, hooks) {
    const list = root.querySelector("#skill-list"), evidence = root.querySelector("#evidence");
    const pick = (name, uses) => {
      evidence.innerHTML = `<small>${esc(name)} is used in</small>${uses.length ? `<div class="tags strong">${uses.map((u) => `<span>${esc(u)}</span>`).join("")}</div>` : `<p>This one is on my resume, without a public project to link yet. Ask me about it.</p>`}`;
    };
    const showGroup = (g) => {
      const items = Object.entries(SKILLS[g].items);
      list.innerHTML = items.map(([n], i) => `<button type="button" class="skill in" style="--i:${i}" aria-pressed="${i === 0}">${esc(n)}</button>`).join("");
      const btns = [...list.children];
      btns.forEach((b, i) => b.addEventListener("click", () => { btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b))); pick(items[i][0], items[i][1]); }));
      pick(items[0][0], items[0][1]);
      hooks.rack(g);
    };
    const groups = [...root.querySelectorAll("[data-group]")];
    groups.forEach((b) => b.addEventListener("click", () => { groups.forEach((o) => o.setAttribute("aria-pressed", String(o === b))); showGroup(Number(b.dataset.group)); }));
    showGroup(0);
  },
  certificates(root, hooks) {
    const certs = [...root.querySelectorAll(".cert")];
    let held = null;
    certs.forEach((c, i) => {
      c.addEventListener("mouseenter", () => hooks.book(i));
      c.addEventListener("mouseleave", () => hooks.book(held));
      c.addEventListener("focus", () => hooks.book(i));
      c.addEventListener("click", () => { held = held === i ? null : i; certs.forEach((o, j) => o.setAttribute("aria-pressed", String(j === held))); hooks.book(held ?? i); });
    });
  },
  contact(root, hooks) {
    root.querySelector("#copy").addEventListener("click", async () => {
      const label = root.querySelector("#copied");
      try { await navigator.clipboard.writeText(EMAIL); label.textContent = "Copied"; hooks.flag(); } catch { label.textContent = "Select it above"; }
      setTimeout(() => { label.textContent = "Copy"; }, 2000);
    });
    root.querySelector("#letter").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = root.querySelector("#l-name").value, msg = root.querySelector("#l-msg").value;
      hooks.flag();
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n${name}`)}`;
    });
  },
};

export function mountSection(key, root, hooks) {
  const s = SECTIONS[key], i = SECTION_ORDER.indexOf(key);
  const next = SECTION_ORDER[(i + 1) % SECTION_ORDER.length], prev = SECTION_ORDER[(i - 1 + SECTION_ORDER.length) % SECTION_ORDER.length];
  root.innerHTML = `
    <p class="eyebrow">${esc(s.eyebrow)}</p>
    <h2>${esc(s.title)}</h2>
    <p class="lead">${esc(s.lead)}</p>
    <div class="view">${VIEWS[key]()}</div>
    <nav class="panel-nav" aria-label="Next and previous sections">
      <button type="button" data-go="${prev}"><span aria-hidden="true">&larr;</span> ${SECTIONS[prev].label}</button>
      <button type="button" data-go="${next}">${SECTIONS[next].label} <span aria-hidden="true">&rarr;</span></button>
    </nav>`;
  WIRES[key](root, hooks);
  root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => hooks.go(b.dataset.go)));
}
