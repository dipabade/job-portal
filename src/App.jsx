import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import './styles/main.scss';
import Register from './pages/auth/registration';
import Login from './pages/auth/login';
import UserJobList from './components/user-job/user-job';
import ProtectedRoute from './components/protected-route';
import JobList from './components/admin/job-list';


function App() {
  const [registered, setRegistered] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login showRegisterLink={!registered} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register onRegister={() => setRegistered(true)} />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/jobs" element={<JobList />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/jobs" element={<UserJobList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
