import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import success from '../Images/paymentsuccess.gif'



const Success: React.FC = () => {
    const navigate= useNavigate();

  
    useEffect(() => {
      const insertPaymentRecord = async () => {
          try {
              const queryParams = new URLSearchParams(window.location.search);
              // console.log(window.location.search)
              const session_id = queryParams.get('session_id');
              const property_id = queryParams.get('property_id'); 
              const user_id = queryParams.get('user_id');
              const amount = queryParams.get('amount');
        

              if (!session_id || !property_id || !user_id) {      
                  throw new Error('Missing parameters');
              }

              const response = await fetch(`http://localhost:3000/payment/success?session_id=${session_id}&property_id=${property_id}&user_id=${user_id}&amount=${amount}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              if (response.ok) {
                  console.log('Payment record inserted successfully');
              } else {
                  console.error('Error inserting payment record:', response.statusText);
              }
          } catch (error) {
              console.error('Error:', error);
          }
      };

      insertPaymentRecord();
  }, []);

  return (
    <div className='max-w-lg p-3 mt-[50px] rounded-lg mx-auto shadow-gray-400 shadow-md'>
    <div className='mt-[100px] text-center'>
      <img className='bg-transparent w-[250px] mx-auto' src={success} alt='GIF' />
      <p className='text-[30px] font-semibold text-green-800'>Payment Successful</p>
      <button className='w-full mt-10 h-[45px] rounded-md bg-blue-700 text-white hover:opacity-95' onClick={() => navigate("/")}>Explore More Property</button>
    </div>
  </div>
  
      
  )
}

export default Success
