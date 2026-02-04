/* Css */
import './App.css'

/* Components */
import Home from './Components/Home/Home.jsx'
import Navigation from './Components/Navigation/Navigation.jsx'
import Log from './Components/LogRegister/Jsx/Log.jsx'
import Register from './Components/LogRegister/Jsx/Register.jsx'
import Truc from './Components/Navigation/Page/Game/Morpion/truc.jsx'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* login base page */}
          <Route path="/" element={<Log />} />
          <Route path="/register" element={<Register />} />
          
          {/* Home */}
          <Route path="/Home" element={<Home />} />
          <Route path="/Truc" element={<Truc />} />


          {/* Navigation/page/{sreen} */}
          <Route path="/ContactUs" element={<Navigation screen="ContactUs"/>} />
          <Route path="/Morpion" element={<Navigation screen="Morpion"/>} />
          {/* <Route path="/Truc" element={<Navigation screen="Truc" />} /> */}
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          {/* <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} /> */}
          <Route path="/*" element={<Navigation screen="ErrorRedir"/>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}














// export default function App() {
  
//   const [screen, setScreen] = useState('Home')

//   const renderScreen = () => {
//     switch(screen) {
//       case 'Home':
//         return <Home changePage={setScreen}/>
//       default:
//         return <Navigation changePage={setScreen} screen={screen} />
//     }
//   }

//   return (
//     <>
//       {renderScreen()}
//     </>
//   )
// }
