import logging
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

logger = logging.getLogger(__name__)

# Define Pydantic Schema for Structured Response from Gemini
class ExecutiveReport(BaseModel):
    executive_summary: str = Field(description="A high-level executive summary of customer sentiment and review trends.")
    key_findings: List[str] = Field(description="3-5 key business findings extracted from the metrics.")
    customer_pain_points: List[str] = Field(description="Customer pain points, particularly referencing categories with issues.")
    recommendations: List[str] = Field(description="Actionable recommendations for product and business teams.")

class GeminiService:
    @staticmethod
    def generate_summary(api_key: str, metrics: dict, model_name: str = "gemini-2.5-flash") -> dict:
        """
        Queries Gemini to generate an executive report using the provided review metrics.
        Returns a dictionary conforming to the ExecutiveReport schema.
        """
        # If API key is missing or not provided, return a simulated premium response
        if not api_key or api_key.strip() == "":
            logger.warning("GEMINI_API_KEY is not configured. Generating a simulated high-quality report...")
            return GeminiService._generate_mock_report(metrics)

        try:
            client = genai.Client(api_key=api_key)
            
            prompt = (
                f"You are an expert product strategist and customer intelligence analyst.\n"
                f"Analyze the following customer reviews analytics and output an executive intelligence report.\n\n"
                f"--- PRODUCT ANALYTICS METRICS ---\n"
                f"- Total Reviews Analyzed: {metrics.get('total_reviews', 0)}\n"
                f"- Sentiment Breakdown: \n"
                f"  * Positive: {metrics.get('positive_reviews', 0)} ({metrics.get('positive_percentage', 0)}%)\n"
                f"  * Negative: {metrics.get('negative_reviews', 0)} ({metrics.get('negative_percentage', 0)}%)\n"
                f"  * Neutral: {metrics.get('neutral_reviews', 0)} ({metrics.get('neutral_percentage', 0)}%)\n"
                f"- Average Sentiment Score: {metrics.get('average_sentiment_score', 0.0)} (VADER Scale: -1.0 to 1.0)\n"
                f"- Top Issue / Complaint Category: {metrics.get('top_issue_category', 'None')}\n"
                f"- Category Distribution: {json.dumps(metrics.get('category_distribution', {}))}\n"
                f"---------------------------------\n\n"
                f"Please compile an Executive Summary, Key Findings, Customer Pain Points, and Actionable Recommendations."
            )
            
            # Call Gemini model requesting structured JSON output
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ExecutiveReport,
                    temperature=0.2
                )
            )
            
            # Parse the generated text back to dictionary
            return json.loads(response.text)
            
        except Exception as e:
            logger.error(f"Failed to generate summary with Gemini API: {e}. Falling back to simulated report.")
            return GeminiService._generate_mock_report(metrics, error_info=str(e))

    @staticmethod
    def _generate_mock_report(metrics: dict, error_info: str = None) -> dict:
        """
        Generates a highly contextual mock report based on the actual metrics provided.
        Helps test the system without requiring active Gemini API credentials.
        """
        top_issue = metrics.get("top_issue_category", "Performance")
        total = metrics.get("total_reviews", 0)
        pos_p = metrics.get("positive_percentage", 0)
        neg_p = metrics.get("negative_percentage", 0)
        
        # Tailor mock details based on metrics
        issue_details = {
            "Battery": {
                "summary": "Customer sentiment is mixed, heavily weighed down by battery endurance issues and slow charging times.",
                "findings": ["Battery degradation complaints constitute a key detractor.", "Charging times are longer than modern market standards."],
                "pain_points": ["Frequent recharging required during workday.", "Product heat generation during fast-charging cycles."],
                "recommendations": ["Optimize firmware battery consumption algorithms.", "Upgrade charging components in the next hardware revision."]
            },
            "Audio": {
                "summary": "While audio response is appreciated, microphone distortion and high-volume clipping are recurring complaints.",
                "findings": ["Mic clarity suffers during calls.", "Speaker output lacks bass and clarity at high volume levels."],
                "pain_points": ["Muffled voice reception reported by call recipients.", "Static crackling sounds at max volume."],
                "recommendations": ["Integrate noise-cancellation DSP profiles.", "Source higher quality speaker drivers for subsequent production batches."]
            },
            "Connectivity": {
                "summary": "Connectivity drops and initial Bluetooth pairing hiccups are significantly affecting user satisfaction scores.",
                "findings": ["Unprompted Bluetooth disconnections occur across multiple devices.", "Re-pairing requires manual factory resets in some cases."],
                "pain_points": ["Frequent dropouts during active calls or music playback.", "Prolonged sync delays with the companion application."],
                "recommendations": ["Release an OTA firmware update to optimize the Bluetooth stack.", "Improve pairing flow instructions within the user manual."]
            },
            "Display": {
                "summary": "The display is visually striking, but outdoor legibility and brightness sensor bugs are main drivers of negative feedback.",
                "findings": ["Peak brightness is insufficient under direct sunlight.", "Auto-brightness adjustment is slow and erratic."],
                "pain_points": ["Screen hard to read during outdoor activities.", "Flickering issues at lower brightness settings."],
                "recommendations": ["Increase peak brightness limit via firmware or hardware adjustment.", "Calibrate the light sensor response curves in the OS."]
            },
            "Delivery": {
                "summary": "Product reviews are generally positive, but fulfillment and transit delays are reducing overall customer experience scores.",
                "findings": ["Delayed shipments are common.", "Retail boxes occasionally arrive with superficial or structural damage."],
                "pain_points": ["Incorrect courier tracking details provided.", "Product arrives after the committed delivery date."],
                "recommendations": ["Negotiate stricter SLAs with courier services.", "Strengthen shipping box packaging materials to prevent transit damage."]
            },
            "Performance": {
                "summary": "Users report interface lag, slow boot-up times, and intermittent software freezes.",
                "findings": ["System memory management leads to app crashes.", "UI transition animations frequently drop frames."],
                "pain_points": ["Lag during quick menu navigation.", "Device UI freezes during background syncing processes."],
                "recommendations": ["Optimize application execution size and run memory profiling audits.", "Disable heavy UI animations on low-spec products."]
            },
            "Other": {
                "summary": "General product satisfaction is stable, but miscellaneous minor defects prevent the product from achieving a top rating.",
                "findings": ["Build materials feel plastic-heavy.", "Instruction manual is missing key feature definitions."],
                "pain_points": ["Product wear and tear occurs quicker than expected.", "Initial onboarding is slightly confusing."],
                "recommendations": ["Enhance initial customer onboarding guides.", "Perform quality control audits on external structural materials."]
            }
        }
        
        details = issue_details.get(top_issue, issue_details["Other"])
        
        # Generalize if no reviews or positive/negative balance
        if total == 0:
            summary = "No reviews available. Seed the database with csv upload or load the demo dataset to view actual summaries."
            findings = ["No feedback records found in the database."]
            pain_points = ["Insufficient customer data to identify product flaws."]
            recommendations = ["Upload customer feedback CSV files to generate actionable insights."]
        else:
            indicator = "healthy" if pos_p > 70 else ("moderate" if pos_p >= 50 else "critical")
            summary = f"Analysis of {total} customer reviews reveals a {indicator} sentiment profile. " + details["summary"]
            findings = [
                f"Overall positive sentiment stands at {pos_p}%, while negative sentiment registers at {neg_p}%.",
                f"VADER average score of {metrics['average_sentiment_score']} shows stable but improvable customer satisfaction.",
                details["findings"][0],
                details["findings"][1]
            ]
            pain_points = [
                f"Issues with the '{top_issue}' category are driving the bulk of customer complaints.",
                details["pain_points"][0],
                details["pain_points"][1]
            ]
            recommendations = [
                f"Prioritize remediation of the '{top_issue}' issues to increase overall NPS/CSAT.",
                details["recommendations"][0],
                details["recommendations"][1],
                "Establish continuous sentiment monitoring to measure the success of updates."
            ]

        # Add simulated prefix or error note
        note = " [Simulated Report - Gemini API Key Not Configured]"
        if error_info:
            note = f" [Simulated Report - Gemini API Call Failed: {error_info[:60]}...]"

        return {
            "executive_summary": summary + note,
            "key_findings": findings,
            "customer_pain_points": pain_points,
            "recommendations": recommendations
        }
