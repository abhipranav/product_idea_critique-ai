import './Results.css';

const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
  </svg>
);

function getScoreColor(score) {
  if (score > 70) return '#22c55e';
  if (score > 40) return '#f59e0b';
  return '#ef4444';
}

export default function Results({ result, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="result-placeholder">
        <div className="loading-spinner" style={{ width: 48, height: 48, margin: '0 auto 1rem' }} />
        <p>Analyzing your content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-placeholder">
        <PlaceholderIcon />
        <p>Your analysis will appear here</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="error-message">
        {result.error}
      </div>
    );
  }

  return (
    <>
      <div className="score-display">
        <span 
          className="score-number" 
          style={{ color: getScoreColor(result.score) }}
        >
          {result.score}
        </span>
        <span className="score-max">/ 100</span>
        <span className={`risk-badge risk-${result.risk_level?.toLowerCase()}`}>
          {result.risk_level} Risk
        </span>
      </div>

      <div className="result-section">
        <h3 className="result-section-title critiques">🚩 Critiques</h3>
        <ul className="result-list critiques">
          {result.critiques?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="result-section">
        <h3 className="result-section-title blindspots">⚠️ Blind Spots</h3>
        <ul className="result-list blindspots">
          {result.blind_spots?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
