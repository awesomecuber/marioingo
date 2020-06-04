import BingoConstants from "./config.js";

function generateSeed() {
  return String(Math.floor(Math.random() * 100000));
}

export default function(query) {
  let needReload = false;
  let size;
  let difficulty = [];
  let seed;
  let type;

  // variable + P means url parameter
  let sizeP = Number(query.size);
  if (
    sizeP &&
    sizeP >= BingoConstants.MIN_SIZE &&
    sizeP <= BingoConstants.MAX_SIZE
  ) {
    size = sizeP;
  } else {
    needReload = true;
    size = BingoConstants.DEFAULT_SIZE;
  }

  let minDiffP = Number(query.minDiff);
  let maxDiffP = Number(query.maxDiff);
  if (
    minDiffP &&
    maxDiffP &&
    minDiffP >= BingoConstants.MIN_DIFF &&
    maxDiffP <= BingoConstants.MAX_DIFF &&
    maxDiffP - minDiffP >= BingoConstants.MIN_DIFF_DIFFERENCE
  ) {
    difficulty[0] = minDiffP;
    difficulty[1] = maxDiffP;
  } else {
    needReload = true;
    difficulty[0] = BingoConstants.MIN_DIFF;
    difficulty[1] = BingoConstants.MAX_DIFF;
  }

  let seedP = query.seed;
  if (seedP && seedP.length <= 20) {
    seed = seedP;
  } else {
    needReload = true;
    seed = generateSeed();
  }

  let typeP = query.type;
  if (typeP && BingoConstants.TYPES.map(type => type.value).includes(typeP)) {
    type = typeP;
  } else {
    needReload = true;
    type = BingoConstants.DEFAULT_TYPE;
  }

  return {
    needReload,
    size,
    difficulty,
    seed,
    type
  };
}
