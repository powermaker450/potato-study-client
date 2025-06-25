import { ReactNode } from "react";
import { View } from "react-native";

interface MainViewProps {
  children: ReactNode;
}

const MainView = ({ children }: MainViewProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {children}
    </View>
  )
};

export default MainView;
