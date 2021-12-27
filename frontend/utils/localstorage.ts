class Localstorage {
  static get = function (key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch {
      return null;
    }
  };

  static set = function (key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  };
}

export default Localstorage;
