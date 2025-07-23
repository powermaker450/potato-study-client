import { useApi } from "@/contexts/ApiProvider";
import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useToast } from "@/contexts/ToastProvider";
import { FlashcardSet, User } from "@povario/potato-study.js/models";
import FlashcardSetPreview from "@/components/FlashcardSetPreview";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { handleAxiosErr } from "@/util/handleAxiosErr";

interface IndexStyleSheet {
  view: ComponentProps<typeof View>["style"];
}

export default function Index() {
  const navigation = useNavigation();
  const { api } = useApi();
  const toast = useToast();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [users, setUsers] = useState<Map<number, User>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSets() {
      try {
        const res = await api.sets.getAll();
        setSets(res);
      } catch (e) {
        handleAxiosErr(e, toast.error);
      } finally {
        setLoading(false);
      }
    }

    async function getUsers() {
      try {
        const res = await api.users.getAll();
        const data = new Map<number, User>();

        for (const user of res) {
          data.set(user.id, user);
        }

        setUsers(data);
      } catch (e) {
        handleAxiosErr(e, toast.error);
      }
    }

    navigation.addListener("focus", () => {
      getUsers();
      getSets();
    });
  }, []);

  const styles: IndexStyleSheet = {
    view: {
      flex: 1,
      width: "95%",
      alignSelf: "center",
      alignItems: "stretch",
      gap: 15,
    },
  };

  const loadingIcon = <ActivityIndicator animating />;

  return (
    <View style={styles.view}>
      {loading ? loadingIcon : undefined}
      {sets.map((set) => (
        <FlashcardSetPreview key={set.id} set={set} users={users} />
      ))}
    </View>
  );
}
