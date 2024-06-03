import db from "../Utils/Dbconnections.js";
import { errorHandler } from "../Utils/error.js";

// Create Property API

export const createlist = (req, res) => {
  try {
    const {
      title,
      description,
      location,
      sell,
      rent,
      parking,
      furnished,
      bedroom,
      bathroom,
      price,
      userid,
      images,
    } = req.body;
    console.log(req.body);
    // Insert property into the database
    db.query(
      "INSERT INTO properties (title, description, location, sell, rent, parking, furnished, bedroom, bathroom, price, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        location,
        sell,
        rent,
        parking,
        furnished,
        bedroom,
        bathroom,
        price,
        userid,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: "Error creating property" });
        } else {
          const propertyid = results.insertId;
          // Insert images into the property_images table
          if (images && images.length > 0) {
            const imageValues = images.map((imageUrl) => [
              propertyid,
              imageUrl,
            ]);
            db.query(
              "INSERT INTO images (propertyid, imageurl) VALUES ?",
              [imageValues],
              (imageError, imageResults) => {
                if (imageError) {
                  console.error(imageError);
                  res
                    .status(500)
                    .json({ message: "Error adding property images" });
                } else {
                  res
                    .status(201)
                    .json({ message: "Property created successfully", propertyid });
                }
              }
            );
          } else {
            res.status(201).json({ message: "Property created successfully", propertyid });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating property" });
  }
};

// GET listings for rent and sell

export const getFilterListings = async (req, res) => {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(`
        SELECT p.*, GROUP_CONCAT(i.imageurl) AS images
        FROM properties p
        LEFT JOIN images i ON p.propertyid = i.propertyid
        GROUP BY p.propertyid
      `, (error, results) => {
        if (error) {
          console.error(error);
          reject("Error in fetching property data");
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error || "An unknown error occurred" });
  }
};






// GET property details API

export const getPropertyDetails = async (req, res) => {
  try {
    const userid = req.params.id;

    // Query to fetch property details from the database
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM properties WHERE userid = ?",
        [userid],
        (error, results) => {
          if (error) {
            console.error(error);
            reject("Error fetching property details");
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "Properties not found" });
    }

    // Array to store details of all properties
    const allProperties = [];

    // Loop through each property to fetch associated images
    for (const property of results) {
      const propertyDetails = { ...property };

      // Query to fetch images associated with the property
      const imageResults = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM images WHERE propertyid = ?",
          [property.propertyid],
          (error, results) => {
            if (error) {
              console.error(error);
              reject("Error fetching property images");
            } else {
              resolve(results);
            }
          }
        );
      });

      const propertyImages = imageResults.map((image) => image.imageurl);
      propertyDetails.images = propertyImages;

      // Push property details with images to the array
      allProperties.push(propertyDetails);
    }

    res.status(200).json(allProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};




export const getDetails = async (req, res) => {
  try {
    const propertyid = req.params.id;

    // Query to fetch property details from the database
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM properties WHERE propertyid = ?",
        [propertyid],
        (error, results) => {
          if (error) {
            console.error(error);
            reject("Error fetching property details");
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "Properties not found" });
    }

    // Array to store details of all properties
    const allProperties = [];

    // Loop through each property to fetch associated images
    for (const property of results) {
      const propertyDetails = { ...property };

      // Query to fetch images associated with the property
      const imageResults = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM images WHERE propertyid = ?", 
          [property.propertyid],
          (error, results) => {
            if (error) {
              console.error(error);
              reject("Error fetching property images");
            } else {
              resolve(results);
            }
          }
        );
      });

      const propertyImages = imageResults.map((image) => image.imageurl);
      propertyDetails.images = propertyImages;

      // Push property details with images to the array
      allProperties.push(propertyDetails);
    }

    res.status(200).json(allProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};




// search property with title & location api 

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.title || "";
    const searchLocation = req.query.location || "";

    const sql = `
    SELECT p.*, GROUP_CONCAT(i.imageurl) AS images
    FROM properties p
    LEFT JOIN images i ON p.propertyid = i.propertyid
    WHERE p.title LIKE ? AND p.location LIKE ?
    GROUP BY p.propertyid
    LIMIT ? OFFSET ?;
      `;


    const values = [`%${searchTerm}%`,`%${searchLocation}`, limit, startIndex];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    next(error);
  }
};


// get ordered property list API


export const OrderedProperties = async (req, res) => {
  try {
    const userid = req.params.id;

    // Fetch property data ordered by user from the payment table
    db.query(
      `SELECT p.*, GROUP_CONCAT(i.imageurl) AS images 
      FROM payment AS py
      JOIN properties AS p ON py.property_id = p.propertyid
      LEFT JOIN images AS i ON p.propertyid = i.propertyid
      WHERE py.user_id = ?   
      GROUP BY p.propertyid
      ORDER BY py.user_id`,
      [userid],
      async (error, results) => {
        if (error) {
          console.error('Error fetching property data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Property data fetched successfully');
          const propertyData = results.map(property => {
            return {
              ...property,
              images: property.images.split(',') // Split images string into an array
            };
          });

          // Sending response with fetched property data
          res.status(200).json(propertyData);
        }
      }
    );

  } catch (error) {
    console.error('Error fetching property data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// delete property list from profile section api 


export const deletelisting = async (req, res, next) => {
  try {
    const propertyid = req.params.id;

    // Query to delete the property from the database
    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM properties WHERE propertyid = ?",
        [propertyid],
        (error, result) => {
          if (error) {
            console.error(error);
            reject("Error deleting property");
          } else {
            resolve(result);
          }
        }
      );
    });

    // Check if any property was deleted
    if (result.affectedRows === 0) {
      return next(errorHandler(404, "Property not found!"));
    }

    res.status(200).json('Property has been deleted!');
  } catch (error) {
    next(error);
  }
};



// update the property list from the profile section

export const updateProperty = (req, res, next) => {
  try {
    const propertyid = req.params.id;
    const userid = req.body.userid; 
    console.log(propertyid, userid);

 
    const { title, description, location, sell, rent, parking, furnished, bedroom, bathroom, price } = req.body;

    // Construct the SQL query
    const sql = `
      UPDATE properties 
      SET 
        title = ?,
        description = ?,
        location = ?,
        sell = ?,
        rent = ?,
        parking = ?,
        furnished = ?,
        bedroom = ?,
        bathroom = ?,
        price = ?
      WHERE 
        propertyid = ? AND userid = ?
    `;

    // Execute the SQL query
    db.query(sql, [title, description, location, sell, rent, parking, furnished, bedroom, bathroom, price, propertyid, userid], (error, results) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return next(errorHandler(404, 'Property not found or unauthorized to update'));
      }
   
      // Fetch the updated property details
      const getPropertySQL = `
        SELECT * FROM properties WHERE propertyid = ?
      `;
      db.query(getPropertySQL, [propertyid], (error, updatedPropertyData) => {
        if (error) {
          console.error(error);
          return next(error);
        }

        // Send updated property details in the response
        res.status(200).json(updatedPropertyData[0]);
      });
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

  