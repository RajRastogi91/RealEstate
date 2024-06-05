import { GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import google from '../Images/google.png'

const OAuth: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
             console.log(result);
           const name =result.user.displayName
           const email=result.user.email
           const photoURL=result.user.photoURL
           const uid= result.user.uid

            const res = await fetch('https://newrealestate.onrender.com/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              photo:photoURL,
              googleid:uid

            }),
            
         });
         const data = await res.json();
        //  console.log(data)
         dispatch(signInSuccess(data));
         navigate('/');
        }catch(error){
            console.log('could not sign in with google', error);
        }
    }
  
  return (
   
          <button
            onClick={handleGoogleClick}
            type='button'
            className='bg-transparent text-black p-3 rounded-lg uppercase hover:opacity-95 flex items-center justify-center gap-2'
            style={{ border: '1px solid black' }}
          >
          <img
            src={google}
            alt="Google Logo"
            className="h-7 w-7 object-cover"
          />
          Continue with Google
         </button>
      

  )  
}

export default OAuth
