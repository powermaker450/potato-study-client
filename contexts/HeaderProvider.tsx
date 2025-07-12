import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { Appbar, Button, Dialog, Portal, TextInput } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useApi } from "./ApiProvider";
import { useToast } from "./ToastProvider";
import type { AxiosError } from "axios";

interface HeaderProviderProps {
  children?: ReactNode;
}

interface ActionPush {
  icon: IconSource;
  onPress: ComponentProps<(typeof Appbar)["Action"]>["onPress"];
}

interface HeaderProviderData {
  title: string;
  setTitle: (title: string) => void;
  clearTitle: () => void;
  pushAction: (action: ActionPush) => void;
  removeAction: (icon: IconSource) => void;
  clearActions: () => void;
}

const HeaderContext = createContext<HeaderProviderData | undefined>(undefined);

interface HeaderProviderStyleSheet {
  input: ComponentProps<typeof TextInput>["style"];
  loginWindow?: ComponentProps<typeof Dialog>["style"];
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  const { api, baseUrl, login } = useApi();
  const toast = useToast();

  const [loginWindowVisible, setLoginWindowVisible] = useState(false);
  const showLoginWindow = () => setLoginWindowVisible(true);
  const hideLoginWindow = () => setLoginWindowVisible(false);

  const [title, setTitle] = useState("Potato Study");
  const clearTitle = () => setTitle("Potato Study");

  const [actions, setActions] = useState<ActionPush[]>([]);
  const pushAction: HeaderProviderData["pushAction"] = (action) =>
    setActions((current) => current.concat(action));
  const removeAction: HeaderProviderData["removeAction"] = (icon) =>
    setActions((current) => current.filter((action) => action.icon !== icon));
  const clearActions = () => setActions([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordHidden = () => setPasswordHidden((current) => !current);
  const invalidData = useMemo<boolean>(
    () =>
      !email.match(/[A-Za-z0-9].*@[A-Za-z0-9].*\.[A-Za-z0-9]/) ||
      !password.trim(),
    [email, password],
  );

  const styles: HeaderProviderStyleSheet = {
    input: {
      marginBottom: 10,
    },
    ...Platform.select({
      web: {
        loginWindow: { alignSelf: "center" },
      },
    }),
  };

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
            mode="outlined"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            textContentType="emailAddress"
          />

          <TextInput
            style={styles.input}
            mode="outlined"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={passwordHidden}
            textContentType="password"
            right={
              <TextInput.Icon
                icon={passwordHidden ? "eye" : "eye-off"}
                onPress={togglePasswordHidden}
              />
            }
          />

          <Dialog.Actions>
            <Button onPress={hideLoginWindow}>Cancel</Button>

            <Button disabled={invalidData} onPress={execLogin}>
              Log in
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );

  return (
    <HeaderContext.Provider
      value={{
        title,
        setTitle,
        clearTitle,
        pushAction,
        removeAction,
        clearActions,
      }}
    >
      <Appbar.Header>
        <Appbar.Content title={title} />

        <Appbar.Action icon="login" onPress={showLoginWindow} />
        {actions.map((action) => (
          <Appbar.Action icon={action.icon} onPress={action.onPress} />
        ))}
      </Appbar.Header>

      {loginWindow}
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);

  if (context === undefined) {
    throw new Error("useHeader must be called within a HeaderContext");
  }

  return context;
};
