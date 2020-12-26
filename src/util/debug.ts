import Vue from 'vue'

const warn = (msg: string, vm: Vue, type: ConsoleType = 'error') => {
  if (hasConsole) {
    console[type](`[vue-paginate]: ${msg} ` + (
      vm ? formatLocation(formatComponentName(vm)) : ''
      ))
  }
}

const formatComponentName = (vm: Vue & { _isVue?: boolean, name?: string }) => {
  if (vm.$root === vm) {
    return 'root instance'
  }

  const options = vm.$options as any
  const name = vm._isVue
    ? vm.$options.name || options._componentTag
    : vm.name!

  return (
    (name ? `component <${name}>` : `anonymous component`) +
    (vm._isVue && options.__file ? ` at ${options.__file}` : '')
    )
}

const hasConsole = typeof console !== 'undefined'

type ConsoleType = 'error' | 'warn' | 'log'


const formatLocation = (str: string) => {
  if (str === 'anonymous component') {
    str += ` - use the "name" option for better debugging messages.`
  }
  return `\n(found in ${str})`
}

export { warn, formatComponentName }
