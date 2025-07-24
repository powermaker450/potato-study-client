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

import { FlashcardSet } from "@povario/potato-study.js/models";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi } from "./ApiProvider";
import { handleAxiosErr } from "@/util/handleAxiosErr";
import { useToast } from "./ToastProvider";
import { useLocalSearchParams } from "expo-router";

interface SetProviderProps {
  children?: ReactNode;
}

interface SetProviderData {
  set: FlashcardSet | undefined;
  setSetId: (setId: number) => Promise<void>;
  refreshSetData: () => Promise<void>;
  clearSet: () => void;
}

const SetContext = createContext<SetProviderData | undefined>(undefined);

export const SetProvider = ({ children }: SetProviderProps) => {
  const { api } = useApi();
  const toast = useToast();
  const { setId } = useLocalSearchParams<{ setId: string }>();

  const [tried, setTried] = useState(false);
  const [set, setSet] = useState<FlashcardSet>();

  // The app upon first load has no ID set. If the user is on a /sets/:setId page,
  // this will try to extract it and set the ID ourselves.
  useEffect(() => {
    if (tried || set) {
      return;
    }

    const id = Number(setId);
    if (!id) {
      return;
    }

    setSetId(id);
  }, []);

  async function getSetData(id: number) {
    setTried(false);

    try {
      const res = await api.sets.get(id);
      setSet(res);
    } catch (err) {
      handleAxiosErr(err, toast.error);
    } finally {
      setTried(true);
    }
  }

  const setSetId = useCallback(
    async (id: number) => {
      if (set?.id === id) {
        return;
      }

      getSetData(id);
    },
    [set],
  );

  async function refreshSetData() {
    if (!set?.id) {
      return;
    }

    getSetData(set.id);
  }

  function clearSet() {
    setSet(undefined);
    setTried(false);
  }

  return (
    <SetContext.Provider value={{ set, setSetId, refreshSetData, clearSet }}>
      {children}
    </SetContext.Provider>
  );
};

export const useSet = () => {
  const context = useContext(SetContext);

  if (context === undefined) {
    throw new Error("useSet must be called within a SetProvider");
  }

  return context;
};
