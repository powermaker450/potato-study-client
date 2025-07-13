import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { PotatoStudyApi } from "@povario/potato-study.js";
import SecureStoreWrapper from "@/util/SecureStoreWrapper";
import LocalStorageWrapper from "@/util/LocalStorageWrapper";

interface ApiProviderProps {
  children: ReactNode;
}

interface ApiLoginOpts {
  baseUrl: string;
  token?: string;
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
  const { EXPO_PUBLIC_BASE_URL } = process.env;

  const [api, setApi] = useState(
    new PotatoStudyApi(EXPO_PUBLIC_BASE_URL ?? "http://localhost:8080", ""),
  );
  const [baseUrl, setBaseUrl] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  async function login({ baseUrl, token }: ApiLoginOpts) {
    const available = await SecureStoreWrapper.isAvailableAsync();

    if (available) {
      token && (await SecureStoreWrapper.setItem("token", token));
      await SecureStoreWrapper.setItem("baseUrl", baseUrl);
    } else {
      token && LocalStorageWrapper.setItem("token", token);
      LocalStorageWrapper.setItem("baseUrl", baseUrl);
    }

    setApi(new PotatoStudyApi(baseUrl, token));
    setBaseUrl(baseUrl);
    setLoggedIn(true);
  }

  async function logout() {
    const available = await SecureStoreWrapper.isAvailableAsync();

    setApi(
      new PotatoStudyApi(EXPO_PUBLIC_BASE_URL ?? "http://localhost:8080", ""),
    );

    if (available) {
      await SecureStoreWrapper.setItem("token", "");
      await SecureStoreWrapper.setItem("baseUrl", "");
    } else {
      LocalStorageWrapper.setItem("token", "");
      LocalStorageWrapper.setItem("baseUrl", "");
    }

    setBaseUrl(EXPO_PUBLIC_BASE_URL ?? "http://localhost:8080");
    setLoggedIn(false);
  }

  async function getLocalCredentials() {
    const available = await SecureStoreWrapper.isAvailableAsync();

    const localToken = available
      ? await SecureStoreWrapper.getItem("token")
      : LocalStorageWrapper.getItem("token");

    const localBaseUrl = available
      ? await SecureStoreWrapper.getItem("baseUrl")
      : LocalStorageWrapper.getItem("baseUrl");

    localBaseUrl &&
      setApi(new PotatoStudyApi(baseUrl, localToken ?? undefined));
    setBaseUrl(localBaseUrl ?? EXPO_PUBLIC_BASE_URL ?? "http://localhost:8080");

    setLoggedIn(!!localToken);
    setLoading(false);
  }

  useEffect(() => {
    getLocalCredentials();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        api,
        login,
        logout,
        loggedIn,
        baseUrl,
        loading,
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
};
