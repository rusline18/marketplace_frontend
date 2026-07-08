<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { list } = useOrders()
const page = ref(1)

const { data, status } = await useAsyncData(
  () => `orders-${page.value}`,
  () => list({ page: page.value }),
  { watch: [page] },
)

const orders = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.meta.total ?? 0)
const perPage = computed(() => data.value?.meta.per_page ?? 15)

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
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-semibold text-highlighted">История заказов</h1>

    <div v-if="status === 'pending'" class="space-y-3">
      <USkeleton v-for="n in 4" :key="n" class="h-20 w-full" />
    </div>

    <div v-else-if="orders.length === 0" class="flex flex-col items-center gap-2 py-16 text-center text-muted">
      <UIcon name="i-lucide-package" class="size-8" />
      <p>Вы ещё не оформляли заказов.</p>
      <UButton to="/" color="primary" variant="soft">К каталогу</UButton>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink v-for="order in orders" :key="order.id" :to="`/orders/${order.id}`">
        <UCard class="hover:ring-2 hover:ring-primary transition-all">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-medium text-highlighted">Заказ №{{ order.id }}</p>
              <p class="text-sm text-muted">
                {{ new Date(order.created_at).toLocaleDateString('ru-RU') }} · {{ order.items.length }} тов.
              </p>
            </div>
            <div class="flex items-center gap-4">
              <UBadge :color="statusColors[order.status] ?? 'neutral'" variant="subtle">
                {{ statusLabels[order.status] ?? order.status }}
              </UBadge>
              <span class="font-semibold text-highlighted">{{ order.total }} ₽</span>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <div v-if="total > perPage" class="flex justify-center">
      <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
    </div>
  </div>
</template>
