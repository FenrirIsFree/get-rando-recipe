import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'glutenFree', label: 'Gluten Free' },
  { value: 'dairyFree', label: 'Dairy Free' },
  { value: 'veryHealthy', label: 'Very Healthy' },
  { value: 'cheap', label: 'Cheap' },
  { value: 'sustainable', label: 'Sustainable' },
];

const animatedComponents = makeAnimated();

function FoodOptions({ onRestrictionsChange }) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      onChange={onRestrictionsChange}
    />
  );
}

FoodOptions.propTypes = {
  onRestrictionsChange: PropTypes.func.isRequired,
};

export default FoodOptions;
