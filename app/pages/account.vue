<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, updateProfile } = useAuth()
const toast = useToast()

const name = ref(user.value?.name ?? '')
const email = ref(user.value?.email ?? '')
const password = ref('')
const passwordConfirmation = ref('')
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true

  const payload: Partial<{ name: string, email: string, password: string, password_confirmation: string }> = {
    name: name.value,
    email: email.value,
  }
  if (password.value) {
    payload.password = password.value
    payload.password_confirmation = passwordConfirmation.value
  }

  try {
    await updateProfile(payload)
    password.value = ''
    passwordConfirmation.value = ''
    toast.add({ title: 'Профиль обновлён', icon: 'i-lucide-circle-check' })
  } catch (error: any) {
    const errors = error?.data?.errors as Record<string, string[]> | undefined
    const message = errors ? Object.values(errors).flat().join(' ') : 'Не удалось обновить профиль.'
    toast.add({ title: message, color: 'error', icon: 'i-lucide-circle-x' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-semibold text-highlighted">Профиль</h1>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Имя">
          <UInput v-model="name" type="text" icon="i-lucide-user" required class="w-full" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="email" type="email" icon="i-lucide-mail" required class="w-full" />
        </UFormField>

        <UFormField label="Новый пароль" hint="Необязательно">
          <UInput v-model="password" type="password" icon="i-lucide-lock" class="w-full" />
        </UFormField>

        <UFormField v-if="password" label="Повторите новый пароль">
          <UInput v-model="passwordConfirmation" type="password" icon="i-lucide-lock" required class="w-full" />
        </UFormField>

        <UButton type="submit" color="primary" block :loading="submitting">Сохранить</UButton>
      </form>
    </UCard>
  </div>
</template>
