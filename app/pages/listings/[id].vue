<script setup lang="ts">
const route = useRoute()
const { find } = useListings()

const { data: listing, status } = await useAsyncData(
  `listing-${route.params.id}`,
  () => find(route.params.id as string),
)

const statusLabels: Record<string, string> = {
  active: 'Активно',
  draft: 'Черновик',
  archived: 'В архиве',
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
          <span class="text-2xl font-semibold text-highlighted">{{ listing.price }} ₽</span>
        </template>
      </UCard>
    </div>

    <UAlert v-else color="error" variant="soft" title="Объявление не найдено" />
  </div>
</template>
