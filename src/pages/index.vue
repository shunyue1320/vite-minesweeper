<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(6, 6, 3)

const now = $(useNow())
const timerMS = $computed(() => Math.round(((play.state.value.endMS || +now) - play.state.value.startMS) / 1000))

useStorage('vuesweeper-state', play.state)
const state = $computed(() => play.board)

const mineRest = $computed(() => {
  if (!play.state.value.mineGenerated)
    return play.mines
  return play.blocks.reduce((m, b) => m + (b.mine ? 1 : 0) - (b.flagged ? 1 : 0), 0)
})

function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  let column = Math.floor(document.documentElement.clientWidth / 40)
  if (column < 9)
    column = 9

  switch (difficulty) {
    case 'easy': {
      const width = Math.floor(column / 3)
      play.reset(width, width, Math.round(Math.pow(width, 2) / 10))
      break
    }
    case 'medium':{
      const width = Math.floor(column * (2 / 3))
      play.reset(width, width, Math.round(Math.pow(width, 2) / 10))
      break
    }
    case 'hard':{
      play.reset(column, column, Math.round(Math.pow(column, 2) / 10))
      break
    }
  }
}

const customModel = reactive({
  customRow: 6,
  customCol: 6,
  mineNum: 3,
  show: false,
})
function custom() {
  play.reset(customModel.customCol, customModel.customRow, customModel.mineNum)
  customModel.show = false
}

watchEffect(() => {
  play.checkGameState()
})

</script>

<template>
  <div>
    <div flex="~ gap-10" justify-center>
      <div font-mono>
        扫雷
      </div>
      <div font-mono flex="~ gap-2" items-center>
        <div i-carbon-timer />
        {{ timerMS }}
      </div>
      <div font-mono flex="~ gap-2" items-center>
        <div i-mdi-mine />
        {{ mineRest }}
      </div>
    </div>
    <div flex="~ gap-1" justify-center p4>
      <button btn bg-red hover:bg-red-700 @click="play.reset()">
        重来
      </button>
      <button btn @click="newGame('easy')">
        简单
      </button>
      <button btn @click="newGame('medium')">
        中级
      </button>
      <button btn @click="newGame('hard')">
        困难
      </button>
      <button btn @click="customModel.show = !customModel.show">
        自定义
      </button>
    </div>

    <div v-if="customModel.show" flex="~ gap-1" justify-center items-center p4>
      <span>行</span>
      <input v-model.number="customModel.customRow" w-15>
      <span>列</span>
      <input v-model.number="customModel.customCol" w-15>
      <span>炸弹</span>
      <input v-model.number="customModel.mineNum" w-15>
      <button btn @click="custom">
        确定
      </button>
    </div>

    <div>
      <div
        v-for="row, y in state" :key="y"
        flex="~"
        items-center justify-center w-max ma
      >
        <MineBlock
          v-for="block, x in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @dblclick="play.autoExpand(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>

    <Confetti :passed="play.state.value.status === 'won'" />
  </div>
</template>
