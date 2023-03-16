import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten Free' },
  { value: 'dairy-free', label: 'Dairy Free' },
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
