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

  projects.push({ name, workspaces:[] });
  renderProjects();
}

function renderProjects(){
  let el=document.getElementById("projects");
  el.innerHTML="";

  projects.forEach((p,i)=>{
    let card=document.createElement("div");
    card.className="card";
    card.innerText=p.name;

    card.onclick=()=>{
      currentProject=p;
      document.getElementById("projectTitle").innerText=p.name;
      show("projectScreen");
      renderBars();
    };

    card.oncontextmenu=(e)=>{
      e.preventDefault();
      if(confirm("Delete project?")){
        projects.splice(i,1);
        renderProjects();
      }
    };

    el.appendChild(card);
  });
}

/* WORKSPACES */

function createWorkspace(){
  let name = prompt("Workspace name:") || `Workspace ${currentProject.workspaces.length+1}`;

  currentProject.workspaces.push({
    name,
    root:[]
  });

  renderBars();
}

function renderBars(){
  let el=document.getElementById("workspaceBars");
  el.innerHTML="";

  currentProject.workspaces.forEach(w=>{
    let bar=document.createElement("div");
    bar.className="bar";

    let scenes = flatten(w.root);
    if(scenes.length===0) scenes=[{}];

    scenes.forEach(s=>{
      let seg=document.createElement("div");

      if(!s.content) seg.className="seg gray";
      else seg.className="seg white";

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
  currentWorkspace.root.push({
    type:"folder",
    title:"Folder",
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

  function draw(items,parent){
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

        div.onclick=()=>{
          currentScene=item;
          renderEditor();
        };

        parent.appendChild(div);
      }
    });
  }

  draw(currentWorkspace.root, el);
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
