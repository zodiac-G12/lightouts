// https://ja.wikipedia.org/wiki/%E9%9A%A3%E6%8E%A5%E8%A1%8C%E5%88%97
// https://www.gensu.co.jp/saito/puzzle/a38lightsout1.html

const N = 3;
// N<=15


const statusLights = [];
for (let i = 0; i < N; i++) {
    statusLights[i] = [];
    for (let j = 0; j < N; j++) statusLights[i][j] = Math.floor(Math.random()*2);
}

const mapLights = [];
for (let i = 0; i < N*N; i++) {
    mapLights[i] = [];
    for (let j = 0; j < N*N; j++) {
        if (
            i === j ||
            (0 <= i-1 && i-1 === j && j%N!==N-1) ||
            (i+1 < N*N && i+1 === j && j%N!==0) ||
            (0 <= i-N && i-N === j) ||
            (i+N < N*N && i+N === j)
        ) {
            mapLights[i][j] = 1;
        } else {
            mapLights[i][j] = 0;
        }
    } 
}

const toIdt = JSON.parse(JSON.stringify(mapLights));


const idt_mtrx = [];
for (let i = 0; i < N*N; i++) {
    idt_mtrx[i] = [];
    for (let j = 0; j < N*N; j++) {
        if (i===j) { idt_mtrx[i][j] = 1; }
        else { idt_mtrx[i][j] = 0; }
    }
}

const mapLightsInv = JSON.parse(JSON.stringify(idt_mtrx));

// console.log(toIdt.map(xs => {return xs.join(", ")}).join("\n"), "\n");
// console.log(mapLightsInv.map(xs => {return xs.join(", ")}).join("\n"), "\n");

function isIdt_mtrx(mtrx) {
    return !mtrx.some((row,idx1) => {
        return row.some((j,idx2) => {
            return (idx1===idx2&&!j) || (idx1!==idx2&&j);
        });
    });
}

// toIdt | mapLightsInv
const kansei = [];
const pend = [];

for(let i = 0; i < N*N; i++) {
    kansei[i] = false;
    pend[i] = false;
}

let count = 0;
while (!isIdt_mtrx(toIdt) && count < N) {
    for (let i = 0; i < N*N; i++) {
        toIdt[i].forEach((isOne, idx) => {
            // (i,i) 以外で"1"になっている箇所について処理 (i,idx)
            if (i !== idx && isOne) {
                for (let j = 0; j < N*N; j++) {
                    // (j,0) ~ (j,idx-1) が全て"0"で (j,idx) が"1"
                    if (i!==j && !toIdt[j].slice(0,idx).includes(1) && toIdt[j][idx]===1) {
                        let left = toIdt[j],
                            right = mapLightsInv[j];

                        for (let k = 0; k < N*N; k++) {
                            toIdt[i][k] = (toIdt[i][k] + left[k])&1;
                            mapLightsInv[i][k] = (mapLightsInv[i][k] + right[k])&1;
                        }
                        if (!kansei[i] && toIdt[i].filter(k=>k===1).length===1) {
                            // console.log("kansei", toIdt[i], "\n")
                            kansei[i] = true;
                            let chIdx = toIdt[i].indexOf(1);
                            let chLeft = toIdt[i],
                                chRight = mapLightsInv[i];

                            toIdt[i] = JSON.parse(JSON.stringify(toIdt[chIdx]));
                            mapLightsInv[i] = JSON.parse(JSON.stringify(mapLightsInv[chIdx]));

                            toIdt[chIdx] = JSON.parse(JSON.stringify(chLeft));
                            mapLightsInv[chIdx] = JSON.parse(JSON.stringify(chRight));

                            for (let k = 0; k < N*N; k++) {
                                if (k!==chIdx && toIdt[k][chIdx]===1) {
                                    for (let l = 0; l < N*N; l++) {
                                        toIdt[k][l] = (toIdt[k][l] + toIdt[chIdx][l])&1;
                                        mapLightsInv[k][l] = (mapLightsInv[k][l] + mapLightsInv[chIdx][l])&1;
                                    }
                                }
                                if (!kansei[k] && toIdt[k].filter(l=>l===1).length===1) {
                                    pend[k] = true;
                                }
                            }
                            pend.forEach((v,m) => {
                                if(v) {
                                    if (!kansei[m] && toIdt[m].filter(k=>k==1).length===1) {
                                        // console.log("kansei", toIdt[m], "\n")
                                        pend[m] = false;
                                        kansei[m] = true;
                                        let chIdx = toIdt[m].indexOf(1);      
                                        let chLeft = toIdt[m],
                                            chRight = mapLightsInv[m];

                                        toIdt[m] = JSON.parse(JSON.stringify(toIdt[chIdx]));
                                        mapLightsInv[m] = JSON.parse(JSON.stringify(mapLightsInv[chIdx]));

                                        toIdt[chIdx] = JSON.parse(JSON.stringify(chLeft));
                                        mapLightsInv[chIdx] = JSON.parse(JSON.stringify(chRight));

                                        for (let k = 0; k < N*N; k++) {
                                            if (k!==chIdx && toIdt[k][chIdx]===1) {
                                                for (let l = 0; l < N*N; l++) {
                                                    toIdt[k][l] = (toIdt[k][l] + toIdt[chIdx][l])&1;
                                                    mapLightsInv[k][l] = (mapLightsInv[k][l] + mapLightsInv[chIdx][l])&1;
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        break;
                    }
                }
            }
        })
    }
    // console.log(toIdt.map(xs => {return xs.join(", ")}).join("\n"), "\n");
    // console.log(mapLightsInv.map(xs => {return xs.join(", ")}).join("\n"), "\n");
    count += 1;
}

if (isIdt_mtrx(toIdt)) console.log(count);

// console.log(toIdt.map(xs => {return xs.join(", ")}).join("\n"), "\n");

// console.log(mapLights, mapLightsInv)

// const a = [];
// for (let i = 0; i < N*N; i++) {
//     a[i] = [];
//     for (let j = 0; j < N*N; j++) {
//         a[i][j] = 0;
//         for(let k = 0; k < N*N; k++) a[i][j] = (a[i][j] + (mapLights[k][j]*mapLightsInv[i][k]))&1;
//     }
// }
//
// console.log("E", a)
//
//
// f = [0,0,1,1,0,1,1,0,0];
//
// console.log(mapLightsInv.map((row => {return row.map((i,idx) => {return (i*f[idx])}).filter(i=>i===1).length&1} )))
