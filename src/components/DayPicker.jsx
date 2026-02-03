import React from 'react';
import PropTypes from 'prop-types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DayPicker = ({ onSelectDay, onClose }) => {
  // Get the current week's dates
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    return DAYS.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        shortDay: day.slice(0, 3),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateKey: date.toISOString().split('T')[0],
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < new Date(today.setHours(0, 0, 0, 0)),
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
          📅 Add to which day?
        </h3>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDates.map(({ day, shortDay, date, dateKey, isToday }) => (
            <button
              key={dateKey}
              onClick={() => onSelectDay(dateKey)}
              className={`p-2 rounded-lg text-center transition-colors duration-200 ${
                isToday
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
            >
              <div className="font-medium text-xs">{shortDay}</div>
              <div className="text-xs opacity-75">{date.split(' ')[1]}</div>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

DayPicker.propTypes = {
  onSelectDay: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DayPicker;
