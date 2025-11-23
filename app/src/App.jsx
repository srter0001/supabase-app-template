import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Signin from './pages/Signin';
import App from './pages/App';
import Settings from './pages/Settings';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/app" element={<App />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
