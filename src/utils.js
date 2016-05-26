export default {

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  
  generateLinksArray: function (initial, max, limit = 0) {
    var links = [];

    for(var i = initial; i <= max; i++) {
      links.push(i);

      if (limit && links.length >= limit) break;
    }

    return links;
  }
};
