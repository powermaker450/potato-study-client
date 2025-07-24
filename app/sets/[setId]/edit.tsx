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

import FlashcardCreateCard from "@/components/FlashcardCreateCard";
import { useApi } from "@/contexts/ApiProvider";
import { useHeader } from "@/contexts/HeaderProvider";
import { useSet } from "@/contexts/SetProvider";
import { useToast } from "@/contexts/ToastProvider";
import { handleAxiosErr } from "@/util/handleAxiosErr";
import { FlashcardCreate } from "@povario/potato-study.js/schema";
import { router } from "expo-router";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface EditStyleSheet {
  view: ComponentProps<typeof ScrollView>["style"];
  buttonContainer: ComponentProps<typeof View>["style"];
  button: ComponentProps<typeof Button>["style"];
}

export default function Edit() {
  const { api } = useApi();
  const { set, refreshSetData } = useSet();
  const toast = useToast();
  const theme = useTheme();
  const header = useHeader();

  useEffect(() => {
    header.removeAction("pencil");
  }, []);

  const [loading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const [flashcards, setFlashcards] = useState<FlashcardCreate[]>(
    set?.flashcards.map(({ index, text, answer }) => ({
      index,
      text,
      answer,
    })) ?? [],
  );

  const styles: EditStyleSheet = {
    view: {
      width: "95%",
      alignSelf: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 10,
      marginBottom: 20,
      justifyContent: "center",
    },
    button: {
      marginLeft: 5,
      marginRight: 5,
    },
  };

  const add = () =>
    setFlashcards((current) =>
      current.concat([
        {
          index: current.length,
          text: "",
          answer: "",
        },
      ]),
    );

  const modify = useCallback(async () => {
    if (!set) {
      return;
    }

    startLoading();

    try {
      await api.sets.update(set.id, { name: set.name, flashcards });

      stopLoading();
      refreshSetData();
      router.replace(`/sets/${set.id}`);
    } catch (err) {
      handleAxiosErr(err, toast.error);
    }
  }, [flashcards]);

  return (
    <ScrollView style={styles.view}>
      {flashcards
        .toSorted((a, b) => a.index - b.index)
        .map((flashcard) => (
          <FlashcardCreateCard
            key={flashcard.index}
            card={flashcard}
            setFlashcards={setFlashcards}
          />
        ))}

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained-tonal"
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          onPress={router.back}
        >
          Cancel
        </Button>

        <Button style={styles.button} mode="contained-tonal" onPress={add}>
          Add
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={modify}
          disabled={loading}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
}
