import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import '@testing-library/jest-dom'

// Provide Vuetify plugin globally for all tests
export const globalPlugins = [
  createVuetify({
    components: {
      VDateInput,
    },
  }),
]

// Mock ResizeObserver globally
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Mock visualViewport globally for Vuetify
if (!globalThis.visualViewport) {
  globalThis.visualViewport = {
    addEventListener: () => {},
    removeEventListener: () => {},
    width: 1024,
    height: 768,
    scale: 1,
    pageTop: 0,
    pageLeft: 0,
    offsetLeft: 0,
    offsetTop: 0,
    onresize: null,
    onscroll: null,
    dispatchEvent: () => false,
  }
}
