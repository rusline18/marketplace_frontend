<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)

async function onSubmit() {
  error.value = null
  submitting.value = true

  try {
    await login({ email: email.value, password: password.value })
    router.push('/')
  } catch {
    error.value = 'Неверный email или пароль.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-semibold text-highlighted">Вход</h1>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Email">
          <UInput v-model="email" type="email" icon="i-lucide-mail" required class="w-full" />
        </UFormField>

        <UFormField label="Пароль">
          <UInput v-model="password" type="password" icon="i-lucide-lock" required class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="soft" :title="error" />

        <UButton type="submit" color="primary" block :loading="submitting">Войти</UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Нет аккаунта?
          <ULink to="/register" class="text-primary font-medium">Зарегистрироваться</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
