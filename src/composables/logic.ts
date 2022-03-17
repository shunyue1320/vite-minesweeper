import type { Ref } from 'vue'
import type { BlockState } from '~/types'

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

type GameStatus = 'play' | 'won' | 'lost'

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  status: GameStatus
  startMS: number
  endMS?: number
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(
    public width: number,
    public height: number,
    public mines: number,
  ) {
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  get blocks() {
    return this.state.value.board.flat() as BlockState[]
  }

  reset(
    width = this.width,
    height = this.height,
    mines = this.mines,
  ) {
    this.width = width
    this.height = height
    this.mines = mines

    this.state.value = {
      startMS: +Date.now(),
      mineGenerated: false,
      status: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x, y, adjacentMines: 0, revealed: false,
        })),
      ),
    }
  }

  checkGameState() {
    if (!this.state.value.mineGenerated)
      return
    const blocks = this.board.flat()

    if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
      if (blocks.some(block => block.flagged && !block.mine))
        this.onGameOver('lost')

      else
        this.onGameOver('won')
    }
  }
}
