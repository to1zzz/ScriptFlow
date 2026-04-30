const app = document.getElementById("app");

let projects = [
  { id: 1, name: "Project 1", workspaces: [] }
];

let currentProject = null;

// ---------- RENDER ----------

function render() {
  if (!currentProject) {
    renderHome();
  } else {
    renderProject();
  }
}

// ---------- HOME ----------

function renderHome() {
  app.innerHTML = `
    <div class="page">
      <h1 class="logo">SF ScriptFlow</h1>

      <div class="grid">
        ${projects.map(p => `
          <div class="card" 
            onclick="openProject(${p.id})"
            oncontextmenu="deleteProject(event, ${p.id})"
          >
            ${p.name}
          </div>
        `).join("")}
      </div>

      <button class="btn" onclick="createProject()">
        + New Project
      </button>
    </div>
  `;
}

// ---------- PROJECT ----------

function renderProject() {
  app.innerHTML = `
    <div class="page">
      <button class="back" onclick="goBack()">← Back</button>

      <h2>${currentProject.name}</h2>

      <div class="grid">
        ${currentProject.workspaces.map(w => `
          <div class="card">
            ${w.name}
          </div>
        `).join("")}
      </div>

      <button class="btn" onclick="createWorkspace()">
        + Workspace
      </button>
    </div>
  `;
}

// ---------- ACTIONS ----------

function createProject() {
  const name = prompt("Project name") || `Project ${projects.length + 1}`;
  projects.push({ id: Date.now(), name, workspaces: [] });
  render();
}

function deleteProject(e, id) {
  e.preventDefault();
  if (confirm("Delete project?")) {
    projects = projects.filter(p => p.id !== id);
    render();
  }
}

function openProject(id) {
  currentProject = projects.find(p => p.id === id);
  render();
}

function goBack() {
  currentProject = null;
  render();
}

function createWorkspace() {
  const name =
    prompt("Workspace name") ||
    `Workspace ${currentProject.workspaces.length + 1}`;

  currentProject.workspaces.push({
    id: Date.now(),
    name
  });

  render();
}

// ---------- INIT ----------
render();
