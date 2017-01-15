import Generator from '../src/util/LimitedLinksGenerator'
import { ELLIPSES } from '../src/config/linkTypes'

const FULL_LINKS = [0, 1, 2, 3, 4, 5, 6]
const PREV_LINK = '<<'
const NEXT_LINK = '>>'
describe('LimitedLinksGenerator', () => {
  it('generates limited links array when limit = 2', () => {
    const LIMIT = 2
    expect(
      new Generator(FULL_LINKS, 0, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, 1, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 1, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, 1, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 2, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 2, 3, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 3, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 2, 3, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 4, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 4, 5, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 5, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 4, 5, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 6, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 4, 5, 6, NEXT_LINK
        ])
  })

  it('generates limited links array when limit = 3', () => {
    const LIMIT = 3
    expect(
      new Generator(FULL_LINKS, 0, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, 1, 2, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 1, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, 1, 2, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 2, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, 1, 2, ELLIPSES, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 3, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 3, 4, 5, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 4, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 3, 4, 5, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 5, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 3, 4, 5, 6, NEXT_LINK
        ])

    expect(
      new Generator(FULL_LINKS, 6, LIMIT, { prev: PREV_LINK, next: NEXT_LINK })
        .generate()).to.deep.equal([
          PREV_LINK, 0, ELLIPSES, 3, 4, 5, 6, NEXT_LINK
        ])
  })
})
