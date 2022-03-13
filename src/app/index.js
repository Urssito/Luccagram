import React from 'react';
import {render} from 'react-dom';
import A from './a'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from './App';

render(
    <App />,
    document.getElementById('react-root')
);