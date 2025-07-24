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

import { useSet } from "@/contexts/SetProvider";
import { FlashcardSet, User } from "@povario/potato-study.js/models";
import { router } from "expo-router";
import { ComponentProps } from "react";
import { Card, Text } from "react-native-paper";

interface FlashcardSetPreviewProps {
  set: FlashcardSet;
  users: Map<number, User> | undefined;
}

interface FlashcardSetPreviewStyleSheet {
  title: ComponentProps<typeof Text>["style"];
}

const FlashcardSetPreview = ({ set, users }: FlashcardSetPreviewProps) => {
  const { setSetId } = useSet();

  const styles: FlashcardSetPreviewStyleSheet = {
    title: {
      fontWeight: "bold",
    },
  };

  const cardTitle = (
    <Text style={styles.title} variant="titleLarge">
      {set.name}
    </Text>
  );

  const goTo = () => {
    setSetId(set.id);
    router.navigate(`/sets/${set.id}`);
  };

  return (
    <Card onPress={goTo}>
      <Card.Title
        title={cardTitle}
        subtitle={`Created by: ${users?.get(set.creator)?.username ?? "Unknown user"}`}
      />
    </Card>
  );
};

export default FlashcardSetPreview;
