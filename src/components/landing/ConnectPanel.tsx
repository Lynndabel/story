"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectPanel() {
  return (
    <div className="glass-panel flex flex-col gap-6 p-8 sm:p-10 border border-white/10 relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className="pointer-events-none absolute inset-px rounded-[1.4rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 opacity-40" />
      <div className="relative space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
        Start with your wallet
        </p>
        <h3 className="text-2xl font-semibold">
          Connect Valora, MetaMask, or WalletConnect
        </h3>
        <p className="text-white/70">
          Securely authenticate with Self Protocol
          insights tailored to your Celo activity.
        </p>
      </div>
      <div className="relative mt-4">
        <ConnectButton
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          chainStatus="icon"
          showBalance={{ smallScreen: false, largeScreen: true }}
        />
      </div>
    </div>
  );
}


