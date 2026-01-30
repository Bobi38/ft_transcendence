
import './App.css'
import { useState } from 'react'
import Home from './Components/Home/Home.jsx'
import ContactUs from './Components/ContactUs/ContactUs.jsx'
// import Profile from './Components/Profile/Profile.jsx'

export default function App() {
  const [screen, setScreen] = useState('Home')

  const renderScreen = () => {
    switch(screen) {
      case 'ContactUs':
        return <ContactUs changePage={setScreen} />
      default:
        return <Home changePage={setScreen} />
    }
  }

  return (
    <>
      {renderScreen()}
    </>
  )
}