import { useDark } from '@vueuse/core';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const isDark = useDark();

  return (options: confetti.Options) => {
    confetti({
      colors: isDark
        ? ['#ff6347', '#4682b4', '#8a2be2', '#ffd700', '#32cd32']
        : ['#00bfff', '#ff69b4', '#ffda44', '#32a852', '#7a4fff'],
      ...options,
    });
  };
};
