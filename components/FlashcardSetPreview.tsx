import { FlashcardSet } from "@povario/potato-study.js/models";
import { Card, Text } from "react-native-paper";

interface FlashcardSetPreviewProps {
  set: FlashcardSet;
}

const FlashcardSetPreview = ({ set }: FlashcardSetPreviewProps) => {
  return (
    <Card>
      <Card.Title title={set.name} subtitle={`Created by: ${set.creator}`} />
      <Card.Content>
        {set.flashcards.map((card) => (
          <Text
            key={card.id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {card.text}
          </Text>
        ))}
      </Card.Content>
    </Card>
  );
};

export default FlashcardSetPreview;
