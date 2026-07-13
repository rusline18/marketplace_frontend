import { describe, expect, it } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'

describe('useAuth', () => {
  it('unwraps the {data} envelope returned by GET /me', async () => {
    document.cookie = 'auth_token=test-token'

    const TestComponent = defineComponent({
      async setup() {
        useRuntimeConfig().public.apiBase = ''
        registerEndpoint('/api/v1/me', {
          method: 'GET',
          handler: () => ({
            data: { id: 1, name: 'Ада Лавлейс', email: 'ada@example.com', created_at: '2026-01-01T00:00:00.000Z' },
          }),
        })

        const { user, fetchMe } = useAuth()
        await fetchMe()
        return () => h('div', user.value?.name ?? 'нет имени')
      },
    })

    const component = await mountSuspended(TestComponent)

    expect(component.text()).toBe('Ада Лавлейс')
  })

  it('unwraps the {data} envelope returned by PATCH /me', async () => {
    document.cookie = 'auth_token=test-token'

    const TestComponent = defineComponent({
      async setup() {
        useRuntimeConfig().public.apiBase = ''
        registerEndpoint('/api/v1/me', {
          method: 'PATCH',
          handler: () => ({
            data: { id: 1, name: 'Новое имя', email: 'ada@example.com', created_at: '2026-01-01T00:00:00.000Z' },
          }),
        })

        const { user, updateProfile } = useAuth()
        await updateProfile({ name: 'Новое имя' })
        return () => h('div', user.value?.name ?? 'нет имени')
      },
    })

    const component = await mountSuspended(TestComponent)

    expect(component.text()).toBe('Новое имя')
  })
})
