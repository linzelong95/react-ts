import next from 'next'

const NEXT = Symbol('Application#next')

export default {
  get nextServer(): ReturnType<typeof next> {
    if (!this[NEXT]) {
      this[NEXT] = next({ dev: (this as any).config.env !== 'prod', dir: '../', customServer: true })
    }
    return this[NEXT]
  },
}
