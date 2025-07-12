import MainView from "@/components/MainView";
import { useApi } from "@/contexts/ApiProvider";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
} from "react-native-paper";
import type { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastProvider";
import { FlashcardSet } from "@povario/potato-study.js/models";
import FlashcardSetPreview from "@/components/FlashcardSetPreview";

export default function Index() {
  const { api } = useApi();
  const toast = useToast();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function start() {
      try {
        const res = await api.sets.getAll();
        setSets(res);
        console.log(res);
        setLoading(false);
      } catch (e) {
        const { response } = e as AxiosError<{
          name?: string;
          message?: string;
        }>;
        toast.error(response?.data.message ?? "Unknown error");
        console.error(e);
      }
    }

    start();
  }, []);

  const loadingIcon = <ActivityIndicator animating />;

  return (
    <MainView>
      {loading ? loadingIcon : undefined}
      {sets.map((set) => (
        <FlashcardSetPreview key={set.id} set={set} />
      ))}
    </MainView>
  );
}
