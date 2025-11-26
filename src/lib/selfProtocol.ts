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

async function verifyViaRest(address: `0x${string}`): Promise<VerificationResult> {
  const url = process.env.NEXT_PUBLIC_SELF_VERIFY_URL;
  if (!url) {
    return { verified: false };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    if (!res.ok) {
      return { verified: false };
    }

    const data = (await res.json()) as {
      isVerified?: boolean;
      reputationScore?: number;
      credentials?: unknown;
    };

    return {
      verified: Boolean(data?.isVerified),
      reputation: data?.reputationScore,
      credentials: data?.credentials,
    };
  } catch (e) {
    return { verified: false };
  }
}

export async function verifyIdentity(
  address: `0x${string}`,
): Promise<VerificationResult> {
  const sdkClass = await ensureSDK();
  const apiKey = process.env.NEXT_PUBLIC_SELF_API_KEY;

  if (!sdkClass || !apiKey) {
    console.warn("Self Protocol SDK or API Key missing; attempting REST fallback");
    return verifyViaRest(address);
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

