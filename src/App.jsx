import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthPage from './components/AuthPage'; // <-- Import AuthPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All authentication (login + register switching) */}
        <Route path="/" element={<AuthPage />} />
        {/* After login */}
        <Route path="/home-page" element={<MainPage />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
