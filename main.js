/* =========================
   FitCRM - main.js
   localStorage key: "fitcrm_clients"
   ========================= */

const STORAGE_KEY = "fitcrm_clients";

/* ---------- Utilities ---------- */
function readClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function uid() {
  return "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
}

function byId(id) {
  return readClients().find(c => c.id === id) || null;
}

function setMsg(el, msg) {
  if (!el) return;
  el.textContent = msg || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function requireFields(client) {
  if (!client.name || client.name.trim().length < 2) return "Name is required (min 2 chars).";
  if (!client.email || !isValidEmail(client.email)) return "A valid email is required.";
  if (!client.phone || client.phone.trim().length < 7) return "Phone is required.";
  if (!client.goal || client.goal.trim().length < 2) return "Fitness goal is required.";
  if (!client.startDate) return "Start date is required.";
  return null;
}

/* ---------- Page Router ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "add") initAddPage();
  if (page === "list") initListPage();
  if (page === "view") initViewPage();
});

/* =========================
   Page 1: Add Client
   ========================= */
function initAddPage() {
  const form = document.getElementById("clientForm");
  const msg = document.getElementById("formMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const client = {
      id: uid(),
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      goal: document.getElementById("goal").value.trim(),
      startDate: document.getElementById("startDate").value,
      history: document.getElementById("history").value.trim(),
      createdAt: new Date().toISOString()
    };

    const err = requireFields(client);
    if (err) {
      setMsg(msg, err);
      return;
    }

    const clients = readClients();
    clients.push(client);
    saveClients(clients);

    form.reset();
    setMsg(msg, "Client added successfully ✅ (saved in localStorage)");
  });
}

/* =========================
   Page 2: Client List View
   ========================= */
function initListPage() {
  const listEl = document.getElementById("clientList");
  const listMsg = document.getElementById("listMsg");

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  const editSection = document.getElementById("editSection");
  const editForm = document.getElementById("editForm");
  const editMsg = document.getElementById("editMsg");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  function render(clients) {
    listEl.innerHTML = "";

    if (!clients.length) {
      setMsg(listMsg, "No clients yet. Add one from the Add Client page.");
      return;
    }
    setMsg(listMsg, `Showing ${clients.length} client(s).`);

    clients.forEach((c) => {
      const item = document.createElement("div");
      item.className = "item";

      item.innerHTML = `
        <div class="meta">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="small">${escapeHtml(c.email)} • ${escapeHtml(c.phone)}</div>
          <div class="small">Goal: ${escapeHtml(c.goal)} • Start: ${escapeHtml(c.startDate)}</div>
        </div>

        <div class="btns">
          <button class="btn-outline" data-action="view" data-id="${c.id}">View</button>
          <button class="btn-outline" data-action="edit" data-id="${c.id}">Edit</button>
          <button class="btn" data-action="delete" data-id="${c.id}">Delete</button>
        </div>
      `;

      listEl.appendChild(item);
    });
  }

  function refresh() {
    render(readClients());
  }

  function openEdit(client) {
    document.getElementById("editId").value = client.id;
    document.getElementById("editName").value = client.name || "";
    document.getElementById("editEmail").value = client.email || "";
    document.getElementById("editPhone").value = client.phone || "";
    document.getElementById("editGoal").value = client.goal || "";
    document.getElementById("editStartDate").value = client.startDate || "";
    document.getElementById("editHistory").value = client.history || "";

    editSection.hidden = false;
    editSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setMsg(editMsg, "Editing client…");
  }

  function closeEdit() {
    editSection.hidden = true;
    editForm.reset();
    setMsg(editMsg, "");
  }

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "view") {
      window.location.href = `client.html?id=${encodeURIComponent(id)}`;
      return;
    }

    if (action === "edit") {
      const client = byId(id);
      if (!client) return setMsg(listMsg, "Client not found.");
      openEdit(client);
      return;
    }

    if (action === "delete") {
      const client = byId(id);
      if (!client) return setMsg(listMsg, "Client not found.");

      const ok = confirm(`Delete "${client.name}"? This cannot be undone.`);
      if (!ok) return;

      const clients = readClients().filter(c => c.id !== id);
      saveClients(clients);
      closeEdit();
      refresh();
      setMsg(listMsg, "Client deleted ✅");
    }
  });

  searchBtn.addEventListener("click", () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const all = readClients();

    if (!q) {
      render(all);
      setMsg(listMsg, `Showing ${all.length} client(s).`);
      return;
    }

    const filtered = all.filter(c => (c.name || "").toLowerCase().includes(q));
    render(filtered);
    setMsg(listMsg, filtered.length ? `Found ${filtered.length} match(es).` : "No matches found.");
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    closeEdit();
    refresh();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const clients = readClients();
    const idx = clients.findIndex(c => c.id === id);

    if (idx === -1) {
      setMsg(editMsg, "Client not found (maybe deleted).");
      return;
    }

    const updated = {
      ...clients[idx],
      name: document.getElementById("editName").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      phone: document.getElementById("editPhone").value.trim(),
      goal: document.getElementById("editGoal").value.trim(),
      startDate: document.getElementById("editStartDate").value,
      history: document.getElementById("editHistory").value.trim(),
      updatedAt: new Date().toISOString()
    };

    const err = requireFields(updated);
    if (err) {
      setMsg(editMsg, err);
      return;
    }

    clients[idx] = updated;
    saveClients(clients);
    refresh();
    setMsg(editMsg, "Saved ✅");
  });

  cancelEditBtn.addEventListener("click", closeEdit);

  refresh();
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   Page 3: Client View + Wger Exercises
   ========================= */
function initViewPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const detailsEl = document.getElementById("clientDetails");
  const exerciseList = document.getElementById("exerciseList");
  const refreshBtn = document.getElementById("refreshExercisesBtn");
  const exMsg = document.getElementById("exMsg");

  if (!id) {
    detailsEl.innerHTML = `<p class="hint">Missing client id.</p>`;
    return;
  }

  const client = byId(id);
  if (!client) {
    detailsEl.innerHTML = `<p class="hint">Client not found (maybe deleted).</p>`;
    return;
  }

  detailsEl.innerHTML = `
    <div class="kv"><div class="k">Name</div><div class="v">${escapeHtml(client.name)}</div></div>
    <div class="kv"><div class="k">Email</div><div class="v">${escapeHtml(client.email)}</div></div>
    <div class="kv"><div class="k">Phone</div><div class="v">${escapeHtml(client.phone)}</div></div>
    <div class="kv"><div class="k">Fitness Goal</div><div class="v">${escapeHtml(client.goal)}</div></div>
    <div class="kv"><div class="k">Membership Start Date</div><div class="v">${escapeHtml(client.startDate)}</div></div>
    <div class="kv"><div class="k">Training history</div><div class="v">${escapeHtml(client.history || "—")}</div></div>
    <div class="kv"><div class="k">Exercises for the next session</div><div class="v">See suggestions below</div></div>
  `;

  async function loadExercises() {
    setMsg(exMsg, "Loading exercises…");
    exerciseList.innerHTML = "";

    try {
      const url = "https://wger.de/api/v2/exercise/?limit=50";
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const results = Array.isArray(data.results) ? data.results : [];

      const picked = pickRandom(results, 5).map(x => ({
        name: x.name || "Unnamed exercise",
        description: (x.description || "").replace(/<[^>]*>/g, "").trim()
      }));

      if (!picked.length) throw new Error("No exercises returned.");

      picked.forEach(ex => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${escapeHtml(ex.name)}</strong>${ex.description ? ` — ${escapeHtml(ex.description.slice(0, 140))}${ex.description.length > 140 ? "…" : ""}` : ""}`;
        exerciseList.appendChild(li);
      });

      setMsg(exMsg, "Loaded ✅");
    } catch (err) {
      const fallback = ["Push-ups", "Bodyweight Squats", "Plank", "Glute Bridges", "Lunges"];
      fallback.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        exerciseList.appendChild(li);
      });
      setMsg(exMsg, "Could not fetch from API — showing fallback list.");
    }
  }

  refreshBtn.addEventListener("click", loadExercises);
  loadExercises();
}

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
