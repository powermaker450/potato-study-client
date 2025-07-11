import MainView from "@/components/MainView";
import { useApi } from "@/contexts/ApiProvider";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import type { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastProvider";
import { FlashcardSet } from "@povario/potato-study.js/models";
import FlashcardSetPreview from "@/components/FlashcardSetPreview";
import { Platform } from "react-native";

interface IndexStyleSheet {
  loginWindow?: ComponentProps<typeof Dialog>["style"];
  input?: ComponentProps<typeof TextInput>["style"];
}

export default function Index() {
  const { api, login, baseUrl } = useApi();
  const toast = useToast();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginWindowVisible, setLoginWindowVisible] = useState(false);
  const showLoginWindow = () => setLoginWindowVisible(true);
  const hideLoginWindow = () => setLoginWindowVisible(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles: IndexStyleSheet = {
    input: {
      marginTop: 10,
    },
    ...Platform.select({
      web: {
        loginWindow: { alignSelf: "center" },
      },
    }),
  };

  useEffect(() => {
    async function start() {
      try {
        const res = await api.sets.getAll();
        setSets(res);
        console.log(res);
        setLoading(false);
      } catch (e) {
        const { response } = e as AxiosError<{
          name?: string;
          message?: string;
        }>;
        toast.error(response?.data.message ?? "Unknown error");
        console.error(e);
      }
    }

    start();
  }, []);

  const execLogin = useCallback(async () => {
    try {
      const { token } = await api.auth.login({ email, password });
      await login({ baseUrl, token });

      toast.show("Logged in.");
      hideLoginWindow();
    } catch (e) {
      const { response } = e as AxiosError<{ name?: string; message?: string }>;

      toast.error(response?.data.message ?? "Unknown error");
      console.error(response ?? e);
    }
  }, [email, password]);

  const loadingIcon = <ActivityIndicator animating />;
  const loginWindow = (
    <Portal>
      <Dialog
        style={styles.loginWindow}
        visible={loginWindowVisible}
        onDismiss={hideLoginWindow}
      >
        <Dialog.Title>Log in</Dialog.Title>

        <Dialog.Content>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
          />
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideLoginWindow}>Cancel</Button>
          <Button
            disabled={
              !email.match(/[A-Za-z0-9].*@[A-Za-z0-9].*\.[A-Za-z0-9]/) ||
              !password.trim()
            }
            onPress={execLogin}
          >
            Log in
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Potato Study" />
        <Appbar.Action icon="login" onPress={showLoginWindow} />
      </Appbar.Header>

      <MainView>
        {loading ? loadingIcon : undefined}
        {sets.map((set) => (
          <FlashcardSetPreview key={set.id} set={set} />
        ))}
        {loginWindow}
      </MainView>
    </>
  );
}
