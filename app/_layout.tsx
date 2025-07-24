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

import { Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { ComponentProps, useMemo } from "react";
import { ApiProvider } from "@/contexts/ApiProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { HeaderProvider } from "@/contexts/HeaderProvider";
import { SetProvider } from "@/contexts/SetProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const fonts = configureFonts({
    config: {
      fontFamily: Platform.select({
        web: '"Inter Variable", Inter, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      }),
    },
  });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark, fonts }
        : { ...MD3LightTheme, colors: theme.light, fonts },
    [colorScheme, theme],
  );

  const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
    headerShown: false,
    contentStyle: {
      backgroundColor: paperTheme.colors.background,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <ToastProvider>
        <ApiProvider>
          <SetProvider>
            <HeaderProvider>
              <Stack screenOptions={screenOptions} />
            </HeaderProvider>
          </SetProvider>
        </ApiProvider>
      </ToastProvider>
    </PaperProvider>
  );
}
