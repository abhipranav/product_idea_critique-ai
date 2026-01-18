import { useState } from 'react';
import './CriteriaSelector.css';

const PRESET_CRITERIA = [
  { id: 'market', name: 'Market Fit' },
  { id: 'money', name: 'Monetization' },
  { id: 'scale', name: 'Scalability' },
  { id: 'tech', name: 'Tech Feasibility' },
  { id: 'viral', name: 'Viral Potential' },
  { id: 'moat', name: 'Competitive Moat' },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CriteriaSelector({ criteria, onCriteriaChange }) {
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const toggleCriterion = (name) => {
    const existing = criteria.find(c => c.name === name);
    if (existing) {
      onCriteriaChange(criteria.filter(c => c.name !== name));
    } else {
      onCriteriaChange([...criteria, { name, priority: 'Normal' }]);
    }
  };

  const addCustom = () => {
    if (!customName.trim()) return;
    const newCriterion = {
      name: customName.trim(),
      priority: 'Normal',
      description: customDesc.trim() || undefined,
    };
    onCriteriaChange([...criteria, newCriterion]);
    setCustomName('');
    setCustomDesc('');
  };

  const removeCustom = (name) => {
    onCriteriaChange(criteria.filter(c => c.name !== name));
  };

  const isSelected = (name) => criteria.some(c => c.name === name);
  const customCriteria = criteria.filter(
    c => !PRESET_CRITERIA.some(p => p.name === c.name)
  );

  return (
    <div className="criteria-section">
      <label className="criteria-label">Select what matters most to you:</label>

      <div className="criteria-grid">
        {PRESET_CRITERIA.map(({ id, name }) => (
          <div
            key={id}
            className={`criterion-item ${isSelected(name) ? 'selected' : ''}`}
            onClick={() => toggleCriterion(name)}
          >
            <div className="criterion-checkbox">
              <CheckIcon />
            </div>
            <span className="criterion-name">{name}</span>
            <span className="criterion-priority">Normal</span>
          </div>
        ))}
      </div>

      <div className="custom-criteria">
        <label className="criteria-label">Add your own criterion:</label>
        <div className="custom-input-row">
          <input
            type="text"
            placeholder="Criterion name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          />
          <input
            type="text"
            placeholder="Optional description"
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          />
          <button type="button" className="add-btn" onClick={addCustom}>
            + Add
          </button>
        </div>

        {customCriteria.length > 0 && (
          <div className="custom-criteria-list">
            {customCriteria.map((c) => (
              <span key={c.name} className="custom-tag">
                {c.name}
                <span className="remove" onClick={() => removeCustom(c.name)}>
                  ✕
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
