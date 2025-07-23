import { Stack } from "expo-router";
import { ComponentProps } from "react";
import { useTheme } from "react-native-paper";

export default function SetIdLayout() {
  const theme = useTheme();

  const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
    headerShown: false,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };

  return <Stack screenOptions={screenOptions} />;
}
