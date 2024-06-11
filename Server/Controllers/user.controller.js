import db from '../Utils/Dbconnections.js';
import bcrypt from 'bcrypt';

// Update user profile route

export const updateUser = (req, res, next) => {
  try {
    const id = req.params.id;
    const userid = req.body.user;
    console.log(id, userid);

    // Check if the authenticated user is trying to update their own account
    if (req.body.user !== req.params.id) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }

    // Fetch existing user details  
    const getUserSQL = `
      SELECT * FROM users WHERE userid = ?
    `;
    db.query(getUserSQL, [id], (error, existingUserData) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      const existingUser = existingUserData[0];

      // Validate fields
      const username = req.body.username || existingUser.username;
      const email = req.body.email || existingUser.email;
      const password = req.body.password ? bcrypt.hashSync(req.body.password, 10) : existingUser.password;
      const avatar = req.body.avatar || existingUser.avatar;

      if (!req.body.username && !req.body.email && !req.body.password && !req.body.avatar) {
        return next(errorHandler(400, 'Please update at least one field.'));
      }

      if (existingUser.username && !req.body.username) {
        return next(errorHandler(400, 'Username cannot be empty.'));
      }
      if (existingUser.email && !req.body.email) {
        return next(errorHandler(400, 'Email cannot be empty.'));
      }
      if (!req.body.password) {
        return next(errorHandler(400, 'Password cannot be empty.'));
      }

      // Construct the SQL query
      const sql = `
        UPDATE users 
        SET 
          username = ?,
          email = ?,
          password = ?,
          avatar = ?
        WHERE 
          userid = ?
      `;

      // Execute the SQL query
      db.query(sql, [username, email, password, avatar, id], (error, results) => {
        if (error) {
          console.error(error);
          return next(error);
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
          return next(errorHandler(404, 'User not found'));
        }

        // Fetch the updated user details
        db.query(getUserSQL, [req.params.id], (error, updatedUserData) => {
          if (error) {
            console.error(error);
            return next(error);
          }

          // Exclude password from the response
          const { password, ...rest } = updatedUserData[0];

          // Send updated user details in the response
          res.status(200).json(rest);
        });
      });
    });
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};




// delete User API 

export const deleteUser = async (req, res, next) => {
  try {
    const id=req.params.id;
    const userid = req.body.user;
    // Check if the authenticated user is authorized to delete the user
    if (req.body.user !== req.params.id) {
      // return next(errorHandler(401, 'You can only delete your own account!'));
      console.log("error")
    }

    // Construct the SQL query to delete the user
    const sql = `
      DELETE FROM users
      WHERE userid = ?
    `;

    // Execute the SQL query
    db.query(sql, [req.params.id], (error, results) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return next(errorHandler(404, 'User not found'));
      }

      // Clear any session data or tokens associated with the user
      // Example: Clearing access token from cookies
      res.clearCookie('access_token');

      // Send success response
      res.status(200).json('User has been deleted!');
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};


//

export const getUser = async (req, res, next) => {
  try {
    
    const user = await user.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};