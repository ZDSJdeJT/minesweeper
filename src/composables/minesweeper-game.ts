import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { z } from 'zod';

import { useConfetti, useToast } from '@/composables';

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

enum GameStatus {
  Playing,
  Won,
  Lost,
}

enum BlockStatus {
  // 是否未被“翻开”
  Unrevealed,
  // 是否被“翻开”
  Revealed,
  // 是否被插旗
  Flagged,
}

interface Block {
  // 是否是地雷
  mine: boolean;
  // 状态
  status: BlockStatus;
  // 文本
  text: string;
  // 类名
  class: string;
}

const GameOptionsSchema = z.object({
  key: z.string().default('minesweeper'),
  width: z.number().min(1, { message: 'width must be at least 1' }).default(8),
  height: z
    .number()
    .min(1, { message: 'height must be at least 1' })
    .default(8),
  mineProbability: z
    .number()
    .gt(0, { message: 'mineProbability must be greater than 0' })
    .lt(1, { message: 'mineProbability must be less than 1' })
    .default(0.2),
  blockClass: z
    .string()
    .default('w-8 h-8 border border-gray-600/100 hover:bg-gray-500'),
  blockText: z.string().default('❓'),
  numberClass: z
    .array(z.string())
    .length(9, { message: 'numberClass must have a length of 9' })
    .default([
      'bg-gray-500/30',
      'bg-blue-500/30',
      'bg-green-500/30',
      'bg-red-500/30',
      'bg-purple-500/30',
      'bg-orange-500/30',
      'bg-yellow-500/30',
      'bg-pink-500/30',
      'bg-teal-500/30',
    ]),
  numberText: z
    .array(z.string())
    .length(9, { message: 'numberText must have a length of 9' })
    .default(['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']),
  boomClass: z.string().default('bg-red-900/30'),
  boomText: z.string().default('💥'),
  flagClass: z.string().default('bg-lime-500/30'),
  flagText: z.string().default('🚩'),
  onLost: z
    .function()
    .args()
    .returns(z.void())
    .default(() => () => {
      const toast = useToast();
      toast('Game Over 🔚', { type: 'error' });
    }),
  onWon: z
    .function()
    .args()
    .returns(z.void())
    .optional()
    .default(() => () => {
      const toast = useToast();
      toast('You Won 🎉', { type: 'success' });

      const confetti = useConfetti();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }),
});

export const useMinesweeperGame = (
  options: Partial<z.infer<typeof GameOptionsSchema>> = {},
) => {
  const {
    key,
    height,
    width,
    blockText,
    blockClass,
    mineProbability,
    boomText,
    boomClass,
    numberText,
    numberClass,
    flagText,
    flagClass,
    onLost,
    onWon,
  } = GameOptionsSchema.parse(options);

  const initBoard = (): Block[][] =>
    Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({
        x,
        y,
        mine: false,
        status: BlockStatus.Unrevealed,
        text: blockText,
        class: blockClass,
      })),
    );

  const board = ref<Block[][]>(initBoard());
  useStorage(`${key}Board`, board);

  const status = ref<GameStatus>(GameStatus.Playing);
  useStorage(`${key}Status`, status);

  const minesGenerated = (): boolean => {
    return !board.value
      .flat()
      .every((block) => block.status === BlockStatus.Unrevealed);
  };

  const generateMines = (initialX: number, initialY: number): void => {
    board.value = board.value.map((row, y) =>
      row.map((block, x) => ({
        ...block,
        ...((x !== initialX || y !== initialY) && {
          mine: Math.random() < mineProbability,
        }),
      })),
    );
  };

  const revealAllMineBlock = () => {
    board.value = board.value.map((row, y) =>
      row.map((block, x) => ({
        ...board.value[y][x],
        ...(block.mine && {
          status: BlockStatus.Revealed,
          text: boomText,
          class: `${blockClass} ${boomClass}`,
        }),
      })),
    );
  };

  const lost = () => {
    revealAllMineBlock();
    status.value = GameStatus.Lost;
    onLost();
  };

  const won = () => {
    status.value = GameStatus.Won;
    onWon();
  };

  const checkIsWon = (): void => {
    if (status.value !== GameStatus.Playing) {
      return;
    }
    const mineBlocks: Block[] = [];
    const otherBlocks: Block[] = [];
    board.value.flat().forEach((block) => {
      if (block.mine) {
        mineBlocks.push(block);
        return;
      }
      otherBlocks.push(block);
    });
    if (
      otherBlocks.every((block) => block.status === BlockStatus.Revealed) ||
      (mineBlocks.every((block) => block.status === BlockStatus.Flagged) &&
        otherBlocks.every((block) => block.status !== BlockStatus.Flagged))
    ) {
      won();
    }
  };

  const onReveal = (x: number, y: number): void => {
    if (
      status.value !== GameStatus.Playing ||
      board.value[y][x].status !== BlockStatus.Unrevealed
    ) {
      return;
    }
    if (!minesGenerated()) {
      generateMines(x, y);
    }
    if (board.value[y][x].mine) {
      lost();
      return;
    }
    const queue: number[][] = [[x, y]];
    do {
      const adjacentBlockPositions: number[][] = [];
      let adjacentMines = 0;
      directions.forEach(([dx, dy]) => {
        const position = [queue[0][0] + dx, queue[0][1] + dy];
        const block = board.value[position[1]]?.[position[0]];
        if (block) {
          adjacentBlockPositions.push(position);
          if (block.mine) {
            adjacentMines++;
          }
        }
      });
      board.value[queue[0][1]][queue[0][0]] = {
        ...board.value[queue[0][1]][queue[0][0]],
        status: BlockStatus.Revealed,
        text: numberText[adjacentMines],
        class: `${blockClass} ${numberClass[adjacentMines]}`,
      };
      if (adjacentMines === 0) {
        queue.push(
          ...adjacentBlockPositions.filter(
            (position) =>
              board.value[position[1]][position[0]].status ===
              BlockStatus.Unrevealed,
          ),
        );
      }
      queue.shift();
    } while (queue.length > 0);
    checkIsWon();
  };

  const onFlag = (x: number, y: number): void => {
    if (
      status.value !== GameStatus.Playing ||
      board.value[y][x].status === BlockStatus.Revealed
    ) {
      return;
    }
    if (!minesGenerated()) {
      generateMines(x, y);
    }
    if (board.value[y][x].status === BlockStatus.Unrevealed) {
      board.value[y][x] = {
        ...board.value[y][x],
        status: BlockStatus.Flagged,
        text: flagText,
        class: `${blockClass} ${flagClass}`,
      };
    } else {
      board.value[y][x] = {
        ...board.value[y][x],
        status: BlockStatus.Unrevealed,
        text: blockText,
        class: blockClass,
      };
    }
    checkIsWon();
  };

  const onReset = (): void => {
    board.value = initBoard();
    status.value = GameStatus.Playing;
  };

  return { board, onReveal, onFlag, onReset };
};
