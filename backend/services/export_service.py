import io
import pandas as pd
from typing import List, Dict

class ExportService:
    @staticmethod
    def generate_csv(reviews: List[Dict]) -> io.BytesIO:
        """
        Converts the list of processed review records into a CSV byte stream.
        
        Required Columns:
            - review
            - date
            - product
            - sentiment
            - sentiment_score
            - category
        """
        if not reviews:
            # Return empty CSV with headers
            df = pd.DataFrame(columns=['review', 'date', 'product', 'sentiment', 'sentiment_score', 'category'])
        else:
            df = pd.DataFrame(reviews)
            
        # Target columns for Power BI
        target_columns = ['review', 'date', 'product', 'sentiment', 'sentiment_score', 'category']
        
        # Add any missing target columns with empty values
        for col in target_columns:
            if col not in df.columns:
                df[col] = None
                
        # Slice to ensure correct ordering and selection
        df_export = df[target_columns]
        
        # Write to in-memory bytes buffer
        csv_buffer = io.BytesIO()
        # Convert to CSV and write as bytes using utf-8 encoding
        # Using string mode first to write CSV then encoding, or write directly using to_csv
        # io.BytesIO needs bytes. In pandas, we can pass text wrapper or use path_or_buf as string and encode.
        # Alternatively, we can use to_csv with a StringIO and convert to bytes, or write directly.
        # Let's write to a StringIO first then encode. This is highly portable.
        
        text_buffer = io.StringIO()
        df_export.to_csv(text_buffer, index=False, encoding='utf-8')
        csv_buffer.write(text_buffer.getvalue().encode('utf-8'))
        csv_buffer.seek(0)
        
        return csv_buffer
