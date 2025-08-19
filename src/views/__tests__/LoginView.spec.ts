import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { globalPlugins } from '@/test/setup'
import { userApiService } from '@/services/userApiService'
import { useUserStore } from '@/stores/user'
import LoginView from '../LoginView.vue'

vi.mock('@/services/userApiService', () => ({
  userApiService: {
    login: vi.fn(),
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('LoginView', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    wrapper = mount(LoginView, {
      global: {
        plugins: [...globalPlugins, createTestingPinia()],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders login form', () => {
    expect(wrapper.find('h3').text()).toBe('Login')
    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates required fields', async () => {
    await wrapper.find('form').trigger('submit')

    const fields = wrapper.findAllComponents({ name: 'VInput' })
    const emailField = fields.find((f) => f.props('name') === 'email')!
    const passwordField = fields.find((f) => f.props('name') === 'password')!

    expect(emailField.vm.errorMessages).toContain('E-mail is required')
    expect(passwordField.vm.errorMessages).toContain('Password is required')
    expect(userApiService.login).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    await wrapper.find('input[name="email"]').setValue('invalid-email')
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('form').trigger('submit')

    const emailField = wrapper
      .findAllComponents({ name: 'VInput' })
      .find((f) => f.props('name') === 'email')!

    expect(emailField.vm.errorMessages).toContain('E-mail must be valid')
    expect(userApiService.login).not.toHaveBeenCalled()
  })

  it('calls login API with correct credentials, and sets user with returned values and redirects on successful login', async () => {
    const mockUserReturn = { id: 1, name: 'Test User' }
    const userStore = useUserStore()
    ;(userApiService.login as Mock).mockResolvedValue(mockUserReturn)

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(userApiService.login).toHaveBeenCalledTimes(1)
    expect(userApiService.login).toHaveBeenCalledWith('test@example.com', 'password')
    expect(userStore.setUser).toHaveBeenCalledTimes(1)
    expect(userStore.setUser).toHaveBeenCalledWith({ id: 1, name: 'Test User' })
    // @ts-expect-error: router is not typed on the component instance, but is injected via useRouter mock
    expect(wrapper.vm.router.push).toHaveBeenCalledTimes(1)
    // @ts-expect-error: router is not typed on the component instance, but is injected via useRouter mock
    expect(wrapper.vm.router.push).toHaveBeenCalledWith('/hospital')
  })

  it('handles login failure', async () => {
    const testError = new Error('Invalid credentials')
    ;(userApiService.login as Mock).mockRejectedValue(testError)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await wrapper.find('input[name="email"]').setValue('test@example.com')
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid credentials')
    consoleErrorSpy.mockRestore()
  })
})
