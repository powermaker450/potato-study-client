import type { AxiosError } from "axios";
import type { useToast } from "@/contexts/ToastProvider";

export function handleAxiosErr(
  e: unknown,
  display: ReturnType<typeof useToast>["error"],
) {
  const { response } = e as AxiosError<{
    name?: string;
    message?: string;
  }>;

  display(response?.data.message ?? "Unknown error");
  console.error(response ?? e);
}
