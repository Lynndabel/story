import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celo, celoAlfajores } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not function properly.",
  );
}

export const config = getDefaultConfig({
  appName: "Celo AI Finance",
  projectId: projectId ?? "missing-project-id",
  chains: [celo, celoAlfajores],
  ssr: true,
});

