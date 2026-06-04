import { ReviewData } from '../types';

/**
 * Parses a CSV string into a list of objects, respecting double quotes and commas within cells.
 */
export function parseCSV(csvText: string): ReviewData[] {
  const lines: string[][] = [];
  let row: string[] = [];
  let insideQuote = false;
  let currentToken = '';

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        // Escaped quote: "" becomes "
        currentToken += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n of \r\n
      }
      row.push(currentToken.trim());
      if (row.length > 0 && row.some(cell => cell !== '')) {
        lines.push(row);
      }
      row = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  
  if (currentToken !== '' || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some(cell => cell !== '')) {
      lines.push(row);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.toLowerCase().trim());
  const dataRows = lines.slice(1);

  // Column mapping helper
  const findColumnIndex = (keys: string[]): number => {
    return headers.findIndex(header => keys.some(key => header.includes(key) || key.includes(header)));
  };

  const reviewIdx = findColumnIndex(['review', 'text', 'content', 'comment', 'body', 'feedback']);
  const sentimentIdx = findColumnIndex(['sentiment', 'polarity', 'feeling', 'sentiment_label']);
  const categoryIdx = findColumnIndex(['category', 'topic', 'department', 'tag', 'component']);
  const confidenceIdx = findColumnIndex(['confidence', 'score', 'probability', 'conf']);
  const dateIdx = findColumnIndex(['date', 'time', 'timestamp', 'created']);
  const productIdx = findColumnIndex(['product', 'item', 'device']);

  return dataRows.map((cols, index) => {
    // Fill array elements with empty string if CSV line was too short
    const getVal = (idx: number): string => (idx !== -1 && idx < cols.length ? cols[idx] : '');

    const rawReview = getVal(reviewIdx) || 'No review text provided.';
    
    // Normalize Sentiment
    let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    const rawSent = getVal(sentimentIdx).toLowerCase();
    if (rawSent.startsWith('pos') || rawSent.includes('good') || rawSent.includes('like') || rawSent === '1' || rawSent === 'positive') {
      sentiment = 'Positive';
    } else if (rawSent.startsWith('neg') || rawSent.includes('bad') || rawSent.includes('hate') || rawSent === '-1' || rawSent === 'negative') {
      sentiment = 'Negative';
    } else if (rawSent.startsWith('neu') || rawSent === '0' || rawSent === 'neutral') {
      sentiment = 'Neutral';
    } else {
      // Fallback sentiment classifier by keyword heuristics if not specified
      const positiveKeywords = ['great', 'excellent', 'good', 'love', 'amazing', 'perfect', 'nice', 'awesome', 'best', 'satisfied'];
      const negativeKeywords = ['bad', 'terrible', 'worst', 'poor', 'defect', 'fail', 'hate', 'broke', 'useless', 'disconnect', 'waste'];
      let posCount = 0;
      let negCount = 0;
      const lowerText = rawReview.toLowerCase();
      positiveKeywords.forEach(k => { if (lowerText.includes(k)) posCount++; });
      negativeKeywords.forEach(k => { if (lowerText.includes(k)) negCount++; });

      if (posCount > negCount) sentiment = 'Positive';
      else if (negCount > posCount) sentiment = 'Negative';
    }

    // Normalize Category
    let rawCategory = getVal(categoryIdx);
    let category = 'Other';
    if (rawCategory) {
      // Standardize to common categories if possible
      const lowerCat = rawCategory.toLowerCase();
      if (lowerCat.includes('batt') || lowerCat.includes('power') || lowerCat.includes('charg')) {
        category = 'Battery';
      } else if (lowerCat.includes('connect') || lowerCat.includes('bluetooth') || lowerCat.includes('pair') || lowerCat.includes('bt')) {
        category = 'Connectivity';
      } else if (lowerCat.includes('audio') || lowerCat.includes('sound') || lowerCat.includes('mic') || lowerCat.includes('volume') || lowerCat.includes('music')) {
        category = 'Audio';
      } else if (lowerCat.includes('disp') || lowerCat.includes('screen') || lowerCat.includes('touch') || lowerCat.includes('watchface')) {
        category = 'Display';
      } else if (lowerCat.includes('deliv') || lowerCat.includes('ship') || lowerCat.includes('pack')) {
        category = 'Delivery';
      } else {
        // Capitalize first letter of their custom category
        category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();
      }
    } else {
      // Guess category from review text keywords
      const textLower = rawReview.toLowerCase();
      if (textLower.includes('battery') || textLower.includes('charge') || textLower.includes('charging') || textLower.includes('duration') || textLower.includes('runtime')) {
        category = 'Battery';
      } else if (textLower.includes('bluetooth') || textLower.includes('connect') || textLower.includes('pairing') || textLower.includes('wifi') || textLower.includes('pair')) {
        category = 'Connectivity';
      } else if (textLower.includes('audio') || textLower.includes('sound') || textLower.includes('volume') || textLower.includes('bass') || textLower.includes('music') || textLower.includes('mic')) {
        category = 'Audio';
      } else if (textLower.includes('screen') || textLower.includes('display') || textLower.includes('touch') || textLower.includes('brightness') || textLower.includes('dial')) {
        category = 'Display';
      } else if (textLower.includes('deliver') || textLower.includes('shipping') || textLower.includes('package') || textLower.includes('ordered') || textLower.includes('arrived')) {
        category = 'Delivery';
      }
    }

    // Normalize Confidence Score
    let confidenceScore = 0.8; // default
    const rawConf = getVal(confidenceIdx);
    if (rawConf) {
      const cleanConf = rawConf.replace('%', '').trim();
      const num = parseFloat(cleanConf);
      if (!isNaN(num)) {
        confidenceScore = num > 1 ? num / 100 : num;
      }
    } else {
      // Mock score based on length of review and sentiment
      confidenceScore = 0.7 + (Math.sin(index) * 0.2 + 0.1);
    }
    // Cap score
    confidenceScore = Math.max(0.1, Math.min(1.0, confidenceScore));

    // Normalize Date
    let date = getVal(dateIdx);
    if (!date) {
      // Pick a random date in the last 6 months
      const today = new Date();
      const past = new Date(today.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
      date = past.toISOString().split('T')[0];
    } else {
      // Parse and format to YYYY-MM-DD
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
        } else {
          // Fallback if Date is unrecognized
          date = new Date().toISOString().split('T')[0];
        }
      } catch {
        date = new Date().toISOString().split('T')[0];
      }
    }

    const productName = getVal(productIdx) || undefined;

    return {
      id: `review-${index}-${Math.floor(Math.random() * 10000)}`,
      reviewText: rawReview,
      sentiment,
      category,
      confidenceScore,
      date,
      productName,
    };
  });
}
