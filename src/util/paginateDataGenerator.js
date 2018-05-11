export default (listNames = []) =>
  listNames.reduce((curr, listName) => {
    curr[listName] = {
      list: [],
      page: 0,
    };
    return curr;
  }, {});
