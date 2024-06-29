import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Typography, Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  result: {
    propertyid: number;
    images: string[0];
    title: string;
    description: string;
    price: number;
    location: string;
    furnished: boolean;
    bedroom: number;
    bathroom: number;
    parking: boolean;
    userid: number;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ result }) => {

  const [isFavorited, setIsFavorited] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


//   const handleFavoriteClick = (event: React.MouseEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsFavorited(!isFavorited);
// };

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
        if (isFavorited) {
            // Remove from favorites
            const response = await fetch('https://newrealestate.onrender.com/favorite/removeFavorite', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: result.userid, propertyid: result.propertyid }),
            });

            if (response.ok) {
                setIsFavorited(false);
                setMessage('Property removed from favorites');
            } else {
                console.error('Error removing property from favorites:', response.statusText);
            }
        } else {
            // Add to favorites
            const response = await fetch('https://newrealestate.onrender.com/favorite/addFavorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: result.userid, propertyid: result.propertyid }),
            });

            if (response.ok) {
                setIsFavorited(true);
                setMessage('Property added to favorites');
            } else {
                console.error('Error adding property to favorites:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Error updating favorites:', error);
    }
};

const handleCloseSnackbar = () => {
    setMessage(null);
};

  return (
    <div className="bg-white my-3 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/property/${result.propertyid}`}>  
        {result.images.length > 0 && (
          <div className="relative">
            <img
              src={result.images}
              alt={`Property Image 1`}
              className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
            />
            <div
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 cursor-pointer"
            >
              {isFavorited ? (
                <FavoriteIcon style={{ fontSize: 25, color: "red" }} />
              ) : (
                <FavoriteBorderOutlinedIcon
                  style={{ fontSize: 25, color: "white" }}
                />
              )}
            </div>
          </div>
        )}

        <h2 className="text-lg text-slate-700 px-2 my-2 font-semibold mb-2">
          {result.title}
        </h2>
        <p className="text-slate-500 font-semibold px-2 my-2 mb-2">
          Price: ${result.price}
          {result.rent === 1 ? "/month" : ""}
        </p>
        <p className="text-gray-700 mb-2">
          <LocationOnIcon className="text-green-700" />
          {result.location}
        </p>
        <p className="text-gray-700 px-2 text-sm mb-2">{result.description}</p>
        <p className="text-gray-700 px-2 my-2 mb-2">
          Furnished: {result.furnished ? "Yes" : "No"}
        </p>

        <Typography>
          <div className="flex px-2 my-2 gap-4">
            <p className="text-gray-700 font-bold mb-2">
              Beds {result.bedroom}
            </p>
            <p className="text-gray-700 font-bold mb-2">
              Baths {result.bathroom}
            </p>
          </div>
        </Typography>

        {/* <p className="text-gray-700 px-2 my-2">{result.type === 0 ? 'For Sale' : 'For Rent'}</p> */}
      </Link>

       {message && (
                <Snackbar open autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success">
                        {message}
                    </Alert>
                </Snackbar>
            )}
    </div>
  );
};

export default PropertyCard;
