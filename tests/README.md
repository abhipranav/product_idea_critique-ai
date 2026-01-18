# JIRA Critique Tool - Test Suite

This directory contains comprehensive tests for the JIRA Critique Tool project.

## Test Structure

### Backend Tests

#### `test_scorer.py`
Tests for the core analysis logic in `logic/scorer.py`:
- **API Integration Tests**: Mocked Gemini API calls for both ticket and business analysis modes
- **Error Handling**: Tests for missing API keys and API failures
- **Prompt Building**: Tests for generating correct prompts for different analysis modes
- **Criteria Handling**: Tests for business mode with custom criteria

#### `test_app.py`
Tests for the Flask API endpoints in `app.py`:
- **API Endpoint Tests**: Testing `/api/analyze` with various inputs
- **JSON Handling**: Valid and invalid JSON request/response handling
- **Mode Switching**: Ticket vs business analysis modes
- **Error Responses**: Proper error handling and status codes

## Running Tests

### Prerequisites
```bash
# Install test dependencies
pip install -r requirements.txt
```

### Run All Tests
```bash
# From project root
python -m pytest

# Or use the test runner script
python run_tests.py
```

### Run Specific Test Files
```bash
# Test only the scorer logic
python -m pytest tests/test_scorer.py -v

# Test only the Flask app
python -m pytest tests/test_app.py -v
```

### Run with Coverage
```bash
pip install pytest-cov
python -m pytest --cov=logic --cov=app --cov-report=html
```

## Test Coverage

The tests cover:
- ✅ Core analysis functionality with mocked API calls
- ✅ Error handling for API failures and missing credentials
- ✅ Flask API endpoints with proper request/response handling
- ✅ Prompt generation for different analysis modes
- ✅ Business criteria processing
- ✅ JSON serialization/deserialization

## Mocking Strategy

- **Gemini API**: Fully mocked to avoid external dependencies and API costs
- **Environment Variables**: Controlled setup/teardown for API keys
- **Flask Test Client**: Used for testing API endpoints without running a server

## Adding New Tests

When adding new functionality:

1. **For scorer logic**: Add tests to `test_scorer.py` with appropriate mocking
2. **For API endpoints**: Add tests to `test_app.py` using the Flask test client
3. **For new modules**: Create new test files following the naming convention `test_*.py`

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    python -m pytest --cov=logic --cov=app --cov-report=xml
```

## Test Results

Current test status: **12 tests passing** ✅

- `test_scorer.py`: 7 tests
- `test_app.py`: 5 tests

All tests use proper mocking to ensure they run quickly and reliably without external dependencies.