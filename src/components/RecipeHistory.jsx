import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ACTION_ICONS = {
  viewed: '👁️',
  favorited: '❤️',
  planned: '📅',
};

const ACTION_LABELS = {
  viewed: 'Viewed',
  favorited: 'Favorited',
  planned: 'Planned',
};

const ACTION_ORDER = ['viewed', 'favorited', 'planned'];

const RecipeHistory = ({ history, onViewRecipe, onClearHistory, onClose }) => {
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter((entry) => entry.actions?.includes(filter) || entry.action === filter);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get actions for an entry (handle both old and new format)
  const getActions = (entry) => {
    if (entry.actions) return entry.actions;
    if (entry.action) return [entry.action];
    return [];
  };

  // Get timestamp for an entry (handle both old and new format)
  const getTimestamp = (entry) => {
    return entry.lastActivity || entry.timestamp;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              📜 Recipe History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {['all', 'viewed', 'favorited', 'planned'].map((action) => (
              <button
                key={action}
                onClick={() => setFilter(action)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === action
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {action === 'all' ? '🔄 All' : `${ACTION_ICONS[action]} ${ACTION_LABELS[action]}`}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📜</p>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? 'No history yet. Start exploring recipes!'
                  : `No ${filter} recipes yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((entry, index) => {
                const actions = getActions(entry);
                const timestamp = getTimestamp(entry);
                
                return (
                  <div
                    key={`${entry.recipe.id}-${index}`}
                    onClick={() => onViewRecipe(entry.recipe)}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    {entry.recipe.image ? (
                      <img
                        src={entry.recipe.image}
                        alt={entry.recipe.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        🍽️
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-white truncate">
                        {entry.recipe.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          {ACTION_ORDER.filter((a) => actions.includes(a)).map((action) => (
                            <span key={action} className="text-lg" title={ACTION_LABELS[action]}>
                              {ACTION_ICONS[action]}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          • {formatDate(timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all recipe history?')) {
                    onClearHistory();
                  }
                }}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

RecipeHistory.propTypes = {
  history: PropTypes.array.isRequired,
  onViewRecipe: PropTypes.func.isRequired,
  onClearHistory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RecipeHistory;
