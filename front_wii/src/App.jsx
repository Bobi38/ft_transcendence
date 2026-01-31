import './App.css'

import { useState } from 'react'
import Home from './Components/Home/Home.jsx'
import Navigation from './Components/Navigation/Navigation.jsx'

export default function App() {
  const [screen, setScreen] = useState('Home')

  const renderScreen = () => {
    switch(screen) {
      case 'Home':
        return <Home changePage={setScreen}/>
      default:
        return <Navigation changePage={setScreen} screen={screen} />
    }
  }

  return (
    <>
      {renderScreen()}
    </>
  )
}