import { useApi } from "@/contexts/ApiProvider";
import { useHeader } from "@/contexts/HeaderProvider";
import { FlashcardCreate } from "@povario/potato-study.js/schema";
import { router, useNavigation } from "expo-router";
import {
  ComponentProps,
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastProvider";
import { Button, TextInput } from "react-native-paper";
import { ScrollView, View } from "react-native";
import FlashcardCreateCard from "@/components/FlashcardCreateCard";

interface CreateStyleSheet {
  view: ComponentProps<typeof ScrollView>["style"];
  input: ComponentProps<typeof TextInput>["style"];
  buttonContainer: ComponentProps<typeof View>["style"];
  button: ComponentProps<typeof Button>["style"];
}

export default function Create() {
  const { api } = useApi();
  const navigation = useNavigation();
  const header = useHeader();
  const toast = useToast();

  useEffect(() => {
    header.setTitle("Create New Set");

    navigation.addListener("beforeRemove", () => {
      header.clearActions();
      header.clearTitle();
    });
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

  const renderCard = (flashcard: FlashcardCreate) => {
    const setText = (text: string) =>
      setFlashcards((current) => {
        const newArray = [...current];
        newArray[flashcard.index] = { ...newArray[flashcard.index], text };

        return newArray;
      });

    const setAnswer = (answer: string) =>
      setFlashcards((current) => {
        const newArray = [...current];
        newArray[flashcard.index] = { ...newArray[flashcard.index], answer };

        return newArray;
      });

    const deleteCard = () =>
      setFlashcards((current) => {
        const newList = current.filter(
          (card) => card.index !== flashcard.index,
        );

        for (let i = flashcard.index; i < newList.length; i++) {
          newList[i].index--;
        }

        return newList;
      });

    return (
      <FlashcardCreateCard
        key={flashcard.index}
        card={flashcard}
        setText={setText}
        setAnswer={setAnswer}
        deleteCard={deleteCard}
      />
    );
  };

  const cardEditors = useMemo<JSX.Element[]>(
    () => flashcards.toSorted((a, b) => a.index - b.index).map(renderCard),
    [flashcards],
  );

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
      const { response } = e as AxiosError<{ name?: string; message?: string }>;

      toast.error(response?.data.message ?? "Unknown error");
      console.error(response ?? e);
    } finally {
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

      {cardEditors}

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
