import express from 'express';
import { checkAvailability } from '../controllers/availibility.controller.js';
import { getUser } from '../controllers/user.controller.js'; // Import your getUser controller
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.get('/:id', verifyToken, getUser); // Add this route to fetch user details with token verification

export default router;
