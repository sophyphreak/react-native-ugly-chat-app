import React from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { io } from "socket.io-client";

const socket = io("ws://6743-73-32-38-191.ngrok.io");

interface Message {
  message: string;
  timeString: string;
}

function App() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState<string>("");

  React.useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((messages: Message[]) => [...messages, msg]);
      window.scrollTo(0, document.body.scrollHeight);
    });
    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  return (
    <SafeAreaView>
      <View style={{ marginTop: 100 }}>
        <FlatList
          data={messages}
          renderItem={({ item: { timeString, message } }) => (
            <View>
              <Text key={timeString}>{message}</Text>
            </View>
          )}
        />
        <TextInput
          style={{
            padding: 5,
            borderRadius: 5,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: "black",
            margin: 5,
          }}
          autoComplete="off"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <Button
          title="Submit"
          onPress={(e) => {
            e.preventDefault();
            socket.emit("chat message client speaking", inputMessage);
            setInputMessage("");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
