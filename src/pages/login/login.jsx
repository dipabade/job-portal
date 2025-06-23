import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';
import { supabase } from '../../supabaseClient';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Authentication failed.");

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error("User profile not found.");

      login(profile.role);
      navigate(profile.role === 'admin' ? '/admin/jobs/list' : '/jobs', { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong during login.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
      </div>
    </div>
  );
}
