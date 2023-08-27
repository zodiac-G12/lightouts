import {
  createIdentity,
  createRandomMatrix,
  createInverse,
  createMapping,
  createAnswer,
} from './lightsout.module';

export type LightsOutProps = {
  n: number;
  matrix: number[][];
  states: number[];
  identity: number[][];
  mapping: number[][];
  inverse: number[][] | null;
  answer: number[][] | null;
};

export class LightsOut {
  n: number;
  matrix: number[][];
  states: number[];
  identity: number[][];
  mapping: number[][];
  inverse: number[][] | null;
  answer: number[][] | null;

  constructor(props: { n: number }) {
    this.n = props.n;
    this.matrix = createRandomMatrix(props.n);
    this.identity = createIdentity(props.n);
    this.states = this.matrix.flat();
    this.mapping = createMapping(props.n);
    this.inverse = createInverse({
      n: props.n * props.n,
      matrix: this.mapping,
      identity: this.identity,
    });
    this.answer = createAnswer({
      n: props.n,
      inverse: this.inverse,
      states: this.matrix.flat(),
    });
  }

  update(props: { states: number[] }) {
    const {states} = props;

    this.states = states;
    this.answer = createAnswer({n: this.n, inverse: this.inverse, states});
  }

  getAnswer() {
    console.log(
        this.answer
            ?.map((xs) => {
              return xs.join(', ');
            })
            .join('\n')
    );

    return this.answer;
  }
}
