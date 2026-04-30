// =======================
// STATE
// =======================

let projects = [];

let currentProject = null;
let currentWorkspace = null;
let currentScene = null;


// =======================
// NAVIGATION
// =======================

function show(id) {
  document.querySelectorAll("#home,#projectScreen,#workspaceScreen")
    .forEach(e => e.classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");
}

function goHome() {
  show("home");
  renderProjects();
}

function goProject() {
  show("projectScreen");
  renderBars();
}


// =======================
// PROJECTS
// =======================

function createProject() {
  let name = prompt("Project name (optional):") || `Project ${projects.length + 1}`;

  let project = {
    name,
    workspaces: [],
    last: null
  };

  projects.push(project);
  renderProjects();
}

function renderProjects() {
  let el = document.getElementById("projects");
  el.innerHTML = "";

  projects.forEach(p => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerText = p.name;

    // открыть проект
    card.onclick = () => {
      currentProject = p;
      document.getElementById("projectTitle").innerText = p.name;
      show("projectScreen");
      renderBars();
    };

    // rename
    card.ondblclick = () => {
      let n = prompt("Rename project:", p.name);
      if (n) {
        p.name = n;
        renderProjects();
      }
    };

    el.appendChild(card);
  });
}


// =======================
// WORKSPACES
// =======================

function createWorkspace() {
  let name = prompt("Workspace name (optional):") || `Workspace ${currentProject.workspaces.length + 1}`;

  let workspace = {
    name,
    scenes: [],
    last: null
  };

  currentProject.workspaces.push(workspace);
  renderBars();
}

function renderBars() {
  let el = document.getElementById("workspaceBars");
  el.innerHTML = "";

  currentProject.workspaces.forEach(w => {

    let bar = document.createElement("div");
    bar.className = "bar";

    // 🔥 ФИКС: всегда минимум 1 сегмент
    let scenes = w.scenes.length ? w.scenes : [{}];

    scenes.forEach(s => {
      let seg = document.createElement("div");

      if (!s.content) seg.className = "seg gray";
      else seg.className = "seg white";

      if (w.last === s) seg.className = "seg red";

      bar.appendChild(seg);
    });

    // открыть workspace
    bar.onclick = () => {
      currentWorkspace = w;
      document.getElementById("workspaceTitle").innerText = w.name;
      show("workspaceScreen");
      renderScenes();
      renderEditor();
    };

    // rename
    bar.ondblclick = () => {
      let n = prompt("Rename workspace:", w.name);
      if (n) {
        w.name = n;
        renderBars();
      }
    };

    el.appendChild(bar);
  });
}


// =======================
// SCENES
// =======================

function addScene() {
  let scene = {
    title: `Scene ${currentWorkspace.scenes.length + 1}`,
    content: ""
  };

  currentWorkspace.scenes.push(scene);
  currentScene = scene;

  renderScenes();
  renderEditor();
}

function renderScenes() {
  let el = document.getElementById("scenes");
  el.innerHTML = "";

  currentWorkspace.scenes.forEach(s => {
    let div = document.createElement("div");
    div.className = "scene";
    div.innerText = s.title;

    if (s === currentScene) {
      div.classList.add("active");
    }

    div.onclick = () => {
      currentScene = s;
      currentWorkspace.last = s;
      renderScenes();
      renderEditor();
    };

    // rename сцены
    div.ondblclick = () => {
      let n = prompt("Rename scene:", s.title);
      if (n) {
        s.title = n;
        renderScenes();
      }
    };

    el.appendChild(div);
  });
}


// =======================
// EDITOR
// =======================

function renderEditor() {
  let editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "Create a scene";
    return;
  }

  editor.innerHTML = currentScene.content;

  editor.oninput = () => {
    currentScene.content = editor.innerHTML;
  };
}


// =======================
// TOOLBAR (ENTITY)
// =======================

let editor = document.getElementById("editor");
let toolbar = document.getElementById("toolbar");

editor.addEventListener("mouseup", () => {
  let sel = window.getSelection();

  if (!sel || sel.toString().length === 0) {
    toolbar.classList.add("hidden");
    return;
  }

  let range = sel.getRangeAt(0);
  let rect = range.getBoundingClientRect();

  toolbar.style.top = (rect.top - 40 + window.scrollY) + "px";
  toolbar.style.left = (rect.left + window.scrollX) + "px";

  toolbar.classList.remove("hidden");
});

function wrapEntity() {
  let sel = window.getSelection();

  if (!sel.rangeCount) return;

  let range = sel.getRangeAt(0);

  let span = document.createElement("span");
  span.style.background = "#264f78";
  span.style.padding = "2px 4px";
  span.style.borderRadius = "4px";

  try {
    range.surroundContents(span);
  } catch {
    // если сложный selection — fallback
    let text = range.toString();
    span.innerText = text;
    range.deleteContents();
    range.insertNode(span);
  }

  toolbar.classList.add("hidden");
}


// =======================
// RIGHT CLICK (FAKE FOLDER)
// =======================

document.getElementById("scenes").addEventListener("contextmenu", (e) => {
  e.preventDefault();

  let name = prompt("Folder name:");
  if (!name) return;

  currentWorkspace.scenes.push({
    title: "📁 " + name,
    content: ""
  });

  renderScenes();
});


// =======================
// INIT
// =======================

renderProjects();
