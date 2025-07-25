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

import {
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { FlashcardCreate } from "@povario/potato-study.js/schema";
import { ComponentProps, Dispatch, SetStateAction, useMemo } from "react";
import { View } from "react-native";

interface FlashcardCreateCardProps {
  card: FlashcardCreate;
  setFlashcards: Dispatch<SetStateAction<FlashcardCreate[]>>;
}

interface FlashcardCreateCardStyleSheet {
  surface: ComponentProps<typeof Surface>["style"];
  input: ComponentProps<typeof TextInput>["style"];
  buttonContainer: ComponentProps<typeof View>["style"];
  indexText: ComponentProps<typeof Text>["style"];
}

const FlashcardCreateCard = ({
  card,
  setFlashcards,
}: FlashcardCreateCardProps) => {
  const theme = useTheme();

  const setText = (text: string) =>
    setFlashcards((current) => {
      const newArray = [...current];
      newArray[card.index] = { ...newArray[card.index], text };

      return newArray;
    });

  const setAnswer = (answer: string) =>
    setFlashcards((current) => {
      const newArray = [...current];
      newArray[card.index] = { ...newArray[card.index], answer };

      return newArray;
    });

  const deleteCard = () =>
    setFlashcards((current) => {
      const newArray = current.filter(
        (flashcard) => flashcard.index !== card.index,
      );

      for (let i = card.index; i < newArray.length; i++) {
        newArray[i].index--;
      }

      return newArray;
    });

  const styles = useMemo<FlashcardCreateCardStyleSheet>(
    () => ({
      surface: {
        padding: 5,
        paddingBottom: 20,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceVariant,
      },
      input: {
        marginTop: 7.5,
        marginBottom: 7.5,
        marginLeft: 15,
        marginRight: 15,
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      indexText: {
        marginTop: 15,
        marginLeft: 15,
        fontWeight: "bold",
      },
    }),
    [theme],
  );

  return (
    <Surface style={styles.surface}>
      <View style={styles.buttonContainer}>
        <Text style={styles.indexText} variant="bodyLarge">
          #{card.index + 1}
        </Text>

        <IconButton
          iconColor={theme.colors.onError}
          containerColor={theme.colors.error}
          icon="trash-can"
          size={22}
          onPress={deleteCard}
        />
      </View>

      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="Text"
        value={card.text}
        onChangeText={setText}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="Answer"
        value={card.answer}
        onChangeText={setAnswer}
      />
    </Surface>
  );
};

export default FlashcardCreateCard;
