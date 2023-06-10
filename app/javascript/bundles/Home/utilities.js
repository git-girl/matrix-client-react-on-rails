const Util = {
  object_vals_not_null: (object) => {
    return !Object.values(object).every(v => v === null);
  },

  tryGetRoomsLocalStorage: () => {
    return JSON.parse(window.localStorage.getItem('rooms')) 
  },

  // WARNING: this is intermediary
  getFirstElementOfRooms: (rooms) => {
    const first_key = Object.keys(rooms)[0]
    const first_val = rooms[first_key]
    return { 
      // computed key
      [first_key]: first_val
    }

  }

};


export default Util
