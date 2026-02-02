/* Css */
import './App.css'

/* Components */
import Home from './Components/Home/Home.jsx'
import Navigation from './Components/Navigation/Navigation.jsx'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Navigation/page/{sreen} */}
          <Route path="/ContactUs" element={<Navigation screen="ContactUs"/>} />
          <Route path="/*" element={<Navigation screen="Nothing"/>} />


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
