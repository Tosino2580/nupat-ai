/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 14:33:08
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
