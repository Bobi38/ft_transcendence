/* Css */
import './App.css'

/* Components */
import Home from './Components/Home/Home.jsx'
import Navigation from './Components/Navigation/Navigation.jsx'
import Log from './Components/LogRegister/Log/Log.jsx'
import Register from './Components/LogRegister/Register/Register.jsx'
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

          {/* Navigation/page/{sreen} */}
          <Route path="/ContactUs" element={<Navigation screen="ContactUs"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />
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
