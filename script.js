"use strict";

// ---------- Data ----------
const skills = [
  { group: "Programming", items: ["C", "Java", "Python"] },
  { group: "Web Development", items: ["HTML", "CSS", "JavaScript", "React"] },
  { group: "Databases", items: ["MySQL", "MongoDB (familiar)"] },
  { group: "Core CS", items: ["Data Structures & Algorithms", "OOPs Concepts", "Operating Systems"] },
  { group: "ML & NLP Libraries", items: ["Scikit-learn", "NLTK", "spaCy"] },
];

const projects = [
  {
    title: "AI-Vision: Sustainable Agricultural Waste Management",
    category: "ai",
    description: "Web platform that classifies agricultural waste from images with 95.4% accuracy using EfficientNetB0, then suggests recycling options. Includes Grad-CAM explanations, multilingual AI advice, carbon tracking, a marketplace, and a recycling-center locator.",
    tags: ["Python", "TensorFlow", "Node.js", "Express", "SQLite", "Leaflet.js"],
  },
  {
    title: "WatchLens: Movie Discovery & OTT Platform",
    category: "web",
    description: "React app built on the TMDB API with search, filtering, sorting, ratings, and movie details. Shows OTT availability, trailers, and cast, in a responsive layout.",
    tags: ["React", "JavaScript", "TMDB API"],
  },
  {
    title: "Interview Question Generator",
    category: "ai",
    description: "NLP-based tool that generates and evaluates interview questions, connected to a Flask web interface for real-time use. Built during the EDUNET Foundation internship.",
    tags: ["Python", "NLP", "Flask"],
  },
];

const $ = (sel) => document.querySelector(sel);

// ---------- Render skills and projects ----------
const renderSkills = () => {
  $("#skillList").innerHTML = skills.map(({ group, items }) => `
    <div class="col-sm-6 col-lg-4">
      <div class="card skill-card h-100"><div class="card-body">
        <h3 class="h6">${group}</h3>
        <p class="mb-0">${items.join(", ")}</p>
      </div></div>
    </div>`).join("");
};

const renderProjects = (filter = "all") => {
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  $("#projectList").innerHTML = list.map((p) => `
    <div class="col-md-6 col-lg-4">
      <article class="card project-card h-100"><div class="card-body d-flex flex-column">
        <h3 class="h5">${p.title}</h3>
        <p>${p.description}</p>
        <div class="mt-auto d-flex flex-wrap gap-1">
          ${p.tags.map((t) => `<span class="badge text-bg-secondary tag">${t}</span>`).join("")}
        </div>
      </div></article>
    </div>`).join("");
};

// Interactive feature 1: project filtering
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-filter]");
  if (!btn) return;
  document.querySelectorAll("#filters button").forEach((b) => {
    const active = b === btn;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active);
  });
  renderProjects(btn.dataset.filter);
});

// Interactive feature 2: theme switching (remembered between visits)
const themeBtn = $("#themeToggle");
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
  const dark = theme === "dark";
  themeBtn.textContent = dark ? "Light mode" : "Dark mode";
  themeBtn.setAttribute("aria-pressed", dark);
};
let saved = "light";
try { saved = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (_) {}
applyTheme(saved);
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (_) {}
});

// Interactive feature 3: rotating skill text in the hero
const words = ["Python", "Java", "React", "AI/ML and NLP", "Flask and Node.js"];
let i = 0;
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => { i = (i + 1) % words.length; $("#typed").textContent = words[i]; }, 2000);
}

// ---------- Contact form validation ----------
const form = $("#contactForm");
const MAX = 500;
const rules = {
  name: (v) => (v.trim().length < 2 ? "Enter your name (at least 2 characters)." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com."),
  message: (v) => {
    const len = v.trim().length;
    if (len < 10) return "Message must be at least 10 characters.";
    if (len > MAX) return `Message must be ${MAX} characters or fewer.`;
    return "";
  },
};

const validateField = (field) => {
  const error = rules[field.name](field.value);
  field.classList.toggle("is-invalid", Boolean(error));
  field.classList.toggle("is-valid", !error);
  $(`#${field.name}Error`).textContent = error;
  field.setAttribute("aria-invalid", Boolean(error));
  return !error;
};

const showAlert = (type, text) => {
  $("#formAlert").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
};

["name", "email", "message"].forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) validateField(field);
    if (id === "message") $("#count").textContent = field.value.length;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  const results = fields.map(validateField);
  if (results.every(Boolean)) {
    const name = form.name.value.trim();
    showAlert("success", `Thanks, ${name}! Your message is ready to send (demo: no server connected).`);
    form.reset();
    fields.forEach((f) => f.classList.remove("is-valid"));
    $("#count").textContent = 0;
  } else {
    showAlert("danger", "Please fix the highlighted fields and try again.");
    fields.find((f) => f.classList.contains("is-invalid")).focus();
  }
});

// ---------- Init ----------
$("#year").textContent = new Date().getFullYear();
renderSkills();
renderProjects();
