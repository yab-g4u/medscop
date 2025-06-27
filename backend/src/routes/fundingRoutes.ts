import express from 'express';
import { createFundingSimulation } from '../controllers/fundingController';

const router = express.Router();

router.post('/simulate', createFundingSimulation);

export default router;
