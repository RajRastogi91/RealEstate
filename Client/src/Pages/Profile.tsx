import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../Redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";


interface FormData {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
 
}


const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null) as React.MutableRefObject<any>;
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState<FormData>({});
  const decodedval: any = jwtDecode(currentUser.access_token);
  const id = decodedval.id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(id);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
 

  let decoded: any;
  if (currentUser && currentUser.access_token) {     
    decoded = jwtDecode(currentUser.access_token);
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("https://newrealestate.onrender.com/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error: any) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `https://newrealestate.onrender.com/listing/getPropertyDetails/${decoded.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (res.status === 404) {
        setShowListingsError(true);
        return;
      }
  
      setUserListings(data);

      navigate('/Listings', { state: { userListings: data } });
    } catch (error) {
      setShowListingsError(true);
    }
  };


  const handleUpdate = async (e: any) => {
    try {
      e.preventDefault();
  
      // Check if at least one field is being updated
      if (!username && !email && !password && !file) {
        alert("Please update at least one field.");
        return;
      }
  
      // Check if any of the fields are empty when there's existing data
      if (decodedval.name && !username) {
        alert("Username cannot be empty.");
        return;
      }
      if (decodedval.email && !email) {
        alert("Email cannot be empty.");
        return;
      }
      if (!password) {
        alert("Password cannot be empty.");
        return;
      }
  
      if (file) {
        // Upload the file
        await handleFileUpload(file);
      }
  
      const updatedFormData = { ...formData, avatar: formData.avatar || decodedval.photourl };
  
      // Perform update logic here, using username, email, password state variables
      // Example: Update API call
      const response = await fetch(
        `https://newrealestate.onrender.com/user/updateUser/${decodedval.id}`,  
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",    
          },
          body: JSON.stringify({ username, email, password, user, ...updatedFormData }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const updatedUser = await response.json();
      console.log(updatedUser);
      // Handle successful update
      alert("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
   
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `https://newrealestate.onrender.com/user/deleteUser/${decoded.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();

      // Dispatch success action if deletion was successful
      dispatch(deleteUserSuccess(data));

      // You may also want to clear user data from the Redux store or redirect to a different page after deletion

      alert("User deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };   


  useEffect(() => {
    if (file) {
      handleFileUpload(file);    
    }
  }, [file]);
   
  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;      
      setFilePerc(Math.round(progress));
    },
    (error: any) => {   
      setfileUploadError(true);
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setformData({ ...formData, avatar: downloadURL });
     });
    }
  );
   
  };


  

  return (
    <div className="p-3 my-8 max-w-lg rounded-lg mx-auto shadow-gray-400 shadow-md">
      <h1 className="text-3xl font-semibold text-center my-7">PROFILE</h1>
      <form className="flex flex-col gap-4">
        <input                                                                                                             
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />      
        <img
          onClick={() => fileRef.current?.click()}      
          src={formData.avatar || decoded?.photourl}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"      
          className="border p-3 rounded-lg"
          defaultValue={decoded.name}   
          onChange={(e) => setUsername(e.target.value)}  
        />  
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={decoded.email}
          onChange={(e) => setEmail(e.target.value)}
        />  
        <input
          type="password"
          placeholder="password"
          id="password"   
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          onClick={handleUpdate}
        >
          Update Profile
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/createlisting"}
        >
          Create Listing    
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer p-2 border hover:rounded-lg hover:bg-red-700 hover:text-white"
        >
          Delete Account
        </span>    
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer p-2 border hover:rounded-lg hover:bg-red-700 hover:text-white">
          Sign out
        </span>
      </div>
  
      <div className="flex justify-between my-3">
        <Link to='/Listings'>
      <button
        onClick={handleShowListings}
        className="text-green-700 border rounded-lg p-2 border-green-700 hover:bg-green-700 hover:text-white hover:border-transparent"
      >
        Show Listings
      </button>
      </Link>
        <Link to="/Orders" className='text-green-700 border rounded-lg p-2 border-green-700 hover:bg-green-700 hover:text-white hover:border-transparent'>Orders</Link>
        
      </div>

   
       
    </div>
  );    
};

export default Profile;
