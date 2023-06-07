import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Test = (props) => {
  const test = useState(props.test);

  return (
    <div>
      <h3>The test is: {test}!</h3>
    </div>
  );
};
Test.propTypes = {
  name: PropTypes.string.isRequired, // this is passed from the Rails view
};

export default Test;
