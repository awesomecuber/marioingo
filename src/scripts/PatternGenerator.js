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

function getBoxPatterns(n, l) {
  let patterns = [];
  for (let i = 0; i <= n - l; i++) {
    for (let j = 0; j <= n - l; j++) {
      let pattern = [];
      for (let y = 0; y < l; y++) {
        for (let x = 0; x < l; x++) {
          pattern.push((i + y) * n + j + x);
        }
      }
      patterns.push(pattern);
    }
  }
  return patterns;
}

export default function(n, type) {
  switch (type) {
    case "bingo":
      return getLinePatterns(n, n);
    case "ttt":
      return getLinePatterns(n, 3);
    case "2x2":
      return getBoxPatterns(n, 2);
  }
}
