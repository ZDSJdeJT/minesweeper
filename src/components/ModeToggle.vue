<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button type="button" class="fixed top-0 right-0 m-4" @click="toggleDark()">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>
