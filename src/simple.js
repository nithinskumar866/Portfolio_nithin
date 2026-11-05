// A fast, plain version of the portfolio for recruiters and devices without WebGL.
import "@fontsource/syne/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/600.css";
import "./simple.css";
import { CERTS, EMAIL, EXPERIENCE, FOCUS, PROJECTS, RESUME, SKILLS } from "./content.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

document.getElementById("app").innerHTML = `
  <header>
    <h1>Nithin S</h1>
    <p class="role">AI / LLM Engineer · Coimbatore, India</p>
    <p>B.Tech AI &amp; Data Science graduate (2026) building production LLM and agentic AI systems, from fine-tuning and quantisation to RAG pipelines and evaluation harnesses.</p>
    <nav>
      <a class="primary" href="${RESUME}" download>Download resume</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      ${link("https://github.com/nithinskumar866", "GitHub")}
      ${link("https://www.linkedin.com/in/nithin-s-52292b278", "LinkedIn")}
      <a href="/">Explore the 3D room</a>
    </nav>
  </header>

  <section>
    <h2>What I work on</h2>
    <dl>${FOCUS.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>
  </section>

  <section>
    <h2>Experience</h2>
    ${EXPERIENCE.map((j) => `
      <article>
        <h3>${esc(j.role)}, ${esc(j.company)}</h3>
        <p class="meta">${j.period} · ${j.place}</p>
        <p>${esc(j.intro)}</p>
        ${j.points.length ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        <p class="meta">${j.stack.map(esc).join(" · ")}</p>
      </article>`).join("")}
  </section>

  <section>
    <h2>Projects</h2>
    ${PROJECTS.map((p) => `
      <article>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.tagline)} ${esc(p.problem)}</p>
        <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <p class="meta">${p.stack.map(esc).join(" · ")}</p>
        ${p.note ? `<p class="meta">${esc(p.note)}</p>` : ""}
        <p class="links">${link(p.code, "View code")}${p.demo ? ` ${link(p.demo, "Live demo")}` : ""}</p>
      </article>`).join("")}
  </section>

  <section>
    <h2>Skills</h2>
    <dl>${SKILLS.map((g) => `<dt>${esc(g.name)}</dt><dd>${Object.keys(g.items).map(esc).join(", ")}</dd>`).join("")}</dl>
  </section>

  <section>
    <h2>Certificates</h2>
    <ul>${CERTS.map(([n, by]) => `<li>${esc(n)} <span class="meta">(${esc(by)})</span></li>`).join("")}</ul>
  </section>
`;
