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
  token?: string;
}

interface ApiProviderData {
  api: PotatoStudyApi;
  baseUrl: string;
  login: ({ token }: ApiLoginOpts) => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  loading: boolean;
}

const ApiContext = createContext<ApiProviderData | undefined>(undefined);

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const url = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:8080";

  const [api, setApi] = useState(
    new PotatoStudyApi(url),
  );
  const [baseUrl, setBaseUrl] = useState(url);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  async function login({ token }: ApiLoginOpts) {
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
      new PotatoStudyApi(url, ""),
    );

    if (available) {
      await SecureStoreWrapper.setItem("token", "");
      await SecureStoreWrapper.setItem("baseUrl", "");
    } else {
      LocalStorageWrapper.setItem("token", "");
      LocalStorageWrapper.setItem("baseUrl", "");
    }

    setBaseUrl(url);
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
      setApi(new PotatoStudyApi(localBaseUrl, localToken ?? undefined));
    setBaseUrl(localBaseUrl ?? url);

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
