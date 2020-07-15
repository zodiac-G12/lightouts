import React, { useState } from 'react';

import CanvasC from './CanvasC';

import styled, { keyframes } from 'styled-components';

import { css } from 'emotion';

function App(props) {
    const [state, setState] = useState(props);

    return (
        <AppContainer>
            <AnsShowButton
                onClick={() => { setState({...state, showAnsFlag: !state.showAnsFlag }) } }
                className={state.showAnsFlag ? hide : show}
                >{state.showAnsFlag ? "HIDE" : "SHOW"} ANSWER
            </AnsShowButton>
            <CanvasC showAnsFlag={state.showAnsFlag} />
            <Link href="https://github.com/zodiac-G12/lightouts#lights-out">
                Documents :)
            </Link>
        </AppContainer>
    );
}

App.defaultProps = {
    showAnsFlag: false
}


const AppContainer = styled.div`
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
`;

const AnsShowButton = styled.button`
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
    // box-shadow: 0px 0px 10px 10px darkslategray;
    // border-radius: 5vh;
`;

const glimpse = keyframes`
    from {
        text-shadow: 0px 0px 0.5vh darkorange, -0px -0px 0.7vh red;
    }
    to {
        text-shadow: 0px 0px 0.9vh darkorange, -0px -0px 1vh red;
    }
`;

const linkPositionTop = window.innerHeight > window.innerWidth ? '80vh' : '90vh';

const Link = styled.a`
    z-index: 1;
    position: fixed;
    left: 0;
    right: 0;
    margin: auto;
    width: 50vh;
    text-align: center;
    top: ${linkPositionTop};
    font-size: 3vh;
    color: orange;
    text-shadow: 0px 0px 0.5vh darkorange, -0px -0px 0.7vh red;
    // animation: ${glimpse} inifinite 2s ease-in-out;
    background: rgba(0,0,0,0);
    text-decoration: none;
`;

const hide = css`
    color: white;
    background: black;
    box-shadow: 0px 0px 10px 10px darkslategray;
`;

const show = css`
    color: black;
    background: white;
`;

export default App;
