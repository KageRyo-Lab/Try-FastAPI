import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, Text, View, Keyboard } from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const onButtonPress = async () => {
  Keyboard.dismiss();
  console.log('User Input : ' + this.state.text);

  // 將輸入文字轉換成 CSV 格式
  const csvData = `${this.state.text}\n`;

  // 建立暫存檔案
  const fileName = `${FileSystem.cacheDirectory}temp.csv`;
  await FileSystem.writeAsStringAsync(fileName, csvData, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  console.log(`CSV file created at ${fileName}`);
};

export default class TextInputSample extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress = async () => {
    Keyboard.dismiss();
    console.log('User Input : ' + this.state.text);

    const csvData = `${this.state.text}\n`;
    const fileName = `${FileSystem.cacheDirectory}temp.csv`;
    await FileSystem.writeAsStringAsync(fileName, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log(`CSV file created at ${fileName}`);

    // 讀取檔案內容
    const fileContent = await FileSystem.readAsStringAsync(fileName, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    console.log('File content:', fileContent);

    // 建立 FormData 物件
    const formData = new FormData();
    formData.append('file', {
      uri: fileName,
      name: 'temp.csv',
      type: 'text/csv',
    });
    console.log('FormData:', formData);
    axios.post('http://192.168.0.148:8000/uploadfile/', formData, {headers : {
      'Accept': 'application/json',
      'content-Type': 'multipart/form-data',
    }})
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error sending data: ", error);
      });

      axios.get('http://192.168.0.148:8000/')
        .then(response => {
          console.log(response.data);
        })
  };

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.textCenter}>{this.state.text}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.number}
        />
        <Button title="送出" onPress={async () => {
          await this.onButtonPress();
        }} />
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textCenter: {
      color: 'black',
      fontSize: 40,
      padding: 20,
    },
    input: {
      height: 40,
      width: 200,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });