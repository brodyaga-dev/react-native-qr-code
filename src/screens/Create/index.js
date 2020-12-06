import React, { Component, Fragment } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './styles'
import {
    TouchableOpacity,
    Text,
    StatusBar,
    Button,
    View,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    SafeAreaView,

    Image,
    ToastAndroid,
    Platform,
    PermissionsAndroid

} from 'react-native';

import QRCode from 'react-native-qrcode-svg';

import RNFS from "react-native-fs"

import CameraRoll from "@react-native-community/cameraroll";

import Share from 'react-native-share';
import { primaryColor } from '../../../helper';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
}


class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scan: true,
            ScanResult: false,
            result: null,
            value: '',
        };
    }


    shareQRCode = () => {
        this.svg.toDataURL((data) => {
            this.setState({ base64: data })
            console.log({ data })
            let shareImageBase64 = {
                type: 'image/png',
                title: 'Qr',
                url: `data:image/png;base64,${data}`,
            };
            Share.open(shareImageBase64).catch(error => console.log(error));
        })
        // console.log({ dd: this.getDataURL() })
        //getDataURL


        /*
        //  this.svg.toDataURL(this.ShareCallback);
        let shareImageBase64 = {
            type: 'image/jpg',
            title: '',
            message: '',
            url: this.svg
        };
        Share.share(shareImageBase64).catch(error => console.log(error));
        */
    };

    /*
      title: 'React Native',
            type: 'image/png',
            url: `data:image/png;base64,${dataURL}`,
            subject: 'Share Link', //  for email
  */
    ShareCallback(dataURL) {
        console.log({ dataURL });
        let shareImageBase64 = {
            title: 'App link',
            type: 'image/png',
            message: 'Please install this app and stay safe',
            //   url: `data:image/png;base64,${dataURL}`,
            url: `data:image/png;base64,${dataURL}`,
        };
        // Share.open(shareImageBase64).catch(error => console.log(error));
        Share.share(shareImageBase64).catch(error => console.log(error));
    }

    /*
    componentDidUpdate = () => {
        if (this.state.value) {
            this.setState({
                base64: `data:image/png;base64,${this.svg}`
            })
        }
    }
    */

    // get base64 string encode of the qrcode (currently logo is not included)
    getDataURL = () => {
        // this.svg.toDataURL(this.callback);

        return this.svg.toDataURL()
    }

    callback = (dataURL) => {
        //  console.log({dataURL});
        console.log({ dataURL: this.svg });
        return dataURL
    }


    saveQrToDisk = async () => {

        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            ToastAndroid.show("Uygulama kayıt işlemine izin vermeniz gerekiyor!")
            return;
        }


        this.svg.toDataURL((data) => {
            const imageName = `${RNFS.CachesDirectoryPath}/qr${new Date().getTime()}.png`
            RNFS.writeFile(imageName, data, 'base64')
                .then((success) => {
                    return CameraRoll.save(imageName, 'photo')
                })
                .then(() => {
                    this.setState({ busy: false, imageSaved: true })
                    ToastAndroid.show('Kayıt Başarılı !!', ToastAndroid.SHORT)
                })
        })
    }

    render() {
        const { value, ScanResult, result } = this.state
        return (

            <View style={styles.scrollViewStyle}>

                <View style={styles.cardView}>
                    {
                        value
                            ?
                            <QRCode
                                getRef={c => (this.svg = c)}
                                size={204}
                                value={value.toString()}
                            />
                            :
                            null
                    }
                </View>

                <View style={{ flex: 2, paddingTop: 20 }}>
                    <TextInput
                        autoFocus={true}
                        placeholderTextColor='rgba(28,53,63, .7)'
                        placeholder="Şifrelemek istediğiniz metni buraya giriniz"
                        autoCorrect={false}
                        keyboardType="default"
                        autoCapitalize="none"
                        style={{
                            width: '100%',
                            borderColor: primaryColor,
                            borderWidth: 0.6,
                            padding: 10,
                            borderRadius: 10,
                            color: '#fff',

                        }}
                        value={this.state.value}
                        onChangeText={text => this.setState({ value: text })}
                        multiline={true}
                        underlineColorAndroid='transparent'
                    />

                    {
                        value
                            ?
                            <>
                                <TouchableOpacity onPress={this.shareQRCode}>
                                    <View style={{ width: '100%', borderRadius: 10, backgroundColor: '#fff', padding: 10, marginTop: 20, marginBottom: 5 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <AntDesign name="sharealt" />
                                            <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>
                                                PAYLAŞ
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.saveQrToDisk}>
                                    <View style={{ width: '100%', borderRadius: 10, backgroundColor: '#fff', padding: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialIcons name="save-alt" />
                                            <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>
                                                GALERİYE KAYDET
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </>
                            :
                            null
                    }
                </View>

            </View >

        );
    }
}


/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    scrollView: {
        backgroundColor: 'pink',
        marginHorizontal: 20,
    },
    text: {
        fontSize: 42,
    },
});
*/

export default Create;


/*



  <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>


                    <View style={styles.scrollViewStyle}>

                        <View style={styles.cardView}>
                            {
                                value
                                    ?
                                    <QRCode
                                        size={204}
                                        value={value.toString()}
                                    />
                                    :
                                    null
                            }

                        </View>

                        <View style={{ flex: 2, paddingTop: 50 }}>
                            <TextInput
                                placeholder="Şifrelemek istediğiniz metni buraya giriniz"
                                // numberOfLines={3}
                                //style={styles.input}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    borderBottomColor: 'red',
                                    //  borderBottomWidth: 0,
                                    borderColor: 'red',
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 10,
                                    color: '#fff'
                                }}
                                value={this.state.value}
                                onChangeText={text => this.setState({ value: text })}
                                multiline={true}
                                underlineColorAndroid='transparent'
                            />
                        </View>

                    </View>


                </ScrollView>
            </SafeAreaView>



  <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.scrollViewStyle}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{
                        padding: 24,
                        flex: 1,
                        justifyContent: "space-around"
                    }}>

                        <View style={styles.scrollViewStyle}>

                            <View style={styles.cardView}>
                                {
                                    value
                                        ?
                                        <QRCode
                                            size={204}
                                            value={value.toString()}
                                        />
                                        :
                                        null
                                }

                            </View>

                            <View style={{ flex: 2, paddingTop: 50 }}>
                                <TextInput
                                    placeholder="Şifrelemek istediğiniz metni buraya giriniz"
                                    // numberOfLines={3}
                                    //style={styles.input}
                                    style={{
                                        width: '100%',
                                        height: 40,
                                        borderBottomColor: 'red',
                                        //  borderBottomWidth: 0,
                                        borderColor: 'red',
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 10,
                                        color: '#fff'
                                    }}
                                    value={this.state.value}
                                    onChangeText={text => this.setState({ value: text })}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                />
                            </View>

                        </View>



                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>




            */