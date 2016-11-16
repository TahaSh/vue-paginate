import pdg from '../src/util/paginateDataGenerator'

describe('PaginateDataGenerator', () => {
  it('converts an array of list names into a valid paginate data object', () => {
    expect(pdg(['langs', 'names'])).to.deep.equal({
      langs: {
        list: [],
        page: 0
      },
      names: {
        list: [],
        page: 0
      }
    })
  })
})
