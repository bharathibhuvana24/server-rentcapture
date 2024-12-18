import express from 'express';
import { signup, signin, signOut, google, registerAdmin } from '../controllers/auth.controller.js';



const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.post('/signout', signOut);
router.post('/register-admin', registerAdmin);

export default router;