import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import './index.css';
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Properties from "./Pages/Properties";
import Profile from "./Pages/Profile";
import Listings from "./Pages/Listings";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/UpdateListing";
import PrivateRoute from "./components/PrivateRoute";
import Search from "./Pages/Search";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import Orders from "./Pages/Orders";

const App: React.FC = () => {

  return (
    <>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/property/:id" element={<Properties />} />
          <Route path="/CreateListing" element={<CreateListing />} />
          <Route path="/Listings" element={<Listings />} />
          <Route path="/UpdateListing/:id" element={<UpdateListing />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/Profile" element={<Profile />} />
          </Route>
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Cancel" element={<Cancel />} />
          <Route path="/Orders" element={<Orders />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
