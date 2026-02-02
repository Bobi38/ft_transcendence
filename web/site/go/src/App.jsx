
import './App.css'
import Home from './Components/Home/Home.jsx'
import Log from './Components/Log/log/log'
import Register from './Components/Log/register/register'
import Profil from './Components/Profil/Profil.jsx'
import { Routes, Route } from "react-router-dom";

export default function App() {


  return (
    <Routes>
        
        <Route path="/" element={<Log />} />
        <Route path="/log" element={<Log />} />
        <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<HomeMain />} />
        <Route path="profil" element={<Profil />} />
      </Route>
    </Routes>
  )
}
