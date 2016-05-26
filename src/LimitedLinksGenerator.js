import utils from './utils';

const RIGHT_ARROW = '»';
const LEFT_ARROW = '«';
const ELIPSES = '…';

class LimitedLinksGenerator {

  constructor (vm, list, listName) {
    this.vm = vm;
    this.list = list;
    this.listName = listName;
  }
  
  generate (limit) {
    this.limit = limit || 4;

    var links = [];

    if (this.shouldShowLeftArrow()) {
      links.push(LEFT_ARROW);
    }

    if (this.rightArrowOrElipsesIsClicked()) {

      // Show the left arrow if not shown yet.
      if (links[0] !== LEFT_ARROW) {
        links.push(LEFT_ARROW);
      }

      this.showNextNavSet();
    }

    if (this.leftArrowIsClicked()) {

      // Remove left arrow if it's the first nav set
      // and the there's a left arrow (as the first element).
      if (this.list.initial <= this.limit && links[0] === LEFT_ARROW) {
        links.shift();
      }

      this.showPreviousNavSet();
    }

    if (this.lastPageIsClicked()) {

      // Add the left arrow if it's not there yet.
      if (links[0] !== LEFT_ARROW) {
        links.push(LEFT_ARROW);
      }

      this.showLastNavSet();
    }


    // Add the very first page (page 1).
    links.push(this.list.initial + 1);

    // The this.limit should not be beyond the total number of pages.
    this.limit = (this.limit > this.list.numberOfPages) ? this.list.numberOfPages : this.limit;

    // Generate and add the rest nav links.
    links = links.concat(utils.generateLinksArray(this.list.initial + 2, this.list.numberOfPages, this.limit - 1));

    if (this.shouldShowElipses()) {
      links.push(ELIPSES);
    }

    // Add the last page.
    links.push(this.list.numberOfPages);

    // If should show right arrow.
    if (this.notLastNavSet()) {
      links.push(RIGHT_ARROW);
    }

    // return the links without duplicate values
    return [...new Set(links)];
  }

  shouldShowLeftArrow () {
    return this.list.numberOfPages > this.limit + 1 && this.list.initial >= this.limit;
  }

  rightArrowOrElipsesIsClicked () {
    return this.list.currentPage === ELIPSES || this.list.currentPage === RIGHT_ARROW;
  }

  showNextNavSet () {
    if (this.list.numberOfPages - this.list.initial > this.limit + 1) {
      this.list.initial += this.limit;
      this.vm['change' + utils.capitalize(this.listName) + 'Page'](this.list.initial + 1);
    } else {
      this.list.currentPage = this.list.numberOfPages;
      this.vm['change' + utils.capitalize(this.listName) + 'Page'](this.list.currentPage);
      return;
    }
  }

  leftArrowIsClicked () {
    return this.list.currentPage === LEFT_ARROW;
  }

  showPreviousNavSet () {
    if (this.list.initial > this.limit - 1) {
      this.list.initial -= this.limit;
      this.vm['change' + utils.capitalize(this.listName) + 'Page'](this.list.initial + this.limit);
    } else {
      this.list.currentPage = this.list.initial;
      this.vm['change' + utils.capitalize(this.listName) + 'Page'](this.list.currentPage + 1);
      return;
    }
  }

  lastPageIsClicked () {
    return this.list.currentPage == this.list.numberOfPages - 1
  }

  showLastNavSet () {
    if (this.list.numberOfPages - this.list.initial > this.limit + 1) {
      this.list.initial = this.initialOfLastNav(this.limit);
      this.list.currentPage = this.list.initial + this.limit;

      this.vm['change' + utils.capitalize(this.listName) + 'Page'](this.list.currentPage + 1);
    }
  }

  shouldShowElipses () {
    return this.list.numberOfPages - this.list.initial > this.limit + 1;
  }

  initialOfLastNav () {
    var numberOfNavs = ~~(this.list.numberOfPages / this.limit);
    var rest = this.list.numberOfPages - this.limit * numberOfNavs;

    rest = rest <= 1 ? rest + this.limit : rest;
    return this.list.numberOfPages - rest ;
  }

  notLastNavSet () {
    return this.list.initial < this.initialOfLastNav(this.limit);
  }
}

export default LimitedLinksGenerator;
