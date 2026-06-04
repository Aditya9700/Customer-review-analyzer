import { ReviewData, DashboardStats, CategoryFeedback, TrendPoint, AIInsights } from '../types';

/**
 * Computes all statistical aggregates for the reviews list.
 */
export function computeDashboardStats(reviews: ReviewData[]): DashboardStats {
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      averageSentimentScore: 0,
      topIssueCategory: 'None',
      topIssueCount: 0
    };
  }

  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  // Track negative reviews per category to find the top issue area
  const negativeCategoryCounts: Record<string, number> = {};
  const totalCategoryCounts: Record<string, number> = {};

  reviews.forEach(r => {
    totalCategoryCounts[r.category] = (totalCategoryCounts[r.category] || 0) + 1;
    
    if (r.sentiment === 'Positive') {
      positive++;
    } else if (r.sentiment === 'Negative') {
      negative++;
      negativeCategoryCounts[r.category] = (negativeCategoryCounts[r.category] || 0) + 1;
    } else {
      neutral++;
    }
  });

  const positivePercentage = Math.round((positive / totalReviews) * 100);
  const negativePercentage = Math.round((negative / totalReviews) * 100);
  const neutralPercentage = Math.round((neutral / totalReviews) * 100);

  // Compute average score on a 1.0 - 5.0 scale
  // Positive = 5.0, Neutral = 3.0, Negative = 1.5
  const sumScores = reviews.reduce((sum, r) => {
    if (r.sentiment === 'Positive') return sum + 5.0;
    if (r.sentiment === 'Negative') return sum + 1.5;
    return sum + 3.2; // Neutral is a slight positive lean in consumer goods
  }, 0);
  const rawAvg = sumScores / totalReviews;
  const averageSentimentScore = Math.round(rawAvg * 10) / 10; // Round to 1 decimal place

  // Determine top issue category (highest volume of negative reviews)
  let topIssueCategory = 'None';
  let topIssueCount = 0;

  Object.entries(negativeCategoryCounts).forEach(([cat, count]) => {
    if (count > topIssueCount) {
      topIssueCategory = cat;
      topIssueCount = count;
    }
  });

  // If there are no negative reviews, select the category with the most neutrality or the highest volume
  if (topIssueCategory === 'None') {
    let maxCount = 0;
    Object.entries(totalCategoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        topIssueCategory = cat;
        maxCount = count;
      }
    });
  }

  return {
    totalReviews,
    positivePercentage,
    negativePercentage,
    neutralPercentage,
    averageSentimentScore,
    topIssueCategory,
    topIssueCount
  };
}

/**
 * Groups reviews by product categories and computes volume and health scores.
 */
export function computeCategoryFeedback(reviews: ReviewData[]): CategoryFeedback[] {
  const categoryMap: Record<string, { pos: number; neu: number; neg: number; total: number }> = {};

  // Initialize common categories to ensure they display even if empty
  const defaultCategories = ['Battery', 'Connectivity', 'Audio', 'Display', 'Delivery'];
  defaultCategories.forEach(cat => {
    categoryMap[cat] = { pos: 0, neu: 0, neg: 0, total: 0 };
  });

  reviews.forEach(r => {
    if (!categoryMap[r.category]) {
      categoryMap[r.category] = { pos: 0, neu: 0, neg: 0, total: 0 };
    }
    
    categoryMap[r.category].total++;
    if (r.sentiment === 'Positive') categoryMap[r.category].pos++;
    else if (r.sentiment === 'Negative') categoryMap[r.category].neg++;
    else categoryMap[r.category].neu++;
  });

  return Object.entries(categoryMap).map(([category, counts]) => {
    // Health score calculation: Ratio of positive vs negative (neutrals are weighted positively)
    // Formula: (pos + neu*0.3) / total * 100
    let healthScore = 100;
    if (counts.total > 0) {
      const score = ((counts.pos + counts.neu * 0.4) / counts.total) * 100;
      healthScore = Math.min(100, Math.max(0, Math.round(score)));
    }

    return {
      category,
      positiveCount: counts.pos,
      neutralCount: counts.neu,
      negativeCount: counts.neg,
      totalCount: counts.total,
      healthScore
    };
  }).sort((a, b) => b.totalCount - a.totalCount); // sort by volume
}

/**
 * Summarizes monthly sentiment trends for chart visualizations.
 */
export function computeMonthlyTrends(reviews: ReviewData[]): TrendPoint[] {
  const monthlyMap: Record<string, { pos: number; neu: number; neg: number; total: number }> = {};

  reviews.forEach(r => {
    // Extract YYYY-MM from date string
    const month = r.date.substring(0, 7);
    if (!month) return;

    if (!monthlyMap[month]) {
      monthlyMap[month] = { pos: 0, neu: 0, neg: 0, total: 0 };
    }

    monthlyMap[month].total++;
    if (r.sentiment === 'Positive') monthlyMap[month].pos++;
    else if (r.sentiment === 'Negative') monthlyMap[month].neg++;
    else monthlyMap[month].neu++;
  });

  // Convert map to sorted array
  return Object.entries(monthlyMap)
    .map(([month, counts]) => {
      // Format month string into human-readable e.g. "2026-06" -> "Jun 2026" or just "June"
      const date = new Date(month + '-02'); // Add day to prevent timezone shift issues
      const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });

      return {
        month: monthLabel,
        rawMonthStr: month, // keep for sorting
        positive: counts.pos,
        neutral: counts.neu,
        negative: counts.neg,
        total: counts.total
      };
    })
    .sort((a, b) => a.rawMonthStr.localeCompare(b.rawMonthStr))
    .map(({ month, positive, neutral, negative, total }) => ({
      month,
      positive,
      neutral,
      negative,
      total
    }));
}

/**
 * Dynamically synthesizes AI summary and recommendations based on reviews metrics.
 */
export function generateAIInsights(reviews: ReviewData[]): AIInsights {
  const stats = computeDashboardStats(reviews);
  const categories = computeCategoryFeedback(reviews);

  // If no reviews, return default empty insights
  if (reviews.length === 0) {
    return {
      executiveSummary: "No review data available to analyze.",
      keyComplaints: [],
      keyPraises: [],
      recommendations: []
    };
  }

  // Find top positive categories and top negative categories
  const positiveSorted = [...categories].sort((a, b) => {
    const aPosPct = a.positiveCount / (a.totalCount || 1);
    const bPosPct = b.positiveCount / (b.totalCount || 1);
    return bPosPct - aPosPct;
  });

  const negativeSorted = [...categories].sort((a, b) => {
    const aNegPct = a.negativeCount / (a.totalCount || 1);
    const bNegPct = b.negativeCount / (b.totalCount || 1);
    return bNegPct - aNegPct;
  });

  const topPraisedCat = positiveSorted[0]?.category || "Audio";
  const topComplainedCat = stats.topIssueCategory !== 'None' ? stats.topIssueCategory : (negativeSorted[0]?.category || "Connectivity");

  // Executive Summary synthesis
  let executiveSummary = `Customer sentiment remains generally ${
    stats.positivePercentage > 60 ? 'highly positive' : stats.positivePercentage > 45 ? 'moderately positive' : 'critical'
  } with an average satisfaction rating of ${stats.averageSentimentScore}/5.0 based on ${stats.totalReviews} reviews. `;

  if (topPraisedCat === 'Audio') {
    executiveSummary += `Immersive audio quality and sound stage accuracy continue to drive core product satisfaction, representing our greatest consumer strength. `;
  } else if (topPraisedCat === 'Battery') {
    executiveSummary += `Exceptional battery longevity and rapid-charging cycles are highly appreciated by consumers, reducing charging anxiety. `;
  } else if (topPraisedCat === 'Display') {
    executiveSummary += `The high-fidelity OLED display crispness and sunlight readability stand out as highly rated visual metrics. `;
  } else {
    executiveSummary += `Standard product operational features are performing well across major consumer segments. `;
  }

  if (stats.negativePercentage > 20) {
    executiveSummary += `However, product teams should closely monitor emerging issues in the ${topComplainedCat} department, which is generating friction and dragging down overall satisfaction scores.`;
  } else {
    executiveSummary += `The overall defect rate remains low, with minor criticisms localized around ${topComplainedCat}.`;
  }

  // Generate dynamic praises list
  const praises: string[] = [];
  if (topPraisedCat === 'Audio' || reviews.some(r => r.category === 'Audio' && r.sentiment === 'Positive')) {
    praises.push("Rich audio fidelity, punchy sub-bass, and highly effective active noise cancellation (ANC).");
  }
  if (reviews.some(r => r.category === 'Battery' && r.sentiment === 'Positive')) {
    praises.push("Long standby battery runtime (averaging 5-7 days for wearables) and efficient Type-C rapid charging.");
  }
  if (reviews.some(r => r.category === 'Display' && r.sentiment === 'Positive')) {
    praises.push("Vivid color contrast and excellent UI smoothness (60Hz refresh rates) on smartwatch displays.");
  }
  if (reviews.some(r => r.category === 'Delivery' && r.sentiment === 'Positive')) {
    praises.push("Prompt parcel deliveries, securely padded packaging, and transparent shipment notification cycles.");
  }
  if (praises.length < 3) {
    praises.push("Premium aesthetic build materials, tactile button feedback, and intuitive device pairing setup.");
  }

  // Generate dynamic complaints list
  const complaints: string[] = [];
  if (topComplainedCat === 'Connectivity' || reviews.some(r => r.category === 'Connectivity' && r.sentiment === 'Negative')) {
    complaints.push("Bluetooth pairing drops and slow companion app synchronization, particularly on older operating systems.");
  }
  if (reviews.some(r => r.category === 'Battery' && r.sentiment === 'Negative')) {
    complaints.push("High battery drain when GPS tracking is active and weak magnet alignment on smartwatch charging pucks.");
  }
  if (reviews.some(r => r.category === 'Display' && r.sentiment === 'Negative')) {
    complaints.push("Screen scratch vulnerability under normal wear and laggy touch response on curved glass edges.");
  }
  if (reviews.some(r => r.category === 'Delivery' && r.sentiment === 'Negative')) {
    complaints.push("Transit delays with budget carriers, lack of real-time tracking links, and crushed parcel boxes.");
  }
  if (reviews.some(r => r.category === 'Audio' && r.sentiment === 'Negative')) {
    complaints.push("Quiet speaker volumes for calling, microphone muffled voice quality, and subtle pausing static hiss.");
  }
  if (complaints.length < 3) {
    complaints.push("Confusing companion app menu layouts and excessive background permission requests.");
  }

  // Generate Recommendations
  const recommendations: string[] = [];
  if (topComplainedCat === 'Connectivity') {
    recommendations.push("Bluetooth Firmware Patch: Deploy a wireless controller update to optimize pairing state retention and resolve pocket signal attenuation.");
    recommendations.push("App Synchronization: Revamp the background sync scheduler to compress data packets and accelerate sync speed under 10 seconds.");
  } else if (topComplainedCat === 'Battery') {
    recommendations.push("GPS Standby Optimization: Implement auto-dimming and polling throttle features in the OS firmware during heavy GPS sessions.");
    recommendations.push("Connector Redesign: Reinforce the magnetic core structure of the charging dock to avoid user connection slips.");
  } else if (topComplainedCat === 'Audio') {
    recommendations.push("Microphone Noise Filtering: Apply updated digital signal processing (DSP) parameters to reduce background wind noise during call routing.");
    recommendations.push("Calling Audio Boost: Programmatically amplify mid-frequency audio bandwidths specifically on watch speaker phone channels.");
  } else if (topComplainedCat === 'Display') {
    recommendations.push("Glass Durability Upgrade: Transition subsequent product lots to high-resistance Gorilla Glass or add pre-applied screen protective films.");
    recommendations.push("Edge Touch Tuning: Calibrate digitizer sensitivity algorithms to minimize ghost touches or ignored swipe inputs on curved bezel boundaries.");
  } else if (topComplainedCat === 'Delivery') {
    recommendations.push("Logistics Partnership Audit: Discontinue operations with low-tier shipping providers showing high delay and box-crush distributions.");
    recommendations.push("Automated Tracking: Integrate an automated webhook API with shipping platforms to alert customers of delivery milestones.");
  } else {
    recommendations.push("Customer Success Integration: Create a self-service troubleshooting dashboard inside the mobile application to reduce simple support tickets.");
  }

  // Add generic strategic suggestions
  recommendations.push("Value Marketing: Leverage positive feedback regarding battery life and sound quality in upcoming seasonal promotional campaigns.");
  recommendations.push("Defect Monitoring: Set up automated alerts in Jira or GitHub to flag if negative feedback regarding " + topComplainedCat + " increases by over 15% in a single week.");

  return {
    executiveSummary,
    keyComplaints: complaints.slice(0, 3),
    keyPraises: praises.slice(0, 3),
    recommendations: recommendations.slice(0, 3)
  };
}
