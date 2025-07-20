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

  const goTo = () => router.navigate(`/sets/${set.id}`);

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
