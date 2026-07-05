<script setup lang="ts">
const { register } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)

async function onSubmit() {
  error.value = null
  submitting.value = true

  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push('/')
  } catch {
    error.value = 'Не удалось зарегистрироваться. Проверьте введённые данные.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-semibold text-highlighted">Регистрация</h1>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Имя">
          <UInput v-model="name" type="text" icon="i-lucide-user" required class="w-full" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="email" type="email" icon="i-lucide-mail" required class="w-full" />
        </UFormField>

        <UFormField label="Пароль">
          <UInput v-model="password" type="password" icon="i-lucide-lock" required class="w-full" />
        </UFormField>

        <UFormField label="Повторите пароль">
          <UInput v-model="passwordConfirmation" type="password" icon="i-lucide-lock" required class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="soft" :title="error" />

        <UButton type="submit" color="primary" block :loading="submitting">Зарегистрироваться</UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Уже есть аккаунт?
          <ULink to="/login" class="text-primary font-medium">Войти</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
