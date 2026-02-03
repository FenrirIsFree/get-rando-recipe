import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options = [
  // Diet types
  { value: 'vegetarian', label: '🥬 Vegetarian' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'pescetarian', label: '🐟 Pescatarian' },
  { value: 'ketogenic', label: '🥓 Keto' },
  { value: 'paleolithic', label: '🦴 Paleo' },
  { value: 'primal', label: '🍖 Primal' },
  { value: 'whole30', label: '🎯 Whole30' },
  // Restrictions
  { value: 'gluten-free', label: '🌾 Gluten Free' },
  { value: 'dairy-free', label: '🥛 Dairy Free' },
  { value: 'lacto-vegetarian', label: '🧀 Lacto-Vegetarian' },
  { value: 'ovo-vegetarian', label: '🥚 Ovo-Vegetarian' },
  // Health & Budget
  { value: 'very-healthy', label: '💪 Very Healthy (75+ score)' },
  { value: 'cheap', label: '💰 Budget Friendly (<$3/serving)' },
];

const animatedComponents = makeAnimated();

const customStyles = (isDark) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: isDark ? '#1f2937' : 'white',
    borderColor: state.isFocused ? '#f97316' : isDark ? '#374151' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(249, 115, 22, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#f97316',
    },
    borderRadius: '0.5rem',
    padding: '0.25rem',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: isDark ? '#1f2937' : 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: isDark ? '#374151' : '#fff7ed',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: isDark ? '#fdba74' : '#c2410c',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: isDark ? '#fdba74' : '#c2410c',
    '&:hover': {
      backgroundColor: isDark ? '#4b5563' : '#fed7aa',
      color: isDark ? '#fb923c' : '#9a3412',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? '#f97316' 
      : state.isFocused 
        ? isDark ? '#374151' : '#fff7ed'
        : isDark ? '#1f2937' : 'white',
    color: state.isSelected ? 'white' : isDark ? '#e5e7eb' : '#374151',
    '&:active': {
      backgroundColor: '#fb923c',
    },
  }),
  input: (base) => ({
    ...base,
    color: isDark ? '#e5e7eb' : '#374151',
  }),
  placeholder: (base) => ({
    ...base,
    color: isDark ? '#9ca3af' : '#6b7280',
  }),
  singleValue: (base) => ({
    ...base,
    color: isDark ? '#e5e7eb' : '#374151',
  }),
});

function FoodOptions({ onRestrictionsChange, isDark = false }) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      onChange={onRestrictionsChange}
      styles={customStyles(isDark)}
      placeholder="Select dietary preferences..."
      className="w-full"
    />
  );
}

FoodOptions.propTypes = {
  onRestrictionsChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool,
};

export default FoodOptions;
