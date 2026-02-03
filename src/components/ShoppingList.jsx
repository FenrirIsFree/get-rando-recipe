import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Helper to normalize ingredient names for combining duplicates
const normalizeIngredient = (name) => {
  return name.toLowerCase().trim().replace(/s$/, ''); // basic pluralization handling
};

// Helper to combine amounts with same units
const combineAmounts = (amounts) => {
  // Group by unit
  const byUnit = {};
  amounts.forEach(({ amount, unit }) => {
    const normalizedUnit = (unit || '').toLowerCase().trim();
    if (!byUnit[normalizedUnit]) {
      byUnit[normalizedUnit] = 0;
    }
    byUnit[normalizedUnit] += amount || 0;
  });
  
  // Format output
  return Object.entries(byUnit)
    .filter(([_, amt]) => amt > 0)
    .map(([unit, amt]) => {
      const rounded = Math.round(amt * 100) / 100;
      return unit ? `${rounded} ${unit}` : `${rounded}`;
    })
    .join(' + ');
};

const ShoppingList = ({ mealPlan, onClose, isDark }) => {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('recipeApp_shoppingChecked');
    return saved ? JSON.parse(saved) : {};
  });
  const [showChecked, setShowChecked] = useState(true);

  // Save checked state
  useEffect(() => {
    localStorage.setItem('recipeApp_shoppingChecked', JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Extract and organize ingredients from meal plan
  const getShoppingList = () => {
    const ingredientMap = new Map();
    
    Object.values(mealPlan).forEach((meals) => {
      meals.forEach((recipe) => {
        if (recipe.extendedIngredients) {
          recipe.extendedIngredients.forEach((ing) => {
            const key = normalizeIngredient(ing.name || ing.nameClean || 'unknown');
            const aisle = ing.aisle || 'Other';
            
            if (!ingredientMap.has(key)) {
              ingredientMap.set(key, {
                name: ing.name || ing.nameClean || 'Unknown',
                aisle,
                amounts: [],
                recipes: new Set(),
              });
            }
            
            const item = ingredientMap.get(key);
            item.amounts.push({ amount: ing.amount, unit: ing.unit });
            item.recipes.add(recipe.title);
          });
        }
      });
    });

    // Group by aisle
    const byAisle = {};
    ingredientMap.forEach((item, key) => {
      const aisle = item.aisle;
      if (!byAisle[aisle]) {
        byAisle[aisle] = [];
      }
      byAisle[aisle].push({
        id: key,
        name: item.name,
        quantity: combineAmounts(item.amounts),
        recipes: Array.from(item.recipes),
      });
    });

    // Sort aisles and items
    const sortedAisles = Object.keys(byAisle).sort();
    const result = {};
    sortedAisles.forEach((aisle) => {
      result[aisle] = byAisle[aisle].sort((a, b) => a.name.localeCompare(b.name));
    });

    return result;
  };

  const shoppingList = getShoppingList();
  const totalItems = Object.values(shoppingList).flat().length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleItem = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const clearChecked = () => {
    setCheckedItems({});
  };

  const checkAll = () => {
    const allChecked = {};
    Object.values(shoppingList).flat().forEach((item) => {
      allChecked[item.id] = true;
    });
    setCheckedItems(allChecked);
  };

  const isEmpty = totalItems === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              🛒 Shopping List
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {!isEmpty && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {checkedCount} of {totalItems} items checked
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChecked(!showChecked)}
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {showChecked ? 'Hide' : 'Show'} checked
                </button>
                <button
                  onClick={clearChecked}
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear all ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📝</p>
              <p className="text-gray-500 dark:text-gray-400">
                No ingredients yet! Add recipes to your meal plan first.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(shoppingList).map(([aisle, items]) => {
                const visibleItems = showChecked 
                  ? items 
                  : items.filter((item) => !checkedItems[item.id]);
                
                if (visibleItems.length === 0) return null;

                return (
                  <div key={aisle}>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded text-sm">
                        {aisle}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({visibleItems.length} items)
                      </span>
                    </h3>
                    <ul className="space-y-2">
                      {visibleItems.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            checkedItems[item.id]
                              ? 'bg-green-50 dark:bg-green-900/20 opacity-60'
                              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className={`text-xl mt-0.5 ${checkedItems[item.id] ? 'opacity-100' : 'opacity-30'}`}>
                            {checkedItems[item.id] ? '✅' : '⬜'}
                          </span>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              checkedItems[item.id]
                                ? 'line-through text-gray-400 dark:text-gray-500'
                                : 'text-gray-800 dark:text-white'
                            }`}>
                              {item.name}
                            </div>
                            {item.quantity && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.quantity}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              For: {item.recipes.join(', ')}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Copy to clipboard
                  const text = Object.entries(shoppingList)
                    .map(([aisle, items]) => {
                      const unchecked = items.filter((i) => !checkedItems[i.id]);
                      if (unchecked.length === 0) return '';
                      return `== ${aisle} ==\n` + unchecked
                        .map((i) => `☐ ${i.name}${i.quantity ? ` (${i.quantity})` : ''}`)
                        .join('\n');
                    })
                    .filter(Boolean)
                    .join('\n\n');
                  navigator.clipboard.writeText(text);
                  alert('Shopping list copied to clipboard!');
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                📋 Copy List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ShoppingList.propTypes = {
  mealPlan: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool,
};

export default ShoppingList;
