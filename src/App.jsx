import './App.css'
import Header from './components/Header'
import ToDo from './components/ToDo'
import Form from './components/Form'
import Snippets from './components/Snippets'

function App() {

  return (
    <div className="app">
      <Header />
      <section className="snippet">
        <h2>Basics</h2>
        <div className="stack">
          <Form />
          <ToDo />
        </div>
      </section>
      <Snippets />
    </div>
  )
}

export default App
