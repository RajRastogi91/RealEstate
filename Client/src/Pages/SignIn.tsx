import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { signInStart, signInSuccess, signInFailure } from '../Redux/user/userSlice';


const SignIn: React.FC = () => {
  const navigate = useNavigate() 
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // console.log(formData);

  const { loading, error } = useSelector((state:any) => state.user);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const response = await fetch('https://newrealestate.onrender.com/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.status==200) {
        // Login successful
        dispatch(signInSuccess(data));
        console.log('logged in');
        navigate('/');
      } else {
        // Login failed
        // Display error message to user
        dispatch(signInFailure(data.message));
        console.error('Login failed');
      }
    } catch (error:any) {
      dispatch(signInFailure(error.message));
      console.error('Error:', error);
    }
  };

  

 

  return (

    
    <div className='p-3 max-w-lg my-20 rounded-lg bg-white mx-auto shadow-gray-400 shadow-md'>
    <h1 className='text-3xl text-center uppercase font-semibold my-7'>Sign In</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input
        type='email'
        placeholder='email'
        className='border p-3 rounded-lg'
        id='email'
        onChange={(e)=>setFormData({ ...formData, email: e.target.value })}
        
      />
      <input
        type='password'
        placeholder='password'
        className='border p-3 rounded-lg'
        id='password'
        onChange={(e)=>setFormData({ ...formData, password: e.target.value })}
       
      />

      <button
        disabled={loading}
        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
      >
        {loading ? 'Loading...' : 'Sign In'}
      </button>
      <OAuth/>
    </form>
    <div className='flex justify-center gap-2 mt-5'>
      <p>Dont have an account?</p>
      <Link to={'/signup'}>de
        <span className='text-blue-700'>Sign up</span>
      </Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
  </div>
 

  );
}

export default SignIn;
