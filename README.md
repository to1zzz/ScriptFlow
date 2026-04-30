# ScriptFlow

**ScriptFlow** is a minimalistic writing tool designed for structuring scripts as a set of interconnected scenes, rather than a single continuous document.

The application is inspired by IDE workflows and file system navigation, aiming to provide a fast and distraction-free environment for writing.

---

## ✨ Concept

Instead of treating writing as one large text file, ScriptFlow introduces a structured approach:

* Projects → represent complete works (films, stories, etc.)
* Scenes → act as independent text units
* Folders → group scenes into acts or logical parts
* Visual progress → each project is displayed as a segmented bar

This allows users to think in terms of **structure and flow**, not just raw text.

---

## 🚀 Features (Current MVP)

* 📁 Project-based workflow
* 🧩 Scene-based editing (multiple documents per project)
* 📂 Folder support for grouping scenes
* 📝 Minimal text editor (distraction-free)
* 📊 Visual progress bar per project
* 🔴 Last opened scene indicator
* 💾 Auto-save (localStorage)

---

## 🧠 Design Philosophy

ScriptFlow follows a few core principles:

* **Minimalism over features** — no heavy formatting, no clutter
* **Speed over complexity** — instant navigation between scenes
* **Structure over text** — focus on how ideas are organized
* **Keyboard-first (planned)** — fast workflow similar to IDEs

---

## 🏗️ Project Status

This project is currently in an **early MVP stage**.

What is done:

* Core architecture (projects → scenes → folders)
* Basic UI and navigation
* Persistent state (localStorage)

What is not implemented yet:

* Advanced entity/annotation system
* Keyboard shortcuts
* Scene reordering (drag & drop)
* Export / import
* Backend or cloud sync

---

## 🔮 Roadmap

Planned improvements:

* Entity system (characters, objects, tags)
* Cross-scene linking
* Search across project
* Timeline / structure visualization
* Desktop version (Tauri)
* Web version with proper state management

---

## 🛠️ Tech Stack

Current MVP:

* HTML
* CSS
* Vanilla JavaScript

Storage:

* localStorage

---

## ⚡ Getting Started

```bash
git clone https://github.com/your-username/scriptflow.git
cd scriptflow
open index.html
```

No build step required.

---

## 📌 Notes

This is an experimental project focused on exploring a different way of writing and structuring ideas.

The current version is intentionally simple and may change significantly in future iterations.

---

## 📄 License

MIT (or choose your preferred license)

