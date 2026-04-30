let projects = [];
let currentProject = null;
let currentScene = null;

/* ---------- NAV ---------- */

function goProjects() {
  hideAll();
  show("projectsScreen");
  renderProjects();
}

function goWorkspace(project) {
  currentProject = project;
  currentScene = null;

  hideAll();
  show("workspace");

  document.getElementById("projectName").innerText = project.name;

  renderScenes();
  renderBars();
}

function hideAll() {
  document.querySelectorAll(".screen, #workspace")
    .forEach(el => el.classList.add("hidden"));
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

/* ---------- PROJECTS ---------- */

function createProject() {
  const name = prompt("Project name:");
  if (!name) return;

  const p = {
    name,
    scenes: [],
    folders: [],
    last: null
  };

  projects.push(p);
  renderProjects();
}

function renderProjects() {
  const tabs = document.getElementById("projectTabs");
  const bars = document.getElementById("projectBars");

  tabs.innerHTML = "";
  bars.innerHTML = "";

  projects.forEach(p => {

    // LEFT tabs
    const tab = document.createElement("div");
    tab.className = "project-tab";
    tab.innerText = p.name;

    tab.onclick = () => goWorkspace(p);

    tabs.appendChild(tab);

    // RIGHT bars
    const bar = document.createElement("div");
    bar.className = "bar";

    p.scenes.forEach(s => {
      const seg = document.createElement("div");

      if (!s.content) seg.className = "seg gray";
      else seg.className = "seg white";

      if (p.last === s) seg.className = "seg red";

      seg.onclick = () => {
        goWorkspace(p);
        currentScene = s;
        renderScenes();
        renderEditor();
      };

      bar.appendChild(seg);
    });

    bars.appendChild(bar);
  });
}

/* ---------- SCENES ---------- */

function addScene(folderId = null) {
  if (!currentProject) return;

  const s = {
    id: Date.now(),
    title: "Scene " + (currentProject.scenes.length + 1),
    content: "",
    folderId
  };

  currentProject.scenes.push(s);
  currentScene = s;
  currentProject.last = s;

  renderScenes();
  renderEditor();
  renderBars();
}

/* ---------- FOLDERS ---------- */

function addFolder() {
  if (!currentProject) return;

  const name = prompt("Folder name:");
  if (!name) return;

  const f = {
    id: Date.now(),
    name
  };

  currentProject.folders.push(f);

  renderScenes();
}

/* ---------- RENDER SCENES ---------- */

function renderScenes() {
  const el = document.getElementById("scenes");
  el.innerHTML = "";

  // folders first
  currentProject.folders.forEach(f => {

    const fd = document.createElement("div");
    fd.className = "folder";
    fd.innerText = "📁 " + f.name;

    el.appendChild(fd);

    const addBtn = document.createElement("div");
    addBtn.className = "add-inside";
    addBtn.innerText = "+ scene";
    addBtn.onclick = () => addScene(f.id);

    el.appendChild(addBtn);

    currentProject.scenes
      .filter(s => s.folderId === f.id)
      .forEach(renderSceneItem);
  });

  // root scenes
  currentProject.scenes
    .filter(s => !s.folderId)
    .forEach(renderSceneItem);
}

function renderSceneItem(s) {
  const el = document.getElementById("scenes");

  const div = document.createElement("div");
  div.className = "scene";
  div.innerText = s.title;

  if (currentScene === s) {
    div.classList.add("active");
  }

  div.onclick = () => {
    currentScene = s;
    currentProject.last = s;

    renderScenes();
    renderEditor();
    renderBars();
  };

  el.appendChild(div);
}

/* ---------- EDITOR ---------- */

function renderEditor() {
  const editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "Select or create a scene";
    return;
  }

  editor.innerText = currentScene.content;

  editor.oninput = () => {
    currentScene.content = editor.innerText;
    currentProject.last = currentScene;
    renderBars();
  };
}

/* ---------- BARS ---------- */

function renderBars() {
  renderProjects(); // перерисовываем полоски
}

/* ---------- ENTITY (заглушка) ---------- */

function addEntity() {
  const text = window.getSelection().toString();
  if (!text) return alert("Select text first");

  alert("Entity: " + text);
}
