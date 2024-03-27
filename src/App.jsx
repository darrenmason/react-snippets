import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import ToDo from './components/ToDo'
import Form from './components/Form'

function App() {

  return (
    <>
      <Header />
      <Form />
      <ToDo />
    </>
  )
}

export default App
