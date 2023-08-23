/** ***********************************************************************************
//     _     _       _     _    ___        _       ____        _
//    | |   (_) __ _| |__ | |_ / _ \ _   _| |_ ___/ ___|  ___ | |_   _____ _ __
//    | |   | |/ _` | '_ \| __| | | | | | | __/ __\___ \ / _ \| \ \ / / _ \ '__|
//    | |___| | (_| | | | | |_| |_| | |_| | |_\__ \___) | (_) | |\ V /  __/ |
//    |_____|_|\__, |_| |_|\__|\___/ \__,_|\__|___/____/ \___/|_| \_/ \___|_|
//             |___/
//
//    Refarence:
//
//   - https://ja.wikipedia.org/wiki/%E9%9A%A3%E6%8E%A5%E8%A1%8C%E5%88%97
//   - https://www.gensu.co.jp/saito/puzzle/a38lightsout1.html
//   - http://www.math.okayama-u.ac.jp/~mi/lecture/pdf/galois.pdf
//
//
//   Depend on a Theory of Algebra
//
//   - F_2 Field: {1,0} only
//
//    (+)| 0 | 1      (*)| 0 | 1
//   -------------   -------------
//     0 | 0 | 1       0 | 0 | 0
//   -------------   -------------
//     1 | 1 | 0       1 | 0 | 1
//
//
//    Provided by Zodiac-G12
//
 *************************************************************************************/

// Nが15より大きいと配列サイズ・計算量的に困難になる（ブラウザという方法論に於いてのみに限る主張）
export const isProblemDifficult = (n: number): boolean => {
  return n > 20;
};

// ライトの初期値をランダムに決めて出力する
export const fStatusLights = (n: number): number[][] => {
  const intsN = [...Array(n).keys()];

  const bitN_N = intsN.map(() => {
    return intsN.map(() => {
      const bit = Math.floor(Math.random() * 2);

      return bit;
    });
  });

  return bitN_N;
};

// 拡大隣接行列：つまりは各マスから各マスに、写像が対応するかに関する真偽値(binary)の、有効グラフの行列
// を出力する
export const fMapLights = (n: number): number[][] => {
  const intsN2 = [...Array(n * n).keys()];

  const bitN_N = intsN2.map((i) => {
    return intsN2.map((j) => {
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

  return bitN_N;
};

// (N*N) * (N*N) の単位行列を出力する
export const fIdt_mtrx = (n: number): number[][] => {
  const intsN2 = [...Array(n * n).keys()];

  const bitN_N = intsN2.map((i) => {
    return intsN2.map((j) => {
      if (i === j) return 1;
      return 0;
    });
  });

  return bitN_N;
};

// 行列が単位行列か判定して真偽値を出力する
export const isIdt_mtrx = (mtrx: number[][]): boolean => {
  return !mtrx.some((row, idx1) => {
    return row.some((j, idx2) => {
      return (idx1 === idx2 && j !== 1) || (idx1 !== idx2 && j !== 0);
    });
  });
};

// 配列Deepコピー
export const arrayDeepCp = (array: number[]): number[] => {
  return JSON.parse(JSON.stringify(array));
};

// TODO refact
// F2体上ににおいて、ある行列の逆行列を出力する
export const F2_Gauss_Jordan = (
    n: number,
    toIdt: number[][],
    mapLightsInv: number[][]
): number[][] | undefined => {
  // 逆行列が作成できるまで、N回までループ
  while (!isIdt_mtrx(toIdt)) {
    // 各行に関して処理
    toIdt.forEach((row, i) => {
      // 既に完成している行はスキップ
      if (row.filter((v) => v === 1).length === 1 && row[i] === 1) return;

      row.forEach((v, j) => {
        // rowの中で(i,i)以外で1になっているところのみ処理
        // 単位行列にしたいので、対角以外の1は許容できない
        // => それ以外はスキップ
        if (j === i || v !== 1) return;

        // (0,0,..<= all zero,
        // ,1 <= index=j
        // ,..0 <= index=i not one
        // ,..) := jFrontAllZeroRow
        let jFrontAllZeroRow: number[] = [];
        let idx: number;
        toIdt.some((row_, i_) => {
          if (i_ !== i && !row_.slice(0, j).includes(1) && row_[i] !== 1) {
            jFrontAllZeroRow = arrayDeepCp(row_);
            idx = i_;
            return true;
          }
          return false;
        });
        jFrontAllZeroRow.forEach((v_, j_) => {
          toIdt[i][j_] = (toIdt[i][j_] + v_) & 1;
          mapLightsInv[i][j_] =
            (mapLightsInv[i][j_] + mapLightsInv[idx][j_]) & 1;
        });
      });
    });
    // ソート：一部ソートしないと解けない問題がある
    // e.g. N=10, etc

    // ソート前
    const bef = toIdt.map((row) => {
      return row.join('');
    });

    // 重複行があれば逆行列は存在しない
    const isDuplicated = bef.filter(function(x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });
    if (isDuplicated.length > 0) break;
    toIdt.sort().reverse(); // ⚠️  破壊的変更

    // ソート後
    const aft = toIdt.map((row) => {
      return row.join('');
    });
    // rowのindex->index推移図
    const btoa = bef.map((row) => {
      return aft.indexOf(row);
    });
    const tmp = [...Array(n)];
    btoa.forEach((j, i) => {
      tmp[j] = arrayDeepCp(mapLightsInv[i]);
    });
    // toIdtに合わせてmapLightsInvのソート
    tmp.forEach((row, i) => {
      mapLightsInv[i] = arrayDeepCp(row);
    });
  }

  // 逆行列が作れなかった
  if (!isIdt_mtrx(toIdt)) {
    console.warn('Inverse Matrix isnt EXIST!');

    return;
  }

  console.log(
      'toIdt',
      '\n',
      toIdt
          .map((xs) => {
            return xs.join(', ');
          })
          .join('\n'),
      '\n'
  );
  console.log(
      'mapLightsInv',
      '\n',
      mapLightsInv
          .map((xs) => {
            return xs.join(', ');
          })
          .join('\n'),
      '\n'
  );
  return mapLightsInv;
};

export const eachSlice = (arr: number[], n = 2): number[][] => {
  return [...Array(Math.floor(arr.length / n)).keys()].map((i) => {
    return arr.slice(i * n, i * n + n);
  });
};

// 答のマップを返す
export const toShowAnsMap = (
    state: number[],
    toAnsMtrx: number[][],
    n: number
): number[][] => {
  return eachSlice(
      toAnsMtrx.map((row) => {
        return (
          row
              .map((i, idx) => {
                return i * state[idx];
              })
              .filter((i) => i === 1).length & 1
        );
      }),
      n
  );
};
