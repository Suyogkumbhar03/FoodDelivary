import express from 'express';
import { getFeaturedMenuItems } from '../controllers/menuController.js';

const router = express.Router();

router.get('/featured', getFeaturedMenuItems);

export default router;
