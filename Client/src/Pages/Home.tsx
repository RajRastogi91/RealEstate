import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import PropertyCard from "./PropertyCard";
import img from "../Images/Herosec.jpg";
import Typed from 'typed.js';

const Home: React.FC = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [properties, setProperties] = useState<any[]>([]);
  const el = useRef<HTMLSpanElement>(null);

  let decoded: any;
  if (currentUser && currentUser.access_token) {
    decoded = jwtDecode(currentUser.access_token);
  }     


  useEffect(() => {    
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://newrealestate.onrender.com/listing/getFilterListings"
        );    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProperties(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);


  useEffect(() => {
    const options: Typed.Options = {    
      strings: ["Explore,", "Discover,"],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    };

    // Ensure that el.current is not null
    if (el.current) {
      const typed = new Typed(el.current, options);

      // Cleanup function to destroy the Typed instance when the component unmounts
      return () => {
        typed.destroy();
      };
    }
  }, []);  

  const rentProperties = properties.filter(property => property.rent === 1);
  const saleProperties = properties.filter(property => property.sell === 1);

  return (    
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-black font-bold text-3xl max-w-4xl lg:text-6xl">
          Find Your Dream Home with Us –  <span className="text-blue-700" ref={el}></span><br/> and Make It Yours
          Today!
        </h1>
        <div className="sm:text-sm">
          Explore our diverse range of properties, from cozy apartments in   
          bustling city centers to serene countryside estates and everything in
          between. Whether you're searching for a starter home, an investment
          property, or your forever abode, we have something for everyone.
          <br />
          We have a wide range of properties for you to choose from.     
        </div>  
        <Link
          to={"/search"}
          className="text-blue-700 w-[150px] font-semibold border-2 rounded-lg p-2 border-blue-700 hover:bg-blue-700 hover:text-white hover:border-transparent"
        >
          Explore More...
        </Link>   
      </div>   
      <img
        src={img}
        alt="backgroundimg"
        className="w-full h-[420px] object-cover"      
      ></img>


  <div className="max-w-6xl mx-auto p-3 flex items-center flex-col gap-8 my-10">
        <h2 className="text-2xl font-bold text-black underline">Properties for Rent</h2>
        <div className="flex flex-wrap gap-4">
          {rentProperties.length > 0 ? (
            rentProperties.map((property: any) => (
              <PropertyCard key={property.id} result={property} />
            ))
          ) : (
            <p>No properties available for rent at the moment.</p>   
          )}
        </div>   
        <h2 className="text-2xl font-bold text-black mt-10 underline">Properties for Sale</h2>
        <div className="flex flex-wrap gap-4">
          {saleProperties.length > 0 ? (
            saleProperties.map((property: any) => (
              <PropertyCard key={property.id} result={property} />
            ))
          ) : (
            <p>No properties available for sale at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


