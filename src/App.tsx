import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Search from './components/search/search';

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <main>
        <Routes>
          <Route
            path=''
            Component={Search}
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
