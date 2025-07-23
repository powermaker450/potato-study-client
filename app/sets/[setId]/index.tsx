import { useNavigation } from "expo-router";
import { ComponentProps, useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useHeader } from "@/contexts/HeaderProvider";
import { View } from "react-native";
import FlashcardSetView from "@/components/FlashcardSetView";
import { useSet } from "@/contexts/SetProvider";

interface SetIdStyleSheet {
  viewContent: ComponentProps<typeof View>["style"];
}

export default function SetId() {
  const navigation = useNavigation();
  const header = useHeader();
  const { set } = useSet();

  useEffect(() => {
    navigation.addListener("beforeRemove", () => {
      header.clearTitle();
    });
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
