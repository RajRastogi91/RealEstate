import express from 'express';
import {createlist, getFilterListings, getDetails, getPropertyDetails, getListings, OrderedProperties, deletelisting, updateProperty} from '../Controllers/listing.controller.js';

const router  = express.Router();

router.post('/createlist', createlist);
router.get('/getFilterListings', getFilterListings);
router.get('/getDetails/:id', getDetails)
router.get('/getPropertyDetails/:id', getPropertyDetails)
router.get('/getListings', getListings)
router.get('/OrderedProperties/:id', OrderedProperties)
router.delete('/deletelisting/:id', deletelisting)
router.put('/updateProperty/:id', updateProperty)



export default router;