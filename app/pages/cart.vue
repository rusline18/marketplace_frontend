<script setup lang="ts">
const { lines, totalPrice, updateQuantity, remove } = useCart()
const { checkout } = useOrders()
const { isAuthenticated } = useAuth()
const router = useRouter()

const isSubmitting = ref(false)
const error = ref<string | null>(null)

async function onCheckout() {
  error.value = null

  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  isSubmitting.value = true
  try {
    await checkout()
    router.push('/')
  } catch {
    error.value = 'Не удалось оформить заказ. Возможно, часть товаров в корзине больше недоступна.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-highlighted">Корзина</h1>

    <div v-if="lines.length === 0" class="flex flex-col items-center gap-2 py-16 text-center text-muted">
      <UIcon name="i-lucide-shopping-cart" class="size-8" />
      <p>Корзина пуста.</p>
      <UButton to="/" color="primary" variant="soft">К каталогу</UButton>
    </div>

    <template v-else>
      <UCard v-for="line in lines" :key="line.listingId">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-medium text-highlighted">{{ line.title }}</p>
            <p class="text-sm text-muted">{{ line.price }} ₽ / шт.</p>
          </div>

          <div class="flex items-center gap-3">
            <UInputNumber
              :model-value="line.quantity"
              :min="1"
              class="w-28"
              @update:model-value="(value: number) => updateQuantity(line.listingId, value)"
            />
            <span class="w-24 text-right font-medium text-highlighted">{{ line.price * line.quantity }} ₽</span>
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              @click="remove(line.listingId)"
            />
          </div>
        </div>
      </UCard>

      <UAlert v-if="error" color="error" variant="soft" :title="error" />

      <div class="flex items-center justify-between border-t border-default pt-4">
        <span class="text-lg font-semibold text-highlighted">Итого: {{ totalPrice }} ₽</span>
        <UButton color="primary" size="lg" :loading="isSubmitting" @click="onCheckout">
          Оформить заказ
        </UButton>
      </div>
    </template>
  </div>
</template>
