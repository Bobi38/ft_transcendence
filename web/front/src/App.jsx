import './style/index.scss'

/* Components */
import Home from 'SRC/page/Home/Home.jsx'
// import Navigation from 'SRC/page/Navigation/Navigation.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Navigation/page/{sreen} */}
            {/* <Route path="/ContactUs" element={<Navigation screen="ContactUs"/>} />
            <Route path="/WaitRoom" element={<Navigation screen="WaitRoom"/>} />
            <Route path="/MorpionTraining" element={<Navigation screen="MorpionTraining"/>} />
            <Route path="/Nothing" element={<Navigation screen="Nothing"/>} />
            <Route path="/Profile" element={<Navigation screen="Profile"/>} />
            <Route path="/Stats" element={<Navigation screen="Stats"/>} />
            <Route path="/PrivateMessage" element={<Navigation screen="PrivateMessage"/>} /> */}
            <Route path="/*" element={<Home/>} />


          </Routes>
        </BrowserRouter>
    </>
  );
}
