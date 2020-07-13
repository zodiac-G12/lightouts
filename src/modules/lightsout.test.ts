import { fMapLights, fIdt_mtrx } from "./lightsout";

describe("lightsout solver", () => {
    describe("function fMapLights", () => {
        it("n === 1", () => {
            const binaryMatrix = fMapLights(1);
            expect(
                [
                    [1]
                ]
            ).toStrictEqual(binaryMatrix);
        });
        it("n === 2", () => {
            const binaryMatrix = fMapLights(2);
            expect(
                [
                    [1, 1, 1, 0],
                    [1, 1, 0, 1],
                    [1, 0, 1, 1],
                    [0, 1, 1, 1],
                ]
            ).toStrictEqual(binaryMatrix);
        });
        it("n === 3", () => {
            const binaryMatrix = fMapLights(3);
            expect(
                [
                    [1, 1, 0, 1, 0, 0, 0, 0, 0],
                    [1, 1, 1, 0, 1, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 1, 0, 0, 0],
                    [1, 0, 0, 1, 1, 0, 1, 0, 0],
                    [0, 1, 0, 1, 1, 1, 0, 1, 0],
                    [0, 0, 1, 0, 1, 1, 0, 0, 1],
                    [0, 0, 0, 1, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 1, 0, 1, 1, 1],
                    [0, 0, 0, 0, 0, 1, 0, 1, 1],
                ]
            ).toStrictEqual(binaryMatrix);
        });
    });
    describe("function fIdt_mtrx", () => {
        it("n === 1", () => {
            const matrix = fIdt_mtrx(1);
            expect(
                [
                    [1]
                ]
            ).toStrictEqual(matrix);
        });
        it("n === 2", () => {
            const matrix = fIdt_mtrx(2);
            expect(
                [
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                ]
            ).toStrictEqual(matrix);
        });
    });
});

export {}