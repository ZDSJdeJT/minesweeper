import { useDark } from '@vueuse/core';
import { toast, type ToastOptions } from 'vue3-toastify';

export const useToast = () => {
  const isDark = useDark();

  return (message: string, options: ToastOptions = {}) => {
    toast(message, {
      theme: isDark.value ? 'dark' : 'light',
      position: 'bottom-right',
      ...options,
    } as ToastOptions);
  };
};
