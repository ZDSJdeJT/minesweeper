import { toast, type ToastOptions } from 'vue3-toastify'
import { useDark } from '@vueuse/core'

export const useToast = () => {
  const isDark = useDark()

  return (message: string, options: ToastOptions = {}) => {
    toast(message, {
      theme: isDark.value ? 'dark' : 'light',
      position: 'bottom-right',
      ...options
    } as ToastOptions)
  }
}
