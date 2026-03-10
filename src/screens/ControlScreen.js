import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ControlScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ROBOT_IP = "198.168.111.50";

  const sendCommand = async (command) => {
    try {
        await fetch(`http://${ROBOT_IP}/${command}`);
        console.log("Command sent:", command);
    } catch (err) {
        console.log("Robot connection error:", err);
    }
};

  const handleComeToMe = () => {
    if (passwordInput === "Arav") {
      setModalVisible(false);
      setPasswordInput("");
      sendCommand("come_to_me");
      Alert.alert("Access Granted", "Robot is coming to you.");
    } else {
      Alert.alert("Access Denied", "Incorrect password.");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>ViewBot Control Center</Text>

      {/* Forward */}
      <TouchableOpacity
        style={styles.arrowBtn}
        onPress={() => sendCommand("forward")}
      >
        <Text style={styles.arrow}>▲</Text>
      </TouchableOpacity>

      {/* Left / Stop / Right */}
      <View style={styles.middleRow}>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => sendCommand("left")}
        >
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopBtn}
          onPress={() => sendCommand("brake")}
        >
          <Text style={styles.stopText}>STOP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => sendCommand("right")}
        >
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>

      </View>

      {/* Backward */}
      <TouchableOpacity
        style={styles.arrowBtn}
        onPress={() => sendCommand("backward")}
      >
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Come To Me Button */}
      <TouchableOpacity
        style={styles.comeBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.comeText}>Come To Me</Text>
      </TouchableOpacity>

      {/* Password Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Enter Password</Text>

            <TextInput
              style={styles.input}
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              placeholder="Password"
            />

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleComeToMe}
            >
              <Text style={styles.modalBtnText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setPasswordInput("");
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40
  },

  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },

  arrowBtn: {
    backgroundColor: "#2563EB",
    width: 80,
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },

  arrow: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold"
  },

  stopBtn: {
    backgroundColor: "#DC2626",
    width: 90,
    height: 90,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },

  stopText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  comeBtn: {
    marginTop: 40,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10
  },

  comeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center"
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15
  },

  modalBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6
  },

  modalBtnText: {
    color: "white",
    fontWeight: "bold"
  },

  cancel: {
    marginTop: 10,
    color: "#6B7280"
  }

});