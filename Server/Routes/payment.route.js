import express from 'express';
import { createsession, success } from '../Controllers/payment.controller.js';


const router = express.Router();
 
router.post('/createsession',createsession);
router.post('/success',success);

export default router;