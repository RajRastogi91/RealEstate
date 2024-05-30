import stripe from 'stripe';
import db from "../Utils/Dbconnections.js";

// Initialize Stripe with your secret key
const Stripe = stripe(process.env.STRIPE_SECRET);

export const createsession = async (req, res) => {
  try {

      const { listing, user_id, property_id, amount } = req.body;
      const lineItems = listing.map((listing) => ({
          price_data: {
              currency: "inr",
              product_data: {
                  name: listing.name,
                  images: listing.image
              },
              unit_amount: listing.price * 100,
          },
          quantity: listing.quantity
      }));

      const customer = await Stripe.customers.create({
        name: "Jenny Rosen",
        address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US"
        }
      });

      const session = await Stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,  
          mode: 'payment',
          success_url: `https://squareproperty.netlify.app/#/Success?session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}&amount=${amount}&property_id=${property_id}`,
          cancel_url: "https://squareproperty.netlify.app/#/Cancel",
          customer: customer.id
         
      });

      // console.log('Session created:', session);
      res.status(200).json(session.url);
  } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



  
export const success = async (req, res) => {
    try {
      
      const { session_id, user_id, amount, property_id } = req.query;
      const session = await Stripe.checkout.sessions.retrieve(session_id);
      const paymentid = session.payment_intent;
  
      db.query(
        'INSERT INTO payment (paymentid, user_id, property_id, amount) VALUES (?, ?, ?, ?)',
        [paymentid, user_id, property_id, amount],
        (error, results) => {
          if (error) {
            console.error('Error inserting payment record:', error);
            return res.redirect('http://http://localhost:5173/#/Cancel');
          } else {
            console.log('Payment record inserted successfully', results);
            return res.redirect('http://http://localhost:5173/#/Success');
          }
        }   
      );
  
    } catch (error) {
      console.error('Error retrieving session details from Stripe:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  

