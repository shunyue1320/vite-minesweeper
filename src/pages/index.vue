<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(6, 6, 3)

const state = $computed(() => play.state)

watchEffect(() => {
  play.
})

const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
</script>

<template>
  <div>
    扫雷

    <div>
      <div
        v-for="row, y in [[1,2,3],[1,2,3],[1,2,3]]" :key="y"
        flex="~"
        items-center justify-center w-max ma
      >
        <MineBlock
          v-for="block, x in row" :key="x"
          :block="block"
        />
      </div>
    </div>

    <!-- <Confetti :passed="play.state.value.status === 'won'" /> -->
  </div>
</template>
