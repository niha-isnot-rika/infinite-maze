/**
 * Procedural Maze Generator & Graph Solver
 * Generates complex, high-winding, 100% solvable mazes.
 */

export class Maze {
  constructor(cols = 25, rows = 25, options = {}) {
    this.cols = cols;
    this.rows = rows;
    this.windingBias = options.windingBias || 0.65; // Bias for twisty corridors
    this.braidFactor = options.braidFactor || 0.0; // Loops (0 = perfect maze)
    
    // Each cell has walls: [top, right, bottom, left] -> 1 means wall exists, 0 means open
    this.grid = [];
    this.start = { x: 0, y: 0 };
    this.exit = { x: cols - 1, y: rows - 1 };
    this.solutionPath = [];
    this.solutionLength = 0;

    this.generate();
  }

  generate() {
    // 1. Initialize grid with all walls active: [Top, Right, Bottom, Left]
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.cols; x++) {
        row.push({
          x,
          y,
          walls: [1, 1, 1, 1], // top, right, bottom, left
          visited: false
        });
      }
      this.grid.push(row);
    }

    // 2. Randomized Depth-First Search with winding corridor bias
    const stack = [];
    const startX = Math.floor(Math.random() * this.cols);
    const startY = Math.floor(Math.random() * this.rows);
    let current = this.grid[startY][startX];
    current.visited = true;
    stack.push(current);

    let lastDir = -1;

    while (stack.length > 0) {
      current = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length > 0) {
        let chosen;
        // Bias toward turning or straight based on winding parameter
        const sameDirNeighbor = neighbors.find(n => n.dir === lastDir);
        if (sameDirNeighbor && Math.random() > this.windingBias) {
          chosen = sameDirNeighbor;
        } else {
          chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
        }

        const nextCell = chosen.cell;
        const dir = chosen.dir; // 0: top, 1: right, 2: bottom, 3: left

        // Remove walls between current and nextCell
        current.walls[dir] = 0;
        nextCell.walls[(dir + 2) % 4] = 0;

        nextCell.visited = true;
        stack.push(nextCell);
        lastDir = dir;
      } else {
        stack.pop();
        lastDir = -1;
      }
    }

    // 3. Optional subtle braiding (if braidFactor > 0)
    if (this.braidFactor > 0) {
      this.braidDeadEnds(this.braidFactor);
    }

    // 4. Calculate maximal topological distance for Start and Exit points
    this.determineOptimalEndpoints();

    // 5. Solve and cache optimal solution
    this.solutionPath = this.solve(this.start, this.exit);
    this.solutionLength = this.solutionPath.length;
  }

  getUnvisitedNeighbors(cell) {
    const neighbors = [];
    const { x, y } = cell;

    // Directions: 0: Up (0, -1), 1: Right (1, 0), 2: Down (0, 1), 3: Left (-1, 0)
    const deltas = [
      { dx: 0, dy: -1, dir: 0 },
      { dx: 1, dy: 0, dir: 1 },
      { dx: 0, dy: 1, dir: 2 },
      { dx: -1, dy: 0, dir: 3 }
    ];

    for (const d of deltas) {
      const nx = x + d.dx;
      const ny = y + d.dy;

      if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
        const neighbor = this.grid[ny][nx];
        if (!neighbor.visited) {
          neighbors.push({ cell: neighbor, dir: d.dir });
        }
      }
    }

    return neighbors;
  }

  braidDeadEnds(factor) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = this.grid[y][x];
        const wallCount = cell.walls.reduce((a, b) => a + b, 0);
        // If it's a dead end (3 walls)
        if (wallCount === 3 && Math.random() < factor) {
          const closedDirs = [];
          if (cell.walls[0] && y > 0) closedDirs.push(0);
          if (cell.walls[1] && x < this.cols - 1) closedDirs.push(1);
          if (cell.walls[2] && y < this.rows - 1) closedDirs.push(2);
          if (cell.walls[3] && x > 0) closedDirs.push(3);

          if (closedDirs.length > 0) {
            const dir = closedDirs[Math.floor(Math.random() * closedDirs.length)];
            const deltas = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            const nx = x + deltas[dir][0];
            const ny = y + deltas[dir][1];
            cell.walls[dir] = 0;
            this.grid[ny][nx].walls[(dir + 2) % 4] = 0;
          }
        }
      }
    }
  }

  /**
   * Two-pass BFS to find the longest topological path between any two points in the maze.
   */
  determineOptimalEndpoints() {
    // Pick random corner or cell as initial probe
    const probe = { x: 0, y: 0 };
    const firstFarthest = this.getFarthestCellBFS(probe);
    const secondFarthest = this.getFarthestCellBFS(firstFarthest);

    this.start = firstFarthest;
    this.exit = secondFarthest;
  }

  getFarthestCellBFS(from) {
    const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    const queue = [{ x: from.x, y: from.y, dist: 0 }];
    visited[from.y][from.x] = true;

    let maxDist = -1;
    let farthest = { x: from.x, y: from.y };

    const deltas = [
      { dx: 0, dy: -1, dir: 0 },
      { dx: 1, dy: 0, dir: 1 },
      { dx: 0, dy: 1, dir: 2 },
      { dx: -1, dy: 0, dir: 3 }
    ];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.dist > maxDist) {
        maxDist = current.dist;
        farthest = { x: current.x, y: current.y };
      }

      const cell = this.grid[current.y][current.x];

      for (const d of deltas) {
        // Can only move if no wall in that direction
        if (cell.walls[d.dir] === 0) {
          const nx = current.x + d.dx;
          const ny = current.y + d.dy;
          if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && !visited[ny][nx]) {
            visited[ny][nx] = true;
            queue.push({ x: nx, y: ny, dist: current.dist + 1 });
          }
        }
      }
    }

    return farthest;
  }

  /**
   * BFS Solver to find shortest path from start to target.
   * Guaranteed to succeed on connected mazes.
   */
  solve(from = this.start, to = this.exit) {
    const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    const parent = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    const queue = [{ x: from.x, y: from.y }];
    visited[from.y][from.x] = true;

    const deltas = [
      { dx: 0, dy: -1, dir: 0 },
      { dx: 1, dy: 0, dir: 1 },
      { dx: 0, dy: 1, dir: 2 },
      { dx: -1, dy: 0, dir: 3 }
    ];

    let found = false;

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr.x === to.x && curr.y === to.y) {
        found = true;
        break;
      }

      const cell = this.grid[curr.y][curr.x];

      for (const d of deltas) {
        if (cell.walls[d.dir] === 0) {
          const nx = curr.x + d.dx;
          const ny = curr.y + d.dy;
          if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && !visited[ny][nx]) {
            visited[ny][nx] = true;
            parent[ny][nx] = curr;
            queue.push({ x: nx, y: ny });
          }
        }
      }
    }

    if (!found) return [];

    // Backtrack path
    const path = [];
    let step = { x: to.x, y: to.y };
    while (step) {
      path.push(step);
      if (step.x === from.x && step.y === from.y) break;
      step = parent[step.y][step.x];
    }

    return path.reverse();
  }

  /**
   * Check if movement is allowed in direction (0: Up, 1: Right, 2: Down, 3: Left)
   */
  canMove(x, y, dir) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
    return this.grid[y][x].walls[dir] === 0;
  }
}
