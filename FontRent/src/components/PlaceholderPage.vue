<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold text-slate-900">{{ title }}</h1>
    <p class="mt-2 text-slate-600">This page is coming soon.</p>
  </main>
</template>
