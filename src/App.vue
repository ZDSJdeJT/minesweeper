<script setup lang="ts">
import MinesweeperGame from '@/components/MinesweeperGame.vue';
import ModeToggle from '@/components/ModeToggle.vue';
</script>

<template>
  <div class="w-full p-8 flex flex-col justify-center items-center gap-6">
    <ModeToggle />
    <MinesweeperGame />
  </div>
</template>
