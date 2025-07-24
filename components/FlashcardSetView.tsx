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

import { Flashcard } from "@povario/potato-study.js/models";
import { ComponentProps, useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  Card,
  IconButton,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";

interface FlashcardSetViewProps {
  flashcards: Flashcard[];
}

interface FlashcardSetViewStyleSheet {
  view: ComponentProps<typeof View>["style"];
  card: ComponentProps<typeof Card>["style"];
  title: ComponentProps<typeof Card.Title>["titleStyle"];
  content: ComponentProps<typeof Card.Content>["style"];
  contentText: ComponentProps<typeof Text>["style"];
  pager: ComponentProps<typeof View>["style"];
  icon: ComponentProps<typeof Avatar.Icon>["style"];
}

const FlashcardSetView = ({ flashcards }: FlashcardSetViewProps) => {
  const theme = useTheme();

  const [display, setDisplay] = useState<"text" | "answer">("text");
  const displayIsText = display === "text";
  const toggleDisplay = () =>
    setDisplay((current) => (current === "text" ? "answer" : "text"));
  const resetDisplay = () => (displayIsText ? undefined : setDisplay("text"));

  const [currentIndex, setCurrentIndex] = useState(0);
  const incrementCurrentIndex = () => {
    resetDisplay();
    setCurrentIndex((current) => current + 1);
  };
  const decrementCurrentIndex = () => {
    resetDisplay();
    setCurrentIndex((current) => current - 1);
  };

  const reachedEnd = currentIndex - 1 < 0;
  const reachedStart = currentIndex + 1 > flashcards.length - 1;
  const currentCard = flashcards[currentIndex];

  const styles: FlashcardSetViewStyleSheet = {
    view: {
      gap: 10,
    },
    card: {
      paddingBottom: 20,
    },
    title: {
      fontWeight: "bold",
      color: displayIsText ? undefined : theme.colors.primary,
    },
    content: {
      alignSelf: "center",
      margin: 100,
    },
    contentText: {
      color: displayIsText ? undefined : theme.colors.primary,
      fontWeight: displayIsText ? undefined : "bold",
    },
    pager: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    icon: {
      backgroundColor: theme.colors[displayIsText ? "secondary" : "primary"],
    },
  };

  const icon = (props: { size: number }) => (
    <Avatar.Icon
      {...props}
      style={styles.icon}
      color={theme.colors[displayIsText ? "onSecondary" : "onPrimary"]}
      icon={displayIsText ? "help" : "check"}
    />
  );

  return (
    <View style={styles.view}>
      <Card style={styles.card} onPress={toggleDisplay}>
        <Card.Title
          titleStyle={styles.title}
          titleVariant="headlineLarge"
          title={`Card ${currentCard.index + 1}`}
          left={icon}
        />

        <Card.Content style={styles.content}>
          <Text style={styles.contentText} variant="titleLarge">
            {currentCard[display]}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.pager}>
        <IconButton
          mode="contained"
          icon="chevron-left"
          onPress={decrementCurrentIndex}
          disabled={reachedEnd}
        />

        <Text>
          {currentIndex} / {flashcards.length - 1}
        </Text>

        <IconButton
          mode="contained"
          icon="chevron-right"
          onPress={incrementCurrentIndex}
          disabled={reachedStart}
        />
      </View>

      <ProgressBar progress={currentIndex / (flashcards.length - 1)} />
    </View>
  );
};

export default FlashcardSetView;
