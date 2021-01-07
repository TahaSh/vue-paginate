import pdg from '../src/util/paginateDataGenerator'

describe('PaginateDataGenerator', () => {
  test('converts an array of list names into a valid paginate data object', () => {
    expect(pdg(['langs', 'names'])).toStrictEqual({
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
