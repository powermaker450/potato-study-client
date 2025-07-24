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
import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useToast } from "@/contexts/ToastProvider";
import { FlashcardSet, User } from "@povario/potato-study.js/models";
import FlashcardSetPreview from "@/components/FlashcardSetPreview";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { handleAxiosErr } from "@/util/handleAxiosErr";
import { useHeader } from "@/contexts/HeaderProvider";

interface IndexStyleSheet {
  view: ComponentProps<typeof View>["style"];
}

export default function Index() {
  const { api } = useApi();
  const navigation = useNavigation();
  const toast = useToast();
  const header = useHeader();

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

    navigation.addListener("focus", async () => {
      header.clearActions();
      header.clearTitle();

      await getUsers();
      await getSets();
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
