
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    usertype: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    usertype: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Reset validation error message for the field being updated
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('https://newrealestate.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Registration successful
        setSuccessMessage('Registration successful');
      } else {
        // Registration failed
        // Display error message to user
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className='p-3 max-w-lg my-20 rounded-lg bg-white mx-auto shadow-gray-400 shadow-md'>
        <h1 className='text-3xl text-center uppercase font-semibold my-7'>Sign Up</h1>
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Username'
            className='border p-3 rounded-lg'
            id='username'
            name='username' 
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input
            type='password'
            placeholder='Password'
            className='border p-3 rounded-lg'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <select className='border p-3 rounded-lg' name='usertype' value={formData.usertype} onChange={handleChange}>
            <option value='' disabled>Select an usertype option</option>
            <option value='Buyer'>Buyer</option>
            <option value='Seller'>Seller</option>
          </select>

  
          <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Sign Up
          </button>
          <OAuth />
        </form>
        <div className='flex justify-center gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to='/signin'>
            <span className='text-blue-700'>Sign in</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignUp;
