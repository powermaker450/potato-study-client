import { ComponentProps, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dialog,
  Portal,
  useTheme,
  Text,
} from "react-native-paper";
import { useHeader } from "@/contexts/HeaderProvider";
import { View } from "react-native";
import FlashcardSetView from "@/components/FlashcardSetView";
import { useSet } from "@/contexts/SetProvider";
import { useApi } from "@/contexts/ApiProvider";
import { router, useNavigation } from "expo-router";
import { handleAxiosErr } from "@/util/handleAxiosErr";
import { useToast } from "@/contexts/ToastProvider";

interface SetIdStyleSheet {
  viewContent: ComponentProps<typeof View>["style"];
  dialogTitle: ComponentProps<typeof Text>["style"];
}

export default function SetId() {
  const { api } = useApi();
  const { set } = useSet();
  const toast = useToast();
  const header = useHeader();
  const theme = useTheme();
  const navigation = useNavigation();

  const [isOwner, setIsOwner] = useState(false);

  async function get() {
    try {
      const res = await api.users.getSelf();
      setIsOwner(set?.creator === res.id);
    } catch (err) {
      handleAxiosErr(err, toast.error);
    }
  }

  useEffect(() => {
    if (!set) {
      return;
    }

    header.setTitle(set.name);
    get();
  }, [set]);

  useEffect(() => {
    if (!set) {
      return;
    }

    header.clearActions();
    header.pushAction({
      tooltip: "Edit",
      action: {
        icon: "pencil",
        mode: "contained",
        size: 22,
        disabled: !isOwner,
        onPress: () => {
          router.navigate(`/sets/${set.id}/edit`);
          header.clearActions();
        },
      },
    });
    header.pushAction({
      tooltip: "Delete",
      action: {
        icon: "trash-can",
        mode: "contained",
        containerColor: theme.colors.errorContainer,
        iconColor: theme.colors.onErrorContainer,
        size: 22,
        disabled: true,
        onPress: () => {},
      },
    });
  }, [set, isOwner]);

  useEffect(() => {
    navigation.addListener("focus", get);
    navigation.addListener("beforeRemove", header.clearActions);
  }, []);

  const styles: SetIdStyleSheet = {
    viewContent: {
      width: "95%",
      alignSelf: "center",
      justifyContent: "center",
    },
    dialogTitle: {
      fontWeight: "bold",
    },
  };

  const loadingIcon = <ActivityIndicator animating />;

  return (
    <>
      <Portal>
        <Dialog>
          <Dialog.Title>
            <Text style={styles.dialogTitle}>Delete {set?.name}</Text>
          </Dialog.Title>

          <Dialog.Content>
            Are you sure you want to delete this set?
          </Dialog.Content>

          <Dialog.Actions></Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.viewContent}>
        {set ? <FlashcardSetView flashcards={set.flashcards} /> : loadingIcon}
      </View>
    </>
  );
}
