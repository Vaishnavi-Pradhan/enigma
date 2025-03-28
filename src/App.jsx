import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStyles } from './styles/globalStyles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExamPage from './pages/ExamPage';
import CapturePage from './pages/CapturePage';
import Dashboard from './pages/Dashboard';
import StartExam from './pages/StartExam';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/startexam" element={<StartExam />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;