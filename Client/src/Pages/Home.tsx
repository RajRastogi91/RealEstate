import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import PropertyCard from "./PropertyCard";
import img from "../Images/Herosec.jpg";

const Home: React.FC = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [searchResults, setSearchResults] = useState([]);
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState("");

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
        setProperties(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterProperties = (type: string) => {
    if (type === "rent") {
      const rentProps = properties.filter((property) => property.rent === 1);
      setSearchResults(rentProps);
    } else if (type === "sell") {
      const sellProps = properties.filter((property) => property.sell === 1);
      setSearchResults(sellProps);
    }
    setView(type);
  };

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-black font-bold text-3xl max-w-4xl lg:text-6xl">
          Find Your Dream Home with Us –<span className="text-blue-700"> Explore, Discover</span>, and Make It Yours
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
        <button
          onClick={() => handleFilterProperties("rent")}
          className="border rounded-lg text-blue-700 w-80 p-2 text-sm sm:text-sm font-bold hover:bg-blue-700 hover:text-white transition ease-in duration-800"
        >
          Rent Property
        </button>
        <button
          onClick={() => handleFilterProperties("sell")}
          className="border rounded-lg text-blue-700 w-80 p-2 text-sm sm:text-sm font-bold hover:bg-blue-700 hover:text-white transition ease-in duration-800"
        >
          Buy Property
        </button>

        {view && (
          <h2 className="text-2xl font-bold text-black">
            {view === "rent" ? "Properties for Rent" : "Properties for Sale"}
          </h2>
        )}

        <div className="flex flex-wrap gap-4">
          {searchResults.map((result: any) => (
            <PropertyCard key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
