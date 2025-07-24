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

import { useApi } from "@/contexts/ApiProvider";
import { useHeader } from "@/contexts/HeaderProvider";
import { FlashcardCreate } from "@povario/potato-study.js/schema";
import { router } from "expo-router";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastProvider";
import { Button, TextInput } from "react-native-paper";
import { ScrollView, View } from "react-native";
import FlashcardCreateCard from "@/components/FlashcardCreateCard";
import { handleAxiosErr } from "@/util/handleAxiosErr";

interface CreateStyleSheet {
  view: ComponentProps<typeof ScrollView>["style"];
  input: ComponentProps<typeof TextInput>["style"];
  buttonContainer: ComponentProps<typeof View>["style"];
  button: ComponentProps<typeof Button>["style"];
}

export default function Create() {
  const { api } = useApi();
  const header = useHeader();
  const toast = useToast();

  useEffect(() => {
    header.setTitle("Create New Set");
  }, []);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [flashcards, setFlashcards] = useState<FlashcardCreate[]>([
    {
      index: 0,
      text: "",
      answer: "",
    },
    {
      index: 1,
      text: "",
      answer: "",
    },
  ]);

  const add = useCallback(
    () =>
      setFlashcards((current) =>
        current.concat([
          {
            index: current.length,
            text: "",
            answer: "",
          },
        ]),
      ),
    [flashcards],
  );

  // When the number of flashcards are updated, the header doesn't
  // re-render without pushing a new action with the button disabled...
  useEffect(() => {
    header.removeAction("send");
    header.pushAction({
      tooltip: "Create set",
      action: {
        mode: "contained",
        icon: "send",
        size: 22,
        onPress: create,
        disabled: loading || flashcards.length === 0,
      },
    });
  }, [loading, flashcards]);

  const styles: CreateStyleSheet = {
    view: {
      width: "95%",
      margin: "auto",
    },
    input: {
      marginBottom: 10,
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

  const create = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.sets.create({ name, flashcards });
      router.replace(`/sets/${res.id}`);
    } catch (e) {
      handleAxiosErr(e, toast.error);
    } finally {
      header.clearTitle();
      header.clearActions();
      setLoading(false);
    }
  }, [name, flashcards]);

  return (
    <ScrollView style={styles.view}>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Name"
        value={name}
        onChangeText={setName}
      />

      {flashcards
        .toSorted((a, b) => a.index - b.index)
        .map((flashcard) => (
          <FlashcardCreateCard card={flashcard} setFlashcards={setFlashcards} />
        ))}

      <View style={styles.buttonContainer}>
        <Button style={styles.button} mode="contained-tonal" onPress={add}>
          Add
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={create}
          disabled={loading || flashcards.length === 0}
        >
          Create
        </Button>
      </View>
    </ScrollView>
  );
}
