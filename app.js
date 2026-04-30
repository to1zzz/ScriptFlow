let state = JSON.parse(localStorage.getItem("sf")) || {
  projects: []
};

let currentProject = null;
let currentScene = null;

function save() {
  localStorage.setItem("sf", JSON.stringify(state));
}

function createProject() {
  const name = prompt("Название проекта:");
  if (!name) return;

  state.projects.push({
    id: Date.now(),
    name,
    scenes: [],
    folders: [],
    last: null
  });

  save();
  renderProjects();
}

function renderProjects() {
  const el = document.getElementById("projects");
  el.innerHTML = "";

  state.projects.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${p.name}</b>`;

    const bar = document.createElement("div");
    bar.className = "bar";

    p.scenes.forEach(s => {
      const seg = document.createElement("div");

      if (!s.content) seg.className = "seg gray";
      else seg.className = "seg white";

      if (p.last === s.id) seg.className = "seg red";

      seg.onclick = () => openProject(p.id, s.id);
      bar.appendChild(seg);
    });

    div.appendChild(bar);

    div.onclick = () => openProject(p.id);

    el.appendChild(div);
  });
}

function openProject(id, sceneId=null) {
  currentProject = state.projects.find(p => p.id === id);

  document.getElementById("home").classList.add("hidden");
  document.getElementById("editorScreen").classList.remove("hidden");

  if (sceneId) {
    currentScene = currentProject.scenes.find(s => s.id === sceneId);
  } else {
    currentScene = currentProject.scenes[0] || null;
  }

  renderScenes();
  renderEditor();
}

function renderScenes() {
  const el = document.getElementById("scenes");
  el.innerHTML = "";

  currentProject.folders.forEach(f => {
    const fd = document.createElement("div");
    fd.className = "folder";
    fd.innerText = "📁 " + f.name;
    el.appendChild(fd);

    currentProject.scenes
      .filter(s => s.folderId === f.id)
      .forEach(renderSceneItem);
  });

  currentProject.scenes
    .filter(s => !s.folderId)
    .forEach(renderSceneItem);
}

function renderSceneItem(s) {
  const el = document.getElementById("scenes");

  const div = document.createElement("div");
  div.className = "scene";
  if (currentScene && currentScene.id === s.id) {
    div.classList.add("active");
  }

  div.innerText = s.title || "Без названия";
  div.onclick = () => {
    currentScene = s;
    currentProject.last = s.id;
    save();
    renderScenes();
    renderEditor();
  };

  el.appendChild(div);
}

function renderEditor() {
  const editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "";
    return;
  }

  editor.innerText = currentScene.content || "";

  editor.oninput = () => {
    currentScene.content = editor.innerText;
    currentProject.last = currentScene.id;
    save();
    renderProjects();
  };
}

function addScene() {
  const s = {
    id: Date.now(),
    title: "Scene " + (currentProject.scenes.length + 1),
    content: "",
    folderId: null
  };

  currentProject.scenes.push(s);
  currentScene = s;
  save();

  renderScenes();
  renderEditor();
}

function addFolder() {
  const name = prompt("Имя папки:");
  if (!name) return;

  currentProject.folders.push({
    id: Date.now(),
    name
  });

  save();
  renderScenes();
}

function addEntity() {
  const text = window.getSelection().toString();
  if (!text) return alert("Выдели текст");

  alert("Сущность добавлена: " + text);
}

function goHome() {
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("editorScreen").classList.add("hidden");

  renderProjects();
}

renderProjects();
