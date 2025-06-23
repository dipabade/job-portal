import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      const user = authData.user;
      if (!user?.id) throw new Error("Signup succeeded, but no user ID returned.");

      const { error: dbError } = await supabase.from("users").insert([{ id: user.id, email, role }]);
      if (dbError) throw new Error("Failed to store role in database.");

      setSuccess("Registration successful!");
      setFormData({ email: '', password: '', role: 'user' });

      setTimeout(() => {
        navigate("/login?from=register");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;