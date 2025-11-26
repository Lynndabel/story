"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectPanel() {
  return (
    <div className="glass-panel p-6 sm:p-8 flex flex-col gap-4">
      <p className="text-sm uppercase tracking-[0.3em] text-white/60">
        Start with your wallet
      </p>
      <h3 className="text-2xl font-semibold">
        Connect Valora, MetaMask, or WalletConnect
      </h3>
      <p className="text-white/70">
        Securely authenticate with Self Protocol and unlock NoahAI-powered
        insights tailored to your Celo activity.
      </p>
      <div className="mt-2">
        <ConnectButton
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          chainStatus="icon"
          showBalance={{ smallScreen: false, largeScreen: true }}
        />
      </div>
    </div>
  );
}


