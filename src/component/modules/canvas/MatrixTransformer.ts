function presetVerify(matrixA: Array<number[]>, matrixB: Array<number[]>): boolean {
  if (matrixA.length != matrixB.length) return false;
  for (let i = 0; i < matrixA.length; i++) {
    if (matrixA[i].length != matrixB[i].length) {
      return false;
    }
    if (i != 0 && matrixA[i].length != matrixA[i - 1].length) {
      return false;
    }
  }
  return true;
}

export function matrixMultiply(matrixA: Array<number[]>, matrixB: Array<number[]>): Array<number[]> {
  const matrix: Array<number[]> = [];
  if (presetVerify(matrixA, matrixB)) {
    for (let i = 0; i < matrixA.length; i++) {
      const item = [] as number[];
      for (let j = 0; j < matrixA[i].length; j++) {

      }
      matrix.push(item);
    }
  }
  return matrix;
}
