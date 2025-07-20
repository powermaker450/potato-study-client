import { useLocalSearchParams, useNavigation } from "expo-router";
import { ComponentProps, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { useApi } from "@/contexts/ApiProvider";
import { useToast } from "@/contexts/ToastProvider";
import { ActivityIndicator } from "react-native-paper";
import { FlashcardSet } from "@povario/potato-study.js/models";
import { useHeader } from "@/contexts/HeaderProvider";
import { View } from "react-native";
import FlashcardSetView from "@/components/FlashcardSetView";

interface SetIdStyleSheet {
  viewContent: ComponentProps<typeof View>["style"];
}

export default function SetId() {
  const { api } = useApi();
  const navigation = useNavigation();
  const toast = useToast();
  const header = useHeader();

  const [set, setSet] = useState<FlashcardSet>();
  const setId = Number(useLocalSearchParams<{ setId: string }>().setId);

  useEffect(() => {
    navigation.addListener("beforeRemove", () => {
      header.clearTitle();
    });

    async function get() {
      try {
        const res = await api.sets.get(setId);
        setSet(res);
        header.setTitle(res.name);
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

  const styles: SetIdStyleSheet = {
    viewContent: {
      width: "95%",
      alignSelf: "center",
      justifyContent: "center",
    },
  };

  const loadingIcon = <ActivityIndicator animating />;

  return (
    <View style={styles.viewContent}>
      {set ? <FlashcardSetView flashcards={set.flashcards} /> : loadingIcon}
    </View>
  );
}
