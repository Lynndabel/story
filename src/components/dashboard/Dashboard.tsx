"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { ConnectPanel } from "../landing/ConnectPanel";
import { getTransactionHistory, getTokenBalances } from "@/lib/celoData";
import { verifyIdentity } from "@/lib/selfProtocol";
import { generateFinancialInsights } from "@/lib/financialAnalysis";

type DashboardData = {
  identity: Awaited<ReturnType<typeof verifyIdentity>>;
  transactions: Awaited<ReturnType<typeof getTransactionHistory>>;
  balances: Awaited<ReturnType<typeof getTokenBalances>>;
  insights: Awaited<ReturnType<typeof generateFinancialInsights>>;
};

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const isReady = Boolean(isConnected && address);

  const memoizedAddress = useMemo<`0x${string}` | undefined>(() => {
    return address ? (address.toLowerCase() as `0x${string}`) : undefined;
  }, [address]);

  const loadData = useCallback(async () => {
    if (!memoizedAddress) return;

    setLoading(true);
    setError(null);

    try {
      const [identity, transactions, balances] = await Promise.all([
        verifyIdentity(memoizedAddress),
        getTransactionHistory(memoizedAddress),
        getTokenBalances(memoizedAddress),
      ]);

      const insights = await generateFinancialInsights({
        address: memoizedAddress,
        transactions,
        balances,
        reputation: identity.reputation,
      });

      setData({ identity, transactions, balances, insights });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [memoizedAddress]);

  useEffect(() => {
    if (isReady) {
      loadData();
    } else {
      setData(null);
    }
  }, [isReady, loadData]);

  if (!isReady) {
    return (
      <div className="flex flex-1 flex-col gap-10">
        <HeroSection />
        <ConnectPanel />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 py-6">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          Celo x Self Protocol x NoahAI
        </p>
        <h1 className="text-4xl font-semibold text-white lg:text-5xl">
          Your financial command center
        </h1>
        <p className="max-w-2xl text-white/70">
          Identity verified, balances synced, and AI ready to recommend the next
          best financial moves tailored to your Base wallet.
        </p>
      </header>

      {error && (
        <div className="glass-panel border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100 flex items-start gap-3">
          <span className="mt-0.5 h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
          <p className="flex-1 leading-relaxed">{error}</p>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-6 text-white/70 animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-24 rounded-2xl bg-white/10" />
            <div className="h-24 rounded-2xl bg-white/10" />
          </div>
        </div>
      )}

      {data && (
        <section className="glass-panel p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Balances
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <BalanceStat
              label="CELO"
              value={data.balances.celo}
              accent="text-primary"
            />
            <BalanceStat
              label="cUSD"
              value={data.balances.cusd}
              accent="text-accent"
            />
          </div>
        </section>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="space-y-6 max-w-3xl">
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/80 shadow-sm">
        Celo Proof of Ship
      </p>
      <div className="space-y-6">
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          The AI co-pilot for your{" "}
          <span className="text-primary">Celo finances.</span>
        </h1>
        <p className="text-lg text-white/70 sm:text-xl">
          Connect your wallet, verify with Self Protocol, and let NoahAI
          translate raw on-chain activity into clear insights, budgets, and
          savings goals.
        </p>
      </div>
    </section>
  );
}

function BalanceStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform transition-colors duration-200 hover:-translate-y-0.5 hover:border-primary/40">
      <p className="text-sm uppercase tracking-[0.3em] text-white/60">
        {label}
      </p>
      <p className={`mt-2 text-3xl sm:text-4xl font-semibold ${accent}`}>
        {value.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );
}

