let projects = [];

let currentProject = null;
let currentWorkspace = null;
let currentScene = null;

/* NAV */

function show(id){
  document.querySelectorAll("#home,#projectScreen,#workspaceScreen")
    .forEach(e=>e.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goHome(){ show("home"); renderProjects(); }
function goProject(){ show("projectScreen"); renderBars(); }

/* PROJECTS */

function createProject(){
  let name = prompt("Project name:") || `Project ${projects.length+1}`;

  projects.push({
    name,
    workspaces:[]
  });

  renderProjects();
}

function renderProjects(){
  let el=document.getElementById("projects");
  el.innerHTML="";

  projects.forEach(p=>{
    let card=document.createElement("div");
    card.className="card";
    card.innerText=p.name;

    card.onclick=()=>{
      currentProject=p;
      document.getElementById("projectTitle").innerText=p.name;
      show("projectScreen");
      renderBars();
    };

    el.appendChild(card);
  });
}

/* WORKSPACES */

function createWorkspace(){
  let name = prompt("Workspace name:") || `Workspace ${currentProject.workspaces.length+1}`;

  currentProject.workspaces.push({
    name,
    root:[] // 🔥 теперь дерево
  });

  renderBars();
}

function renderBars(){
  let el=document.getElementById("workspaceBars");
  el.innerHTML="";

  currentProject.workspaces.forEach(w=>{
    let bar=document.createElement("div");
    bar.className="bar";

    let items = flatten(w.root);

    if(items.length===0) items=[{}];

    items.forEach(s=>{
      let seg=document.createElement("div");

      if(!s.content) seg.className="seg gray";
      else seg.className="seg white";

      if(w.last===s) seg.className="seg red";

      bar.appendChild(seg);
    });

    bar.onclick=()=>{
      currentWorkspace=w;
      document.getElementById("workspaceTitle").innerText=w.name;
      show("workspaceScreen");
      renderTree();
    };

    el.appendChild(bar);
  });
}

/* TREE */

function addScene(){
  currentWorkspace.root.push({
    type:"scene",
    title:`Scene ${Date.now()}`,
    content:""
  });
  renderTree();
}

function addFolder(){
  let name = prompt("Folder name:") || "Folder";

  currentWorkspace.root.push({
    type:"folder",
    title:name,
    open:true,
    children:[]
  });

  renderTree();
}

function flatten(arr){
  let res=[];
  arr.forEach(i=>{
    if(i.type==="scene") res.push(i);
    if(i.type==="folder") res.push(...flatten(i.children));
  });
  return res;
}

function renderTree(){
  let el=document.getElementById("scenes");
  el.innerHTML="";

  function draw(items, parent){
    items.forEach(item=>{
      let div=document.createElement("div");
      div.className="item";

      if(item.type==="folder"){
        div.classList.add("folder");
        div.innerText=(item.open?"📂 ":"📁 ")+item.title;

        div.onclick=()=>{
          item.open=!item.open;
          renderTree();
        };

        parent.appendChild(div);

        if(item.open){
          let child=document.createElement("div");
          child.className="children";
          parent.appendChild(child);
          draw(item.children, child);
        }

      } else {
        div.innerText=item.title;

        div.draggable=true;

        div.onclick=()=>{
          currentScene=item;
          renderEditor();
        };

        div.ondragstart=(e)=>{
          e.dataTransfer.setData("scene", JSON.stringify(item));
        };

        parent.appendChild(div);
      }

      // drop в папку
      div.ondragover=e=>e.preventDefault();

      div.ondrop=e=>{
        let data=JSON.parse(e.dataTransfer.getData("scene"));
        if(item.type==="folder"){
          item.children.push(data);
          removeScene(currentWorkspace.root, data);
          renderTree();
        }
      };

    });
  }

  draw(currentWorkspace.root, el);
}

function removeScene(arr, target){
  for(let i=0;i<arr.length;i++){
    if(arr[i]===target){
      arr.splice(i,1);
      return true;
    }
    if(arr[i].children){
      if(removeScene(arr[i].children,target)) return true;
    }
  }
}

/* EDITOR */

function renderEditor(){
  let editor=document.getElementById("editor");

  if(!currentScene){
    editor.innerText="Select scene";
    return;
  }

  editor.innerHTML=currentScene.content;

  editor.oninput=()=>{
    currentScene.content=editor.innerHTML;
  };
}

/* INIT */

renderProjects();
