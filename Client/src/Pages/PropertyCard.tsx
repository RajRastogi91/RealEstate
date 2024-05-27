import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
        type: number;
    };

}

const PropertyCard: React.FC<PropertyCardProps> = ({ result }) => {


    return (

        <div className="bg-white my-3 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
            <Link to={`/property/${result.propertyid}`}>
                
                {result.images.length > 0 && (
                    <img
                        src={result.images} 
                        alt={`Property Image 1`}
                        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                    />
                )}

                

            <h2 className="text-lg text-slate-700 px-2 my-2 font-semibold mb-2">{result.title}</h2>
            <p className="text-slate-500 font-semibold px-2 my-2 mb-2">Price: ${result.price}</p>
            <p className="text-gray-700 mb-2"><LocationOnIcon className='text-green-700' />{result.location}</p>
            <p className="text-gray-700 px-2 text-sm mb-2">{result.description}</p>
            <p className="text-gray-700 px-2 my-2 mb-2">Furnished: {result.furnished ? 'Yes' : 'No'}</p>
            
            <Typography>
                <div className='flex px-2 my-2 gap-4'>
                    <p className="text-gray-700 font-bold mb-2">Beds {result.bedroom}</p>
                    <p className="text-gray-700 font-bold mb-2">Baths {result.bathroom}</p>
                </div>
            </Typography>
            {/* <p className="text-gray-700 px-2 my-2">{result.type === 0 ? 'For Sale' : 'For Rent'}</p> */}
            </Link>



        </div>
        
    );
};

export default PropertyCard;
