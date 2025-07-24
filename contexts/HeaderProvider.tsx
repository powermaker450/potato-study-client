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

import {
  ComponentElement,
  ComponentProps,
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  Tooltip,
  useTheme,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useApi } from "./ApiProvider";
import { useToast } from "./ToastProvider";
import { router, usePathname } from "expo-router";
import { handleAxiosErr } from "@/util/handleAxiosErr";

interface HeaderProviderProps {
  children?: ReactNode;
}

interface ActionPush {
  tooltip: string;
  action: ComponentProps<typeof Appbar.Action>;
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
  label: ComponentProps<typeof Text>["style"];
  labelLink: ComponentProps<typeof Text>["style"];
  loginWindow?: ComponentProps<typeof Dialog>["style"];
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  const { api, login, logout, loggedIn } = useApi();
  const theme = useTheme();
  const toast = useToast();
  const path = usePathname();

  const [loginWindowVisible, setLoginWindowVisible] = useState(false);
  const showLoginWindow = () => setLoginWindowVisible(true);
  const hideLoginWindow = () => setLoginWindowVisible(false);

  const [logoutWindowVisible, setLogoutWindowVisible] = useState(false);
  const showLogoutWindow = () => setLogoutWindowVisible(true);
  const hideLogoutWindow = () => setLogoutWindowVisible(false);

  const [loginAction, setLoginAction] = useState<"login" | "register">("login");
  const setActionLogin = () => setLoginAction("login");
  const setActionRegister = () => setLoginAction("register");

  const [title, setTitle] = useState("Potato Study");
  const clearTitle = () => setTitle("Potato Study");

  const [actions, setActions] = useState<ActionPush[]>([]);
  const pushAction: HeaderProviderData["pushAction"] = (action) =>
    setActions((current) => current.concat(action));
  const removeAction: HeaderProviderData["removeAction"] = (icon) =>
    setActions((current) =>
      current.filter((value) => value.action.icon !== icon),
    );
  const clearActions = () => setActions([]);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordHidden = () => setPasswordHidden((current) => !current);

  const invalidLoginData =
    !email.match(/[A-Za-z0-9].*@[A-Za-z0-9].*\.[A-Za-z0-9]/) ||
    !password.trim();
  const invalidRegisterData = invalidLoginData || !username.trim();

  const showCreate = useMemo<boolean>(
    () => loggedIn && path !== "/sets/create",
    [loggedIn, path],
  );

  const styles: HeaderProviderStyleSheet = {
    input: {
      marginBottom: 10,
    },
    label: {
      color: theme.colors.secondary,
      marginBottom: 10,
    },
    labelLink: {
      color: theme.colors.primary,
      fontWeight: "bold",
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
      await login({ token });

      toast.show("Logged in.");
      hideLoginWindow();
    } catch (e) {
      handleAxiosErr(e, toast.error);
    }
  }, [email, password]);

  const execRegister = useCallback(async () => {
    try {
      const { token } = await api.auth.register({ email, username, password });
      await login({ token });

      toast.show("Logged in.");
      hideLoginWindow();
    } catch (e) {
      handleAxiosErr(e, toast.error);
    }
  }, [email, username, password]);

  const execLogout = async () => {
    await logout();
    toast.show("Logged out.");
    setLogoutWindowVisible(false);
  };

  const handleEnter: ComponentProps<typeof TextInput>["onKeyPress"] = ({
    nativeEvent,
  }) => {
    if (invalidLoginData) {
      return;
    }

    nativeEvent.key === "Enter" && execLogin();
  };

  const loginContent = (
    <>
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
        onKeyPress={handleEnter}
        right={
          <TextInput.Icon
            icon={passwordHidden ? "eye" : "eye-off"}
            onPress={togglePasswordHidden}
          />
        }
      />

      <Text style={styles.label} variant="labelLarge">
        Don't have an account?{" "}
        <Text style={styles.labelLink} onPress={setActionRegister}>
          Register
        </Text>
      </Text>

      <Dialog.Actions>
        <Button onPress={hideLoginWindow}>Cancel</Button>

        <Button disabled={invalidLoginData} onPress={execLogin}>
          Log in
        </Button>
      </Dialog.Actions>
    </>
  );

  const registerContent = (
    <>
      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        textContentType="username"
      />

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
        textContentType="password"
        secureTextEntry
      />

      <Text style={styles.label} variant="labelLarge">
        Already have an account?{" "}
        <Text style={styles.labelLink} onPress={setActionLogin}>
          Log in
        </Text>
      </Text>

      <Dialog.Actions>
        <Button onPress={hideLoginWindow}>Cancel</Button>

        <Button disabled={invalidRegisterData} onPress={execRegister}>
          Register
        </Button>
      </Dialog.Actions>
    </>
  );

  const loginWindow = (
    <Portal>
      <Dialog
        style={styles.loginWindow}
        visible={loginWindowVisible}
        onDismiss={hideLoginWindow}
      >
        <Dialog.Title>
          {loginAction === "login" ? "Log in" : "Register"}
        </Dialog.Title>

        <Dialog.Content>
          {loginAction === "login" ? loginContent : registerContent}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );

  const logoutWindow = (
    <Portal>
      <Dialog
        style={styles.loginWindow}
        visible={logoutWindowVisible}
        onDismiss={hideLogoutWindow}
      >
        <Dialog.Title>Log out</Dialog.Title>

        <Dialog.Content>
          <Text>Are you sure you want to log out?</Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideLogoutWindow}>Cancel</Button>
          <Button onPress={execLogout}>Log out</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const back = () =>
    router.canGoBack() ? router.back() : router.navigate("/");

  const backAction = useMemo<JSX.Element | undefined>(
    () => (path !== "/" ? <Appbar.BackAction onPress={back} /> : undefined),
    [path],
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
        {backAction}

        <Appbar.Content title={title} />

        {actions.map((value, index) => (
          <Tooltip key={index} title={value.tooltip}>
            <Appbar.Action {...value.action} />
          </Tooltip>
        ))}

        {showCreate ? (
          <Tooltip title="Create new set">
            <Appbar.Action
              icon="plus"
              onPress={() => router.navigate("/sets/create")}
            />
          </Tooltip>
        ) : undefined}

        <Tooltip title={loggedIn ? "Account" : "Log in"}>
          <Appbar.Action
            icon={loggedIn ? "account" : "login"}
            onPress={loggedIn ? showLogoutWindow : showLoginWindow}
          />
        </Tooltip>
      </Appbar.Header>

      {loginWindow}
      {logoutWindow}
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
