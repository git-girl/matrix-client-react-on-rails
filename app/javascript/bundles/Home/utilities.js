const Util = {
  object_vals_not_null: (object) => {
    return !Object.values(object).every(v => v === null);
  }
};

export default Util
