import React from 'react';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Listings: React.FC = () => {

  const location = useLocation();
  const { userListings } = location.state || { userListings: [] };

  const handleListingDelete = async (id: any) => {
    try {
      const res = await fetch(`https://newrealestate.onrender.com/listing/deletelisting/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.log(data.message);
        return;
      }
      // Optionally, you can update the userListings state here to remove the deleted listing from the UI
    } catch (error) {
      console.log("Error deleting listing:", error);
    }
  };

  return (
    <div className="m-3">
      {userListings.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mt-5">Your Listings</h2>
          <div className="flex flex-wrap mx-2">
            {userListings.map((listing: any, index: number) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <Link to={`/property/${listing.propertyid}`}>
                  <div className="border shadow-md shadow-gray-400 w-full rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                      <div>
                        <button
                          onClick={() => handleListingDelete(listing.propertyid)}
                          className='text-red-700 uppercase mr-2'
                        >
                          Delete
                        </button>
                        <Link to={`/UpdateListing/${listing.propertyid}`}>
                          <button className="text-green-700 uppercase">Edit</button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      {listing.images.map((image: string, idx: number) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Property ${index + 1} image ${idx}`}
                          className="w-32 h-32 object-cover rounded-lg mr-2 mb-2"
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="text-red-500 font-bold text-2xl my-5 text-center">You haven't listed any property yet!</h2>
      )}
    </div>
  );
};

export default Listings;
