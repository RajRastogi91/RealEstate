import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';


const Search : React.FC = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [searchLocation, setSearchLocation] = useState(''); 
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await fetch(`https://newrealestate.onrender.com/listing/getListings/?title=${searchTerm}&location=${searchLocation}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          setSearchResults(data);
          if (data.length === 0) {
            setSearchError('No properties found with the entered details.');
          } else {
            setSearchError('');
          }
          navigate(`/search?title=${searchTerm}&location=${searchLocation}`);
        } catch (error) {
          console.error('Error searching:', error);
          setSearchError('An error occurred while searching for properties.');
        }
      };

      

      useEffect(() => {
    
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('title');
        const locationFromUrl = urlParams.get('location');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
        if (locationFromUrl) {
            setSearchLocation(locationFromUrl);
        }
    }, []);

  return (
    <div className='flex flex-col md:flex-row'> 
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8' onSubmit={handleSearch}>
                <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Property</label>
                <input type="text"
                    id='search'
                    placeholder='search...'
                    className='border rounded-lg p-3 w-full'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}

                />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='all'
                        className='w-5'/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='rent'
                        className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='sell'
                        className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='offer'
                        className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='parking'
                        className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='furnished'
                        className='w-5'/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <label className='font-semibold'>Location:</label>
                    <select id='location'
                    className='border rounded-lg p-3'
                    value={searchLocation}
                    onChange={(e)=>setSearchLocation(e.target.value)}>
                        <option value="">Select location</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mohali">Mohali</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Dehradun">Dehradun</option>
                        <option value="Noida">Noida</option>
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Bengalore">Bengalore</option>
                        <option value="Gujarat">Gujarat</option>
                    </select>
                </div>
                <button type='submit' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-90'>
                    Search
                </button>
            </form>
        </div>
        <div className=''>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Results</h1>
            <div className='flex flex-wrap x-3 p-3 gap-3'>
                {/* Display search results or error message */}
                {searchResults.length === 0 && <p>{searchError}</p>}
                {searchResults.length > 0 && (
                    <>
                    {searchResults.map((result: any) => (
                        <PropertyCard key={result.id} result={result} />
                        // You can display other properties as needed    
                        
                    ))}
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default Search


