import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Map from "../components/Map";

const Properties: React.FC = () => {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  let decoded: any;
  if (currentUser && currentUser.access_token) {
    decoded = jwtDecode(currentUser.access_token);
  }

  const [message, setMessage] = useState("");
  const onChange = (e: any) => {
    setMessage(e.target.value);
  };

  const settings = {
    dots: listing?.images?.length > 1,
    infinite: listing?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // Make a request to fetch property details using propertyid
        const res = await fetch(
          `https://newrealestate.onrender.com/listing/getDetails/${id}`
        );
        const data = await res.json();
        if (res.status === 404 || data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const checkout = async () => {
    if (!decoded.id) {
      alert("Login First!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://newrealestate.onrender.com/payment/createsession",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listing: [
              {
                name: listing.title,
                price: listing.price,
                quantity: 1,  
                image: listing.images,
              },
            ],
            user_id: decoded.id,
            property_id: listing.propertyid,
            amount: listing?.price,
          }),
        }
      );
      if (response.ok) {
        const session = await response.json();
        window.location = session;

        // Redirect the user to the checkout session URL
      } else {
        console.error("Error initiating payment:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);  
    }    
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}

      {listing && (
        <div>
          <div>
            <Slider {...settings}>
              {listing.images.map((image: string, index: number) => (
                <div key={index}>
                  <img    
                    className="h-[350px] object-cover"
                    src={image}
                    alt={`Property Image ${index + 1}`}        
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="flex flex-col lg:flex-row justify-evenly items-center my-6">
            <div className="flex flex-col p-3 my-7 gap-4 w-full lg:w-[500px]">
              <h2 className="text-3xl text-slate-700 font-semibold">
                {listing.title}   
              </h2>
              <p className="text-2xl text-slate-700 font-semibold">
                Price: ${listing.price}{listing.rent === 1 ? '/month' : ''}
              </p>
              <p>
                <span className="text-slate-700 font-semibold">
                  Description:{" "}
                </span>
                {listing.description}
              </p>
              <div>
                <div className="flex flex-col sm:flex-row gap-4 my-4">
                  <p className="text-slate-700 font-semibold">
                    <LocationOnIcon className="text-green-700" />
                    {listing.location}
                  </p>
                  <p className="text-slate-700 font-semibold">
                    <LocalParkingIcon className="text-green-700" />
                    {listing.parking ? "Available" : "Not Available"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 my-4">
                  <p className="text-slate-700 font-semibold">
                    Furnished: {listing.furnished ? "Yes" : "No"}      
                  </p>
                  <p className="text-slate-700 font-semibold">
                    Bedrooms: {listing.bedroom}   
                  </p>
                  <p className="text-slate-700 font-semibold">   
                    Bathrooms: {listing.bathroom}
                  </p>
                </div>
                {/* <div className="flex gap-4 my-4">
                  <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    {listing.type === 0 ? "For Sale" : "For Rent"}
                  </p>
                </div> */}    
              </div>
              <div className="flex justify-between mt-4">
                <Link
                  to={`mailto:${decoded.email}?subject=Regarding ${listing.title}&body=${message}`}
                >
                  <button className="bg-blue-700 text-white p-3 rounded-lg hover:opacity-95">
                    Contact Landlord
                  </button>      
                </Link>
                <button
                  className="bg-red-700 w-[100px] text-white p-3 rounded-lg hover:opacity-95"
                  onClick={checkout}
                  disabled={loading} >
                {loading ? 'Buying...' : 'Buy'} 
              
                </button>
              </div>
            </div>
            <div className="w-full lg:w-[650px] p-3 my-7">
              <Map location={listing.location} />
            </div>
          </div>
        </div>
      )}
    </main>
  );   
};

export default Properties;
