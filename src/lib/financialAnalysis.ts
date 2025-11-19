import {
  analyzeSpending,
  categorizeTransactions,
  getFinancialAdvice,
  predictSpending,
  SpendingAnalysis,
  TransactionCategories,
  SpendingPrediction,
} from "./noahAI";
import { ChainTransaction } from "./celoData";

export async function generateFinancialInsights({
  address,
  transactions,
  balances,
  reputation,
}: {
  address: `0x${string}`;
  transactions: ChainTransaction[];
  balances: Record<string, number>;
  reputation?: number;
}) {
  const userProfile = {
    address,
    transactionCount: transactions.length,
    balances,
    reputationScore: reputation,
    averageTransactionValue: calculateAverage(transactions),
    mostActiveDay: findMostActiveDay(transactions),
    totalSpent: calculateTotalSpent(transactions),
    totalReceived: calculateTotalReceived(transactions),
  };

  const [spending, categories, predictions, advice] = await Promise.all([
    analyzeSpending(transactions),
    categorizeTransactions(transactions),
    predictSpending(transactions),
    getFinancialAdvice(userProfile),
  ]);

  return {
    spendingAnalysis: spending,
    categories,
    predictions,
    advice,
    insights: generateInsights(spending, categories, predictions),
  };
}

function generateInsights(
  spending: SpendingAnalysis,
  categories: TransactionCategories,
  predictions: SpendingPrediction,
) {
  return {
    topSpendingCategory: categories?.categories?.[0],
    savingsPotential: spending?.savingOpportunities,
    riskLevel: spending?.riskAssessment,
    monthlyTrend: predictions?.trend,
    recommendations: spending?.recommendations,
  };
}

function calculateAverage(txs: ChainTransaction[]) {
  if (!txs.length) return 0;
  return txs.reduce((sum, tx) => sum + tx.value, 0) / txs.length;
}

function calculateTotalSpent(txs: ChainTransaction[]) {
  return txs
    .filter((tx) => tx.isOutgoing)
    .reduce((sum, tx) => sum + tx.value, 0);
}

function calculateTotalReceived(txs: ChainTransaction[]) {
  return txs
    .filter((tx) => !tx.isOutgoing)
    .reduce((sum, tx) => sum + tx.value, 0);
}

function findMostActiveDay(txs: ChainTransaction[]) {
  const days = new Map<string, number>();

  txs.forEach((tx) => {
    const day = tx.timestamp.toDateString();
    days.set(day, (days.get(day) ?? 0) + 1);
  });

  return [...days.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

