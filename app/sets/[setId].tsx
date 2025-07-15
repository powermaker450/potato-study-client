import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { useApi } from "@/contexts/ApiProvider";
import { useToast } from "@/contexts/ToastProvider";
import { ActivityIndicator } from "react-native-paper";
import { FlashcardSet } from "@povario/potato-study.js/models";
import MainView from "@/components/MainView";

export default function SetId() {
  const { api } = useApi();
  const toast = useToast();
  const [set, setSet] = useState<FlashcardSet>();
  const [loading, setLoading] = useState(true);

  const setId = Number(useLocalSearchParams<{ setId: string }>().setId);

  useEffect(() => {
    async function get() {
      try {
        const res = await api.sets.get(setId);
        setSet(res);

        setLoading(false);
      } catch (e) {
        const { response } = e as AxiosError<{
          name?: string;
          message?: string;
        }>;

        toast.error(response?.data.message ?? "Unknown error");
        console.error(response ?? e);
      }
    }

    get();
  }, []);

  useEffect(() => {
    if (!set) {
      return;
    }

    console.log(set);
  }, [set]);

  const loadingIcon = <ActivityIndicator animating />;

  return <MainView>{loading ? loadingIcon : undefined}</MainView>;
}
