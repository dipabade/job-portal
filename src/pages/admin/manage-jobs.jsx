import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AddJobForm from '../../components/admin/admin-job-form';
import JobList from '../../components/admin/job-list';

export default function ManageJobs() {
  return (
        <div>
      <h2>Admin Jobs Panel</h2>
      {/* <Routes>
        <Route index element={<AddJobForm />} />
        <Route path="list" element={<JobList />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes> */}
       <Outlet />
    </div>

  );
}
