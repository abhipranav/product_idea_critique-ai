import { useState } from 'react';
import ModeToggle from '../ModeToggle/ModeToggle';
import CriteriaSelector from '../CriteriaSelector/CriteriaSelector';
import './AnalysisForm.css';

export default function AnalysisForm({ onSubmit, isLoading }) {
  const [mode, setMode] = useState('ticket');
  const [content, setContent] = useState('');
  const [criteria, setCriteria] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content, mode, criteria });
  };

  const placeholder = mode === 'ticket'
    ? 'Paste your JIRA ticket, PRD, or technical spec here...'
    : 'Describe your business idea, startup concept, or product vision...';

  const buttonText = mode === 'ticket'
    ? '🔥 Roast This Ticket'
    : '🔥 Roast This Idea';

  return (
    <form onSubmit={handleSubmit}>
      <ModeToggle mode={mode} onModeChange={setMode} />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        required
      />

      {mode === 'business' && (
        <CriteriaSelector
          criteria={criteria}
          onCriteriaChange={setCriteria}
        />
      )}

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner" />
            Analyzing...
          </>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
