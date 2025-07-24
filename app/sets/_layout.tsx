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
import { ComponentProps } from "react";
import { useTheme } from "react-native-paper";

export default function RootLayout() {
  const theme = useTheme();

  const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
    headerShown: false,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };

  return <Stack screenOptions={screenOptions} />;
}
