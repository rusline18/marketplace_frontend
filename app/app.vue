<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'ru' },
  titleTemplate: title => title ? `${title} — Маркетплейс` : 'Маркетплейс',
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
