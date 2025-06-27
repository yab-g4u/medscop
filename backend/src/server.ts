import app from './index';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// prisma/schema.prisma
model FundingSimulation {
  id               String   @id @default(cuid())
  disease          String
  region           String
  amount           Float
  sourceWallet     String
  destinationWallet String
  status           String
  transactionHash  String?  
  createdAt        DateTime @default(now())
}
