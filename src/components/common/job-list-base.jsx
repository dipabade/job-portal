import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/features/jobs/jobsSlice';
import { supabase } from '../../supabaseClient';
import Grid from '../grid/grid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';


function JobListBase({
  showEdit = false,
  onBack = null,
  enableSearch = false,
  enablePagination = false,
}) {
  const dispatch = useDispatch();
  const jobs = useSelector((s) => s.jobs.list);
  const [filters, setFilters] = useState({});
  const [searchString, setSearchString] = useState('');
    const [appliedIds, setAppliedIds] = useState(new Set());

    

  const navigate = useNavigate();
  const { user } = useAuth();


  const columns = [
    { key: 'title', label: 'Title', editable: showEdit },
    { key: 'company', label: 'Company', editable: showEdit },
    { key: 'location', label: 'Location', editable: showEdit },
    { key: 'salary', label: 'Salary', editable: showEdit },
    { key: 'skills', label: 'Skills', editable: showEdit },
    { key: 'description', label: 'Description', editable: showEdit },
  ];

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
  const fetchApplications = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('applications')
      .select('job_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setAppliedIds(new Set(data.map(app => app.job_id)));
    } else {
      console.error('Failed to fetch applications:', error?.message);
    }
  };

  fetchApplications();
}, [user?.id]); 


  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSaveRow = async (id, payload) => {
    const { error } = await supabase
      .from('jobs')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Update failed:', error.message);
    } else {
      dispatch(fetchJobs());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete failed:', error.message);
    } else {
      dispatch(fetchJobs());
    }
  };

  const handleApply = (job) => {
    navigate(`/jobs/apply/${job.id}`);
  };

  const handleViewApplicants = (job) => {
  navigate(`/admin/jobs/${job.id}/applications`);
};


  const filtered = jobs.filter(
    (job) =>
      Object.entries(filters).every(([k, f]) =>
        String(job[k] || '').toLowerCase().includes(f.toLowerCase())
      ) &&
      (!enableSearch ||
        [job.title, job.company, job.location].some((f) =>
          f.toLowerCase().includes(searchString.toLowerCase())
        ))
  );

  const jobsToDisplay = enablePagination ? filtered.slice(0, 5) : filtered;

  return (
    <div className="joblist-base">
      {onBack && <button onClick={onBack}>Back</button>}
      {enableSearch && (
        <input
          placeholder="Search..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      )}
      <Grid
        rows={jobsToDisplay}
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSaveRow={handleSaveRow}
        onDeleteRow={handleDelete}
        onApplyRow={handleApply}
        onViewApplicants={showEdit ? handleViewApplicants : null}
        showEditActions={showEdit}
        showApplyAction={!showEdit}
        appliedJobIds={appliedIds}
      />
    </div>
  );
}

export default JobListBase;