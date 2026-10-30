import { Maze } from './maze.js';
import { MazeRenderer, THEMES } from './renderer.js';
import { sound } from './audio.js';

class EndlessMazeGame {
  constructor() {
    this.canvas = document.getElementById('mazeCanvas');
    this.renderer = new MazeRenderer(this.canvas);
    
    // Stats & State
    this.mazesSolved = 0;
    this.totalSteps = 0;
    this.mazeSteps = 0;
    this.totalTimeElapsed = 0;
    this.currentMazeTime = 0;
    this.startTime = null;
    this.lastFrameTime = performance.now();
    this.isPaused = false;
    this.isTransitioning = false;

    // Lap Splits History (Clock Lap Tracker)
    this.laps = [];

    // 5-Second Fading Hint State
    this.hintDuration = 5.0;
    this.hintFadeDuration = 1.5; // Final 1.5s fades smoothly to 0
    this.hintRemaining = 0;
    this.isHintActive = false;

    // Difficulty settings (unchanged generation parameters)
    this.baseSize = 21;
    this.currentCols = 21;
    this.currentRows = 21;
    this.maxSize = 41;

    // Player
    this.player = {
      x: 0,
      y: 0,
      interpolatedX: 0,
      interpolatedY: 0
    };
    this.trailHistory = [];
    this.maxTrail = 60;

    // Movement state: Single tap = 1 step, Long press / hold = continuous stepping
    this.heldDirections = new Set();
    this.holdDelayTimer = 0;
    this.initialHoldDelay = 0.22; // 220ms pause before starting repeat
    this.repeatInterval = 0.10;   // 100ms per step while held

    // Load LocalStorage Highscores
    this.bestStreak = parseInt(localStorage.getItem('aether_best_streak') || '0', 10);
    this.totalMazesSolved = parseInt(localStorage.getItem('aether_total_solved') || '0', 10);
    this.savedTheme = localStorage.getItem('aether_theme') || 'obsidian';
    this.savedCameraMode = localStorage.getItem('aether_camera_v2') || 'overview';

    this.renderer.cameraMode = this.savedCameraMode;

    // UI Elements
    this.bindUIElements();
    this.bindInputs();

    // Set initial theme & CSS variables
    this.applyTheme(this.savedTheme);

    // Start First Maze
    this.initNewMaze(false);

    // Main Game Loop
    requestAnimationFrame(this.loop.bind(this));
  }

  bindUIElements() {
    // Left Sidebar / Status
    this.uiSolvedCount = document.getElementById('solvedCount');
    this.uiTotalTimer = document.getElementById('totalTimer');
    this.uiMazeTimer = document.getElementById('mazeTimer');
    this.uiMazeNumber = document.getElementById('mazeNumber');
    this.uiMazeDim = document.getElementById('mazeDim');
    this.uiSteps = document.getElementById('stepCounter');
    this.uiOptimal = document.getElementById('optimalSteps');
    this.uiStreak = document.getElementById('bestStreak');

    // Laps Panel
    this.lapsList = document.getElementById('lapsList');
    this.lapsEmptyState = document.getElementById('lapsEmptyState');
    this.lapCountBadge = document.getElementById('lapCountBadge');

    // Right Sidebar Controls & Top Right Theme/Sound
    this.themeSelect = document.getElementById('themeSelect');
    this.btnSound = document.getElementById('btnSound');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundLabel = document.getElementById('soundLabel');
    this.btnHint = document.getElementById('btnHint');
    this.btnCamera = document.getElementById('btnCamera');
    this.btnReset = document.getElementById('btnReset');
    this.btnHelp = document.getElementById('btnHelp');
    this.helpModal = document.getElementById('helpModal');
    this.closeHelp = document.getElementById('closeHelp');

    // Mobile Elements
    this.mobileMazeNumber = document.getElementById('mobileMazeNumber');
    this.mobileMazeTimer = document.getElementById('mobileMazeTimer');
    this.btnMobileLaps = document.getElementById('btnMobileLaps');
    this.btnMobileSound = document.getElementById('btnMobileSound');
    this.btnMobileHint = document.getElementById('btnMobileHint');
    this.btnMobileCamera = document.getElementById('btnMobileCamera');
    this.btnMobileReset = document.getElementById('btnMobileReset');
    this.sidebarLeft = document.getElementById('sidebarLeft');

    // Virtual D-pad
    this.dpadUp = document.getElementById('dpadUp');
    this.dpadRight = document.getElementById('dpadRight');
    this.dpadDown = document.getElementById('dpadDown');
    this.dpadLeft = document.getElementById('dpadLeft');

    // Listeners: Theme Menu & Sound in Top Right
    this.themeSelect?.addEventListener('change', (e) => this.applyTheme(e.target.value));
    this.btnSound?.addEventListener('click', () => this.toggleSound());
    this.btnMobileSound?.addEventListener('click', () => this.toggleSound());

    // Action Buttons
    this.btnHint?.addEventListener('click', () => this.triggerHint());
    this.btnMobileHint?.addEventListener('click', () => this.triggerHint());
    this.btnCamera?.addEventListener('click', () => this.toggleCameraMode());
    this.btnMobileCamera?.addEventListener('click', () => this.toggleCameraMode());
    this.btnReset?.addEventListener('click', () => this.restartCurrentMaze());
    this.btnMobileReset?.addEventListener('click', () => this.restartCurrentMaze());
    this.btnHelp?.addEventListener('click', () => this.toggleHelpModal(true));
    this.closeHelp?.addEventListener('click', () => this.toggleHelpModal(false));

    // Mobile drawer toggle
    this.btnMobileLaps?.addEventListener('click', () => {
      this.sidebarLeft?.classList.toggle('mobile-open');
    });

    // D-Pad Touch / Click (Supports instant tap and long-press)
    const bindDpad = (btn, dir) => {
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        sound.init();
        this.startMove(dir);
      });
      btn.addEventListener('pointerup', () => this.stopMove(dir));
      btn.addEventListener('pointerleave', () => this.stopMove(dir));
      btn.addEventListener('pointercancel', () => this.stopMove(dir));
    };

    bindDpad(this.dpadUp, 0);
    bindDpad(this.dpadRight, 1);
    bindDpad(this.dpadDown, 2);
    bindDpad(this.dpadLeft, 3);

    this.updateHUD();
  }

  applyTheme(themeKey) {
    if (!THEMES[themeKey]) themeKey = 'obsidian';
    const theme = THEMES[themeKey];
    this.renderer.setTheme(themeKey);
    localStorage.setItem('aether_theme', themeKey);

    if (this.themeSelect) {
      this.themeSelect.value = themeKey;
    }

    // Dynamically update CSS custom properties to match active theme
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--panel-bg', theme.panelBg);
    root.style.setProperty('--panel-border', theme.panelBorder);
    root.style.setProperty('--text-main', theme.textMain);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--accent-glow', theme.wallGlow || 'rgba(56, 189, 248, 0.4)');

    document.body.classList.toggle('light-theme', !theme.isDark);
  }

  cycleTheme() {
    sound.playClick();
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(this.renderer.themeKey);
    const nextThemeKey = themeKeys[(currentIndex + 1) % themeKeys.length];
    this.applyTheme(nextThemeKey);
  }

  startMove(dir) {
    if (!this.heldDirections.has(dir)) {
      this.heldDirections.add(dir);
      this.holdDelayTimer = this.initialHoldDelay;
      this.tryMove(dir);
    }
  }

  stopMove(dir) {
    this.heldDirections.delete(dir);
  }

  bindInputs() {
    // Keyboard - Instant step on press, continuous stepping on long press
    window.addEventListener('keydown', (e) => {
      sound.init();
      const key = e.key.toLowerCase();

      // Single step & long press registration
      if (['arrowup', 'w'].includes(key)) { this.startMove(0); e.preventDefault(); }
      else if (['arrowright', 'd'].includes(key)) { this.startMove(1); e.preventDefault(); }
      else if (['arrowdown', 's'].includes(key)) { this.startMove(2); e.preventDefault(); }
      else if (['arrowleft', 'a'].includes(key)) { this.startMove(3); e.preventDefault(); }
      else if (!e.repeat) {
        if (key === ' ' || key === 'c') { this.toggleCameraMode(); e.preventDefault(); }
        else if (key === 'h') { this.triggerHint(); e.preventDefault(); }
        else if (key === 't') { this.cycleTheme(); e.preventDefault(); }
        else if (key === 'm') { this.toggleSound(); e.preventDefault(); }
        else if (key === 'r') { this.restartCurrentMaze(); e.preventDefault(); }
        else if (key === 'escape') { this.toggleHelpModal(false); }
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) this.stopMove(0);
      else if (['arrowright', 'd'].includes(key)) this.stopMove(1);
      else if (['arrowdown', 's'].includes(key)) this.stopMove(2);
      else if (['arrowleft', 'a'].includes(key)) this.stopMove(3);
    });

    window.addEventListener('blur', () => {
      this.heldDirections.clear();
    });

    // Touch Swipe Detection
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      sound.init();
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) > 25) {
          if (absX > absY) {
            this.tryMove(dx > 0 ? 1 : 3);
          } else {
            this.tryMove(dy > 0 ? 2 : 0);
          }
        }
      }
    }, { passive: true });
  }

  initNewMaze(isProgression = true) {
    // Dynamic difficulty calculation: Grid size scales gradually as player solves more mazes
    // Always odd dimensions (21, 23, 25, 27, 29, 31...)
    const sizeIncrement = Math.floor(this.mazesSolved / 2) * 2;
    const currentDim = Math.min(this.maxSize, this.baseSize + sizeIncrement);
    this.currentCols = currentDim;
    this.currentRows = currentDim;

    // High twistiness & winding factor for maximum maze complexity
    this.maze = new Maze(this.currentCols, this.currentRows, {
      windingBias: 0.72,
      braidFactor: 0.0 // True perfect maze = hardest single solution path with extensive deceptive branches
    });

    // Reset Player position to maze start
    this.player.x = this.maze.start.x;
    this.player.y = this.maze.start.y;
    this.player.interpolatedX = this.maze.start.x;
    this.player.interpolatedY = this.maze.start.y;

    // Reset Trail & Stats for this new maze
    this.trailHistory = [{ x: this.player.x, y: this.player.y }];
    this.mazeSteps = 0;

    // RESET TIMER FOR NEW MAZE (Like laps in a stopwatch clock!)
    this.currentMazeTime = 0;

    // Reset hint state
    this.hintRemaining = 0;
    this.isHintActive = false;
    this.renderer.showHint = false;
    this.renderer.hintAlpha = 1.0;
    this.resetHintButtonUI();
    this.updateSolutionHint();

    // Instantly snap camera to fit screen on maze start
    this.renderer.snapCamera(this.player, this.maze);

    if (isProgression) {
      this.renderer.transitionEffect = 1.0;
    }

    this.updateHUD();
  }

  restartCurrentMaze() {
    this.player.x = this.maze.start.x;
    this.player.y = this.maze.start.y;
    this.player.interpolatedX = this.maze.start.x;
    this.player.interpolatedY = this.maze.start.y;
    this.trailHistory = [{ x: this.player.x, y: this.player.y }];
    this.mazeSteps = 0;
    this.currentMazeTime = 0;
    sound.playClick();
    this.updateHUD();
  }

  tryMove(dir) {
    if (this.isTransitioning || this.isPaused) return;

    // Directions: 0: Up, 1: Right, 2: Down, 3: Left
    if (this.maze.canMove(this.player.x, this.player.y, dir)) {
      const deltas = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
      ];

      this.player.x += deltas[dir].dx;
      this.player.y += deltas[dir].dy;
      this.totalSteps++;
      this.mazeSteps++;

      // Trail & particles
      this.trailHistory.push({ x: this.player.x, y: this.player.y });
      if (this.trailHistory.length > this.maxTrail) {
        this.trailHistory.shift();
      }

      const cellSize = this.renderer.cellSize || 24;
      this.renderer.addTrailParticle(
        (this.player.x + 0.5) * cellSize,
        (this.player.y + 0.5) * cellSize
      );

      sound.playStep();
      this.updateHUD();

      // Check for Exit reach
      if (this.player.x === this.maze.exit.x && this.player.y === this.maze.exit.y) {
        this.onMazeCompleted();
      } else {
        if (this.renderer.showHint) {
          this.updateSolutionHint();
        }
      }
    } else {
      sound.playBump();
    }
  }

  onMazeCompleted() {
    this.isTransitioning = true;
    this.mazesSolved++;
    this.totalMazesSolved++;

    // Record completed lap before resetting timer (Like laps in a clock)
    this.recordLap(this.mazesSolved, this.currentMazeTime, this.mazeSteps);

    if (this.mazesSolved > this.bestStreak) {
      this.bestStreak = this.mazesSolved;
      localStorage.setItem('aether_best_streak', this.bestStreak.toString());
    }
    localStorage.setItem('aether_total_solved', this.totalMazesSolved.toString());

    sound.playMazeClear();

    const cellSize = this.renderer.cellSize || 24;
    this.renderer.addSolveBurst(
      (this.maze.exit.x + 0.5) * cellSize,
      (this.maze.exit.y + 0.5) * cellSize
    );

    // Seamless instant transition to next procedural maze
    setTimeout(() => {
      this.initNewMaze(true);
      this.isTransitioning = false;
    }, 450);
  }

  recordLap(lapNumber, timeInSeconds, stepCount) {
    const lapData = {
      number: lapNumber,
      time: timeInSeconds,
      formattedTime: this.formatTime(timeInSeconds),
      steps: stepCount
    };

    // Prepend newest lap to the top of the list
    this.laps.unshift(lapData);
    this.renderLaps();
  }

  renderLaps() {
    if (!this.lapsList) return;

    if (this.laps.length === 0) {
      if (this.lapsEmptyState) this.lapsEmptyState.style.display = 'flex';
      this.lapsList.innerHTML = '';
      if (this.lapCountBadge) this.lapCountBadge.textContent = '0 Laps';
      return;
    }

    if (this.lapsEmptyState) this.lapsEmptyState.style.display = 'none';
    if (this.lapCountBadge) this.lapCountBadge.textContent = `${this.laps.length} Lap${this.laps.length > 1 ? 's' : ''}`;

    // Find fastest lap among all completed
    let fastestTime = Infinity;
    this.laps.forEach(lap => {
      if (lap.time < fastestTime) fastestTime = lap.time;
    });

    let html = '';
    this.laps.forEach(lap => {
      const isFastest = this.laps.length > 1 && lap.time === fastestTime;
      html += `
        <div class="lap-item ${isFastest ? 'lap-fastest' : ''}">
          <div class="lap-left">
            <div class="lap-title-row">
              <span class="lap-index">Lap #${lap.number}</span>
              ${isFastest ? '<span class="lap-badge-best">⚡ BEST</span>' : ''}
            </div>
            <span class="lap-meta">${lap.steps} steps</span>
          </div>
          <span class="lap-time">${lap.formattedTime}</span>
        </div>
      `;
    });

    this.lapsList.innerHTML = html;
  }

  updateSolutionHint() {
    if (!this.maze) return;
    this.renderer.hintPath = this.maze.solve({ x: this.player.x, y: this.player.y }, this.maze.exit);
  }

  /**
   * 5-Second Fading Hint:
   * First 3.5s hold at full brightness, final 1.5s smoothly fade to 0.
   * Lock button and show countdown.
   */
  triggerHint() {
    // If already active or locked, prevent spam-clicking
    if (this.hintRemaining > 0) return;

    sound.playClick();
    this.hintRemaining = this.hintDuration;
    this.isHintActive = true;
    this.renderer.showHint = true;
    this.renderer.hintAlpha = 1.0;
    this.updateSolutionHint();

    this.updateHintButtonUI();
  }

  resetHintButtonUI() {
    if (this.btnHint) {
      this.btnHint.disabled = false;
      this.btnHint.classList.remove('locked');
      this.btnHint.innerHTML = `<span class="btn-icon">💡</span><span class="btn-text">Hint</span>`;
    }
    if (this.btnMobileHint) {
      this.btnMobileHint.disabled = false;
      this.btnMobileHint.classList.remove('locked');
      this.btnMobileHint.textContent = '💡 Hint';
    }
  }

  updateHintButtonUI() {
    const text = `Hint (${this.hintRemaining.toFixed(1)}s)`;
    if (this.btnHint) {
      this.btnHint.disabled = true;
      this.btnHint.classList.add('locked');
      this.btnHint.innerHTML = `<span class="btn-icon">💡</span><span class="btn-text">Hint</span><span class="countdown">${this.hintRemaining.toFixed(1)}s</span>`;
    }
    if (this.btnMobileHint) {
      this.btnMobileHint.disabled = true;
      this.btnMobileHint.classList.add('locked');
      this.btnMobileHint.textContent = `💡 ${text}`;
    }
  }

  toggleCameraMode() {
    sound.playClick();
    this.renderer.cameraMode = this.renderer.cameraMode === 'overview' ? 'follow' : 'overview';
    localStorage.setItem('aether_camera_v2', this.renderer.cameraMode);
    this.updateCameraBtn();
  }

  updateCameraBtn() {
    const isOverview = this.renderer.cameraMode === 'overview';
    if (this.btnCamera) {
      this.btnCamera.innerHTML = isOverview
        ? `<span class="btn-icon">🔍</span><span class="btn-text">Follow Player</span>`
        : `<span class="btn-icon">🗺️</span><span class="btn-text">Fit to Screen</span>`;
    }
    if (this.btnMobileCamera) {
      this.btnMobileCamera.textContent = isOverview ? '🔍 Follow' : '🗺️ Fit';
    }
  }

  toggleSound() {
    const isEnabled = sound.toggleSound();
    if (this.btnSound) {
      this.btnSound.classList.toggle('muted', !isEnabled);
      if (this.soundIcon) this.soundIcon.textContent = isEnabled ? '🔊' : '🔇';
      if (this.soundLabel) this.soundLabel.textContent = isEnabled ? 'Sound' : 'Muted';
    }
    if (this.btnMobileSound) {
      this.btnMobileSound.textContent = isEnabled ? '🔊' : '🔇';
    }
  }

  toggleHelpModal(show) {
    if (this.helpModal) {
      this.helpModal.classList.toggle('hidden', !show);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    const mm = mins.toString().padStart(2, '0');
    const ss = secs.toString().padStart(2, '0');
    return `${mm}:${ss}.${ms}`;
  }

  updateHUD() {
    const currentLapFormatted = this.formatTime(this.currentMazeTime);
    const totalFormatted = this.formatTime(this.totalTimeElapsed);

    if (this.uiSolvedCount) this.uiSolvedCount.textContent = this.mazesSolved;
    if (this.uiTotalTimer) this.uiTotalTimer.textContent = totalFormatted;
    if (this.uiMazeTimer) this.uiMazeTimer.textContent = currentLapFormatted;
    if (this.mobileMazeTimer) this.mobileMazeTimer.textContent = currentLapFormatted;
    if (this.uiMazeNumber) this.uiMazeNumber.textContent = `#${this.mazesSolved + 1}`;
    if (this.mobileMazeNumber) this.mobileMazeNumber.textContent = `#${this.mazesSolved + 1}`;
    if (this.uiMazeDim) this.uiMazeDim.textContent = `${this.currentCols}×${this.currentRows}`;
    if (this.uiSteps) this.uiSteps.textContent = this.mazeSteps;
    if (this.uiOptimal && this.maze) this.uiOptimal.textContent = (this.maze.solutionLength - 1) || '-';
    if (this.uiStreak) this.uiStreak.textContent = this.bestStreak;

    this.updateCameraBtn();
  }

  loop(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastFrameTime) / 1000);
    this.lastFrameTime = currentTime;

    if (!this.isPaused && !this.isTransitioning) {
      this.totalTimeElapsed += dt;
      this.currentMazeTime += dt;

      // Handle continuous stepping when holding arrow keys / D-pad
      if (this.heldDirections.size > 0) {
        this.holdDelayTimer -= dt;
        if (this.holdDelayTimer <= 0) {
          const activeDirs = Array.from(this.heldDirections);
          const dir = activeDirs[activeDirs.length - 1];
          this.tryMove(dir);
          this.holdDelayTimer = this.repeatInterval;
        }
      }

      // 5-Second Fading Hint:
      // First 3.5s hold full brightness (alpha = 1.0)
      // Final 1.5s smoothly fades away to 0 at 5.0s mark
      if (this.hintRemaining > 0) {
        this.hintRemaining = Math.max(0, this.hintRemaining - dt);
        if (this.hintRemaining > this.hintFadeDuration) {
          this.renderer.hintAlpha = 1.0;
        } else {
          this.renderer.hintAlpha = Math.max(0, this.hintRemaining / this.hintFadeDuration);
        }

        this.updateHintButtonUI();

        if (this.hintRemaining <= 0) {
          this.renderer.showHint = false;
          this.renderer.hintAlpha = 0;
          this.isHintActive = false;
          this.resetHintButtonUI();
        }
      }

      // Smooth player coordinate interpolation (Lerp)
      const lerpSpeed = 0.35;
      this.player.interpolatedX += (this.player.x - this.player.interpolatedX) * lerpSpeed;
      this.player.interpolatedY += (this.player.y - this.player.interpolatedY) * lerpSpeed;

      if (Math.abs(this.player.x - this.player.interpolatedX) < 0.01) {
        this.player.interpolatedX = this.player.x;
      }
      if (Math.abs(this.player.y - this.player.interpolatedY) < 0.01) {
        this.player.interpolatedY = this.player.y;
      }

      // Transition effect decay
      if (this.renderer.transitionEffect > 0) {
        this.renderer.transitionEffect = Math.max(0, this.renderer.transitionEffect - dt * 2.5);
      }

      this.updateHUD();
    }

    this.renderer.update(dt, this.player, this.maze);
    this.renderer.render(this.player, this.maze, this.trailHistory);

    requestAnimationFrame(this.loop.bind(this));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new EndlessMazeGame();
});

