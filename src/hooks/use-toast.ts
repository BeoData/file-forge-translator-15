
// Import directly from ui/toast
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast as useShadcnToast,
} from "@/components/ui/toast"

export const useToast = useShadcnToast;
export const toast = useShadcnToast().toast;
export type { Toast, ToastActionElement, ToastProps }
