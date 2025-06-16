import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobs, setExpandedJobs] = useState({});

  const jobsPerPage = 5;

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skills: [],
    skillsInput: '',
  });

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
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'jobs', id));
      alert('Job deleted successfully.');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job.');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job.id);
    setUpdatedData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      description: job.description || '',
      skills: Array.isArray(job.skills)
        ? job.skills.join(', ')
        : job.skills || '',
    });
  };

  const handleUpdate = async () => {
    const updatedSkillsArray = updatedData.skills
      ? updatedData.skills.split(',').map((skill) => skill.trim())
      : [];
    const docRef = doc(db, 'jobs', editingJob);
    await updateDoc(docRef, { ...updatedData, skills: updatedSkillsArray });
    setEditingJob(null);
    fetchJobs();
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    const jobToAdd = {
      ...newJob,
      skills: newJob.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ''),
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'jobs'), jobToAdd);
    setNewJob({
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      skills: [],
      skillsInput: '', // reset input
    });
    fetchJobs();
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
    <div className='joblist-container'>
      <div className='left-pane'>
        <h2>Job Listings</h2>
        <input
          type='text'
          placeholder='Search by title, company, or location'
          value={search}
          onChange={handleSearch}
          className='search-input'
        />

        {currentJobs.map((job) => (
          <div key={job.id} className='job-card'>
            {editingJob === job.id ? (
              <>
                <input
                  type='text'
                  value={updatedData.title}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, title: e.target.value })
                  }
                />
                <input
                  type='text'
                  value={updatedData.company}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, company: e.target.value })
                  }
                />
                <input
                  type='text'
                  value={updatedData.location}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, location: e.target.value })
                  }
                />
                <input
                  type='text'
                  value={updatedData.salary}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, salary: e.target.value })
                  }
                />
                <input
                  type='text'
                  placeholder='Skills (comma-separated)'
                  value={newJob.skillsInput}
                  onChange={(e) =>
                    setNewJob({ ...newJob, skillsInput: e.target.value })
                  }
                />
                <textarea
                  value={updatedData.description}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      description: e.target.value,
                    })
                  }
                ></textarea>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingJob(null)}>Cancel</button>
              </>
            ) : (
              <>
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
                    >
                      {expandedJobs[job.id] ? 'See less' : 'See more'}
                    </button>
                  )}
                </p>

                <p className='label'>
                  Skills:{' '}
                  <span>
                    {Array.isArray(job.skills) ? job.skills.join(', ') : ''}
                  </span>
                </p>

                <div className='job-actions'>
                  <button onClick={() => handleEdit(job)}>Edit</button>
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        <div className='pagination'>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'active-page' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className='right-pane'>
        <h3>Add New Job</h3>
        <form onSubmit={handleAddJob} className='add-job-form'>
          <input
            type='text'
            placeholder='Title'
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Company'
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Location'
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Salary'
            value={newJob.salary}
            onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Skills (comma-separated)'
            value={newJob.skills}
            onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
          />

          <textarea
            placeholder='Description'
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            required
          />
          <button type='submit'>Add Job</button>
        </form>
      </div>
    </div>
  );
}

export default JobList;
