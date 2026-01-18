import unittest
from unittest.mock import patch, MagicMock
import json
import os
from logic.scorer import analyze_content, _build_ticket_prompt, _build_business_prompt


class TestScorer(unittest.TestCase):

    def setUp(self):
        # Mock environment variables
        self.mock_api_key = "test_api_key"
        self.mock_model = "gemini-1.5-flash"
        os.environ["GEMINI_API_KEY"] = self.mock_api_key
        os.environ["GEMINI_MODEL"] = self.mock_model

    def tearDown(self):
        # Clean up environment variables
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        if "GEMINI_MODEL" in os.environ:
            del os.environ["GEMINI_MODEL"]

    @patch('logic.scorer.genai.Client')
    def test_analyze_content_ticket_mode_success(self, mock_client_class):
        # Mock the client and response
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.text = '{"score": 85, "risk_level": "Medium", "critiques": ["Test critique"], "blind_spots": ["Test blind spot"]}'
        mock_client.models.generate_content.return_value = mock_response

        result = analyze_content("Test ticket content", mode="ticket")

        # Verify the result is the mocked response text
        self.assertEqual(result, mock_response.text)

        # Verify the client was called correctly
        mock_client_class.assert_called_once_with(api_key=self.mock_api_key)
        mock_client.models.generate_content.assert_called_once()

    @patch('logic.scorer.genai.Client')
    def test_analyze_content_business_mode_success(self, mock_client_class):
        # Mock the client and response
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.text = '{"score": 75, "risk_level": "High", "critiques": ["Business critique"], "blind_spots": ["Business blind spot"]}'
        mock_client.models.generate_content.return_value = mock_response

        criteria = [{"name": "Market Fit", "priority": "Critical"}]
        result = analyze_content("Test business idea", mode="business", criteria=criteria)

        # Verify the result
        self.assertEqual(result, mock_response.text)

    def test_analyze_content_missing_api_key(self):
        # Remove API key
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]

        result = analyze_content("Test content")
        result_json = json.loads(result)

        # Should return error response
        self.assertEqual(result_json["score"], 0)
        self.assertEqual(result_json["risk_level"], "Error")
        self.assertIn("API Key Missing", result_json["critiques"])

    @patch('logic.scorer.genai.Client')
    def test_analyze_content_api_error(self, mock_client_class):
        # Mock the client to raise an exception
        mock_client_class.side_effect = Exception("API Error")

        result = analyze_content("Test content")
        result_json = json.loads(result)

        # Should return error response
        self.assertEqual(result_json["score"], 0)
        self.assertEqual(result_json["risk_level"], "Error")
        self.assertIn("Error calling Gemini API", result_json["critiques"][0])

    def test_build_ticket_prompt(self):
        text = "Test JIRA ticket content"
        prompt = _build_ticket_prompt(text)

        # Verify prompt contains expected elements
        self.assertIn("Senior QA Engineer", prompt)
        self.assertIn(text, prompt)
        self.assertIn("score", prompt)
        self.assertIn("risk_level", prompt)
        self.assertIn("critiques", prompt)
        self.assertIn("blind_spots", prompt)

    def test_build_business_prompt_with_criteria(self):
        text = "Test business idea"
        criteria = [
            {"name": "Market Fit", "priority": "Critical", "description": "How well it fits the market"},
            {"name": "Scalability", "priority": "Normal"}
        ]
        prompt = _build_business_prompt(text, criteria)

        # Verify prompt contains expected elements
        self.assertIn("Venture Capitalist", prompt)
        self.assertIn(text, prompt)
        self.assertIn("Market Fit", prompt)
        self.assertIn("Critical", prompt)
        self.assertIn("Scalability", prompt)
        self.assertIn("score", prompt)

    def test_build_business_prompt_without_criteria(self):
        text = "Test business idea"
        prompt = _build_business_prompt(text, [])

        # Verify prompt contains default criteria
        self.assertIn("Market Fit", prompt)
        self.assertIn("Monetization Potential", prompt)
        self.assertIn("Scalability", prompt)
        self.assertIn("Competitive Moat", prompt)


if __name__ == '__main__':
    unittest.main()