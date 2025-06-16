// src/components/UserJobList.jsx
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';

function UserJobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobs, setExpandedJobs] = useState({});

  const jobsPerPage = 5;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const jobsQuery = query(
      collection(db, 'jobs'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(jobsQuery);
    const jobData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(jobData);
    setFilteredJobs(jobData);
    setCurrentPage(1); 
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(value) ||
        job.company.toLowerCase().includes(value) ||
        job.location.toLowerCase().includes(value)
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const toggleDescription = (id) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='userjoblist-container' >
      <h2>Job Listings</h2>
      <input
        type='text'
        placeholder='Search by title, company, or location'
        value={search}
        onChange={handleSearch}
        className='search-input'
        
      />

      {currentJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        currentJobs.map((job) => (
          <div key={job.id} className='userjob-card' >
            <h3>{job.title}</h3>
            <p className='meta-line'>
              {job.company} | {job.location} | {job.salary}
            </p>

            <p>
              {expandedJobs[job.id]
                ? job.description
                : job.description.length > 100
                ? `${job.description.slice(0, 100)}...`
                : job.description}
              {job.description.length > 100 && (
                <button
                  onClick={() => toggleDescription(job.id)}
                  className='toggle-description'
                  style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                >
                  {expandedJobs[job.id] ? 'See less' : 'See more'}
                </button>
              )}
            </p>

            <p className='label'>
              Skills: <span>{Array.isArray(job.skills) ? job.skills.join(', ') : ''}</span>
            </p>
          </div>
        ))
      )}

      <div className='pagination' >
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={page === currentPage ? 'active-page' : ''}
            style={{
              margin: '0 0.25rem',
              padding: '0.5rem 1rem',
              background: page === currentPage ? '$color-accent' : '#f0f0f0',
              color: page === currentPage ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserJobList;