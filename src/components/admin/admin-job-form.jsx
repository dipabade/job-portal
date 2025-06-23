import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function AddJobForm() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skillsInput: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      // id: uuidv4(),
      title: form.title,
      company: form.company,
      location: form.location,
      salary: form.salary,
      description: form.description,
      skills: form.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      // No need to manually include created_at if your DB sets default
    };

    const { error } = await supabase.from('jobs').insert([jobData]);

    if (error) {
      console.error('Error adding job:', error.message);
      setLoading(false);
      return;
    }

    setForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      skillsInput: '',
    });

    setLoading(false);
     navigate('/admin/jobs/list', { replace: true });
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        placeholder="Title"
        required
        onChange={handleChange}
      />
      <input
        name="company"
        value={form.company}
        placeholder="Company"
        required
        onChange={handleChange}
      />
      <input
        name="location"
        value={form.location}
        placeholder="Location"
        required
        onChange={handleChange}
      />
      <input
        name="salary"
        value={form.salary}
        placeholder="Salary"
        required
        onChange={handleChange}
      />
      <input
        name="skillsInput"
        value={form.skillsInput}
        placeholder="Skills (comma-separated)"
        onChange={handleChange}
      />
      <textarea
        name="description"
        value={form.description}
        placeholder="Description"
        required
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Job'}
      </button>
    </form>
  );
}

export default AddJobForm;
