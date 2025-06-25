import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { PotatoStudyApi } from "@povario/potato-study.js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AxiosError } from "axios";

interface ApiProviderProps {
  children: ReactNode;
}

interface ApiLoginOpts {
  baseUrl: string;
  token: string;
}

interface ApiProviderData {
  api: PotatoStudyApi;
  baseUrl: string;
  login: ({ baseUrl, token }: ApiLoginOpts) => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  loading: boolean;
}

const ApiContext = createContext<ApiProviderData | undefined>(undefined);

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [api, setApi] = useState(new PotatoStudyApi("http://localhost", ""));
  const [baseUrl, setBaseUrl] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  async function login({ baseUrl, token }: ApiLoginOpts) {

    if (Platform.OS === "web") {
      localStorage.setItem("token", token);
      localStorage.setItem("baseUrl", baseUrl);
      return;
    }

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("baseUrl", baseUrl);

    setApi(new PotatoStudyApi(baseUrl, token));
    setBaseUrl(baseUrl);
    setLoggedIn(true);
  };

  async function logout() {
    setApi(new PotatoStudyApi("http://localhost", ""));
    setBaseUrl("");
    setLoggedIn(false);

    if (Platform.OS === "web") {
      localStorage.setItem("token", "");
      localStorage.setItem("baseUrl", "");
      return;
    }

    await SecureStore.setItemAsync("token", "");
    await SecureStore.setItemAsync("baseUrl", "");
  }

  async function getLocalCredentials() {
    let token: string | null, baseUrl: string | null;

    if (Platform.OS === "web") {
      token = localStorage.getItem("token");
      baseUrl = localStorage.getItem("baseUrl");
    } else {
      token = await SecureStore.getItemAsync("token");
      baseUrl = await SecureStore.getItemAsync("baseUrl");
    }

    if (baseUrl && token) {
      setApi(new PotatoStudyApi(baseUrl, token));
      setBaseUrl(baseUrl);
    }

    setLoggedIn(!!token);
    setLoading(false);
  }

  useEffect(() => {
    getLocalCredentials();
  }, []);

  useEffect(() => {
    async function checkLoggedIn() {
      // @ts-ignore
      if (api.axios.getUri() === "http://localhost") {
        setLoggedIn(false);
        return;
      }

      try {
        // Perform an authorized action
      } catch (err) {
        if (err instanceof AxiosError) {
          // Show error

          err.status == 401 && await logout();
        }
      }
    }

    checkLoggedIn();
  }, [api]);

  return (
    <ApiContext.Provider
      value={{
        api,
        login,
        logout,
        loggedIn,
        baseUrl,
        loading
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);

  if (context === undefined) {
    throw new Error("useApi must be called within an ApiContext");
  }

  return context;
}
