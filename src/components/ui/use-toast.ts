
// This file acts as a re-exporter from hooks/use-toast
import { useToast as hookUseToast, toast as hookToast, Toast, ToastActionElement, ToastProps } from "@/hooks/use-toast";

export const useToast = hookUseToast;
export const toast = hookToast;
export type { Toast, ToastActionElement, ToastProps };
