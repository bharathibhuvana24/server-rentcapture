import express from 'express';
import { createTemporaryAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/create-temp-admin', createTemporaryAdmin); // Temporary route

export default router;
