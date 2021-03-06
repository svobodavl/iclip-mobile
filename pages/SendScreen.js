import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
  Keyboard,
  Clipboard
} from "react-native";
import { Icon, Input } from "react-native-elements";
import QRCode from "react-native-qrcode-svg";
import { isURL } from "../functions";
import { iclipUri } from "../Vars";
import { styles, imgCheck, urlValidation, colors, checkError } from "../Pages";

export function SendScreen({ navigation }) {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API

  // after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();

  useEffect(() => {
    setText(text.replace(" ", "").toLowerCase());
    fetch(`http://uni.hys.cz/includes/api?url=${text}`)
      .then((response) => response.text())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    setLoading(true);
  }, [text]);
  return (
    <View
      style={{
        backgroundColor: colorScheme === "dark" ? colors.darkContent : colors.lightContent,
        color: colorScheme === "dark" ? "#ffffff" : "#000000",
        flex: 1,
      }}
    >
      <View
        style={{ marginBottom: Platform.OS === "ios" ? "20%" : "5%" }}
      ></View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            style={styles.previewImg}
            source={{
              uri: imgCheck(data, text)
                ? `https://external.iclip.trnck.dev/image?url=${data}`
                : "https://raw.githubusercontent.com/aperta-principium/Interclip/master/img/interclip_logo.png",
            }}
          />
        </TouchableOpacity>
        <Input
          keyboardType={Platform.OS === "android" ? "default" : "url"}
          style={{
            ...styles.container,
            color: colorScheme === "dark" ? "white" : "black",
          }}
          placeholder="Your URL here"
          inputStyle={{ fontSize: 25 }}
          autoCorrect={false}
          autoCompleteType={"off"}
          returnKeyType={Platform.OS === "android" ? "none" : "done"}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: "red" }}
          autoCapitalize="none"
          autoFocus={true}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            Keyboard.dismiss;
          }}
        />
        {urlValidation(text) && (
          <View style={{ padding: 24 }}>
            <Text
              style={{
                color: colorScheme === "dark" ? colors.light : colors.text,
              }}
            >
              {urlValidation(text)}
            </Text>
          </View>
        )}
        <View style={{ padding: 24, flexDirection: "row" }}>
          {isLoading ? (
            <Text></Text>
          ) : (
            <Text
              onLongPress={() => {
                Clipboard.setString(data)
              }}
              style={{
                color: colorScheme === "dark" ? colors.light : colors.text,
                backgroundColor:
                  checkError(data) & !urlValidation(text)
                    ? colors.errorColor
                    : null,
                fontSize: 40,
                marginLeft: "20%",
              }}
            >
              {!urlValidation(text) && data}
            </Text>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View
              style={{
                ...styles.centeredView,
                backgroundColor: colorScheme === "dark" ? "#444" : "#fff",
              }}
            >
              <View>
                <QRCode
                  value={`https://iclip.netlify.app/r/${data}`}
                  size={250}
                  logo={{ uri: iclipUri }}
                  logoSize={60}
                  logoBackgroundColor="white"
                />
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Hide QR Code</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          {isURL(text) && (
            <Icon
              type="font-awesome" // The icon is loaded from the font awesome icon library
              name="qrcode" // Icon fa-qrcode
              color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
              style={{ width: 70 }}
              onPress={() => {
                setModalVisible(true);
              }}
              size={50}
            />
          )}
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}
