import express from 'express';
import { bookDates } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/book', bookDates);

export default router;
