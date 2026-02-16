/* Css */
import './App.css'

/* Components */
import Home from './Components/Home/Home.jsx'
import Navigation from './Components/Navigation/Navigation.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />




          {/* Navigation/page/{sreen} */}
          <Route path="/ContactUs" element={<Navigation screen="ContactUs"/>} />
          <Route path="/WaitRoom" element={<Navigation screen="WaitRoom"/>} />
          <Route path="/Qrcode" element={<Navigation screen="Qrcode"/>} />
          <Route path="/Morpion" element={<Navigation screen="Morpion"/>} />
          <Route path="/Nothing" element={<Navigation screen="Nothing"/>} />
          <Route path="/Profile" element={<Navigation screen="Profile"/>} />
          <Route path="/Stats" element={<Navigation screen="Stats"/>} />
          <Route path="/WaitRoom" element={<Navigation screen="WaitRoom"/>} />

          <Route path="/*" element={<Navigation screen="ErrorRedir"/>} />




        </Routes>
      </BrowserRouter>
    </>
  );
}

