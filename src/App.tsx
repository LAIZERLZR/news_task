import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import HomePage from './Components/Pages/HomePage';
import News from './Components/Pages/News';

function App() {
  return (
    <div className="App">
      <Header />
      <div> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<News />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
