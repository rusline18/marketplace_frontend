<script setup lang="ts">
const route = useRoute()
const { find } = useListings()
const { add } = useCart()
const toast = useToast()

const { data: listing, status } = await useAsyncData(
  `listing-${route.params.id}`,
  () => find(route.params.id as string),
)

const statusLabels: Record<string, string> = {
  active: 'Активно',
  draft: 'Черновик',
  archived: 'В архиве',
}

function onAddToCart() {
  if (!listing.value) return
  add({ id: listing.value.id, title: listing.value.title, price: listing.value.price })
  toast.add({ title: 'Добавлено в корзину', icon: 'i-lucide-shopping-cart' })
}
</script>

<template>
  <div class="space-y-4">
    <UButton to="/" color="neutral" variant="link" icon="i-lucide-arrow-left" class="px-0">
      К каталогу
    </UButton>

    <div v-if="status === 'pending'" class="grid gap-6 lg:grid-cols-2">
      <USkeleton class="aspect-video w-full" />
      <div class="space-y-4">
        <USkeleton class="h-8 w-2/3" />
        <USkeleton class="h-24 w-full" />
      </div>
    </div>

    <div v-else-if="listing" class="grid gap-6 lg:grid-cols-2">
      <div class="flex aspect-video items-center justify-center rounded-lg bg-elevated">
        <UIcon name="i-lucide-image" class="size-12 text-dimmed" />
      </div>

      <UCard>
        <template #header>
          <div class="flex items-start justify-between gap-4">
            <h1 class="text-2xl font-semibold text-highlighted">{{ listing.title }}</h1>
            <UBadge color="neutral" variant="subtle">
              {{ statusLabels[listing.status] ?? listing.status }}
            </UBadge>
          </div>
        </template>

        <p class="text-muted whitespace-pre-line">{{ listing.description }}</p>

        <template #footer>
          <div class="flex items-center justify-between gap-4">
            <span class="text-2xl font-semibold text-highlighted">{{ listing.price }} ₽</span>
            <UButton
              v-if="listing.status === 'active'"
              color="primary"
              icon="i-lucide-shopping-cart"
              @click="onAddToCart"
            >
              В корзину
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <UAlert v-else color="error" variant="soft" title="Объявление не найдено" />
  </div>
</template>
