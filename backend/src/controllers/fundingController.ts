
import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { simulateFunding } from '../utils/masumiUtils';

export const createFundingSimulation = async (req: Request, res: Response) => {
  try {
    const { disease, region, amount, sourceWallet, destinationWallet } = req.body;

    const simulation = await prisma.fundingSimulation.create({
      data: {
        disease,
        region,
        amount,
        sourceWallet,
        destinationWallet,
        status: 'pending',
      },
    });

    const result = await simulateFunding(sourceWallet, destinationWallet, amount);

    await prisma.fundingSimulation.update({
      where: { id: simulation.id },
      data: { status: result.success ? 'completed' : 'failed', transactionHash: result.txHash },
    });

    res.status(200).json({ success: true, simulationId: simulation.id, txHash: result.txHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
