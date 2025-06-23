// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/headers/header'; // if using here instead
import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/auth/registration';
import ProtectedRoute from './components/protected-route';
import ManageJobs from './pages/admin/manage-jobs';
import AddJobForm from './components/admin/admin-job-form';
import JobList from './components/admin/job-list';
import AdminJobDetails from './pages/admin/admin-job-details';
import UserJobList from './components/user-job/user-job';
import ApplyPage from './pages/apply-job';
import { useAuth } from './context/auth-provider';

export default function AppRoutes() {
  const { user, role } = useAuth();

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path='/admin/jobs/*' element={<ManageJobs />}>
          <Route index element={<AddJobForm />} />
          <Route path='list' element={<JobList />} />
        </Route>
        <Route path="/admin/jobs/:jobId/applications" element={<AdminJobDetails />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path='/jobs/apply/:jobId' element={<ApplyPage />} />
        <Route path='/jobs' element={<UserJobList />} />
      </Route>

      <Route
        path='*'
        element={
          <Navigate
            to={user ? (role === 'admin' ? '/admin/jobs' : '/jobs') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
