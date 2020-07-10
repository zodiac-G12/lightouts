/*************************************************************************************
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
export const isProblemDifficult = (n : number) : boolean => {
    return n > 15;
}


// ライトの初期値をランダムに決めて出力する
export const fStatusLights = (n : number) : number[][] => {
    const statusLights = [];
    for (let i = 0; i < n; i++) {
        statusLights[i] = [];
        for (let j = 0; j < n; j++) {
            (statusLights[i][j] as number) = Math.floor(Math.random()*2);
        }
    }
    return statusLights;
}


// 拡大隣接行列：つまりは各マスから各マスに、写像が対応するかに関する真偽値(binary)の、有効グラフの行列
// を出力する
export const fMapLights = (n : number) : number[][] => {
    const mapLights = [];
    for (let i = 0; i < n*n; i++) {
        mapLights[i] = [];
        for (let j = 0; j < n*n; j++) {
            if (
                i === j || //あるマスにおける自分に対する写像
                (0 <= i-1 && i-1 === j && j%n!==n-1) || //左側のマスに対する写像
                (i+1 < n*n && i+1 === j && j%n!==0) || //右側のマスに対する写像
                (0 <= i-n && i-n === j) || //下側のマスに対する写像
                (i+n < n*n && i+n === j) //上側に対する写像
            ) {
                (mapLights[i][j] as number) = 1;
            } else { //写像が存在しない時
                (mapLights[i][j] as number) = 0;
            }
        }
    }
    return mapLights;
}


// (N*N) * (N*N) の単位行列を出力する
export const fIdt_mtrx = (n : number) : number[][] => {
    const idt_mtrx = [];
    for (let i = 0; i < n*n; i++) {
        idt_mtrx[i] = [];
        for (let j = 0; j < n*n; j++) {
            if (i===j) { (idt_mtrx[i][j] as number) = 1; }
            else { (idt_mtrx[i][j] as number) = 0; }
        }
    }
    return idt_mtrx;
}


// 行列が単位行列か判定して真偽値を出力する
export const isIdt_mtrx = (mtrx : number[][]) : boolean => {
    return !mtrx.some((row,idx1) => {
        return row.some((j,idx2) => {
            return (idx1===idx2 && j!==1) || (idx1!==idx2 && j!==0);
        });
    });
}


// F2体上ににおいて、ある行列の逆行列を出力する
export const F2_Gauss_Jordan = (n : number, toIdt : number[][], mapLightsInv : number[][]) : boolean|number[][] => {

    const kansei : boolean[] = [];
    const pend : boolean[] = [];

    for(let i = 0; i < n*n; i++) {
        kansei[i] = false;
        pend[i] = false;
    }

    let count = 0;
    while (!isIdt_mtrx(toIdt) && count++ <= n) {
        for (let i = 0; i < n*n; i++) {
            toIdt[i].forEach((isOne, idx) => {
                // (i,i) 以外で"1"になっている箇所について処理 (i,idx)
                if (i === idx || !isOne) return;
                for (let j = 0; j < n*n; j++) {
                    // (j,0) ~ (j,idx-1) が全て"0"で (j,idx) が"1"
                    if ( i===j ||
                         toIdt[j].slice(0,idx).includes(1) ||
                         toIdt[j][idx]!==1 ) continue; 

                    let left = toIdt[j],
                    right = mapLightsInv[j];

                    for (let k = 0; k < n*n; k++) {
                        toIdt[i][k] = (toIdt[i][k] + left[k])&1;
                        mapLightsInv[i][k] = (mapLightsInv[i][k] + right[k])&1;
                    }
                    if (kansei[i] || toIdt[i].filter(k=>k===1).length!==1) continue;
                    kansei[i] = true;
                    let chIdx = toIdt[i].indexOf(1);
                    let chLeft = toIdt[i],
                        chRight = mapLightsInv[i];

                    toIdt[i] = JSON.parse(JSON.stringify(toIdt[chIdx]));
                    mapLightsInv[i] = JSON.parse(JSON.stringify(mapLightsInv[chIdx]));

                    toIdt[chIdx] = JSON.parse(JSON.stringify(chLeft));
                    mapLightsInv[chIdx] = JSON.parse(JSON.stringify(chRight));

                    for (let k = 0; k < n*n; k++) {
                        if (k!==chIdx && toIdt[k][chIdx]===1) {
                            for (let l = 0; l < n*n; l++) {
                                toIdt[k][l] = (toIdt[k][l] + toIdt[chIdx][l])&1;
                                mapLightsInv[k][l] = (mapLightsInv[k][l] + mapLightsInv[chIdx][l])&1;
                            }
                        }
                        if (!kansei[k] && toIdt[k].filter(l=>l===1).length===1) {
                            pend[k] = true;
                        }
                    }
                    pend.forEach((v,m) => {
                        if (!v) return;
                        if (kansei[m] || toIdt[m].filter(k=>k===1).length!==1) return;
                        pend[m] = false;
                        kansei[m] = true;
                        let chIdx = toIdt[m].indexOf(1);      
                        let chLeft = toIdt[m],
                            chRight = mapLightsInv[m];

                        toIdt[m] = JSON.parse(JSON.stringify(toIdt[chIdx]));
                        mapLightsInv[m] = JSON.parse(JSON.stringify(mapLightsInv[chIdx]));

                        toIdt[chIdx] = JSON.parse(JSON.stringify(chLeft));
                        mapLightsInv[chIdx] = JSON.parse(JSON.stringify(chRight));

                        for (let k = 0; k < n*n; k++) {
                            if (k===chIdx || toIdt[k][chIdx]!==1) continue;
                            for (let l = 0; l < n*n; l++) {
                                toIdt[k][l] = (toIdt[k][l] + toIdt[chIdx][l])&1;
                                mapLightsInv[k][l] = (mapLightsInv[k][l] + mapLightsInv[chIdx][l])&1;
                            }
                        }
                    })
                    break;
                }
            })
        }
    }

    // 逆行列が作れなかった
    if (!isIdt_mtrx(toIdt)) {
        console.warn("Inverse Matrix isnt EXIST!");
        return false;
    }

    console.log(count);
    console.log("toIdt", "\n", toIdt.map(xs => {return xs.join(", ")}).join("\n"), "\n");
    console.log("mapLightsInv", "\n", mapLightsInv.map(xs => {return xs.join(", ")}).join("\n"), "\n");
    return mapLightsInv;
}


export const eachSlice = (arr : number[], n : number = 2) : number[][] => {
    let dup = [...arr];
    let result = [];
    let length = dup.length;

    while (0 < length) {
        result.push(dup.splice(0, n));
        length = dup.length;
    }

    return result;
};


// 答のマップを返す 
export const toShowAnsMap = (state : number[], toAnsMtrx : number[][], n : number) : number[][] => {
    return eachSlice(toAnsMtrx.map(row => {
        return row.map((i,idx) => {
            return (i*state[idx]);
        }).filter(i=>i===1).length&1;
    }), n);
}
