import React, { useState } from "react";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register({onRegister}) {
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      role: 'user',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setError('');
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) {
        setError('All fields are required.');
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
  
        await setDoc(doc(db, 'users', user.uid), {
          email: formData.email,
          role: formData.role,
        });
  
        setSuccess('Registration successful!');
        setFormData({ email: '', password: '', role: 'user' });
        onRegister();
        navigate('/login');
        setTimeout(() => {
        navigate("/login?from=register");
      }, 1000);
      } catch (err) {
        setError(err.message);
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
          <input type="email" name="email" required onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" required onChange={handleChange} />

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
