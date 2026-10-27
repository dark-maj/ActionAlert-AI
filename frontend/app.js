/**
 * ActionAlert AI - Client Application Logic & Interactions
 */

// HTML Escaping Utility to prevent XSS injection
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sample Email Database for Hero Mockup & Interactive Pipeline
const HERO_EMAILS = [
  {
    id: "hero-1",
    label: "urgent",
    sender: "PagerDuty / SRE Team",
    avatar: "PD",
    subject: "🚨 Critical: Production API outage [AWS us-east-1]",
    snippet: "Auth service latency spiked to 4.2s. 502 errors exceeding 12% threshold across all regions. Immediate triage required.",
    time: "4m ago",
    confidence: "98.4%",
    deadline: "Within 45 minutes",
    actions: ["Investigate auth cluster replicas", "Rollback deploy #842", "Update incident status page"],
    chips: ["P0 INCIDENT", "ACTION REQUIRED", "< 1h DEADLINE"]
  },
  {
    id: "hero-2",
    label: "not_urgent",
    sender: "Elena Rostova (Lead Recruiter)",
    avatar: "ER",
    subject: "Interview schedule confirmation: Staff ML Engineer",
    snippet: "Hi team, please confirm your availability for the final loop candidate tomorrow at 3:00 PM EST before calendar lock.",
    time: "32m ago",
    confidence: "92.1%",
    deadline: "Tomorrow, 3:00 PM EST",
    actions: ["Confirm panel availability", "Review candidate portfolio notes"],
    chips: ["MEETING", "ACTION ITEM", "CONFIRMED"]
  },
  {
    id: "hero-3",
    label: "not_urgent",
    sender: "Substack Tech Weekly",
    avatar: "TW",
    subject: "Weekly Digest #142: New developments in LLM reasoning",
    snippet: "Here is your curated reading list of machine learning breakthroughs, benchmarks, and community discussions from this week.",
    time: "2h ago",
    confidence: "89.6%",
    deadline: "None detected",
    actions: [],
    chips: ["NEWSLETTER", "INFORMATIONAL", "NO ACTION"]
  }
];

// Presets for the ML Intelligence Pipeline Section
const PIPELINE_PRESETS = [
  {
    name: "Server Outage",
    subject: "Production database connection failure",
    body: "The main Postgres cluster is failing healthchecks. All API endpoints returning 500 errors. Please restore service immediately before 2 PM.",
    label: "urgent",
    confidence: 0.98,
    deadline: "Today before 2 PM",
    actions: ["Restart standby database replicas", "Inspect connection pool saturation"],
    tokens: ["database", "failure", "healthchecks", "immediately", "2 PM"]
  },
  {
    name: "Interview Confirm",
    subject: "Interview scheduled for tomorrow morning",
    body: "We have finalized candidate interviews for tomorrow at 10 AM. Please confirm your attendance by end of day.",
    label: "urgent",
    confidence: 0.94,
    deadline: "End of day / Tomorrow 10 AM",
    actions: ["Confirm attendance on invite", "Review resume scorecard"],
    tokens: ["interview", "tomorrow", "confirm", "end of day"]
  },
  {
    name: "Budget Approval",
    subject: "Urgent approval needed for cloud budget",
    body: "Finance department requires signoff on GPU cluster expenditure before tonight midnight, otherwise nodes will deprovision.",
    label: "urgent",
    confidence: 0.96,
    deadline: "Tonight midnight",
    actions: ["Sign off on GPU budget authorization", "Submit ticket to Finance"],
    tokens: ["urgent", "approval", "before tonight", "deprovision"]
  },
  {
    name: "Newsletter Digest",
    subject: "Weekly engineering updates & newsletter #42",
    body: "Check out our latest architectural writeup and top stories from the open source ecosystem this week.",
    label: "not_urgent",
    confidence: 0.91,
    deadline: null,
    actions: [],
    tokens: ["newsletter", "updates", "writeup", "stories"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroMockup();
  initScrollReveal();
  initStepsAnimation();
  initBentoInteractions();
  initPipelineVisualization();
  initStudioTabs();
  initActionButtons();
  initClassifierForm();
  initInboxDashboard();
});

/* =========================================================
   1. NAVBAR & NAVIGATION
   ========================================================= */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close mobile drawer when clicking any link
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        mobileDrawer.setAttribute("aria-hidden", "true");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* =========================================================
   2. HERO MOCKUP INTERACTIONS
   ========================================================= */
function initHeroMockup() {
  const emailCards = document.querySelectorAll(".mock-email-card");
  const inspectorReasoning = document.getElementById("inspectorReasoning");
  const inspectorConfidence = document.getElementById("inspectorConfidence");
  const inspectorActions = document.getElementById("inspectorActions");
  const simulateBtn = document.getElementById("simulateInboundBtn");

  function selectEmail(index) {
    const data = HERO_EMAILS[index];
    if (!data) return;

    emailCards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });

    if (inspectorConfidence) {
      inspectorConfidence.textContent = `${data.confidence} confidence`;
    }

    if (inspectorReasoning) {
      if (data.label === "urgent") {
        inspectorReasoning.innerHTML = `<strong>Urgent detected:</strong> Hard deadline <em>"${escapeHtml(data.deadline)}"</em> identified with urgency indicators. Immediate triage required.`;
      } else {
        inspectorReasoning.innerHTML = `<strong>Not Urgent:</strong> Standard email priority detected. No critical temporal deadline or immediate escalation required.`;
      }
    }

    if (inspectorActions) {
      inspectorActions.innerHTML = "";
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(act => {
          const chip = document.createElement("span");
          chip.className = "action-item";
          chip.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg> ${escapeHtml(act)}`;
          inspectorActions.appendChild(chip);
        });
      } else {
        const chip = document.createElement("span");
        chip.className = "action-item";
        chip.style.opacity = "0.6";
        chip.textContent = "No pending actions";
        inspectorActions.appendChild(chip);
      }
    }
  }

  emailCards.forEach((card, idx) => {
    card.addEventListener("click", () => selectEmail(idx));
  });

  // Default selection: Urgent email
  selectEmail(0);

  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      simulateBtn.disabled = true;
      simulateBtn.innerHTML = `<span class="pulse-dot"></span> Analyzing stream...`;

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * HERO_EMAILS.length);
        selectEmail(randomIndex);
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Simulate Inbound`;
      }, 700);
    });
  }
}

/* =========================================================
   3. SCROLL REVEAL ANIMATIONS
   ========================================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  reveals.forEach(el => observer.observe(el));
}

/* =========================================================
   4. HOW IT WORKS STEP ANIMATION
   ========================================================= */
function initStepsAnimation() {
  const stepCards = document.querySelectorAll(".step-card");
  const section = document.getElementById("how-it-works");
  if (!section || !stepCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      stepCards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add("step-in-view");
        }, i * 180);
      });
      observer.unobserve(section);
    }
  }, { threshold: 0.2 });

  observer.observe(section);
}

/* =========================================================
   5. BENTO GRID INTERACTIONS
   ========================================================= */
function initBentoInteractions() {
  const filterBtns = document.querySelectorAll(".bento-inbox-ui .filter-btn");
  const noisyItems = document.querySelectorAll(".bento-inbox-ui .item-noisy");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = btn.dataset.mode;
      noisyItems.forEach(item => {
        if (mode === "prioritized") {
          item.style.display = "none";
        } else {
          item.style.display = "flex";
        }
      });
    });
  });
}

/* =========================================================
   6. INTELLIGENCE VISUALIZATION (ML PIPELINE)
   ========================================================= */
function initPipelineVisualization() {
  const presetChips = document.querySelectorAll(".preset-chip");
  const inputEl = document.getElementById("pipelineInput");
  const runBtn = document.getElementById("runPipelineBtn");
  const nodes = document.querySelectorAll(".pipeline-node");

  const stage1Text = document.getElementById("stage1Preview");
  const stage2Tokens = document.getElementById("stage2Tokens");
  const stage3Model = document.getElementById("stage3Model");
  const stage4Actions = document.getElementById("stage4Actions");

  let currentPreset = PIPELINE_PRESETS[0];

  function loadPreset(preset) {
    currentPreset = preset;
    if (inputEl) {
      inputEl.value = preset.body;
    }
    updatePipelineDisplay(preset, false);
  }

  function updatePipelineDisplay(p, isOfflineDemo = false) {
    if (stage1Text) {
      const offlineNote = isOfflineDemo
        ? `<span style="display:inline-block;font-size:0.62rem;color:var(--text-muted);background:rgba(255,255,255,0.06);padding:1px 5px;border-radius:3px;border:1px solid var(--border-subtle);margin-bottom:4px;">offline demo</span><br/>`
        : "";
      const subjectLine = p.subject ? `<strong>Subject:</strong> ${escapeHtml(p.subject)}<br/>` : "";
      stage1Text.innerHTML = `${offlineNote}${subjectLine}<span style="color:#94a3b8;font-size:0.7rem;">Length: ${p.body ? p.body.length : 0} chars</span>`;
    }

    if (stage2Tokens) {
      const tokens = (p.tokens && p.tokens.length > 0)
        ? p.tokens
        : (p.body ? p.body.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2).slice(0, 5) : []);
      stage2Tokens.innerHTML = tokens.map(t => 
        `<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:1px 5px;border-radius:3px;margin:2px;display:inline-block;">${escapeHtml(t)}</span>`
      ).join(" ");
    }

    if (stage3Model) {
      const isUrgent = p.label === "urgent";
      const color = isUrgent ? "var(--accent-coral)" : "var(--accent-emerald)";
      const bg = isUrgent ? "rgba(251,113,133,0.15)" : "rgba(52,211,153,0.15)";
      const labelText = isUrgent ? "URGENT" : "NOT URGENT";
      stage3Model.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span>Model Inference:</span>
          <span style="font-weight:700;color:${color};background:${bg};padding:1px 6px;border-radius:4px;">${labelText}</span>
        </div>
        <div style="font-size:0.7rem;color:#94a3b8;">Confidence: ${(p.confidence * 100).toFixed(0)}%</div>
        <div style="font-size:0.68rem;color:#64748b;margin-top:2px;">TF-IDF Matrix: 92 features</div>
      `;
    }

    if (stage4Actions) {
      if (p.deadline || (p.actions && p.actions.length > 0)) {
        const deadlineHtml = p.deadline
          ? `<div style="color:var(--accent-coral-light);font-size:0.7rem;margin-bottom:3px;font-weight:600;">⚡ Deadline: ${escapeHtml(p.deadline)}</div>`
          : "";
        const actionsHtml = (p.actions && p.actions.length > 0)
          ? `<div style="font-size:0.7rem;color:#cbd5e1;">${p.actions.map(a => `• ${escapeHtml(a)}`).join("<br/>")}</div>`
          : `<div style="font-size:0.7rem;color:#94a3b8;">No actions detected</div>`;
        const alertHtml = p.label === "urgent"
          ? `<div style="font-size:0.65rem;color:#38bdf8;margin-top:4px;">📲 Telegram Alert: Queued</div>`
          : "";
        stage4Actions.innerHTML = `${deadlineHtml}${actionsHtml}${alertHtml}`;
      } else {
        stage4Actions.innerHTML = `
          <div style="color:#64748b;font-size:0.7rem;">No urgent deadline</div>
          <div style="font-size:0.68rem;color:#64748b;margin-top:3px;">No telegram notification dispatched</div>
        `;
      }
    }
  }

  presetChips.forEach((chip, idx) => {
    chip.addEventListener("click", () => {
      presetChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      loadPreset(PIPELINE_PRESETS[idx]);
    });
  });

  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="pulse-dot"></span> Processing...`;

      // 5s waking server timer for Render
      const wakingTimer = setTimeout(() => {
        runBtn.innerHTML = `<span class="pulse-dot"></span> Waking server, this can take ~30s…`;
      }, 5000);

      // Animate stages sequentially
      for (let i = 0; i < nodes.length; i++) {
        nodes.forEach(n => n.classList.remove("active-stage"));
        nodes[i].classList.add("active-stage");
        await new Promise(r => setTimeout(r, 220));
      }

      // Always POST current text to /classify
      const rawText = inputEl ? inputEl.value.trim() : "";
      const textToProcess = rawText || currentPreset.body;

      try {
        const res = await fetch("/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: "", body: textToProcess })
        });

        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }

        const data = await res.json();
        updatePipelineDisplay({
          subject: textToProcess.substring(0, 32) + (textToProcess.length > 32 ? "..." : ""),
          body: textToProcess,
          label: data.label,
          confidence: data.confidence,
          deadline: data.deadline,
          actions: data.actions || [],
          tokens: textToProcess.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2).slice(0, 5)
        }, false);
      } catch (err) {
        // Fallback to preset data with offline demo note
        updatePipelineDisplay({
          ...currentPreset,
          body: textToProcess
        }, true);
      } finally {
        clearTimeout(wakingTimer);
        nodes.forEach(n => n.classList.remove("active-stage"));
        runBtn.disabled = false;
        runBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run Through Pipeline`;
      }
    });
  }

  // Initial load
  loadPreset(PIPELINE_PRESETS[0]);
}

/* =========================================================
   7. LIVE CLASSIFIER PLAYGROUND & INBOX STUDIO TABS
   ========================================================= */
function activateStudioTab(tabId) {
  const tabBtns = document.querySelectorAll(".studio-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  tabPanes.forEach(pane => {
    pane.classList.toggle("active", pane.id === tabId);
  });
}

function initStudioTabs() {
  const tabBtns = document.querySelectorAll(".studio-tab-btn");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activateStudioTab(btn.dataset.tab);
    });
  });
}

/* =========================================================
   7B. ACTION BUTTONS (GET STARTED & OWNER INBOX CTAS)
   ========================================================= */
function initActionButtons() {
  const SAMPLE_URGENT_SUBJECT = "🚨 Urgent: Production database connection failure";
  const SAMPLE_URGENT_BODY = "The main Postgres cluster is failing healthchecks and returning 500 errors. Please restore service immediately before 2 PM today.";

  function handleGetStarted(e) {
    if (e) e.preventDefault();

    // Scroll to #studio section
    const studioSection = document.getElementById("studio");
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: "smooth" });
    }

    // Activate the public classifier playground tab
    activateStudioTab("tabClassifier");

    // Pre-fill subject and body with a realistic urgent email sample
    const subjectInput = document.getElementById("classifySubject");
    const bodyInput = document.getElementById("classifyBody");
    if (subjectInput) {
      subjectInput.value = SAMPLE_URGENT_SUBJECT;
    }
    if (bodyInput) {
      bodyInput.value = SAMPLE_URGENT_BODY;
      bodyInput.dispatchEvent(new Event("input"));
    }

    // Focus the submit button
    const submitBtn = document.getElementById("classifySubmitBtn");
    if (submitBtn) {
      submitBtn.focus();
    }

    // Close mobile drawer if opened
    const mobileDrawer = document.getElementById("mobileDrawer");
    if (mobileDrawer) {
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
    }
    const mobileToggle = document.getElementById("mobileToggle");
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  }

  function handleOwnerInbox(e) {
    if (e) e.preventDefault();

    // Scroll to #studio section
    const studioSection = document.getElementById("studio");
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: "smooth" });
    }

    // Activate the owner inbox dashboard tab
    activateStudioTab("tabInboxDashboard");

    // Close mobile drawer if opened
    const mobileDrawer = document.getElementById("mobileDrawer");
    if (mobileDrawer) {
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
    }
    const mobileToggle = document.getElementById("mobileToggle");
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  }

  // Bind every "Get Started" button (navbar, mobile drawer, final CTA)
  const getStartedBtns = document.querySelectorAll("[data-action='get-started'], #navGetStartedBtn, #mobileGetStartedBtn, #ctaGetStartedBtn");
  getStartedBtns.forEach(btn => {
    btn.addEventListener("click", handleGetStarted);
  });

  // Bind "Owner Inbox" button
  const ownerInboxBtn = document.getElementById("navSignInBtn");
  if (ownerInboxBtn) {
    ownerInboxBtn.addEventListener("click", handleOwnerInbox);
  }
}

/* =========================================================
   8. CLASSIFIER FORM (API /classify)
   ========================================================= */
function initClassifierForm() {
  const form = document.getElementById("liveClassifierForm");
  const btn = document.getElementById("classifySubmitBtn");
  const subjectInput = document.getElementById("classifySubject");
  const bodyInput = document.getElementById("classifyBody");
  const errorEl = document.getElementById("classifyError");

  const resultPlaceholder = document.getElementById("resultPlaceholder");
  const resultActive = document.getElementById("resultActive");
  const resultLabel = document.getElementById("resultLabel");
  const resultConfidence = document.getElementById("resultConfidence");
  const resultDeadline = document.getElementById("resultDeadline");
  const resultActionsList = document.getElementById("resultActionsList");

  if (!form || !btn) return;

  function updateSubmitState() {
    const hasBody = bodyInput && bodyInput.value.trim().length > 0;
    btn.disabled = !hasBody;
  }

  if (bodyInput) {
    bodyInput.addEventListener("input", updateSubmitState);
    updateSubmitState();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subject = subjectInput ? subjectInput.value.trim() : "";
    const body = bodyInput ? bodyInput.value.trim() : "";

    if (!body) {
      if (errorEl) {
        errorEl.textContent = "Email body cannot be empty.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (errorEl) errorEl.style.display = "none";
    btn.disabled = true;
    btn.innerHTML = `<span class="pulse-dot"></span> Analyzing with ML...`;

    // 5s waking server timer for Render
    const wakingTimer = setTimeout(() => {
      btn.innerHTML = `<span class="pulse-dot"></span> Waking server, this can take ~30s…`;
    }, 5000);

    try {
      const res = await fetch("/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });

      if (!res.ok) {
        let errorMsg = `Server error (${res.status})`;
        try {
          const errData = await res.json();
          if (errData.detail) errorMsg = errData.detail;
        } catch (_) {}

        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.style.display = "block";
        }
        return;
      }

      const data = await res.json();
      renderLiveResult(data);
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = "Could not reach the server. Make sure the backend is running.";
        errorEl.style.display = "block";
      }
    } finally {
      clearTimeout(wakingTimer);
      updateSubmitState();
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg> Classify Email`;
    }
  });

  function renderLiveResult(data) {
    if (resultPlaceholder) resultPlaceholder.style.display = "none";
    if (resultActive) resultActive.style.display = "flex";

    if (resultLabel) {
      const isUrgent = data.label === "urgent";
      resultLabel.className = `badge badge-${data.label}`;
      resultLabel.textContent = isUrgent ? "URGENT ATTENTION" : "NOT URGENT";
    }

    if (resultConfidence) {
      resultConfidence.textContent = `${(data.confidence * 100).toFixed(0)}% confidence`;
    }

    if (resultDeadline) {
      resultDeadline.textContent = data.deadline || "None detected";
    }

    if (resultActionsList) {
      resultActionsList.innerHTML = "";
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(action => {
          const li = document.createElement("li");
          li.style.display = "flex";
          li.style.alignItems = "center";
          li.style.gap = "0.5rem";
          li.style.fontSize = "0.85rem";
          li.style.color = "var(--text-primary)";
          li.innerHTML = `<span style="color:var(--accent-cyan);">→</span> ${escapeHtml(action)}`;
          resultActionsList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.style.color = "var(--text-muted)";
        li.style.fontSize = "0.85rem";
        li.textContent = "No required action items extracted";
        resultActionsList.appendChild(li);
      }
    }
  }
}

/* =========================================================
   9. INBOX DASHBOARD (API /emails, /history, /history/{id})
   ========================================================= */
function initInboxDashboard() {
  const loadBtn = document.getElementById("loadHistoryBtn");
  const fetchBtn = document.getElementById("fetchEmailsBtn");
  const logoutBtn = document.getElementById("inboxLogoutBtn");
  const filterSelect = document.getElementById("inboxFilterSelect");
  const statusEl = document.getElementById("inboxStatusMsg");
  const tbody = document.getElementById("inboxTableBody");

  let currentEmails = [];

  function updateDashboardStats(emails = []) {
    const total = emails.length;
    const urgent = emails.filter(e => e.label === "urgent").length;
    const notUrgent = emails.filter(e => e.label === "not_urgent" || e.label === "low").length;
    const withDeadline = emails.filter(e => e.deadline && e.deadline.trim() !== "" && e.deadline !== "None detected").length;

    const statTotal = document.getElementById("statTotal");
    const statUrgent = document.getElementById("statUrgent");
    const statNotUrgent = document.getElementById("statNotUrgent");
    const statDeadline = document.getElementById("statDeadline");

    if (statTotal) statTotal.textContent = total;
    if (statUrgent) statUrgent.textContent = urgent;
    if (statNotUrgent) statNotUrgent.textContent = notUrgent;
    if (statDeadline) statDeadline.textContent = withDeadline;
  }

  function getPassword() {
    let password = localStorage.getItem("appPassword");
    if (password) return password;

    password = prompt("Enter owner password to unlock private inbox operations:");
    if (!password || password.trim() === "") return null;

    localStorage.setItem("appPassword", password.trim());
    return password.trim();
  }

  async function apiFetch(url, options = {}) {
    const password = getPassword();
    if (!password) {
      setStatus("Owner-only feature. Password required.", true);
      return null;
    }

    const headers = { ...options.headers, "X-App-Password": password };

    // 5s waking server timer for Render free tier
    const wakingTimer = setTimeout(() => {
      setStatus("Waking server, this can take ~30s…");
    }, 5000);

    try {
      const res = await fetch(url, { ...options, headers });

      if (res.status === 401) {
        localStorage.removeItem("appPassword");
        setStatus("Invalid password. Click again to retry.", true);
        return null;
      }

      return res;
    } catch (err) {
      setStatus("Could not reach backend server.", true);
      return null;
    } finally {
      clearTimeout(wakingTimer);
    }
  }

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "var(--accent-coral)" : "var(--accent-cyan)";
  }

  function showLoadingSpinner(msg = "Loading...") {
    if (!tbody) return;
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--text-secondary);">
          <div style="display:inline-flex;flex-direction:column;align-items:center;gap:0.75rem;">
            <div class="spinner-ring"></div>
            <span style="font-size:0.85rem;color:var(--text-muted);">${escapeHtml(msg)}</span>
          </div>
        </td>
      </tr>
    `;
  }

  function renderTable(emails) {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!emails || emails.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:3.5rem 1rem;color:var(--text-muted);">
            <div style="display:inline-flex;flex-direction:column;align-items:center;gap:0.6rem;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-muted);opacity:0.6;" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span style="font-weight:600;font-size:0.95rem;color:var(--text-secondary);">No emails found</span>
              <span style="font-size:0.8rem;color:var(--text-muted);">Click "Load History" to view saved messages or "Fetch New Emails" to sync from Gmail.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    emails.forEach(email => {
      const tr = document.createElement("tr");
      if (email.label === "urgent") tr.classList.add("row-urgent");

      const labelBadge = `<span class="badge badge-${escapeHtml(email.label)}">${escapeHtml(email.label)}</span>`;
      const dateStr = email.classified_at ? escapeHtml(new Date(email.classified_at).toLocaleString()) : "—";
      const actionsStr = (email.actions && email.actions.length > 0) ? escapeHtml(email.actions.join("; ")) : "—";
      const subjectStr = email.subject ? escapeHtml(email.subject) : "(No subject)";
      const senderStr = (email.sender || email.from) ? escapeHtml(email.sender || email.from) : "—";
      const deadlineStr = email.deadline ? escapeHtml(email.deadline) : "—";
      const emailId = escapeHtml(email.id);

      tr.innerHTML = `
        <td>${labelBadge}</td>
        <td><strong>${subjectStr}</strong></td>
        <td>${senderStr}</td>
        <td>${deadlineStr}</td>
        <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;">${actionsStr}</td>
        <td style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">${dateStr}</td>
        <td>
          <button class="btn-trash" title="Delete email" aria-label="Delete email: ${subjectStr}" data-id="${emailId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      `;

      const deleteBtn = tr.querySelector(".btn-trash");
      deleteBtn.addEventListener("click", () => deleteEmail(email, tr));

      tbody.appendChild(tr);
    });
  }

  function applyFilter() {
    const filter = filterSelect ? filterSelect.value : "all";
    const filtered = filter === "all" ? currentEmails : currentEmails.filter(e => e.label === filter);
    renderTable(filtered);
    setStatus(`Displaying ${filtered.length} of ${currentEmails.length} emails.`);
  }

  async function loadHistory() {
    setStatus("Connecting to database & loading history...");
    showLoadingSpinner("Loading email history from database...");
    try {
      const res = await apiFetch("/history");
      if (!res) return;
      if (!res.ok) {
        setStatus("Could not load history.", true);
        renderTable([]);
        return;
      }
      const data = await res.json();
      currentEmails = data.emails || [];
      updateDashboardStats(currentEmails);
      applyFilter();
    } catch (err) {
      setStatus("Could not reach backend server.", true);
    }
  }

  async function fetchNewEmails() {
    if (!fetchBtn) return;
    fetchBtn.disabled = true;
    fetchBtn.innerHTML = `<span class="pulse-dot"></span> Fetching...`;
    setStatus("Connecting to Gmail API and classifying latest messages...");
    showLoadingSpinner("Fetching new emails from Gmail & running inference...");

    try {
      const res = await apiFetch("/emails?n=10");
      if (!res) return;
      if (!res.ok) {
        setStatus("Gmail fetch failed or server error.", true);
        return;
      }
      const data = await res.json();
      await loadHistory();
      setStatus(`Successfully classified ${data.emails ? data.emails.length : 0} new emails.`);
    } catch (err) {
      setStatus("Could not reach backend server.", true);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Fetch New Emails (Gmail)`;
    }
  }

  async function deleteEmail(email, rowElement) {
    if (!confirm(`Delete "${email.subject || "this email"}"?`)) return;

    try {
      const res = await apiFetch(`/history/${encodeURIComponent(email.id)}`, { method: "DELETE" });
      if (!res || !res.ok) {
        setStatus("Delete failed.", true);
        return;
      }

      currentEmails = currentEmails.filter(e => e.id !== email.id);
      updateDashboardStats(currentEmails);
      applyFilter();
      setStatus(`Removed email from database.`);
    } catch (err) {
      setStatus("Delete failed.", true);
    }
  }

  if (loadBtn) loadBtn.addEventListener("click", loadHistory);
  if (fetchBtn) fetchBtn.addEventListener("click", fetchNewEmails);
  if (filterSelect) filterSelect.addEventListener("change", applyFilter);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("appPassword");
      currentEmails = [];
      updateDashboardStats([]);
      renderTable([]);
      setStatus("Logged out. Saved owner password cleared.");
    });
  }

  // Initial stats calculation
  updateDashboardStats([]);
}
