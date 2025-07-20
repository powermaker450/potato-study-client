import { useApi } from "@/contexts/ApiProvider";
import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import type { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastProvider";
import { FlashcardSet } from "@povario/potato-study.js/models";
import FlashcardSetPreview from "@/components/FlashcardSetPreview";
import { View } from "react-native";

interface IndexStyleSheet {
  view: ComponentProps<typeof View>["style"];
}

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

  const styles: IndexStyleSheet = {
    view: {
      flex: 1,
      width: "95%",
      alignSelf: "center",
      alignItems: "stretch",
      gap: 15,
    },
  };

  const loadingIcon = <ActivityIndicator animating />;

  return (
    <View style={styles.view}>
      {loading ? loadingIcon : undefined}
      {sets.map((set) => (
        <FlashcardSetPreview key={set.id} set={set} />
      ))}
    </View>
  );
}
