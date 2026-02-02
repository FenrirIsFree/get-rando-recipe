import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options = [
  { value: 'vegetarian', label: '🥬 Vegetarian' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'gluten-free', label: '🌾 Gluten Free' },
  { value: 'dairy-free', label: '🥛 Dairy Free' },
  { value: 'ketogenic', label: '🥓 Keto' },
  { value: 'paleo', label: '🦴 Paleo' },
];

const animatedComponents = makeAnimated();

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#f97316' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(249, 115, 22, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#f97316',
    },
    borderRadius: '0.5rem',
    padding: '0.25rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#fff7ed',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#c2410c',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#c2410c',
    '&:hover': {
      backgroundColor: '#fed7aa',
      color: '#9a3412',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? '#f97316' 
      : state.isFocused 
        ? '#fff7ed' 
        : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#fb923c',
    },
  }),
};

function FoodOptions({ onRestrictionsChange }) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      onChange={onRestrictionsChange}
      styles={customStyles}
      placeholder="Select dietary preferences..."
      className="w-full"
    />
  );
}

FoodOptions.propTypes = {
  onRestrictionsChange: PropTypes.func.isRequired,
};

export default FoodOptions;
