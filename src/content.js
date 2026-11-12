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

// The main projects, most important first. Each one plays its own live demo on the room's monitor (src/monitor.js),
// drawn in its accent colour.
export const FEATURED = [
  { id: "hiring", title: "AI Hiring Intelligence Platform", tag: "Agentic RAG", accent: "#9d8cff", tagline: "Candidate scores that trace back to evidence.", img: "/projects/hiring-dashboard.png", alt: "Dashboard with fictional sample data", problem: "Resume screening tools produce scores that recruiters can't check or trust.", points: ["Every score traces Requirement, Evidence, Reasoning, Confidence, then Decision.", "Authenticity checks flag skills listed but never demonstrated.", "Still produces a complete report with no LLM configured.", "One React app over three services: a FastAPI and LangGraph hiring backend, an ASP.NET Core job portal and a Qdrant company search."], stack: ["LangGraph", "FastAPI", "FAISS", "Qdrant", "React", "ASP.NET Core"], code: gh("code_clause_2-golden---CC3598") },
  { id: "documentor", title: "DocuMentor", tag: "LangGraph agents", accent: "#f4b860", tagline: "Checks, writes and grades homework against your own textbook.", img: "/projects/documentor-grading.png", alt: "Grading screen with class scores and the average for each question", problem: "Teachers need help with homework and marking, but can't trust AI suggestions they can't check.", points: ["Finds off-topic homework questions, writes assignments with answer keys and suggests marks.", "Every suggestion shows its reason and the textbook passage behind it. Nothing changes until you accept it.", "Three LangGraph agents: a teacher assistant, an assignment planner that drafts, checks and revises, and a second-opinion grader.", "Hybrid search over BM25 keywords and embeddings, on Gemini or your own models through Ollama."], stack: ["Python", "LangGraph", "LangChain", "Gemini", "Ollama", "Hybrid search"], code: gh("AIdoccreator"), demo: "https://ai-homework.vercel.app", demoLabel: "Early demo" },
  { id: "agentcorp", title: "AgentCorp", tag: "Multi-agent", accent: "#4fd1a5", tagline: "A services company run by Google ADK agents.", problem: "Can each department of a company become an agent with a clean handoff?", points: ["A PM agent turns client conversations into a versioned requirements spec.", "A developer agent designs the architecture, then writes the code.", "A QA agent writes and locks acceptance tests before any code exists, then runs them in Docker."], stack: ["Python", "Google ADK", "MCP", "pytest", "Docker"], code: gh("agent_Agile_ai") },
  { id: "agenttest", title: "agenttest", tag: "Agent testing", accent: "#ff8a5c", tagline: "pytest for AI agents.", img: "/projects/agenttest-trace.png", alt: "A failing agent test with every step the agent took", problem: "Agents fail in ways unit tests miss: wrong tools, outages, ungrounded answers and flaky runs.", points: ["Asserts on every tool call, its arguments and their order.", "Simulates tool failures and slow tools across frameworks.", "Grounded hallucination checks: the judge must quote evidence, and each quote is verified in code.", "Records model calls once, then replays them for free in CI."], stack: ["Python", "pytest", "LangGraph", "CrewAI", "OpenAI Agents SDK"], code: gh("agent_test_pip") },
  { id: "style", title: "Style Matrix", tag: "Computer vision", accent: "#ff6fa8", tagline: "An AI wardrobe assistant, built as a team.", img: "/projects/style-outfits.png", alt: "Outfit suggestions from sample images", problem: "Choosing outfits from a real wardrobe, including what's in the wash.", points: ["A ResNet50 sorts items into 50 clothing categories.", "Plain-text prompts return ranked outfits.", "My merged work includes the API and Supabase connectivity."], stack: ["FastAPI", "React", "ResNet50", "Supabase"], code: "https://github.com/MohamedAazil/style-matrix" },
  { id: "investo", title: "Investo", tag: "Full stack", accent: "#6cc5ff", tagline: "Matches startups with investors, and explains why.", img: "/projects/investo-matches.png", alt: "Investo ranked investor matches", problem: "Early fundraising is scattered across email threads and shared folders.", points: ["Weighted match scoring across nine factors.", "AI explanations from a local language model.", "Chat, meetings, data rooms and a deal pipeline in one product.", "930 passing backend tests."], stack: ["Django", "Next.js", "PostgreSQL", "Redis", "Ollama"], code: gh("investo-platform"), demo: "https://investo-demo.vercel.app", note: "College project. All money is simulated." },
  { id: "linkbery", title: "Linkbery", tag: "Web", accent: "#c8a2ff", tagline: "Courses from many platforms, in one place.", problem: "Finding a course means searching several platforms one at a time.", points: ["Scraped courses from Coursera, Udemy and Scrimba.", "Serves them by category through Firebase."], stack: ["JavaScript", "Firebase"], code: gh("linkbery-groupproject") },
];

// Everything else, shown smaller under "Other projects", most important first.
export const OTHERS = [
  { id: "ecommerce", title: "Vue E-Commerce", tag: "Frontend", tagline: "A full electronics storefront that runs in the browser.", img: "/projects/ecommerce-home.webp", alt: "Store home page", problem: "A complete shopping experience, with a mock API standing in for a backend.", points: ["Search, filters, product options, cart, coupons and flash sales.", "Checkout with card, UPI or cash on delivery, reward tiers and order tracking.", "Admin dashboard, dark mode and an installable app that works offline."], stack: ["Vue 3", "JavaScript", "PWA"], code: gh("ecommerce_vue"), demo: "https://nithinskumar866.github.io/ecommerce_vue/", note: "Demo store. No orders or payments are real." },
  { id: "models", title: "15 Machine Learning Models", tag: "Core ML", tagline: "One repo for each core algorithm.", problem: "Building a working understanding of the core algorithms by implementing each one.", points: ["Covers classification, regression, clustering and dimensionality reduction.", "Tuned with hyperparameter search and feature selection."], stack: ["Python", "scikit-learn"], code: "https://github.com/nithinskumar866?tab=repositories" },
  { id: "land", title: "Decentralised Land Registry", tag: "Web3", tagline: "Tamper-proof land records on Ethereum.", problem: "Land records are vulnerable to fraud and heavy on paperwork.", points: ["Solidity contracts automate registration and verify ownership.", "Records are stored immutably on Ethereum."], stack: ["Solidity", "Ethereum", "React"], code: gh("edunet-voisl_and_reg") },
  { id: "aqi", title: "AQI Classification", tag: "Core ML", tagline: "Sorts places by air quality from pollution readings.", problem: "Classifying the air quality of a location from its pollution measurements.", points: ["A Random Forest over AQI, carbon monoxide, ozone and PM2.5 readings.", "Training and prediction sped up with Intel oneAPI."], stack: ["Python", "scikit-learn", "Intel oneAPI"], code: gh("AQI_Classification") },
  { id: "folio", title: "Portfolio (Vue & Django)", tag: "Web", tagline: "An earlier portfolio with auth and project management.", problem: "Managing portfolio content without editing code.", points: ["Vue.js frontend and Django backend, with authentication."], stack: ["Vue.js", "Django"], code: gh("django-portfolio-") },
];

export const PROJECTS = [...FEATURED, ...OTHERS];

export const SKILLS = [
  { name: "LLM Engineering", items: { "Fine-tuning (LoRA, PEFT)": ["Techwaukee India"], "Knowledge Distillation": ["Techwaukee India"], Quantisation: ["Techwaukee India"], "Prompt Engineering": ["Techwaukee India", "AI Hiring Platform", "DocuMentor", "AgentCorp"], "LLM Evaluation": ["Techwaukee India", "agenttest", "AI Hiring Platform"], "Synthetic Data": ["Techwaukee India"], "Hugging Face": ["Techwaukee India"] } },
  { name: "Agentic AI & RAG", items: { LangChain: ["Techwaukee India", "DocuMentor"], LangGraph: ["Techwaukee India", "AI Hiring Platform", "DocuMentor", "agenttest"], "Agentic RAG": ["Techwaukee India", "AI Hiring Platform"], OpenClaw: [], "Mastra AI": [], "Vector Databases": ["Techwaukee India", "AI Hiring Platform", "Style Matrix"], "Agent Memory": ["Techwaukee India"], "Tool Calling": ["Techwaukee India", "DocuMentor", "agenttest", "AgentCorp"] } },
  { name: "ML & NLP", items: { "scikit-learn": ["CodeClause", "15 ML Models"], spaCy: ["CodeClause"], Classification: ["CodeClause", "15 ML Models", "Rius Technology"], Regression: ["15 ML Models"], Clustering: ["15 ML Models"], "Feature Selection": ["15 ML Models"] } },
  { name: "Languages", items: { Python: ["Techwaukee India", "agenttest", "Investo", "15 ML Models"], SQL: ["Investo", "Style Matrix"], JavaScript: ["Linkbery", "Land Registry"], Java: ["Java programs"] } },
  { name: "Backend & Web", items: { Django: ["Investo", "Portfolio (Vue & Django)"], "REST APIs": ["Investo", "Style Matrix"], Firebase: ["Linkbery"], "Vue.js": ["Vue E-Commerce", "Portfolio (Vue & Django)"], Bootstrap: ["Rathinam AI & DS site"] } },
  { name: "Tools & Data", items: { Git: ["All projects"], "Power BI": ["DataCamp certificate"], Figma: [] } },
];

export const CERTS = [
  ["IBM AI Engineering (Professional)", "IBM, Coursera"], ["Zero to Hero in LangChain", "Udemy"], ["Professional Data Scientist, Power BI", "DataCamp"], ["Associate Data Scientist", "DataCamp"],
  ["Data Scientist", "DataCamp"], ["Python & Django Complete Web Development", "Udemy"], ["Complete JavaScript & React Core", "Udemy"], ["Java DSA: Mastering the Fundamentals", "Online course"],
];

export const FOCUS = [
  ["Models that fit", "Fine-tuning with LoRA and PEFT, then distillation and quantisation: smaller and cheaper to run, with the same answers."],
  ["Agents that cite", "Agents and RAG pipelines that plan, call tools, check their own work and say where each answer came from."],
  ["Tests that prove it", "Evaluation harnesses that measure retrieval quality, answer accuracy and agent reasoning, so nothing ships on vibes."],
  ["The ML underneath", "Supervised and unsupervised models, with proper feature selection and hyperparameter tuning."],
];

export const SECTIONS = {
  about: { label: "About", tip: "Nithin, fast asleep: who he is", color: "#ffc48a", eyebrow: "Asleep on the sofa", title: "Hi, I'm Nithin", lead: "I build LLM and agent systems that show their work: every score has evidence, every answer has a source." },
  projects: { label: "Projects", tip: "The monitor: proof of work", color: "#6cc5ff", eyebrow: "On the monitor · Proof of work", title: "Don't take my word for it", lead: "Open a project and watch it run on the monitor." },
  experience: { label: "Experience", tip: "The pinboard: where I've worked", color: "#e8b06f", eyebrow: "On the pinboard", title: "Pinned up so far", lead: "One note for each job, with what I actually shipped there. Open one and it lifts off the board." },
  skills: { label: "Skills", tip: "The server rack: skills, with receipts", color: "#9be26e", eyebrow: "In the server rack", title: "Skills, with receipts", lead: "Pick a skill to see exactly where I've used it." },
  certificates: { label: "Certificates", tip: "The bookshelf: certificates", color: "#f4907a", eyebrow: "On the bookshelf", title: "I did the reading", lead: "One book for each certificate. Hover or tap one to pull it off the shelf." },
  contact: { label: "Contact", tip: "The mailbox: say hello", color: "#8aaeff", eyebrow: "In the mailbox", title: "Drop me a letter", lead: "I'm looking for AI and LLM engineering roles. Leave a letter and I'll answer as soon as I wake up." },
};
export const SECTION_ORDER = Object.keys(SECTIONS);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const chips = (list) => `<div class="tags">${list.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;
const external = (href, text, cls = "action") => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${text}<span aria-hidden="true"> &#8599;</span></a>`;
const chevron = `<span class="chev" aria-hidden="true"></span>`;

const VIEWS = {
  about: () => `
    <dl class="stats">${[[EXPERIENCE.length, "Internships"], [PROJECTS.length, "Projects"], [15, "ML models"], [CERTS.length, "Certificates"]].map(([n, l], i) => `<div class="stat in" style="--i:${i}"><dd data-count="${n}">${n}</dd><dt>${l}</dt></div>`).join("")}</dl>
    <h3 class="sub">What I build</h3>
    <div class="grid2">${FOCUS.map(([t, d], i) => `<button type="button" class="tile in" style="--i:${i + 3}" aria-pressed="${i === 0}"><strong>${esc(t)}</strong><span>${esc(d)}</span></button>`).join("")}</div>
    <div class="card static in" style="--i:8"><small>Education, Nov 2022 to May 2026</small><strong>B.Tech. in AI &amp; Data Science</strong><span>Rathinam Technical Campus, Coimbatore</span></div>
    <a class="action solid in" style="--i:9" href="${RESUME}" download>Take the receipts: my resume</a>`,

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

  projects: () => {
    const card = (p, i, mini) => `
      <article class="acc project in${mini ? " mini" : ""}" style="--i:${i}${p.accent ? `;--sec:${p.accent}` : ""}" data-id="${p.id}">
        <button type="button" class="acc-head" aria-expanded="false">
          ${mini ? "" : p.img ? `<img src="${p.img}" alt="" loading="lazy">` : `<span class="thumb" aria-hidden="true">${esc(p.title.slice(0, 2))}</span>`}
          <span class="acc-title"><small class="tagline">${esc(p.tag)}${mini ? "" : `<span class="live"> &middot; <i>live on the monitor</i></span>`}</small><strong>${esc(p.title)}</strong><small>${esc(p.tagline)}</small></span>
          ${chevron}
        </button>
        <div class="acc-body"><div>
          ${p.img ? `<img class="wide" src="${p.img}" alt="${esc(p.alt)}" loading="lazy">` : ""}
          <p>${esc(p.problem)}</p>
          <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          ${chips(p.stack)}
          ${p.note ? `<small class="meta">${esc(p.note)}</small>` : ""}
          <div class="actions">${external(p.code, "View code")}${p.demo ? external(p.demo, p.demoLabel ?? "Live demo", "action solid") : ""}</div>
        </div></div>
      </article>`;
    return `
    <div class="projects">${FEATURED.map((p, i) => card(p, i, false)).join("")}</div>
    <h3 class="sub in" style="--i:${FEATURED.length}">Other projects</h3>
    <div class="projects others">${OTHERS.map((p, i) => card(p, FEATURED.length + 1 + i, true)).join("")}</div>`;
  },

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
  },
  skills(root, hooks) {
    const list = root.querySelector("#skill-list"), evidence = root.querySelector("#evidence");
    const pick = (name, uses) => {
      evidence.innerHTML = `<small>Where I've used ${esc(name)}</small>${uses.length ? `<div class="tags strong">${uses.map((u) => `<span>${esc(u)}</span>`).join("")}</div>` : `<p>No public receipt for this one yet. Ask me about it and I'll walk you through it.</p>`}`;
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
