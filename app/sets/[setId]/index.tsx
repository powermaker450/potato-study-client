/*
 * potato-study-client: The official client for potato-study
 * Copyright (C) 2025  povario
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
  const { api, loggedIn } = useApi();
  const { set } = useSet();
  const toast = useToast();
  const header = useHeader();
  const theme = useTheme();
  const navigation = useNavigation();

  const [isOwner, setIsOwner] = useState(false);

  async function get() {
    if (!loggedIn) {
      return;
    }

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
        <Dialog visible={false}>
          <Dialog.Title>
            <Text style={styles.dialogTitle}>Delete {set?.name}</Text>
          </Dialog.Title>

          <Dialog.Content>
            Are you sure you want to delete this set?
          </Dialog.Content>

          <Dialog.Actions>
            <></>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.viewContent}>
        {set ? <FlashcardSetView flashcards={set.flashcards} /> : loadingIcon}
      </View>
    </>
  );
}
