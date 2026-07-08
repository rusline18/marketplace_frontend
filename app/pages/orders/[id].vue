<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { show, cancel } = useOrders()
const toast = useToast()

const { data: order, status, refresh } = await useAsyncData(
  `order-${route.params.id}`,
  () => show(route.params.id as string),
)

const isCancelling = ref(false)

const statusLabels: Record<string, string> = {
  pending: 'В ожидании',
  confirmed: 'Подтверждён',
  cancelled: 'Отменён',
}
const statusColors: Record<string, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
}

const canCancel = computed(() => order.value?.status === 'pending')

async function onCancel() {
  isCancelling.value = true
  try {
    await cancel(route.params.id as string)
    await refresh()
    toast.add({ title: 'Заказ отменён', icon: 'i-lucide-circle-check' })
  } catch {
    toast.add({ title: 'Не удалось отменить заказ', color: 'error', icon: 'i-lucide-circle-x' })
  } finally {
    isCancelling.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <UButton to="/orders" color="neutral" variant="link" icon="i-lucide-arrow-left" class="px-0">
      К истории заказов
    </UButton>

    <div v-if="status === 'pending'" class="space-y-4">
      <USkeleton class="h-8 w-1/3" />
      <USkeleton class="h-40 w-full" />
    </div>

    <UCard v-else-if="order">
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold text-highlighted">Заказ №{{ order.id }}</h1>
            <p class="text-sm text-muted">{{ new Date(order.created_at).toLocaleString('ru-RU') }}</p>
          </div>
          <UBadge :color="statusColors[order.status] ?? 'neutral'" variant="subtle">
            {{ statusLabels[order.status] ?? order.status }}
          </UBadge>
        </div>
      </template>

      <!--
        TODO(Фаза 5, пункт 7 — чек-ин): когда появится useCheckin(), добавить сюда кнопку
        «Подтвердить получение» для order.status === 'confirmed', ведущую на /checkin/:orderId.
        order.id и order.items[].listing_id уже доступны на этой странице.
      -->
      <div class="divide-y divide-default">
        <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between gap-4 py-2">
          <NuxtLink :to="`/listings/${item.listing_id}`" class="text-highlighted hover:underline">
            Объявление №{{ item.listing_id }}
          </NuxtLink>
          <span class="text-muted">{{ item.quantity }} × {{ item.unit_price }} ₽</span>
          <span class="font-medium text-highlighted">{{ item.quantity * item.unit_price }} ₽</span>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between gap-4">
          <span class="text-lg font-semibold text-highlighted">Итого: {{ order.total }} ₽</span>
          <UButton v-if="canCancel" color="error" variant="soft" :loading="isCancelling" @click="onCancel">
            Отменить заказ
          </UButton>
        </div>
      </template>
    </UCard>

    <UAlert v-else color="error" variant="soft" title="Заказ не найден" />
  </div>
</template>
