import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminJobDetails() {
  const { jobId } = useParams();
  console.log(jobId, "......jj");
  const [apps, setApps] = useState([]);

  useEffect(() => {
    async function fetchApplications() {
      const { data, error } = await supabase
        .from('applications')
        .select('id, email, phone, resume_url, applied_at')
        .order('applied_at', { ascending: false })
        .eq('job_id', jobId);

      if (error) {
        console.error('Error fetching applications:', error.message);
      } else {
        setApps(data);
      }
    }

    fetchApplications();
  }, [jobId]);

  return (
    <div>
      <h2>Applicants for Job: {jobId}</h2>
      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {apps.map((a) => (
            <li key={a.id} style={{ marginBottom: '1rem' }}>
              <p><strong>Email:</strong> {a.email}</p>
              <p><strong>Phone:</strong> {a.phone}</p>
              <p><strong>Applied At:</strong> {new Date(a.applied_at).toLocaleString()}</p>
              <a href={a.resume_url} target="_blank" rel="noopener noreferrer">
                📎 Download Resume
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
