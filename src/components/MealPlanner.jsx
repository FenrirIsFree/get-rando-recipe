import React from 'react';
import PropTypes from 'prop-types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlanner = ({ mealPlan, onRemoveMeal, onViewRecipe }) => {
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
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateKey: date.toISOString().split('T')[0],
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        📅 This Week's Meal Plan
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDates.map(({ day, date, dateKey, isToday }) => {
          const meals = mealPlan[dateKey] || [];
          
          return (
            <div
              key={dateKey}
              className={`rounded-lg p-3 min-h-[150px] transition-colors duration-200 ${
                isToday
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-600'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="text-center mb-2">
                <div className={`font-semibold text-sm ${
                  isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {day}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{date}</div>
              </div>
              
              <div className="space-y-2">
                {meals.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center italic mt-4">
                    No meals planned
                  </p>
                ) : (
                  meals.map((meal, index) => (
                    <div
                      key={`${meal.id}-${index}`}
                      className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm group relative"
                    >
                      {meal.image && (
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="w-full h-16 object-cover rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onViewRecipe(meal)}
                        />
                      )}
                      <p
                        className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400"
                        onClick={() => onViewRecipe(meal)}
                      >
                        {meal.title}
                      </p>
                      {meal.plannedServings && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          🍽️ {meal.plannedServings} servings
                        </p>
                      )}
                      <button
                        onClick={() => onRemoveMeal(dateKey, meal.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-opacity"
                        aria-label="Remove meal"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {Object.keys(mealPlan).length === 0 || 
       Object.values(mealPlan).every(meals => meals.length === 0) ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          💡 Tip: Find recipes above and click "Add to Meal Plan" to plan your week!
        </p>
      ) : null}
    </div>
  );
};

MealPlanner.propTypes = {
  mealPlan: PropTypes.object.isRequired,
  onRemoveMeal: PropTypes.func.isRequired,
  onViewRecipe: PropTypes.func.isRequired,
};

export default MealPlanner;
