import {should} from 'chai'; should();
import utils from '../../src/utils';

describe('Utilities', () => {

  it('capitalizes strings', () => {
    utils.capitalize('hello').should.equal('Hello');
  });

  it('generates links array', () => {
    utils.generateLinksArray(1, 4).should.eql([1, 2, 3, 4]);
  });

  it('generates links array', () => {
    utils.generateLinksArray(1, 4).should.eql([1, 2, 3, 4]);
    utils.generateLinksArray(5, 10).should.eql([5, 6, 7, 8, 9, 10]);
    utils.generateLinksArray(1, 4, 2).should.eql([1, 2]);
    utils.generateLinksArray(5, 9, 3).should.eql([5, 6, 7]);
    utils.generateLinksArray(10, 12, 5).should.eql([10, 11, 12]);
  });
});
