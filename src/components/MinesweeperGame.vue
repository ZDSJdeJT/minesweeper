<script setup lang="ts">
import { vOnLongPress } from '@vueuse/components';

import { useMinesweeperGame } from '@/composables';

const { board, onReveal, onFlag, onReset } = useMinesweeperGame();
</script>

<template>
  <div
    class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
    role="alert"
  >
    <svg
      class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
      />
    </svg>
    <span class="sr-only">Tips</span>
    <div>
      <span class="font-medium">Tips:</span>
      <ul class="mt-1.5 list-disc list-inside">
        <li>Double-click a block to reveal it. 🖱️</li>
        <li>Right-click to place/remove a flag. 🚩</li>
        <li>Mark potential mines with flags. ⚠️</li>
        <li>Numbers show nearby mines. 🔢</li>
        <li>Use logic to clear safe areas. 🧠</li>
      </ul>
    </div>
  </div>
  <div class="text-nowrap select-none">
    <div v-for="(row, y) in board" :key="y">
      <button
        v-for="(block, x) in row"
        :key="x"
        type="button"
        :class="block.class"
        v-on-long-press.prevent="
          () => {
            onFlag(x, y);
          }
        "
        @dblclick="onReveal(x, y)"
        @contextmenu.prevent="onFlag(x, y)"
      >
        {{ block.text }}
      </button>
    </div>
  </div>
  <button
    type="button"
    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    @click="onReset"
  >
    Reset 🔁
  </button>
</template>
