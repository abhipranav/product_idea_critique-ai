import { useState } from 'react';
import Header from './components/Header/Header';
import AnalysisForm from './components/AnalysisForm/AnalysisForm';
import Results from './components/Results/Results';
import { useTheme } from './hooks/useTheme';
import { analyzeContent } from './api/analyze';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ content, mode, criteria }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(content, mode, criteria);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="main-grid">
        <div className="card">
          <h2 className="card-title">What are we roasting?</h2>
          <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="card">
          <h2 className="card-title">Analysis</h2>
          <Results result={result} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default App;
