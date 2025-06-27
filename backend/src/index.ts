
import express from 'express';
import cors from 'cors';
import fundingRoutes from './routes/fundingRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/funding', fundingRoutes);

export default app;
