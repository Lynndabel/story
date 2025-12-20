type NoahAIRequest<TResponse> = {
  path: string;
  payload: Record<string, unknown>;
  parse?: (data: unknown) => TResponse;
};

export type SpendingAnalysis = {
  savingOpportunities?: Record<string, unknown>;
  riskAssessment?: string;
  recommendations?: string[];
};

export type TransactionCategories = {
  categories?: Array<{ name: string; percentage?: number } | string>;
};

export type SpendingPrediction = {
  trend?: string;
  forecast?: Array<{ month: string; value: number }>;
};

export type AdviceResponse = {
  summary?: string;
  actions?: string[];
};

const BASE_URL = "https://api.noahai.com";

async function request<TResponse>({
  path,
  payload,
  parse,
}: NoahAIRequest<TResponse>): Promise<TResponse> {
  const API_KEY = process.env.NEXT_PUBLIC_NOAHAI_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_NOAHAI_API_KEY missing");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`NoahAI request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return parse ? parse(data) : (data as TResponse);
}

export async function analyzeSpending(transactions: unknown[]) {
  return request<SpendingAnalysis>({
    path: "/analyze",
    payload: { transactions, analysisType: "spending_patterns" },
  });
}

export async function categorizeTransactions(transactions: unknown[]) {
  return request<TransactionCategories>({
    path: "/categorize",
    payload: { transactions },
  });
}

export async function predictSpending(data: unknown[]) {
  return request<SpendingPrediction>({
    path: "/predict",
    payload: { data, predictionType: "spending_forecast" },
  });
}

export async function getFinancialAdvice(profile: Record<string, unknown>) {
  return request<AdviceResponse>({
    path: "/advice",
    payload: { userProfile: profile, context: "personal_finance" },
  });
}

