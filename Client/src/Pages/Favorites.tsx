import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import PropertyCard from './PropertyCard';

const Favorites: React.FC = () => {

  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  let decoded: any;
  if (currentUser && currentUser.access_token) {
    decoded = jwtDecode(currentUser.access_token);
  }     

  useEffect(() => {
    const fetchData = async () => {   
        try {
            if (!decoded.id) return;

            const response = await fetch(`https://newrealestate.onrender.com/favorite/getFavoriteProperties/${decoded.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);   
        }
    };
 
    fetchData();
}, [decoded.id]);  


  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-black font-bold text-2xl my-5">
           Your Favorites
        </h1>
      </div>
      <div className='w-full flex flex-wrap justify-center x-3 p-3 gap-3'>  
            {/* Display search results or error message */}   
            {searchResults.length > 0 ? (
                searchResults.map((result: any) => (
                    <PropertyCard key={result.id} result={result} />
                ))
            ) : (
                <h2 className='text-red-500 font-bold text-2xl my-5'>You haven't selected any property to Favorites!</h2>
            )}
         </div>
    </>
  );
};

export default Favorites;
