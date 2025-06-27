
import prisma from '../src/prisma/client';

async function main() {
  await prisma.fundingSimulation.create({
    data: {
      disease: 'Cholera',
      region: 'West Region',
      amount: 1500,
      sourceWallet: 'source_dummy_wallet',
      destinationWallet: 'destination_dummy_wallet',
      status: 'completed',
      transactionHash: 'tx_123456',
    },
  });
  console.log('✅ Seeded funding simulation data');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
