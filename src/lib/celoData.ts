import { createPublicClient, formatEther, http } from "viem";
import { celo } from "viem/chains";

export type ChainTransaction = {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: Date;
  isOutgoing: boolean;
  gasUsed: string;
  token: string;
};

export const client = createPublicClient({
  chain: celo,
  transport: http(),
});

export async function getTransactionHistory(
  address: `0x${string}`,
  limit = 100,
): Promise<ChainTransaction[]> {
  const apiKey = process.env.NEXT_PUBLIC_CELOSCAN_API_KEY;

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_CELOSCAN_API_KEY is not set.");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.celoscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
    );
    const data = await response.json();

    if (data.status !== "1") {
      return [];
    }

    return (data.result as Array<Record<string, string>>)
      .slice(0, limit)
      .map((tx) => {
        const value = Number(tx.value) / 1e18;
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value,
          timestamp: new Date(Number(tx.timeStamp) * 1000),
          isOutgoing: tx.from.toLowerCase() === address.toLowerCase(),
          gasUsed: tx.gasUsed,
          token: "CELO",
        };
      });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getTokenBalances(address: `0x${string}`, injectedClient?: any) {
  const usedClient = injectedClient ?? client;
  const celoBalance = await usedClient.getBalance({ address });

  const cUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  const cUSD_ABI = [
    {
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const cUsdBalance = await usedClient.readContract({
    address: cUSD_ADDRESS,
    abi: cUSD_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  return {
    celo: Number(formatEther(celoBalance)),
    cusd: Number(formatEther(cUsdBalance)),
  };
}

