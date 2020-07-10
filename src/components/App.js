import React, { useState } from 'react';

import CanvasC from './CanvasC';

import styled from 'styled-components';

function App(props) {
    const [state, setState] = useState(props);

    return (
        <AppContainer>
            <AnsShowButton
                onClick={() => { setState({...state, showAnsFlag: !state.showAnsFlag }) } }
                className="ans-show-button">SHOW ANSWER
            </AnsShowButton>
            <CanvasC showAnsFlag={state.showAnsFlag} />
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
    background: white;
`;

export default App;
