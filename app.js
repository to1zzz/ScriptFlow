let projects = [];

let currentProject = null;
let currentWorkspace = null;
let currentScene = null;

/* NAV */

function goHome() {
  show("home");
}

function goProject() {
  show("projectScreen");
}

function show(id) {
  document.querySelectorAll(".screen, #workspaceScreen")
    .forEach(e => e.classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");
}

/* PROJECTS */

function createProject() {
  const p = {
    name: "Project " + (projects.length + 1),
    workspaces: []
  };

  projects.push(p);
  renderProjects();
}

function renderProjects() {
  const el = document.getElementById("projects");
  el.innerHTML = "";

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = p.name;

    card.onclick = () => {
      currentProject = p;
      document.getElementById("projectTitle").innerText = p.name;
      show("projectScreen");
      renderWorkspaces();
    };

    el.appendChild(card);
  });
}

/* WORKSPACES */

function createWorkspace() {
  const w = {
    name: "Workspace " + (currentProject.workspaces.length + 1),
    scenes: []
  };

  currentProject.workspaces.push(w);
  renderWorkspaces();
}

function renderWorkspaces() {
  const el = document.getElementById("workspaces");
  el.innerHTML = "";

  currentProject.workspaces.forEach(w => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = w.name;

    card.onclick = () => {
      currentWorkspace = w;
      document.getElementById("workspaceTitle").innerText = w.name;
      show("workspaceScreen");
      renderScenes();
    };

    el.appendChild(card);
  });
}

/* SCENES */

function addScene() {
  const s = {
    title: "Scene " + (currentWorkspace.scenes.length + 1),
    content: ""
  };

  currentWorkspace.scenes.push(s);
  currentScene = s;

  renderScenes();
  renderEditor();
}

function renderScenes() {
  const el = document.getElementById("scenes");
  el.innerHTML = "";

  currentWorkspace.scenes.forEach(s => {
    const div = document.createElement("div");
    div.className = "scene";
    div.innerText = s.title;

    div.onclick = () => {
      currentScene = s;
      renderScenes();
      renderEditor();
    };

    if (s === currentScene) {
      div.classList.add("active");
    }

    el.appendChild(div);
  });
}

/* EDITOR */

function renderEditor() {
  const editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "Create a scene";
    return;
  }

  editor.innerText = currentScene.content;

  editor.oninput = () => {
    currentScene.content = editor.innerText;
  };
}

/* INIT */

renderProjects();
