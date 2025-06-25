import { ComponentProps } from "react";
import MainView from "@/components/MainView";
import { Appbar, TextInput } from "react-native-paper";

export default function Index() {
  const styles: { input: ComponentProps<typeof TextInput>["style"] } = {
    input: {
      marginBottom: 10
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Potato Study" />
      </Appbar.Header>

      <MainView>
        <TextInput
          style={styles.input}
          label="Username"
        />

        <TextInput
          style={styles.input}
          label="Password"
          secureTextEntry
        />
      </MainView>
    </>
  );
}
