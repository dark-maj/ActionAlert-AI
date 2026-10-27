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
      const isHidden = mobileDrawer.style.display === "none" || !mobileDrawer.style.display;
      mobileDrawer.style.display = isHidden ? "flex" : "none";
    });

    // Close mobile drawer when clicking any link
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.style.display = "none";
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
          chip.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> ${escapeHtml(act)}`;
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

  // Inbound simulation button
  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      simulateBtn.disabled = true;
      simulateBtn.innerHTML = `<span class="pulse-dot"></span> Analyzing stream...`;

      setTimeout(() => {
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Simulate Inbound`;
        selectEmail(0);
        // Trigger subtle flash on top card
        const topCard = emailCards[0];
        topCard.style.boxShadow = "0 0 30px rgba(251, 113, 133, 0.45)";
        setTimeout(() => {
          topCard.style.boxShadow = "";
        }, 1200);
      }, 700);
    });
  }
}

/* =========================================================
   3. SCROLL REVEAL ANIMATIONS
   ========================================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  reveals.forEach(el => observer.observe(el));
}

/* =========================================================
   4. HOW IT WORKS CONNECTOR LINE
   ========================================================= */
function initStepsAnimation() {
  const section = document.getElementById("how-it-works");
  const path = document.getElementById("stepsProgressLine");

  if (!section || !path) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        path.classList.add("animated");
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);
}

/* =========================================================
   5. BENTO GRID INTERACTIONS
   ========================================================= */
function initBentoInteractions() {
  // Focused Inbox toggle in Bento Card 4
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
      inputEl.value = `${preset.subject}: ${preset.body}`;
    }
    updatePipelineDisplay(preset);
  }

  function updatePipelineDisplay(p) {
    if (stage1Text) {
      stage1Text.innerHTML = `<strong>Subject:</strong> ${escapeHtml(p.subject)}<br/><span style="color:#94a3b8;font-size:0.7rem;">Length: ${p.body ? p.body.length : 0} chars</span>`;
    }

    if (stage2Tokens) {
      stage2Tokens.innerHTML = (p.tokens || []).map(t => 
        `<span style="background:rgba(34,211,238,0.15);color:#22d3ee;padding:1px 5px;border-radius:3px;margin:2px;display:inline-block;">${escapeHtml(t)}</span>`
      ).join(" ");
    }

    if (stage3Model) {
      const isUrgent = p.label === "urgent";
      const color = isUrgent ? "var(--accent-coral)" : "var(--accent-emerald)";
      const bg = isUrgent ? "rgba(251,113,133,0.15)" : "rgba(52,211,153,0.15)";
      stage3Model.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span>LR Classification:</span>
          <span style="font-weight:700;color:${color};background:${bg};padding:1px 6px;border-radius:4px;">${escapeHtml(p.label ? p.label.toUpperCase() : "")}</span>
        </div>
        <div style="font-size:0.7rem;color:#94a3b8;">Confidence: ${(p.confidence * 100).toFixed(0)}%</div>
        <div style="font-size:0.68rem;color:#64748b;margin-top:2px;">TF-IDF Matrix: 92 features</div>
      `;
    }

    if (stage4Actions) {
      if (p.actions && p.actions.length > 0) {
        stage4Actions.innerHTML = `
          <div style="color:var(--accent-coral-light);font-size:0.7rem;margin-bottom:3px;font-weight:600;">
            ⚡ Deadline: ${escapeHtml(p.deadline)}
          </div>
          <div style="font-size:0.7rem;color:#cbd5e1;">
            ${p.actions.map(a => `• ${escapeHtml(a)}`).join("<br/>")}
          </div>
          <div style="font-size:0.65rem;color:#38bdf8;margin-top:4px;">📲 Telegram Alert: Queued</div>
        `;
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

      // Animate stages sequentially
      for (let i = 0; i < nodes.length; i++) {
        nodes.forEach(n => n.classList.remove("active-stage"));
        nodes[i].classList.add("active-stage");
        await new Promise(r => setTimeout(r, 380));
      }

      // Check if user entered custom text
      const customText = inputEl ? inputEl.value.trim() : "";
      if (customText) {
        try {
          const res = await fetch("/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "", body: customText })
          });
          if (res.ok) {
            const data = await res.json();
            updatePipelineDisplay({
              subject: customText.substring(0, 30) + "...",
              body: customText,
              label: data.label,
              confidence: data.confidence,
              deadline: data.deadline,
              actions: data.actions || [],
              tokens: customText.toLowerCase().split(/\s+/).slice(0, 5)
            });
          } else {
            updatePipelineDisplay(currentPreset);
          }
        } catch (e) {
          updatePipelineDisplay(currentPreset);
        }
      }

      nodes.forEach(n => n.classList.remove("active-stage"));
      runBtn.disabled = false;
      runBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run Through Pipeline`;
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
    btn.classList.toggle("active", btn.dataset.tab === tabId);
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
    }

    // Focus the submit button
    const submitBtn = document.getElementById("classifySubmitBtn");
    if (submitBtn) {
      submitBtn.focus();
    }

    // Close mobile drawer if opened
    const mobileDrawer = document.getElementById("mobileDrawer");
    if (mobileDrawer) {
      mobileDrawer.style.display = "none";
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
      mobileDrawer.style.display = "none";
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subject = subjectInput ? subjectInput.value.trim() : "";
    const body = bodyInput ? bodyInput.value.trim() : "";

    if (!body) {
      if (errorEl) {
        errorEl.textContent = "Please enter email body text to classify.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (errorEl) errorEl.style.display = "none";
    btn.disabled = true;
    btn.innerHTML = `<span class="pulse-dot"></span> Analyzing with ML...`;

    try {
      const res = await fetch("/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Server error while classifying email.");
      }

      const data = await res.json();
      renderLiveResult(data);
    } catch (err) {
      // Local graceful fallback if API server is not running
      const isUrgent = /outage|urgent|immediately|deadline|asap|down|emergency|today|breach|pay now/i.test(`${subject} ${body}`);
      renderLiveResult({
        label: isUrgent ? "urgent" : "not_urgent",
        confidence: isUrgent ? 0.96 : 0.88,
        deadline: isUrgent ? "Within 24 Hours (Estimated)" : null,
        actions: isUrgent ? ["Review incident telemetry", "Respond to requester"] : []
      });
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg> Classify Email`;
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
  const filterSelect = document.getElementById("inboxFilterSelect");
  const statusEl = document.getElementById("inboxStatusMsg");
  const tbody = document.getElementById("inboxTableBody");

  let currentEmails = [];

  function getPassword() {
    let password = localStorage.getItem("appPassword");
    if (password) return password;

    password = prompt("Enter owner password to unlock private inbox operations:");
    if (!password || password.trim() === "") return null;

    localStorage.setItem("appPassword", password);
    return password;
  }

  async function apiFetch(url, options = {}) {
    const password = getPassword();
    if (!password) {
      setStatus("Owner-only feature. Password required.", true);
      return null;
    }

    const headers = { ...options.headers, "X-App-Password": password };
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      localStorage.removeItem("appPassword");
      setStatus("Invalid password. Click again to retry.", true);
      return null;
    }

    return res;
  }

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "var(--accent-coral)" : "var(--accent-cyan)";
  }

  function renderTable(emails) {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!emails || emails.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem;">No emails saved yet. Click "Load History" or "Fetch New Emails".</td>`;
      tbody.appendChild(tr);
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
          <button class="btn-trash" title="Delete email" data-id="${emailId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
    try {
      const res = await apiFetch("/history");
      if (!res) return;
      if (!res.ok) {
        setStatus("Could not load history.", true);
        return;
      }
      const data = await res.json();
      currentEmails = data.emails || [];
      applyFilter();
    } catch (err) {
      setStatus("Could not reach backend server.", true);
    }
  }

  async function fetchNewEmails() {
    if (!fetchBtn) return;
    fetchBtn.disabled = true;
    fetchBtn.textContent = "Fetching Gmail...";
    setStatus("Connecting to Gmail API and classifying latest messages...");

    try {
      const res = await apiFetch("/emails?n=10");
      if (!res) return;
      if (!res.ok) {
        setStatus("Gmail fetch failed.", true);
        return;
      }
      const data = await res.json();
      setStatus(`Successfully classified ${data.emails ? data.emails.length : 0} new emails.`);
      await loadHistory();
    } catch (err) {
      setStatus("Could not reach backend server.", true);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = "Fetch New Emails";
    }
  }

  async function deleteEmail(email, rowElement) {
    if (!confirm(`Delete "${email.subject || "this email"}"?`)) return;

    try {
      const res = await apiFetch(`/history/${encodeURIComponent(email.id)}`, { method: "DELETE" });
      if (!res) return;

      currentEmails = currentEmails.filter(e => e.id !== email.id);
      applyFilter();
      setStatus(`Removed email from database.`);
    } catch (err) {
      setStatus("Delete failed.", true);
    }
  }

  if (loadBtn) loadBtn.addEventListener("click", loadHistory);
  if (fetchBtn) fetchBtn.addEventListener("click", fetchNewEmails);
  if (filterSelect) filterSelect.addEventListener("change", applyFilter);
}
