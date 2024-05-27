import React from 'react'
import { useNavigate } from 'react-router-dom'
import failed from '../Images/paymentfailed.gif'

const Cancel: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className='max-w-lg p-3 mt-[100px] rounded-lg mx-auto shadow-gray-400 shadow-md'>
    <div className='mt-[50px] text-center'>
      <img className='bg-transparent w-[250px] mx-auto' src={failed} alt='GIF' />
      <p className='text-[30px] font-semibold text-red-700'>Failed Payment</p>
      <button className='w-full mt-10 h-[45px] rounded-md bg-blue-700 text-white hover:opacity-95' onClick={() => navigate("/")}>Back to Home</button>
    </div>
  </div>
  )
}

export default Cancel
