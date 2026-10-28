# 🌀 Infinite Maze

Infinite maze game to play whenever you are free.

An endless, procedurally generated minimalist labyrinth game. Guaranteed solvable, highly complex, with live timers, dynamic lighting, camera follow modes, and continuous progression.

![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Glassmorphism-1572B6?style=flat&logo=css3&logoColor=white)

---

## ✨ Features

- **Procedural Maze Generation**: Uses depth-first recursive backtracker algorithms ensuring every maze is mathematically guaranteed solvable with high branching entropy.
- **Continuous Progression**: Solved a maze? Instantly warp into the next level with scaling difficulty and larger grid sizes.
- **Dynamic Lighting & Trails**: Atmospheric glow, path particle trails, and interactive illumination.
- **Shortest Path Solver & Hint System**: Built-in BFS algorithm calculates the optimal path and step count.
- **Procedural Web Audio FX**: Synthesizer sound effects generated in real-time via the Web Audio API (no external sound files required).
- **Multiple Color Themes**: Obsidian Void, Cyber Neon, Solar Ember, Emerald Matrix, and Royal Nebula.
- **Mobile & Touch Friendly**: On-screen directional D-Pad controls with smooth responsive viewport scaling.

---

## 🎮 Controls

| Action | Keybinding |
| :--- | :--- |
| **Move Orb** | `W`, `A`, `S`, `D` or `Arrow Keys` (or on-screen D-Pad) |
| **Toggle Camera Mode** | `Space` or `C` (Follow Player / Overview) |
| **Toggle Shortest Path Hint** | `H` |
| **Switch Visual Theme** | `T` |
| **Toggle Sound FX** | `M` |
| **Restart Current Maze** | `R` |

---

## 🚀 Quick Start

### 1. Clone & Run Locally
No heavy dependencies needed! Pure native Node.js:

```bash
# Clone the repository
git clone https://github.com/niha-isnot-rika/infinite-maze.git

# Navigate to directory
cd infinite-maze

# Start local server
npm start
```

Open your browser at **`http://localhost:3000`**.

---

## 🌐 Play Online / Deployment
This game is a pure static web app (HTML5 / Canvas / Vanilla JS / CSS). You can host it on **GitHub Pages**:
1. Go to repository **Settings** > **Pages**.
2. Select branch `main` and root `/`.
3. Save to get a free live URL: `https://niha-isnot-rika.github.io/infinite-maze/`!

---

## 📄 License
MIT License
