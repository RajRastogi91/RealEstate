import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import db from '../Utils/Dbconnections.js';



// Register user API

export const signup = (req, res) => {  
    const { username, email, password, usertype } = req.body;  
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  
    db.query('INSERT INTO users (username, email, password, usertype) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, usertype], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error registering user');
      } else {
        res.status(200).send('User registered successfully');
      }
    });
  };   


// Sign in API

export const signin = (req, res) => {
    const { email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
      } else {
        if (results.length > 0) {      
          
          const user = results[0];   
        
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) {
            const token = jwt.sign({ id: user.userid, name: user.username, email: user.email, photourl : user.avatar, usertype: user.usertype}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('access_token', token, { httpOnly: true });
            res.status(200).json({ message: 'Login success','access_token':token});
          } else {
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } else {
          res.status(401).json({ message: 'User not found' });
        }
      }
    });
  };
  


//Google OAuth API

export const google = async (req, res, next) => {
    try {
      const { email, name, photo, googleid } = req.body;
  
      // Check if user exists in the database
      db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error signing in');
        } else {
          if (results.length > 0) {
            // User exists, generate token and send response 
            const user = results[0];
            const token = jwt.sign({ id: user.userid, name:user.username, email: user.email, photourl : user.avatar }, process.env.JWT_SECRET);
            const { password, ...rest } = user;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json({"access_token":token});
          } else {
            // User doesn't exist, create a new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const username = name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);
            db.query('INSERT INTO users (username, email, password, avatar, googleid) VALUES (?, ?, ?, ?, ?)', [username, email, hashedPassword, photo, googleid], async (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send('Error registering user'); 
              } else {
                // User registered successfully, generate token and send response
                const userId = results.insertId;
                const token = jwt.sign({ id: userId, username, email, avatar: photo ,googleid }, process.env.JWT_SECRET);
                const newUser = { id: userId, username, email, avatar: photo ,googleid};
                res.cookie('access_token', token, { httpOnly: true }).status(200).json({"access_token":token});
                console.log('User registered successfully via Google OAuth');
              }
            });
          }
        }
      });
    } catch (error) {
      // console.error(error);
      // res.status(500).send('Error signing in');
      next(error);
    }
  };

  




// Sign out API: 
export const signout = async (req, res, next) => {
    try {
      // Clear the access token cookie
      res.clearCookie('access_token');
  
      // Send a response indicating successful sign-out
      res.status(200).json({ message: 'User has been logged out!' });
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };
  