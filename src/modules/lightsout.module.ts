export const multiply = (a: number, b: number): number => {
  let result = 0;
  while (b > 0) {
    if (b & 1) {
      result = result ^ a; // XOR operation for F2 multiplication
    }
    a = a << 1; // Shift left for F2 multiplication
    if (a & 0x100) {
      a = a ^ 0x11b; // XOR with irreducible polynomial for reducing modulo 256
    }
    b = b >> 1; // Shift right
  }
  return result;
};

export const createMapping = (n: number): number[][] => {
  const array = [...Array(n * n).keys()];

  const mapping = array.map((i) => {
    return array.map((j) => {
      const identity = i === j; // あるマスにおける自分に対する写像
      const leftMapping = 0 <= i - 1 && i - 1 === j && j % n !== n - 1; // 左側のマスに対する写像
      const rightMapping = i + 1 < n * n && i + 1 === j && j % n !== 0; // 右側のマスに対する写像
      const bottomMapping = 0 <= i - n && i - n === j; // 下側のマスに対する写像
      const topMapping = i + n < n * n && i + n === j; // 上側のマスに対する写像

      if (
        identity ||
        leftMapping ||
        rightMapping ||
        bottomMapping ||
        topMapping
      ) {
        return 1;
      }

      return 0;
    });
  });

  return mapping;
};

export const createIdentity = (n: number): number[][] => {
  const identity: number[][] = [];

  for (let i = 0; i < n * n; i++) {
    identity.push(new Array(n * n).fill(0));
    identity[i][i] = 1;
  }

  return identity;
};

export const createRandomMatrix = (n: number): number[][] => {
  const array = [...Array(n).keys()];

  const randomMatrix = array.map(() => {
    return array.map(() => {
      const bit = Math.floor(Math.random() * 2);

      return bit;
    });
  });

  return randomMatrix;
};

export const eachSlice = (arr: number[], n = 2): number[][] => {
  return [...Array(Math.floor(arr.length / n)).keys()].map((i) => {
    return arr.slice(i * n, i * n + n);
  });
};

// 答のマップを返す
export const createAnswer = (props: {
  states: number[];
  inverse: number[][] | null;
  n: number;
}): number[][] | null => {
  const {states, inverse, n} = props;

  if (!inverse) {
    return null;
  }

  return eachSlice(
      inverse.map((row) => {
        return (
          row
              .map((i, idx) => {
                return i * states[idx];
              })
              .filter((i) => i === 1).length & 1
        );
      }),
      n
  );
};

export const createInverse = (props: {
  matrix: number[][];
  identity: number[][];
  n: number;
}): number[][] | null => {
  const {n, identity, matrix} = props;

  for (let i = 0; i < n; i++) {
    if (matrix[i][i] === 0) {
      let found = false;
      for (let j = i + 1; j < n; j++) {
        if (matrix[j][i] !== 0) {
          [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
          [identity[i], identity[j]] = [identity[j], identity[i]];
          found = true;
          break;
        }
      }
      if (!found) {
        return null; // Matrix is not invertible
      }
    }

    const pivotInverse = matrix[i][i] === 1 ? 1 : multiply(matrix[i][i], 0x169); // Inverse in F2

    for (let j = 0; j < n; j++) {
      matrix[i][j] = multiply(matrix[i][j], pivotInverse);
      identity[i][j] = multiply(identity[i][j], pivotInverse);
    }

    for (let j = 0; j < n; j++) {
      if (j !== i && matrix[j][i] !== 0) {
        const factor = matrix[j][i];
        for (let k = 0; k < n; k++) {
          matrix[j][k] = matrix[j][k] ^ multiply(matrix[i][k], factor);
          identity[j][k] = identity[j][k] ^ multiply(identity[i][k], factor);
        }
      }
    }
  }

  return identity;
};
