


export const simulateFunding = async (
  sourceWallet: string,
  destinationWallet: string,
  amount: number
): Promise<{ success: boolean; txHash?: string }> => {
   try {
    const response = await fetch("https://api.masumi.network/testnet/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MASUMI_API_KEY}`
      },
      body: JSON.stringify({
        from: sourceWallet,
        to: destinationWallet,
        amount: amount
      })
    });

    const data = await response.json();

    if (response.ok && data.txHash) {
      return { success: true, txHash: data.txHash };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Masumi simulation error:', error);
    return { success: false };
  }
};

