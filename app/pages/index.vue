<script setup lang="ts">
const { search } = useListings()

const searchTerm = ref('')
const page = ref(1)

const { data, status, refresh } = await useAsyncData(
  () => `listings-${page.value}-${searchTerm.value}`,
  () => search({ search: searchTerm.value || undefined, page: page.value }),
  { watch: [page] },
)

const listings = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.meta.total ?? 0)
const perPage = computed(() => data.value?.meta.per_page ?? 15)

function onSearch() {
  page.value = 1
  refresh()
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold text-highlighted">Каталог объявлений</h1>
      <p class="text-sm text-muted">
        {{ total > 0 ? `Найдено объявлений: ${total}` : 'Найдите то, что ищете' }}
      </p>
    </div>

    <form class="flex gap-2" @submit.prevent="onSearch">
      <UInput
        v-model="searchTerm"
        type="search"
        icon="i-lucide-search"
        placeholder="Поиск по объявлениям..."
        class="max-w-sm flex-1"
      />
      <UButton type="submit" color="primary" :loading="status === 'pending'">Найти</UButton>
    </form>

    <div v-if="status === 'pending'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <USkeleton v-for="n in 8" :key="n" class="h-44 w-full" />
    </div>

    <div v-else-if="listings.length === 0" class="flex flex-col items-center gap-2 py-16 text-center text-muted">
      <UIcon name="i-lucide-search-x" class="size-8" />
      <p>Объявления не найдены.</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <NuxtLink v-for="listing in listings" :key="listing.id" :to="`/listings/${listing.id}`">
        <UCard
          class="h-full flex flex-col hover:ring-2 hover:ring-primary hover:-translate-y-0.5 transition-all"
          :ui="{ body: 'flex-1' }"
        >
          <div class="mb-3 flex aspect-video items-center justify-center rounded-md bg-elevated">
            <UIcon name="i-lucide-image" class="size-8 text-dimmed" />
          </div>

          <span class="font-medium text-highlighted line-clamp-1">{{ listing.title }}</span>
          <p class="mt-1 text-sm text-muted line-clamp-2">{{ listing.description }}</p>

          <template #footer>
            <span class="text-lg font-semibold text-highlighted">{{ listing.price }} ₽</span>
          </template>
        </UCard>
      </NuxtLink>
    </div>

    <div v-if="total > perPage" class="flex justify-center">
      <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
    </div>
  </div>
</template>
