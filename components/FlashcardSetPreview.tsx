import { FlashcardSet } from "@povario/potato-study.js/models";
import { ComponentProps } from "react";
import { Card, Text } from "react-native-paper";

interface FlashcardSetPreviewProps {
  set: FlashcardSet;
}

interface FlashcardSetPreviewStyleSheet {
  title: ComponentProps<typeof Text>["style"];
}

const FlashcardSetPreview = ({ set }: FlashcardSetPreviewProps) => {
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

  return (
    <Card>
      <Card.Title title={cardTitle} subtitle={`Created by: ${set.creator}`} />
    </Card>
  );
};

export default FlashcardSetPreview;
