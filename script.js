/* ==========================================================================
   CARAXES — Portfolio interactivity (vanilla JS, no dependencies)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "caraxes-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      applyTheme("light");
    }
  })();

  themeToggle.addEventListener("click", function () {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  });

  /* ---------------- Mobile nav ---------------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));

  function setActiveLink() {
    let currentId = sections[0] && sections[0].id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    navAnchors.forEach(function (a) {
      const match = a.getAttribute("href") === "#" + currentId;
      a.classList.toggle("active", match);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------------- Scroll reveal for section headers ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- Tech stack tabs ---------------- */
  const tabs = document.querySelectorAll(".stack-tab");
  const panels = document.querySelectorAll(".stack-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  /* ---------------- Skill card cursor glow ---------------- */
  document.querySelectorAll(".skill-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------------- Project card details toggle ---------------- */
  document.querySelectorAll(".project-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const more = btn.closest(".project-body").querySelector(".project-more");
      const isOpen = more.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      btn.firstChild.textContent = isOpen ? "Less " : "Details ";
    });
  });

  /* ---------------- Clickable project cards ---------------- */
  // A card becomes clickable (opens in a new tab) whenever its data-link
  // attribute is filled in with a real URL. Leave data-link="" to keep a
  // card as a plain, non-linking card with just the Details toggle.
  document.querySelectorAll(".project-card").forEach(function (card) {
    const link = card.dataset.link;
    if (!link) return;

    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "View live project (opens in a new tab)");

    const foot = card.querySelector(".project-foot");
    if (foot) {
      const a = document.createElement("a");
      a.className = "project-link";
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = 'View Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17L17 7M7 7h10v10"/></svg>';
      a.addEventListener("click", function (e) { e.stopPropagation(); });
      foot.appendChild(a);
    }

    function openLink() { window.open(link, "_blank", "noopener"); }
    card.addEventListener("click", openLink);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLink();
      }
    });
  });

  /* ---------------- Contact form (client-side only demo) ---------------- */
  // NOTE: This form has no backend wired up. Connect it to a service such as
  // Formspree, EmailJS, or your own API endpoint to actually deliver messages.
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formStatus.classList.add("show");
    contactForm.reset();
    setTimeout(function () {
      formStatus.classList.remove("show");
    }, 6000);
  });

  /* ---------------- AI Reply Assistant (rule-based demo chat) ---------------- */
  const chatBubble = document.getElementById("chatBubble");
  const chatPanel = document.getElementById("chatPanel");
  const chatClose = document.getElementById("chatClose");
  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const welcomeTime = document.getElementById("welcomeTime");

  function timeNow() {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + ampm;
  }
  welcomeTime.textContent = timeNow();

  function openChat() {
    chatPanel.classList.add("open");
    chatBubble.classList.add("open");
    setTimeout(function () { chatInput.focus(); }, 200);
  }
  function closeChat() {
    chatPanel.classList.remove("open");
    chatBubble.classList.remove("open");
  }
  chatBubble.addEventListener("click", function () {
    chatPanel.classList.contains("open") ? closeChat() : openChat();
  });
  chatClose.addEventListener("click", closeChat);

  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = "msg " + (who === "user" ? "msg-user" : "msg-bot");
    div.textContent = text;
    const time = document.createElement("span");
    time.className = "msg-time";
    time.textContent = timeNow();
    div.appendChild(time);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "typing";
    div.id = "typingIndicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById("typingIndicator");
    if (t) t.remove();
  }

  // Keyword-based response engine, grounded in Joseph's actual CV, GitHub
  // profile (github.com/true-22) and the live Shamba Smart project.
  // Swap this out for a real API call (e.g. to your own backend or the
  // Anthropic API) to give the assistant genuine conversational ability.
  const KB = {
    skills:
      "Joseph's stack spans five areas. Programming: Python, JavaScript, Java, SQL, HTML/CSS. Web development: Django, RESTful APIs, full-stack design and deployment. AI & ML: TensorFlow, Keras, Scikit-learn, Pandas, NumPy — model design, training, evaluation and deployment. Data: SQL database design, data cleaning/validation, and reporting in Power BI. Networking & ICT: network infrastructure, hardware diagnostics, SCADA systems, structured cabling, and TCP/IP. He's also comfortable running field research and data collection (surveys, stakeholder interviews, digital data capture).",

    projects:
      "Three flagship projects: (1) Plant Disease Detection System — CNN image classifier live on Hugging Face as \"Shamba Smart,\" (2) an Automated Class Attendance System using biometric fingerprint recognition, and (3) a full-stack Library Management System. Ask me about any one by name for the full story, or check the Projects section — the first card links straight to the live app.",

    shamba:
      "Shamba Smart is Joseph's plant disease detection system, live on Hugging Face (huggingface.co/spaces/True-22/shamba-smart). It uses an EfficientNetB4 CNN trained on 50,000+ leaf images across multiple disease classes. What makes it distinct: Joseph visited farms and interviewed farmers directly to shape which diseases the model needed to detect and how results should be explained in plain language. A user uploads or photographs a leaf and instantly gets a disease name, confidence score, severity rating, and organic treatment recommendations. It's built as a full-stack Django app with a RESTful API and a SQL database logging predictions and system performance — tailored specifically to the Kenyan farming context.",

    attendance:
      "The Automated Class Attendance System (2024-2025) replaced manual sign-in sheets with a biometric fingerprint recognition pipeline. Captured prints are validated against enrolled records in real time, with the results feeding straight into a live reporting dashboard for instructors.",

    library:
      "The Library Management System (2022-2023) is a full-stack Django and SQL web app that automates cataloging, borrowing, and returns — built to replace a fully manual, paper-based process.",

    experience:
      "Joseph was an ICT Intern in the Telecommunication Department at Kenya Power & Lighting Co. (KPLC) in Nakuru, from May to July 2025. Embedded in enterprise-scale ICT operations, he diagnosed and resolved hardware, software, networking and SCADA faults, supported SCADA monitoring and control systems, maintained ICT inventory and coordinated hardware deployments, and communicated technical findings clearly to department heads, suppliers, and non-technical end users.",

    education:
      "Joseph is completing a BSc in Computer Science with an AI & Machine Learning specialization at Machakos University, Kenya (2021-2026; coursework completed May 2026, graduating November 2026). Relevant coursework includes Machine Learning, Deep Learning, Computer Networks, Database Systems, Software Engineering, Cybersecurity, Computer Vision, Algorithms & Data Structures, Statistics & Probability, and Operating Systems. His capstone is the Plant Disease Detection System (Shamba Smart).",

    contact:
      "You can reach Joseph directly at josephndungu10433@gmail.com or +254 718 267 798, or use the contact form on this page — he personally replies within 24-48 hours. GitHub and LinkedIn links are in the hero and Direct Contact sections.",

    cv:
      "You can grab Joseph's full CV using the \"Download CV\" button at the top of the page — it covers his profile, skills, projects, experience, and education in detail.",

    github:
      "Joseph is @true-22 on GitHub (github.com/true-22). It's home to the Shamba Smart repository — his plant disease detection system — and he's currently exploring DevOps practices (Docker, Kubernetes, CI/CD) and sharpening his data analytics skills (Power BI, advanced SQL).",

    linkedin:
      "You can find Joseph on LinkedIn at linkedin.com/in/joseph-ndungu-dev — the link is in the Direct Contact section below.",

    languages:
      "Joseph is fluent in both English and Swahili, which comes in handy for the field research side of his work — interviewing farmers and stakeholders directly.",

    availability:
      "Joseph is available for internship, attachment, or entry-level roles, with immediate availability. The best way to reach out is via josephndungu10433@gmail.com or the contact form on this page.",

    interests:
      "Outside of coursework and client work, Joseph is drawn to open-source development, AI for social good, networking technology, and community tech initiatives — Shamba Smart grew directly out of that interest in applying AI to real, local problems.",

    greeting:
      "Hello! I'm the Caraxes AI Assistant. Ask me about Joseph's skills, projects (try \"Shamba Smart\"), experience, education, or how to get in touch.",

    thanks:
      "You're welcome! Let me know if there's anything else you'd like to know about Joseph's work."
  };

  function getReply(raw) {
    const q = raw.toLowerCase();

    if (/(shamba|plant disease|crop|leaf|farm)/.test(q)) return KB.shamba;
    if (/(attendance|fingerprint|biometric)/.test(q)) return KB.attendance;
    if (/(library)/.test(q)) return KB.library;
    if (/(project|portfolio|build|app\b)/.test(q)) return KB.projects;
    if (/(skill|stack|tech|tool|language.*(program|code)|what.*know)/.test(q)) return KB.skills;
    if (/(experience|kplc|intern|job|career|work history)/.test(q)) return KB.experience;
    if (/(education|university|degree|school|study|machakos|gpa|graduat)/.test(q)) return KB.education;
    if (/(github)/.test(q)) return KB.github;
    if (/(linkedin)/.test(q)) return KB.linkedin;
    if (/(cv|resume)/.test(q)) return KB.cv;
    if (/(swahili|english|speak|fluent)/.test(q)) return KB.languages;
    if (/(available|availability|hire|freelance|open to work)/.test(q)) return KB.availability;
    if (/(interest|hobby|passion|free time)/.test(q)) return KB.interests;
    if (/(contact|email|reach|call|phone|number)/.test(q)) return KB.contact;
    if (/(hello|hi|hey|sup|yo)\b/.test(q)) return KB.greeting;
    if (/(thank|thanks|appreciate)/.test(q)) return KB.thanks;
    if (/(who are you|what are you)/.test(q)) return "I'm the Caraxes AI Assistant — a small rule-based helper trained on Joseph's CV, GitHub, and project details. Ask me about his skills, projects, experience, education, or how to reach him.";

    return "I don't have a specific answer for that yet — but I can tell you about Joseph's skills, projects (including Shamba Smart), experience, education, or how to get in touch. What would you like to know?";
  }

  function handleUserMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, "user");
    chatInput.value = "";
    showTyping();
    const delay = 650 + Math.random() * 500;
    setTimeout(function () {
      hideTyping();
      addMessage(getReply(trimmed), "bot");
    }, delay);
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  });

  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      handleUserMessage(chip.dataset.q);
    });
  });
})();
