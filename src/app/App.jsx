import React  from 'react';
import Home from "./home"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/us" element={<h1> Lucca </h1>} />
            </Routes>
        </BrowserRouter>
    )
}