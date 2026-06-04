export interface ReviewData {
  id: string;
  reviewText: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  category: 'Battery' | 'Connectivity' | 'Audio' | 'Display' | 'Delivery' | string;
  confidenceScore: number; // Decimal representing percentage (e.g. 0.85 for 85%)
  date: string; // YYYY-MM-DD
  productName?: string; // Optional product name
}

export interface DashboardStats {
  totalReviews: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  averageSentimentScore: number; // 0 to 100 representing positive-to-negative balance, or 1 to 5 scale. Let's make it 1-5 scale, e.g. 4.2/5 or percentage. Let's use 1 to 5 stars/points.
  topIssueCategory: string;
  topIssueCount: number;
}

export interface CategoryFeedback {
  category: string;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalCount: number;
  healthScore: number; // score from 0-100 indicating health based on positive vs negative reviews
}

export interface TrendPoint {
  month: string; // YYYY-MM
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface AIInsights {
  executiveSummary: string;
  keyComplaints: string[];
  keyPraises: string[];
  recommendations: string[];
}
