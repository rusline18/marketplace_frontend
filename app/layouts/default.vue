<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()
const { totalItems } = useCart()
const router = useRouter()

async function onLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-10 border-b border-default bg-default/75 backdrop-blur">
      <UContainer class="flex items-center justify-between py-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-highlighted">
          <UIcon name="i-lucide-store" class="size-5" />
          Маркетплейс
        </NuxtLink>

        <div class="flex items-center gap-3">
          <UButton to="/cart" color="neutral" variant="ghost" icon="i-lucide-shopping-cart">
            Корзина
            <UBadge v-if="totalItems > 0" color="primary" variant="solid" size="sm">{{ totalItems }}</UBadge>
          </UButton>

          <template v-if="isAuthenticated">
            <UButton to="/orders" color="neutral" variant="ghost" icon="i-lucide-package">
              Заказы
            </UButton>
            <NuxtLink
              to="/account"
              class="hidden sm:flex items-center gap-2 text-sm text-muted hover:text-highlighted"
            >
              <UIcon name="i-lucide-user-round" class="size-4" />
              {{ user?.name }}
            </NuxtLink>
            <UButton color="neutral" variant="ghost" icon="i-lucide-log-out" @click="onLogout">
              Выйти
            </UButton>
          </template>
          <template v-else>
            <UButton to="/login" color="neutral" variant="ghost">Войти</UButton>
            <UButton to="/register" color="primary">Регистрация</UButton>
          </template>
        </div>
      </UContainer>
    </header>

    <main class="flex-1">
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </main>

    <footer class="border-t border-default">
      <UContainer class="py-6 text-sm text-muted">
        © {{ new Date().getFullYear() }} Маркетплейс
      </UContainer>
    </footer>
  </div>
</template>
