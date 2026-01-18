# JIRA Critique Python Tool

A full-stack web application for analyzing JIRA tickets and business content using AI-powered critique and scoring.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini API for intelligent content analysis
- **Dual Analysis Modes**:
  - **Ticket Mode**: Analyze JIRA tickets for clarity, completeness, and actionability
  - **Business Mode**: Evaluate business content with customizable criteria
- **Modern UI**: React-based frontend with dark/light theme support
- **RESTful API**: Flask backend with CORS support
- **Comprehensive Testing**: Full test coverage for both backend and frontend

## 🏗️ Architecture

### Backend (Python/Flask)
- `app.py`: Main Flask application with API endpoints
- `logic/scorer.py`: Core analysis logic using Google Gemini API
- `requirements.txt`: Python dependencies

### Frontend (React/Vite)
- `src/App.jsx`: Main application component
- `src/components/`: Modular React components
- `src/hooks/`: Custom React hooks
- `src/api/`: API client functions

## 📋 Prerequisites

- **Python 3.8+** with virtual environment support
- **Node.js 16+** and npm
- **Google Gemini API Key** (set as `GEMINI_API_KEY` environment variable)

## 🛠️ Installation & Setup

### Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Return to root directory**:
   ```bash
   cd ..
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend** (in virtual environment):
   ```bash
   source venv/bin/activate
   python app.py
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**:
   ```bash
   python app.py
   ```

The application will be available at `http://localhost:5000`

## 🧪 Testing

### Backend Tests
```bash
# Run all backend tests
python -m pytest

# Run with coverage
python -m pytest --cov=logic --cov=app

# Run specific test file
python -m pytest tests/test_scorer.py
```

### Frontend Tests
```bash
cd frontend

# Run all frontend tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npx vitest --coverage
```

### Test Coverage
- **Backend**: 12 comprehensive tests covering API endpoints and core logic
- **Frontend**: 47 tests covering all components, hooks, and API functions

## 📁 Project Structure

```
├── app.py                    # Flask backend application
├── requirements.txt          # Python dependencies
├── logic/
│   ├── scorer.py            # Core analysis logic
│   └── __pycache__/         # Python cache
├── tests/                   # Backend tests
│   ├── test_app.py
│   └── test_scorer.py
├── frontend/
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── index.html           # Main HTML template
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   ├── api/
│   │   │   └── analyze.js   # API client
│   │   ├── components/       # React components
│   │   │   ├── Header/
│   │   │   ├── ModeToggle/
│   │   │   ├── CriteriaSelector/
│   │   │   ├── AnalysisForm/
│   │   │   └── Results/
│   │   ├── hooks/
│   │   │   └── useTheme.js  # Theme management hook
│   │   └── test/            # Frontend tests
│   │       ├── README.md    # Test documentation
│   │       ├── setup.js     # Test configuration
│   │       └── *.test.jsx   # Component tests
│   └── public/              # Static assets
└── templates/               # Legacy Flask templates (can be removed)
```

## 🔧 API Documentation

### POST `/api/analyze`

Analyze content using AI-powered critique.

**Request Body**:
```json
{
  "content": "Content to analyze",
  "mode": "ticket" | "business",
  "criteria": ["clarity", "completeness"]  // Optional, for business mode
}
```

**Response**:
```json
{
  "score": 85,
  "risk_level": "Medium",
  "critiques": ["List of improvement suggestions"],
  "blind_spots": ["Potential issues identified"]
}
```

## 🎨 UI Components

- **Header**: Application title and theme toggle
- **Mode Toggle**: Switch between ticket and business analysis
- **Analysis Form**: Main input form with content submission
- **Criteria Selector**: Custom criteria selection for business mode
- **Results**: Display analysis results with scoring and feedback

## 🌙 Theme Support

The application supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for extended use
- **System**: Automatically matches OS preference

## 🧪 Development Guidelines

### Backend
- Use virtual environment for dependency management
- Follow Flask best practices for API design
- Include comprehensive error handling
- Write tests for all new functionality

### Frontend
- Use React functional components with hooks
- Follow component composition patterns
- Write tests for all user interactions
- Maintain accessibility standards

### Testing
- Backend: Use pytest with fixtures and mocking
- Frontend: Use Vitest with React Testing Library
- Aim for high test coverage (>80%)
- Test both success and error scenarios

## 🚀 Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="your-production-key"
export FLASK_ENV=production

# Run with production server
gunicorn app:app
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**:
- Ensure virtual environment is activated
- Check if GEMINI_API_KEY is set
- Verify Python dependencies are installed

**Frontend build fails**:
- Ensure Node.js version is 16+
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Tests failing**:
- Backend: Run `pip install -r requirements.txt`
- Frontend: Run `npm install` in frontend directory

**API connection issues**:
- Ensure backend is running on port 5000
- Check CORS settings in Flask app
- Verify API key is valid

For more help, check the test documentation in `frontend/src/test/README.md`