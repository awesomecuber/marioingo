/* eslint-disable no-unused-vars */
import objectiveList from "./ObjectiveList.js";
import seedrandom from "seedrandom";
let rng = new seedrandom();

function getRandomGrid(n, lowerDiff, higherDiff) {
  let arr = [];
  let buckets = higherDiff - lowerDiff + 1;
  let perBucket = Math.floor((n * n) / buckets);
  let extra = (n * n) % buckets;
  let offset = Math.floor((buckets - extra) / 2);
  for (let i = lowerDiff; i <= higherDiff; i++) {
    for (let j = 0; j < perBucket; j++) {
      arr.push(i);
    }
    if (i >= offset && extra > 0) {
      arr.push(i);
      extra--;
    }
  }
  shuffle(arr);

  let grid = [];
  for (let i = 0; i < n; i++) {
    grid.push(arr.splice(0, n));
  }
  return grid;
}

function getPatterns(n, type) {
  switch (type) {
    case "bingo":
      return getLinePatterns(n, n);
    case "ttt":
      return getLinePatterns(n, 3);
  }
}

/**
 *
 * @param {Number} n size of board
 * @param {Number} l length of line
 */
function getLinePatterns(n, l) {
  let patterns = [];
  for (let i = 0; i <= n - l; i++) {
    for (let j = 0; j < n; j++) {
      let rowPattern = [];
      let colPattern = [];
      for (let k = 0; k < l; k++) {
        rowPattern.push(j * n + k + i);
        colPattern.push(j + (k + i) * n);
      }
      patterns.push(rowPattern);
      patterns.push(colPattern);

      if (j <= n - l) {
        let tlbrPattern = [];
        let trblPattern = [];
        for (let k = 0; k < l; k++) {
          tlbrPattern.push((k + j) * n + k + i);
          trblPattern.push((k + j) * n + l - 1 - k + i);
        }
        patterns.push(tlbrPattern);
        patterns.push(trblPattern);
      }
    }
  }
  return patterns;
}

function getMagicNumber(grid, patternSize) {
  let total = 0;
  grid.forEach(line => {
    line.forEach(num => {
      total += num;
    });
  });
  return Math.round(total * (patternSize / grid.length ** 2));
}

function getError(grid, patterns) {
  let n = grid.length;
  let magicNumber = getMagicNumber(grid, patterns[0].length);
  let totalError = 0;
  patterns.forEach(pattern => {
    let sum = 0;
    pattern.forEach(position => {
      sum += grid[Math.floor(position / n)][position % n];
    });
    totalError += (sum - magicNumber) ** 2;
  });
  return totalError;
}

function gridSwap(grid, num1, num2) {
  let n = grid.length;
  let x1 = num1 % n;
  let y1 = Math.floor(num1 / n);
  let x2 = num2 % n;
  let y2 = Math.floor(num2 / n);
  [grid[y1][x1], grid[y2][x2]] = [grid[y2][x2], grid[y1][x1]];
}

function improveGrid(grid, patternType, iterations) {
  let n = grid.length;
  let patterns = getPatterns(n, patternType);
  let currentError = getError(grid, patterns);
  for (let i = 0; i < iterations; i++) {
    let num1 = randint(n * n);
    let num2 = randint(n * n);
    while (num1 === num2) {
      num2 = randint(n * n);
    }
    gridSwap(grid, num1, num2);
    let newError = getError(grid, patterns);
    if (newError < currentError) {
      currentError = newError;
    } else {
      gridSwap(grid, num1, num2);
    }
  }
}

function replaceNumbersWithObjectives(grid, patternType) {
  let n = grid.length;
  let patterns = getPatterns(n, patternType);
  let order = [];
  for (let i = 0; i < n * n; i++) {
    order.push(i);
  }
  shuffle(order);
  order.forEach(gridSpot => {
    let x = gridSpot % n;
    let y = Math.floor(gridSpot / n);
    let possibleObjectives = objectiveList[grid[y][x]];
    let first = randint(possibleObjectives.length);
    let cur = first;
    let best = first;
    let lowestSynergy = 999; // higher than anything realistically
    do {
      let synergy = 0;
      let curTypes = possibleObjectives[cur].types;
      let toCheck = getRelatedSpots(gridSpot, patterns).forEach(relatedSpot => {
        let otherSquare = grid[Math.floor(relatedSpot / n)][relatedSpot % n];
        if (isNaN(otherSquare)) {
          let otherTypes = otherSquare.types;
          otherTypes.forEach(otherType => {
            if (curTypes.includes(otherType)) {
              synergy++;
            }
          });
        }
      });
      if (synergy < lowestSynergy) {
        lowestSynergy = synergy;
        best = cur;
      }

      cur += 1;
      // wrapping
      if (cur === possibleObjectives.length) {
        cur = 0;
      }
    } while (lowestSynergy !== 0 && cur !== first);
    grid[Math.floor(gridSpot / n)][gridSpot % n] = possibleObjectives[best];
    console.log(lowestSynergy);
  });
}

function getRelatedSpots(gridSpot, patterns) {
  let related = [];
  patterns.forEach(pattern => {
    if (pattern.includes(gridSpot)) {
      pattern.forEach(patternSpot => {
        if (gridSpot !== patternSpot && !related.includes(patternSpot)) {
          related.push(patternSpot);
        }
      });
    }
  });
  return related;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = randint(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generates a random number from 0 (inclusive) to max (exclusive)
 * @param {Number} max The max.
 */
function randint(max) {
  return Math.floor(rng() * max);
}

/**
 * Generates the board
 * @param {Number} n Size of width and height of board
 * @param {Number} lowerDiff Lowest difficulty (1-9)
 * @param {Number} higherDiff Highest difficulty (1-9)
 * Should be at least 3 higher than lowerDiff.
 * @param {String} seed (can also be a number)
 * @param {String} patternType Currently, "bingo" or "ttt".
 */
export default function(n, lowerDiff, higherDiff, seed, patternType) {
  rng = new seedrandom(seed);
  let grid = getRandomGrid(n, lowerDiff, higherDiff);
  let patterns = getPatterns(n, patternType);
  let oldError = getError(grid, patterns);
  improveGrid(grid, patternType, 1000);
  console.log(
    `Old Error: ${oldError} | New Error: ${getError(grid, patterns)}`
  );
  replaceNumbersWithObjectives(grid, patternType);
  return grid;
}
