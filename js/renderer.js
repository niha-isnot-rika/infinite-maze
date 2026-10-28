/**
 * High-DPI Canvas Renderer with Smooth Camera, Particles, and Theming
 */

export const THEMES = {
  obsidian: {
    name: 'Obsidian Void',
    bg: '#0a0d14',
    wall: '#1e293b',
    wallGlow: '#0284c7',
    path: '#0f172a',
    player: '#38bdf8',
    playerGlow: '#0ea5e9',
    trail: 'rgba(56, 189, 248, 0.35)',
    start: '#10b981',
    exit: '#a855f7',
    exitGlow: '#c084fc',
    hint: 'rgba(251, 191, 36, 0.65)'
  },
  neon: {
    name: 'Cyberpunk Neon',
    bg: '#05050a',
    wall: '#261b40',
    wallGlow: '#ec4899',
    path: '#0e0b1c',
    player: '#f43f5e',
    playerGlow: '#fb7185',
    trail: 'rgba(244, 63, 94, 0.4)',
    start: '#06b6d4',
    exit: '#a855f7',
    exitGlow: '#d946ef',
    hint: 'rgba(52, 211, 153, 0.7)'
  },
  emerald: {
    name: 'Emerald Matrix',
    bg: '#030d09',
    wall: '#0d2b1f',
    wallGlow: '#10b981',
    path: '#061912',
    player: '#34d399',
    playerGlow: '#10b981',
    trail: 'rgba(52, 211, 153, 0.35)',
    start: '#0ea5e9',
    exit: '#f59e0b',
    exitGlow: '#fbbf24',
    hint: 'rgba(236, 72, 153, 0.7)'
  },
  solar: {
    name: 'Solar Amber',
    bg: '#0c0a09',
    wall: '#292524',
    wallGlow: '#f97316',
    path: '#1c1917',
    player: '#fb923c',
    playerGlow: '#f97316',
    trail: 'rgba(251, 146, 60, 0.35)',
    start: '#22c55e',
    exit: '#06b6d4',
    exitGlow: '#38bdf8',
    hint: 'rgba(168, 85, 247, 0.7)'
  },
  slate: {
    name: 'Monochrome Slate',
    bg: '#0f172a',
    wall: '#334155',
    wallGlow: '#64748b',
    path: '#1e293b',
    player: '#f8fafc',
    playerGlow: '#cbd5e1',
    trail: 'rgba(248, 250, 252, 0.3)',
    start: '#38bdf8',
    exit: '#e2e8f0',
    exitGlow: '#ffffff',
    hint: 'rgba(245, 158, 11, 0.7)'
  }
};

export class MazeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.themeKey = 'obsidian';
    this.theme = THEMES[this.themeKey];

    // Camera
    this.camX = 0;
    this.camY = 0;
    this.zoom = 1;
    this.targetZoom = 1;
    this.targetCamX = 0;
    this.targetCamY = 0;
    this.cameraMode = 'overview'; // Default to 'overview' (Fit to screen)

    // Visual animation particles
    this.particles = [];
    this.portalPulse = 0;
    this.showHint = false;
    this.hintPath = [];

    // Transition effect
    this.transitionEffect = 0; // 0 to 1

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  snapCamera(player, maze) {
    if (!maze) return;
    this.update(0.016, player, maze);
    this.camX = this.targetCamX;
    this.camY = this.targetCamY;
    this.zoom = this.targetZoom;
  }

  setTheme(themeKey) {
    if (THEMES[themeKey]) {
      this.themeKey = themeKey;
      this.theme = THEMES[themeKey];
    }
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  addTrailParticle(x, y, color) {
    this.particles.push({
      x,
      y,
      size: 4 + Math.random() * 3,
      alpha: 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: color || this.theme.playerGlow,
      life: 1.0,
      decay: 0.03 + Math.random() * 0.02
    });
  }

  addSolveBurst(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        size: 3 + Math.random() * 4,
        alpha: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? this.theme.exitGlow : this.theme.player,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02
      });
    }
  }

  update(dt, player, maze) {
    this.portalPulse += dt * 3;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (!maze) return;

    // Responsive bounds calculations: guarantee maze fits without clipping HUDs
    const isMobile = this.width < 768;
    const marginX = isMobile ? 18 : 48;
    const marginTop = isMobile ? 68 : 84;
    const marginBottom = isMobile ? 120 : 84;

    const availW = Math.max(120, this.width - marginX * 2);
    const availH = Math.max(120, this.height - (marginTop + marginBottom));

    // Cell size that fits inside available window
    const maxCellW = availW / maze.cols;
    const maxCellH = availH / maze.rows;
    const fitCellSize = Math.max(8, Math.floor(Math.min(maxCellW, maxCellH)));
    this.cellSize = fitCellSize;

    const mazePixelW = maze.cols * fitCellSize;
    const mazePixelH = maze.rows * fitCellSize;

    if (this.cameraMode === 'overview') {
      // Fit to screen: show entire maze with perfect framing
      this.targetZoom = 1.0;
      this.targetCamX = mazePixelW / 2;
      // Vertically center inside available space between HUDs
      const yOffset = (marginTop - marginBottom) / 2;
      this.targetCamY = (mazePixelH / 2) + yOffset;
    } else {
      // Follow mode: zoomed in on player
      this.targetZoom = Math.max(1.8, Math.min(2.8, 52 / fitCellSize));
      this.targetCamX = (player.interpolatedX + 0.5) * fitCellSize;
      this.targetCamY = (player.interpolatedY + 0.5) * fitCellSize;
    }

    // Smooth camera interpolation
    const lerpRate = 0.14;
    this.camX += (this.targetCamX - this.camX) * lerpRate;
    this.camY += (this.targetCamY - this.camY) * lerpRate;
    this.zoom += (this.targetZoom - this.zoom) * lerpRate;
  }

  render(player, maze, trailHistory = []) {
    const ctx = this.ctx;
    ctx.save();

    // 1. Clear background
    ctx.fillStyle = this.theme.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    if (!maze) {
      ctx.restore();
      return;
    }

    const cellSize = this.cellSize;
    const mazeW = maze.cols * cellSize;
    const mazeH = maze.rows * cellSize;

    // Apply Camera Transform
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.camX, -this.camY);

    // 2. Draw Maze Floor / Backing
    ctx.fillStyle = this.theme.path;
    ctx.fillRect(0, 0, mazeW, mazeH);

    // 3. Draw Breadcrumb Visited Trail
    if (trailHistory.length > 0) {
      ctx.fillStyle = this.theme.trail;
      for (const pt of trailHistory) {
        ctx.beginPath();
        ctx.arc((pt.x + 0.5) * cellSize, (pt.y + 0.5) * cellSize, cellSize * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Draw Hint Path (if active)
    if (this.showHint && this.hintPath.length > 0) {
      ctx.strokeStyle = this.theme.hint;
      ctx.lineWidth = Math.max(3, cellSize * 0.2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([cellSize * 0.25, cellSize * 0.2]);

      ctx.beginPath();
      for (let i = 0; i < this.hintPath.length; i++) {
        const p = this.hintPath[i];
        const px = (p.x + 0.5) * cellSize;
        const py = (p.y + 0.5) * cellSize;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Draw Start Marker
    const startX = (maze.start.x + 0.5) * cellSize;
    const startY = (maze.start.y + 0.5) * cellSize;
    ctx.fillStyle = this.theme.start;
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 6. Draw Exit / Portal Vortex
    const exitX = (maze.exit.x + 0.5) * cellSize;
    const exitY = (maze.exit.y + 0.5) * cellSize;
    
    // Glowing aura
    const pulseScale = 1 + Math.sin(this.portalPulse) * 0.15;
    const grad = ctx.createRadialGradient(exitX, exitY, 2, exitX, exitY, cellSize * 0.7 * pulseScale);
    grad.addColorStop(0, this.theme.exitGlow);
    grad.addColorStop(0.5, this.theme.exit);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(exitX, exitY, cellSize * 0.7 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Concentric swirling rings
    ctx.strokeStyle = this.theme.exitGlow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(exitX, exitY, cellSize * 0.35 * pulseScale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(exitX, exitY, cellSize * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // 7. Draw Maze Walls
    ctx.strokeStyle = this.theme.wall;
    ctx.lineWidth = Math.max(2.5, cellSize * 0.1);
    ctx.lineCap = 'round';
    ctx.beginPath();

    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        const cell = maze.grid[y][x];
        const cx = x * cellSize;
        const cy = y * cellSize;

        // Top Wall
        if (cell.walls[0]) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellSize, cy);
        }
        // Right Wall
        if (cell.walls[1]) {
          ctx.moveTo(cx + cellSize, cy);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        // Bottom Wall
        if (cell.walls[2]) {
          ctx.moveTo(cx, cy + cellSize);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        // Left Wall
        if (cell.walls[3]) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + cellSize);
        }
      }
    }
    ctx.stroke();

    // Subtle wall outer glow
    ctx.strokeStyle = this.theme.wallGlow;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 8. Draw Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 9. Draw Player
    const pX = (player.interpolatedX + 0.5) * cellSize;
    const pY = (player.interpolatedY + 0.5) * cellSize;
    const playerRadius = cellSize * 0.32;

    // Player Glow Halo
    const playerGrad = ctx.createRadialGradient(pX, pY, 1, pX, pY, playerRadius * 1.8);
    playerGrad.addColorStop(0, this.theme.playerGlow);
    playerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = playerGrad;
    ctx.beginPath();
    ctx.arc(pX, pY, playerRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Player Core
    ctx.fillStyle = this.theme.player;
    ctx.beginPath();
    ctx.arc(pX, pY, playerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Player Inner Highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pX, pY, playerRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 10. Draw Screen Transition Wipe / Flash if active
    if (this.transitionEffect > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.transitionEffect * 0.4})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}
