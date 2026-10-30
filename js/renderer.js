/**
 * High-DPI Canvas Renderer with Smooth Camera, Particles, and Theming
 */

export const THEMES = {
  obsidian: {
    name: 'Obsidian Void',
    isDark: true,
    bg: '#070a12',
    panelBg: 'rgba(15, 23, 42, 0.82)',
    panelBorder: 'rgba(56, 189, 248, 0.22)',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accent: '#38bdf8',
    path: '#0d1527',
    wall: '#38bdf8',
    wallGlow: 'rgba(56, 189, 248, 0.45)',
    player: '#00f2fe',
    playerGlow: '#0ea5e9',
    start: '#10b981',
    exit: '#ec4899',
    exitGlow: '#f43f5e',
    hint: '#fbbf24',
    hintGlow: 'rgba(251, 191, 36, 0.75)',
    trail: 'rgba(56, 189, 248, 0.25)'
  },
  neon: {
    name: 'Cyberpunk Neon',
    isDark: true,
    bg: '#080512',
    panelBg: 'rgba(20, 11, 36, 0.85)',
    panelBorder: 'rgba(255, 42, 133, 0.28)',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
    accent: '#ff2a85',
    path: '#140c2b',
    wall: '#ff2a85',
    wallGlow: 'rgba(255, 42, 133, 0.55)',
    player: '#00f5ff',
    playerGlow: '#00c8ff',
    start: '#a855f7',
    exit: '#ffe600',
    exitGlow: '#ffea40',
    hint: '#00ff88',
    hintGlow: 'rgba(0, 255, 136, 0.8)',
    trail: 'rgba(0, 245, 255, 0.28)'
  },
  emerald: {
    name: 'Emerald Matrix',
    isDark: true,
    bg: '#020f09',
    panelBg: 'rgba(6, 32, 22, 0.85)',
    panelBorder: 'rgba(16, 185, 129, 0.28)',
    textMain: '#f0fdf4',
    textMuted: '#86efac',
    accent: '#10b981',
    path: '#062417',
    wall: '#10b981',
    wallGlow: 'rgba(16, 185, 129, 0.55)',
    player: '#f59e0b',
    playerGlow: '#fbbf24',
    start: '#06b6d4',
    exit: '#a855f7',
    exitGlow: '#c084fc',
    hint: '#38bdf8',
    hintGlow: 'rgba(56, 189, 248, 0.85)',
    trail: 'rgba(245, 158, 11, 0.28)'
  },
  solar: {
    name: 'Solar Flare',
    isDark: true,
    bg: '#0e0804',
    panelBg: 'rgba(28, 16, 8, 0.85)',
    panelBorder: 'rgba(249, 115, 22, 0.28)',
    textMain: '#fff7ed',
    textMuted: '#fdba74',
    accent: '#f97316',
    path: '#211208',
    wall: '#f97316',
    wallGlow: 'rgba(249, 115, 22, 0.55)',
    player: '#38bdf8',
    playerGlow: '#0284c7',
    start: '#22c55e',
    exit: '#d946ef',
    exitGlow: '#f43f5e',
    hint: '#facc15',
    hintGlow: 'rgba(250, 204, 21, 0.85)',
    trail: 'rgba(56, 189, 248, 0.28)'
  },
  pureLight: {
    name: 'Pure Light',
    isDark: false,
    bg: '#e2e8f0',
    panelBg: 'rgba(255, 255, 255, 0.92)',
    panelBorder: 'rgba(15, 23, 42, 0.15)',
    textMain: '#0f172a',
    textMuted: '#64748b',
    accent: '#2563eb',
    path: '#ffffff',
    wall: '#0f172a',
    wallGlow: 'transparent',
    player: '#2563eb',
    playerGlow: 'rgba(37, 99, 235, 0.35)',
    start: '#059669',
    exit: '#dc2626',
    exitGlow: 'transparent',
    hint: '#d97706',
    hintGlow: 'transparent',
    trail: 'rgba(37, 99, 235, 0.22)'
  },
  nordicLight: {
    name: 'Nordic Sand',
    isDark: false,
    bg: '#ede8dc',
    panelBg: 'rgba(255, 253, 248, 0.94)',
    panelBorder: 'rgba(51, 65, 85, 0.18)',
    textMain: '#1e293b',
    textMuted: '#64748b',
    accent: '#0284c7',
    path: '#faf7f0',
    wall: '#1e1b4b',
    wallGlow: 'transparent',
    player: '#7c3aed',
    playerGlow: 'rgba(124, 58, 237, 0.35)',
    start: '#0d9488',
    exit: '#e11d48',
    exitGlow: 'transparent',
    hint: '#ea580c',
    hintGlow: 'transparent',
    trail: 'rgba(124, 58, 237, 0.22)'
  },
  slate: {
    name: 'Monochrome Slate',
    isDark: true,
    bg: '#090d16',
    panelBg: 'rgba(15, 23, 42, 0.85)',
    panelBorder: 'rgba(226, 232, 240, 0.22)',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accent: '#38bdf8',
    path: '#172238',
    wall: '#e2e8f0',
    wallGlow: 'rgba(226, 232, 240, 0.35)',
    player: '#38bdf8',
    playerGlow: '#0ea5e9',
    start: '#34d399',
    exit: '#f43f5e',
    exitGlow: '#fb7185',
    hint: '#fbbf24',
    hintGlow: 'rgba(251, 191, 36, 0.75)',
    trail: 'rgba(56, 189, 248, 0.25)'
  },
  sunset: {
    name: 'Synthwave Sunset',
    isDark: true,
    bg: '#0e051a',
    panelBg: 'rgba(26, 10, 48, 0.85)',
    panelBorder: 'rgba(255, 107, 107, 0.32)',
    textMain: '#fff1f2',
    textMuted: '#fda4af',
    accent: '#ff6b6b',
    path: '#1e0c38',
    wall: '#ff6b6b',
    wallGlow: 'rgba(255, 107, 107, 0.55)',
    player: '#fde047',
    playerGlow: '#facc15',
    start: '#38bdf8',
    exit: '#a855f7',
    exitGlow: '#c084fc',
    hint: '#4ade80',
    hintGlow: 'rgba(74, 222, 128, 0.85)',
    trail: 'rgba(253, 224, 71, 0.28)'
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

    // Visual animation particles & timers
    this.particles = [];
    this.portalPulse = 0;
    this.playerPulse = 0;
    this.showHint = false;
    this.hintAlpha = 1.0;
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
      size: 3 + Math.random() * 2.5,
      alpha: 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: color || this.theme.playerGlow,
      life: 0.8,
      decay: 0.03 + Math.random() * 0.02
    });
  }

  addSolveBurst(x, y) {
    for (let i = 0; i < 48; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        size: 3 + Math.random() * 4,
        alpha: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? this.theme.exitGlow || this.theme.exit : this.theme.player,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02
      });
    }
  }

  update(dt, player, maze) {
    this.portalPulse += dt * 3.2;
    this.playerPulse += dt * 3.5;

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

    // Calculate available canvas space with comfortable padding
    const paddingX = Math.max(16, this.width * 0.03);
    const paddingY = Math.max(16, this.height * 0.03);

    const availW = Math.max(100, this.width - paddingX * 2);
    const availH = Math.max(100, this.height - paddingY * 2);

    // Cell size calculation: perfectly scale to fit current viewport
    const maxCellW = availW / maze.cols;
    const maxCellH = availH / maze.rows;
    const fitCellSize = Math.max(10, Math.floor(Math.min(maxCellW, maxCellH)));
    this.cellSize = fitCellSize;

    const mazePixelW = maze.cols * fitCellSize;
    const mazePixelH = maze.rows * fitCellSize;

    if (this.cameraMode === 'overview') {
      // Fit to screen: centered perfectly inside available viewport
      this.targetZoom = 1.0;
      this.targetCamX = mazePixelW / 2;
      this.targetCamY = mazePixelH / 2;
    } else {
      // Follow mode: zoomed in on player
      this.targetZoom = Math.max(1.8, Math.min(2.8, 56 / fitCellSize));
      this.targetCamX = (player.interpolatedX + 0.5) * fitCellSize;
      this.targetCamY = (player.interpolatedY + 0.5) * fitCellSize;
    }

    // Smooth camera interpolation
    const lerpRate = 0.14;
    this.camX += (this.targetCamX - this.camX) * lerpRate;
    this.camY += (this.targetCamY - this.camY) * lerpRate;
    this.zoom += (this.targetZoom - this.zoom) * lerpRate;
  }

  drawPathLine(ctx, cellSize) {
    for (let i = 0; i < this.hintPath.length; i++) {
      const p = this.hintPath[i];
      const px = (p.x + 0.5) * cellSize;
      const py = (p.y + 0.5) * cellSize;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
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

    // Subtle floor grid lines / tiles
    ctx.strokeStyle = this.theme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, mazeW, mazeH);

    // 3. Draw Breadcrumb Visited Trail (small, subtle dots)
    if (trailHistory.length > 0) {
      ctx.fillStyle = this.theme.trail;
      for (const pt of trailHistory) {
        ctx.beginPath();
        ctx.arc((pt.x + 0.5) * cellSize, (pt.y + 0.5) * cellSize, cellSize * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Draw 5-Second Fading Hint Path (if active)
    if (this.showHint && this.hintPath.length > 0 && this.hintAlpha > 0) {
      ctx.save();
      const hintThickness = Math.max(3.5, Math.round(cellSize * 0.22));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (this.theme.isDark) {
        // Dark theme: give the hint line a bright glow!
        ctx.strokeStyle = this.theme.hintGlow || this.theme.hint;
        ctx.lineWidth = hintThickness * 1.8;
        ctx.globalAlpha = 0.45 * this.hintAlpha;
        ctx.beginPath();
        this.drawPathLine(ctx, cellSize);
        ctx.stroke();

        ctx.strokeStyle = this.theme.hint;
        ctx.lineWidth = hintThickness;
        ctx.globalAlpha = this.hintAlpha;
        ctx.beginPath();
        this.drawPathLine(ctx, cellSize);
        ctx.stroke();
      } else {
        // Light theme: keep it a sharp, solid line so it does not look muddy!
        ctx.strokeStyle = this.theme.hint;
        ctx.lineWidth = hintThickness;
        ctx.globalAlpha = this.hintAlpha;
        ctx.beginPath();
        this.drawPathLine(ctx, cellSize);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Draw Start Marker (distinct square pad with inner beacon dot)
    const startX = (maze.start.x + 0.5) * cellSize;
    const startY = (maze.start.y + 0.5) * cellSize;
    const padSize = cellSize * 0.56;
    ctx.save();
    ctx.fillStyle = this.theme.start;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(startX - padSize / 2, startY - padSize / 2, padSize, padSize);
    ctx.strokeStyle = this.theme.start;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(startX - padSize / 2, startY - padSize / 2, padSize, padSize);
    ctx.fillStyle = this.theme.start;
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Draw Exit / Portal (completely different from player piece: rotating geometric star portal)
    const exitX = (maze.exit.x + 0.5) * cellSize;
    const exitY = (maze.exit.y + 0.5) * cellSize;
    const exitRadius = cellSize * 0.44;

    ctx.save();
    ctx.translate(exitX, exitY);

    // Glowing aura
    const pulseScale = 1 + Math.sin(this.portalPulse * 2.2) * 0.12;
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, exitRadius * 1.6 * pulseScale);
    grad.addColorStop(0, this.theme.exitGlow || this.theme.exit);
    grad.addColorStop(0.5, this.theme.exit);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, exitRadius * 1.6 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Outer spinning diamond 1
    ctx.save();
    ctx.rotate(this.portalPulse * 0.6);
    ctx.strokeStyle = this.theme.exit;
    ctx.lineWidth = Math.max(2, cellSize * 0.08);
    ctx.strokeRect(-exitRadius * 0.65, -exitRadius * 0.65, exitRadius * 1.3, exitRadius * 1.3);

    // Outer spinning diamond 2 (forming an 8-pointed star)
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = this.theme.exitGlow || '#ffffff';
    ctx.lineWidth = Math.max(1.5, cellSize * 0.06);
    ctx.strokeRect(-exitRadius * 0.65, -exitRadius * 0.65, exitRadius * 1.3, exitRadius * 1.3);
    ctx.restore();

    // Inner counter-rotating portal blades
    ctx.save();
    ctx.rotate(-this.portalPulse * 1.2);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(exitRadius * 0.42, -exitRadius * 0.18);
      ctx.lineTo(exitRadius * 0.42, exitRadius * 0.18);
      ctx.closePath();
      ctx.fillStyle = (i % 2 === 0) ? (this.theme.exitGlow || '#ffffff') : this.theme.exit;
      ctx.fill();
    }
    ctx.restore();

    // Center radiant diamond core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, exitRadius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 7. Draw Maze Walls (Noticeably Thicker, High Contrast, Crisp Caps)
    const wallThick = Math.max(5, Math.min(10, Math.round(cellSize * 0.22)));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Optional subtle outer glow on dark themes
    if (this.theme.isDark && this.theme.wallGlow && this.theme.wallGlow !== 'transparent') {
      ctx.strokeStyle = this.theme.wallGlow;
      ctx.lineWidth = wallThick + 2.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (let y = 0; y < maze.rows; y++) {
        for (let x = 0; x < maze.cols; x++) {
          const cell = maze.grid[y][x];
          const cx = x * cellSize;
          const cy = y * cellSize;
          if (cell.walls[0]) { ctx.moveTo(cx, cy); ctx.lineTo(cx + cellSize, cy); }
          if (cell.walls[1]) { ctx.moveTo(cx + cellSize, cy); ctx.lineTo(cx + cellSize, cy + cellSize); }
          if (cell.walls[2]) { ctx.moveTo(cx, cy + cellSize); ctx.lineTo(cx + cellSize, cy + cellSize); }
          if (cell.walls[3]) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + cellSize); }
        }
      }
      ctx.stroke();
    }

    // Main solid thick walls
    ctx.strokeStyle = this.theme.wall;
    ctx.lineWidth = wallThick;
    ctx.globalAlpha = 1.0;
    ctx.beginPath();

    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        const cell = maze.grid[y][x];
        const cx = x * cellSize;
        const cy = y * cellSize;

        if (cell.walls[0]) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellSize, cy);
        }
        if (cell.walls[1]) {
          ctx.moveTo(cx + cellSize, cy);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        if (cell.walls[2]) {
          ctx.moveTo(cx, cy + cellSize);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        if (cell.walls[3]) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + cellSize);
        }
      }
    }
    ctx.stroke();

    // Outer perimeter border for crisp bounding frame
    ctx.strokeRect(0, 0, mazeW, mazeH);

    // 8. Draw Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 9. Draw Player (Pulsing Orb with Continuous Sonar Pulse Ring)
    const pX = (player.interpolatedX + 0.5) * cellSize;
    const pY = (player.interpolatedY + 0.5) * cellSize;
    const playerRadius = Math.max(4, (cellSize - wallThick) * 0.38);

    // A. Expanding Sonar Wave Ring (Continuous pulse)
    const waveProgress = (this.playerPulse * 0.5) % 1.0;
    const waveRadius = playerRadius * (1.1 + waveProgress * 1.1);
    const waveAlpha = Math.max(0, (1 - waveProgress) * 0.75);
    ctx.strokeStyle = this.theme.playerGlow || this.theme.player;
    ctx.lineWidth = Math.max(1.5, cellSize * 0.06);
    ctx.globalAlpha = waveAlpha;
    ctx.beginPath();
    ctx.arc(pX, pY, waveRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // B. Inner Breathing Halo Ring
    const haloRadius = playerRadius * (1.25 + Math.sin(this.playerPulse * 4) * 0.1);
    ctx.strokeStyle = this.theme.player;
    ctx.lineWidth = Math.max(1.5, cellSize * 0.05);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(pX, pY, haloRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // C. Player Core Orb
    const playerGrad = ctx.createRadialGradient(pX, pY, 1, pX, pY, playerRadius);
    playerGrad.addColorStop(0, '#ffffff');
    playerGrad.addColorStop(0.3, this.theme.player);
    playerGrad.addColorStop(1, this.theme.playerGlow || this.theme.player);
    ctx.fillStyle = playerGrad;
    ctx.beginPath();
    ctx.arc(pX, pY, playerRadius, 0, Math.PI * 2);
    ctx.fill();

    // D. Crisp Specular Shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pX - playerRadius * 0.28, pY - playerRadius * 0.28, playerRadius * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 10. Screen Transition Wipe / Flash
    if (this.transitionEffect > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.transitionEffect * 0.4})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}

