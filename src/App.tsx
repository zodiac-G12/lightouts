import type {Component} from 'solid-js';
import {createSignal, createEffect} from 'solid-js';
import Canvas from './Canvas';
import {styled} from 'solid-styled-components';
import * as THREE from 'three';

const App: Component = () => {
  const Ncandidate = parseInt(location.href.split('#')[1]);

  const N = Number.isInteger(Ncandidate) ? Ncandidate : undefined;

  const [isShowAnswer, setIsShowAnswer] = createSignal(false);
  const [buttonText, setButtonText] = createSignal('Hide Answer');

  Canvas(N, isShowAnswer);

  createEffect(() => {
    const userNextActionButtonText = isShowAnswer() ?
      'Hide Answer' :
      'Show Answer';

    setButtonText(userNextActionButtonText);
  });

  return (
    <>
      <AnswerShowButton
        onClick={() => {
          setIsShowAnswer(!isShowAnswer());
        }}
      >
        {buttonText()}
      </AnswerShowButton>
    </>
  );
};

const AnswerShowButton = styled('button')`
  z-index: 1;
  position: absolute;
  top: 5vh;
  left: 0;
  right: 0;
  margin: auto;
  width: 30vh;
  text-align: center;
  font-size: 3vh;
  padding: 1vh;
  outline: none;
  border: solid 1px lime;
  box-shadow: 0px 0px 10px 10px darkslategray;
  border-radius: 1.1vh;
`;

export default App;
