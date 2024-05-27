import express from 'express';
import {updateUser, deleteUser, getUser} from '../Controllers/user.controller.js';

const router = express.Router();

router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.get('getUser/:id', getUser);

export default router;