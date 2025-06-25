import { ComponentProps, useState } from "react";
import MainView from "@/components/MainView";
import { Appbar, Button, TextInput } from "react-native-paper";
import { useApi } from "@/contexts/ApiProvider";
import { PotatoStudyApi } from "@povario/potato-study.js";

export default function Index() {
  const { api, login, logout } = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles: { input: ComponentProps<typeof TextInput>["style"] } = {
    input: {
      marginBottom: 10
    }
  };

  async function setup() {
    console.log({ email, password });
    const res = await PotatoStudyApi.login("http://localhost:8080", { email, password });
    console.log(res);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Potato Study" />
      </Appbar.Header>

      <MainView>
        <TextInput
          style={styles.input}
          label="Username"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button onPress={setup}>Login</Button>
      </MainView>
    </>
  );
}
