import React from 'react';
import {render} from 'react-dom';
import reportWebVitals, * as serviceWorker from './reportWebVitals';

import App from './App';

reportWebVitals();

render(
    <App />,
    document.getElementById('app')
);