import { LEFT_ARROW, RIGHT_ARROW, ELLIPSES } from '../config/linkTypes'

export default class LimitedLinksGenerator {
  constructor (listOfPages, currentPage, limit) {
    this.listOfPages = listOfPages
    this.lastPage = listOfPages.length - 1
    this.currentPage = currentPage === this.lastPage
      ? this.lastPage - 1
      : currentPage
    this.limit = limit
  }

  generate () {
    const firstHalf = this._buildFirstHalf()
    let secondHalf = this._buildSecondHalf()
    return [...firstHalf, ...secondHalf]
  }

  _buildFirstHalf () {
    const firstHalf = this._allPagesButLast()
      .slice(
        this._currentChunkIndex(),
        this._currentChunkIndex() + this.limit
      )
    // Add left arrow if needed
    if (this.currentPage >= this.limit) {
      firstHalf.unshift(ELLIPSES)
      firstHalf.unshift(0)
      firstHalf.unshift(LEFT_ARROW)
    }
    // Add ellipses if needed
    if (this.lastPage - this.limit > this._currentChunkIndex()) {
      firstHalf.push(ELLIPSES)
    }
    return firstHalf
  }

  _buildSecondHalf () {
    const secondHalf = [this.lastPage]
    // Add right arrow if needed
    if (this._currentChunkIndex() + this.limit < this.lastPage) {
      secondHalf.push(RIGHT_ARROW)
    }
    return secondHalf
  }

  _currentChunkIndex () {
    const currentChunk = Math.floor(this.currentPage / this.limit)
    return currentChunk * this.limit 
  }

  _allPagesButLast () {
    return this.listOfPages.filter(n => n !== this.lastPage)
  }
}
