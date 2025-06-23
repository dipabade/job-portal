import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/auth-provider';

export default function ApplyPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', phone: '', resume: null });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resume || !form.email || !form.phone) {
      return alert('All fields are required.');
    }

    setStatus('Uploading...');

    const fileExt = form.resume.name.split('.').pop();
    const filePath = `${jobId}_${user.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, form.resume);

    if (uploadError) {
      setStatus('Upload failed.');
      console.error(uploadError.message);
      return;
    }

    const { data: urlData } = await supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // 🧼 Clean up any double slashes in the URL
    const cleanedUrl = urlData.publicUrl.replace(
      'storage/v1/object/public/resumes//',
      'storage/v1/object/public/resumes/'
    );

    const { error: dbError } = await supabase
      .from('applications')
      .upsert({
        job_id: jobId,
        user_id: user.id,
        email: form.email,
        phone: form.phone,
        resume_url: cleanedUrl,
        applied_at: new Date().toISOString()
      });

    if (dbError) {
      setStatus('Failed to save application.');
      console.error(dbError.message);
      return;
    }

    setStatus('Applied successfully!');
    setForm({ email: '', phone: '', resume: null });

    setTimeout(() => {
      navigate('/jobs');
    }, 1500);
  };

  return (
    <div className="apply-page">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          required
          onChange={handleChange}
        />

        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          required
          onChange={handleChange}
        />

        <label>Resume (PDF/DOC):</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          onChange={handleChange}
        />

        <button type="submit">Submit Application</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
