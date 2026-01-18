import './ModeToggle.css';

export default function ModeToggle({ mode, onModeChange }) {
  return (
    <div className="mode-toggle">
      <button
        type="button"
        className={`mode-btn ${mode === 'ticket' ? 'active' : ''}`}
        onClick={() => onModeChange('ticket')}
      >
        📋 Ticket / Spec
      </button>
      <button
        type="button"
        className={`mode-btn ${mode === 'business' ? 'active' : ''}`}
        onClick={() => onModeChange('business')}
      >
        💡 Business Idea
      </button>
    </div>
  );
}
