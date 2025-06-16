import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

function Login({ showRegisterLink }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { user } = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

const userDoc = await getDoc(doc(db, 'users', user.uid));
    const role = userDoc.data()?.role;

    if (role === 'admin') {
      navigate('/admin/jobs');
    } else if (role === 'user') {
      navigate('/jobs');
    } else {
      setError('User role not recognized.');
    }
  } catch (error) {
    setError('Invalid credentials. Please try again.');
  }
};


  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type='email' name='email' required onChange={handleChange} />

          <label>Password</label>
          <input
            type='password'
            name='password'
            required
            onChange={handleChange}
          />

          <button type='submit'>Login</button>
        </form>

        {showRegisterLink && (
          <p>
            Don't have an account?{' '}
            <span
              onClick={handleRegisterClick}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              Create Account
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
