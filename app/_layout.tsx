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
