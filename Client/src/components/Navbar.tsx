import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, InputBase, styled, InputAdornment, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";



const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between'
});

const SearchForm = styled('form')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  width: '30%',
  alignItems: 'center'
}));




const Navbar: React.FC = () => {
  const [openSidebar, setOpenSidebar] = useState(false);


  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const currentUser = useSelector((state: any) => state.user.currentUser);

  let decoded: any;
  if (currentUser && currentUser.access_token) {
    decoded = jwtDecode(currentUser.access_token);

  }  
   
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?title=${searchTerm}`);
  };
    



  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('title');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);


   


  return ( 
    <div>
      <AppBar position='sticky'>
        <StyledToolbar className='bg-blue-600'>
          <Link to={'/'}>     
            <Typography> 
              <span className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-White-500'>Square</span>
              <span className='text-black'>Property</span>
              </span>
            </Typography>
          </Link>
          <SearchForm onSubmit={handleSearch}>  
            <InputBase placeholder='Search...' sx={{ ml: 1, flex: 1 }} value={searchTerm} onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)} />
            <InputAdornment position="end">
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          </SearchForm>




          <nav className='flex justify-between items-center'>
            <div>
              <ul className='md:items-center md:gap-8 hidden sm:flex'>
                <li className='hover:transition ease-in transform hover:scale-105'><Link to="/">Home</Link></li>
                <li className='hover:transition ease-in transform hover:scale-105'><Link to="/about">About</Link></li>
                <div className="hidden sm:flex items-center">

                  <Link to="/profile">
                    {currentUser ? (
                      <img
                        className='rounded-full h-7 w-7 object-cover'
                        src={decoded?.photourl}
                        alt='profile'
                      />
                    ) : (
                      <button className="bg-[#87acec] text-white px-5 p-1 rounded-full hover:bg-[#262627] hidden sm:flex">Sign in</button>

                    )}
                  </Link>
                </div>
              </ul>
            </div>
            <div className='md:hidden'>
              <IconButton onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>  
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={openSidebar}
                onClose={toggleSidebar}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem component={Link} to="/about" onClick={toggleSidebar}>About</MenuItem>
                <MenuItem component={Link} to="/profile" onClick={toggleSidebar}>Profile</MenuItem>
                <MenuItem component={Link} to="/signin" onClick={toggleSidebar}>Sign In</MenuItem>
              </Menu>
            </div>
          </nav>
        </StyledToolbar>
      </AppBar>
 

    </div>
  );
};

export default Navbar;
