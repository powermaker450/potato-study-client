import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useHeader } from "@/contexts/HeaderProvider";
import { View } from "react-native";
import FlashcardSetView from "@/components/FlashcardSetView";
import { useSet } from "@/contexts/SetProvider";
import { useApi } from "@/contexts/ApiProvider";

interface SetIdStyleSheet {
  viewContent: ComponentProps<typeof View>["style"];
}

export default function SetId() {
  const { api } = useApi();
  const { set } = useSet();
  const header = useHeader();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!set) {
      return;
    }

    async function get() {
      if (!set) {
        return;
      }

      const res = await api.users.getSelf();
      setIsOwner(set.creator === res.id);
    }

    header.setTitle(set.name);
    get();
  }, [set]);

  useEffect(() => {
    header.clearActions();

    isOwner &&
      header.pushAction({
        tooltip: "Edit",
        action: {
          icon: "pencil",
          mode: "contained",
          size: 22,
          disabled: !isOwner,
        },
      });
  }, [isOwner]);

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
