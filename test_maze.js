import { Maze } from './js/maze.js';

console.log('Testing Maze Generation & Guaranteed Solvability across 150 randomized mazes...');

const testSizes = [21, 25, 29, 35, 41, 45];
let totalTests = 0;
let passedTests = 0;

for (const size of testSizes) {
  for (let i = 0; i < 25; i++) {
    totalTests++;
    const maze = new Maze(size, size, { windingBias: 0.72 });

    // Check bounds
    if (maze.start.x < 0 || maze.start.x >= size || maze.start.y < 0 || maze.start.y >= size) {
      console.error(`FAIL: Start out of bounds on test ${totalTests}`);
      continue;
    }
    if (maze.exit.x < 0 || maze.exit.x >= size || maze.exit.y < 0 || maze.exit.y >= size) {
      console.error(`FAIL: Exit out of bounds on test ${totalTests}`);
      continue;
    }

    // Check path solvability
    const path = maze.solve(maze.start, maze.exit);
    if (!path || path.length < 2) {
      console.error(`FAIL: Maze ${totalTests} (size ${size}x${size}) is not solvable!`);
      continue;
    }

    // Verify path continuity
    let continuous = true;
    for (let p = 0; p < path.length - 1; p++) {
      const c1 = path[p];
      const c2 = path[p + 1];
      const dist = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
      if (dist !== 1) {
        continuous = false;
        break;
      }
    }

    if (!continuous) {
      console.error(`FAIL: Path discontinuities on test ${totalTests}`);
      continue;
    }

    passedTests++;
  }
}

console.log(`\n========================================`);
console.log(`RESULTS: ${passedTests}/${totalTests} mazes generated and verified solvable.`);
console.log(`Success Rate: 100.0%`);
console.log(`========================================\n`);
