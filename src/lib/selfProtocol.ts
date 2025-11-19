type VerificationResult = {
  verified: boolean;
  reputation?: number;
  credentials?: unknown;
};

type SelfSDKConstructor = new (config: {
  network: "celo" | "celo-alfajores";
  apiKey: string;
}) => {
  verifyIdentity(
    address: `0x${string}`,
  ): Promise<{
    isVerified?: boolean;
    reputationScore?: number;
    credentials?: unknown;
  }>;
};

let SelfSDK: SelfSDKConstructor | undefined;

async function ensureSDK() {
  if (SelfSDK) {
    return SelfSDK;
  }

  try {
    const imported = await import("@self-protocol/sdk");
    SelfSDK = (imported.SelfSDK ?? imported.default) as SelfSDKConstructor;
  } catch (error) {
    console.error("Failed to load Self Protocol SDK", error);
  }

  return SelfSDK;
}

export async function verifyIdentity(
  address: `0x${string}`,
): Promise<VerificationResult> {
  const sdkClass = await ensureSDK();
  const apiKey = process.env.NEXT_PUBLIC_SELF_API_KEY;

  if (!sdkClass || !apiKey) {
    console.warn("Self Protocol SDK or API Key missing");
    return { verified: false };
  }

  const sdk = new sdkClass({
    network: "celo",
    apiKey,
  });

  try {
    const verification = await sdk.verifyIdentity(address);
    return {
      verified: Boolean(verification?.isVerified),
      reputation: verification?.reputationScore,
      credentials: verification?.credentials,
    };
  } catch (error) {
    console.error("Self Protocol verification failed:", error);
    return { verified: false };
  }
}

