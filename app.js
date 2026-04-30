const app = document.getElementById("app");

let state = {
  view: "home",
  projects: [],
  currentProject: null,
  currentWorkspace: null,
  currentScene: null
};

function save() {
  localStorage.setItem("scriptflow", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("scriptflow");
  if (data) state = JSON.parse(data);
}

function uid() {
  return Date.now().toString();
}

/* ---------- HOME ---------- */

function renderHome() {
  app.innerHTML = `
    <div class="header"><h2>ScriptFlow</h2></div>
    <div class="grid">
      ${state.projects.map(p => `
        <div class="card" onclick="openProject('${p.id}')" 
             oncontextmenu="projectMenu(event,'${p.id}')">
          ${p.name}
        </div>
      `).join("")}
    </div>
    <button class="btn" onclick="createProject()">+ New Project</button>
  `;
}

function createProject() {
  const name = prompt("Project name") || "Project";
  state.projects.push({
    id: uid(),
    name,
    workspaces: []
  });
  save();
  render();
}

function openProject(id) {
  state.currentProject = id;
  state.view = "project";
  render();
}

function projectMenu(e, id) {
  e.preventDefault();
  const action = prompt("delete / rename");

  const p = state.projects.find(p => p.id === id);

  if (action === "delete") {
    state.projects = state.projects.filter(p => p.id !== id);
  }

  if (action === "rename") {
    const name = prompt("New name") || p.name;
    p.name = name;
  }

  save();
  render();
}

/* ---------- PROJECT ---------- */

function renderProject() {
  const project = state.projects.find(p => p.id === state.currentProject);

  app.innerHTML = `
    <div class="header">
      <button onclick="goHome()">← Back</button>
      <h2>${project.name}</h2>
    </div>

    <div class="grid">
      ${project.workspaces.map(w => `
        <div class="card" onclick="openWorkspace('${w.id}')"
             oncontextmenu="workspaceMenu(event,'${w.id}')">
          ${w.name}
        </div>
      `).join("")}
    </div>

    <button class="btn" onclick="createWorkspace()">+ Workspace</button>
  `;
}

function createWorkspace() {
  const project = state.projects.find(p => p.id === state.currentProject);

  const name = prompt("Workspace name") || "Workspace";

  project.workspaces.push({
    id: uid(),
    name,
    scenes: []
  });

  save();
  render();
}

function openWorkspace(id) {
  state.currentWorkspace = id;
  state.view = "workspace";
  render();
}

function workspaceMenu(e, id) {
  e.preventDefault();

  const project = state.projects.find(p => p.id === state.currentProject);
  const w = project.workspaces.find(w => w.id === id);

  const action = prompt("delete / rename");

  if (action === "delete") {
    project.workspaces = project.workspaces.filter(w => w.id !== id);
  }

  if (action === "rename") {
    const name = prompt("New name") || w.name;
    w.name = name;
  }

  save();
  render();
}

/* ---------- WORKSPACE / EDITOR ---------- */

function renderWorkspace() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const workspace = project.workspaces.find(w => w.id === state.currentWorkspace);

  app.innerHTML = `
    <div class="header">
      <button onclick="renderProject()">← Back</button>
      <h3>${workspace.name}</h3>
    </div>

    <div class="editor">
      <div class="sidebar">
        ${workspace.scenes.map(s => `
          <div class="scene ${state.currentScene === s.id ? "active" : ""}"
               onclick="selectScene('${s.id}')"
               oncontextmenu="sceneMenu(event,'${s.id}')">
            ${s.name}
          </div>
        `).join("")}

        <button onclick="createScene()">+ Scene</button>
      </div>

      <div class="editor-area">
        <textarea oninput="updateText(this.value)">
${getCurrentText()}
        </textarea>
      </div>
    </div>
  `;
}

function createScene() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const workspace = project.workspaces.find(w => w.id === state.currentWorkspace);

  const name = prompt("Scene name") || "Scene";

  const scene = {
    id: uid(),
    name,
    text: ""
  };

  workspace.scenes.push(scene);
  state.currentScene = scene.id;

  save();
  render();
}

function selectScene(id) {
  state.currentScene = id;
  render();
}

function updateText(value) {
  const project = state.projects.find(p => p.id === state.currentProject);
  const workspace = project.workspaces.find(w => w.id === state.currentWorkspace);
  const scene = workspace.scenes.find(s => s.id === state.currentScene);

  if (scene) scene.text = value;

  save();
}

function getCurrentText() {
  const project = state.projects.find(p => p.id === state.currentProject);
  const workspace = project.workspaces.find(w => w.id === state.currentWorkspace);
  const scene = workspace.scenes.find(s => s.id === state.currentScene);

  return scene ? scene.text : "";
}

function sceneMenu(e, id) {
  e.preventDefault();

  const project = state.projects.find(p => p.id === state.currentProject);
  const workspace = project.workspaces.find(w => w.id === state.currentWorkspace);
  const scene = workspace.scenes.find(s => s.id === id);

  const action = prompt("delete / rename");

  if (action === "delete") {
    workspace.scenes = workspace.scenes.filter(s => s.id !== id);
    state.currentScene = null;
  }

  if (action === "rename") {
    const name = prompt("New name") || scene.name;
    scene.name = name;
  }

  save();
  render();
}

/* ---------- NAV ---------- */

function goHome() {
  state.view = "home";
  state.currentProject = null;
  render();
}

/* ---------- MAIN ---------- */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "project") renderProject();
  if (state.view === "workspace") renderWorkspace();
}

load();
render();
