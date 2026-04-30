let state = JSON.parse(localStorage.getItem("sf")) || {
  projects: [
    {
      id: 1,
      name: "Demo Project",
      scenes: [],
      folders: [],
      last: null
    }
  ]
};

let currentProject = state.projects[0];
let currentScene = null;

function save() {
  localStorage.setItem("sf", JSON.stringify(state));
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

  div.innerText = s.title;

  div.onclick = () => {
    currentScene = s;
    renderScenes();
    renderEditor();
  };

  el.appendChild(div);
}

function renderEditor() {
  const editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "No scene selected";
    return;
  }

  editor.innerText = currentScene.content || "";

  editor.oninput = () => {
    currentScene.content = editor.innerText;
    save();
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
  const name = prompt("Folder name:");
  if (!name) return;

  currentProject.folders.push({
    id: Date.now(),
    name
  });

  save();
  renderScenes();
}

function goHome() {
  alert("Home screen not implemented yet");
}

document.getElementById("projectName").innerText = currentProject.name;

renderScenes();
renderEditor();
