import db from '../Utils/Dbconnections.js';

// API route for add to favorites
export const addFavorite = async (req, res, next) => {
    try {
      const { userid, propertyid } = req.body;
  
      if (!userid || !propertyid) {
        return res.status(400).json({ message: 'User ID and Property ID are required' });
      }
  
      // Query to add the property to favorites
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO favorites (user_id, property_id) VALUES (?, ?)",
          [userid, propertyid],
          (error, result) => {
            if (error) {
              console.error(error);
              reject("Error adding property to favorites");
            } else {
              resolve(result);
            }
          }
        );
      });
  
      res.status(200).json('Property has been added to favorites!');
    } catch (error) {
      next(error);
    }
  };
  

  //API route for remove from favorites
  export const removeFavorite = async (req, res, next) => {
    try {
      const { userid, propertyid } = req.body;
  
      if (!userid || !propertyid) {
        return res.status(400).json({ message: 'User ID and Property ID are required' });
      }
  
      // Query to remove the property from favorites
      const result = await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM favorites WHERE user_id = ? AND property_id = ?",
          [userid, propertyid],
          (error, result) => {
            if (error) {
              console.error(error);
              reject("Error removing property from favorites");
            } else {
              resolve(result);
            }
          }
        );
      });
  
      // Check if any property was removed
      if (result.affectedRows === 0) {
        return next(errorHandler(404, "Favorite not found!"));
      }
  
      res.status(200).json('Property has been removed from favorites!');
    } catch (error) {
      next(error);
    }
  };
  


// API route to fetch favorite properties
export const getFavoriteProperties = async (req, res) => {
  try {
    const userid = req.params.id;

    // Fetch favorite properties for the user
    db.query(
      `SELECT p.*, GROUP_CONCAT(i.imageurl) AS images 
      FROM favorites AS f
      JOIN properties AS p ON f.property_id = p.propertyid
      LEFT JOIN images AS i ON p.propertyid = i.propertyid
      WHERE f.user_id = ?   
      GROUP BY p.propertyid
      ORDER BY f.user_id`,
      [userid],
      async (error, results) => {
        if (error) {
          console.error('Error fetching favorite properties:', error);
          return res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Favorite properties fetched successfully');
          const favoriteProperties = results.map(property => {
            return {
              ...property,
              images: property.images.split(',') // Split images string into an array
            };     
          });

          // Sending response with fetched favorite properties
          res.status(200).json(favoriteProperties);
        }
      }
    );

  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};