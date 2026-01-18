import unittest
import json
from unittest.mock import patch
from app import app


class TestApp(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.analyze_content')
    def test_api_analyze_success(self, mock_analyze_content):
        # Mock the analyze_content function
        mock_response = '{"score": 80, "risk_level": "Medium", "critiques": ["Test critique"], "blind_spots": ["Test blind spot"]}'
        mock_analyze_content.return_value = mock_response

        # Test data
        test_data = {
            "content_text": "Test JIRA ticket",
            "analysis_mode": "ticket",
            "criteria_data": []
        }

        response = self.app.post('/api/analyze',
                               data=json.dumps(test_data),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data["score"], 80)
        self.assertEqual(response_data["risk_level"], "Medium")

        # Verify analyze_content was called with correct arguments
        mock_analyze_content.assert_called_once_with("Test JIRA ticket", mode="ticket", criteria=[])

    @patch('app.analyze_content')
    def test_api_analyze_business_mode(self, mock_analyze_content):
        # Mock the analyze_content function
        mock_response = '{"score": 70, "risk_level": "High", "critiques": ["Business critique"], "blind_spots": ["Business blind spot"]}'
        mock_analyze_content.return_value = mock_response

        # Test data with criteria
        test_data = {
            "content_text": "Test business idea",
            "analysis_mode": "business",
            "criteria_data": [{"name": "Market Fit", "priority": "Critical"}]
        }

        response = self.app.post('/api/analyze',
                               data=json.dumps(test_data),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data["score"], 70)

        # Verify analyze_content was called with correct arguments
        mock_analyze_content.assert_called_once_with("Test business idea", mode="business", criteria=[{"name": "Market Fit", "priority": "Critical"}])

    @patch('app.analyze_content')
    def test_api_analyze_invalid_json_response(self, mock_analyze_content):
        # Mock analyze_content to return invalid JSON
        mock_analyze_content.return_value = "Invalid JSON response"

        test_data = {
            "content_text": "Test content",
            "analysis_mode": "ticket",
            "criteria_data": []
        }

        response = self.app.post('/api/analyze',
                               data=json.dumps(test_data),
                               content_type='application/json')

        self.assertEqual(response.status_code, 500)
        response_data = json.loads(response.data)
        self.assertIn("AI failed to format JSON", response_data["error"])

    def test_api_analyze_missing_data(self):
        # Test with missing required fields
        test_data = {}  # Empty data

        response = self.app.post('/api/analyze',
                               data=json.dumps(test_data),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)  # Flask doesn't validate, just uses defaults
        response_data = json.loads(response.data)
        # Should still work with empty/default values

    def test_api_analyze_invalid_json_request(self):
        # Test with invalid JSON in request
        response = self.app.post('/api/analyze',
                               data="Invalid JSON",
                               content_type='application/json')

        self.assertEqual(response.status_code, 400)  # Bad Request


if __name__ == '__main__':
    unittest.main()