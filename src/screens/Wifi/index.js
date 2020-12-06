import React, { Component, Fragment } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './styles'
import {
    TouchableOpacity,
    Text,
    View,
    TextInput,
    ToastAndroid,
    Platform,
    PermissionsAndroid

} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker'

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


class Wifi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scan: true,
            ScanResult: false,
            result: null,
            ssid: '',
            password: '',
            value: '',
            encryptionType: 'wpawpa2',
            isHiddenNetwork: false
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

    };

    saveQrToDisk = async () => {

        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            ToastAndroid.show("Uygulama kayıt işlemine izin vermeniz gerekiyor!")
            return;
        }

        this.svg.toDataURL((data) => {
            const imageName = `${RNFS.CachesDirectoryPath}/qr-${this.state.ssid}-${new Date().getTime()}.png`
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
        const { ssid, password, encryptionType, isHiddenNetwork } = this.state

        //   WIFI:T:WPA;S:piyanos;P:sifre;H:true;
        const value = `WIFI:T:${encryptionType};S:${ssid};P:${password};H:${isHiddenNetwork};`
        return (

            <View style={styles.container}>
                <View style={styles.cardView}>
                    <QRCode
                        getRef={c => (this.svg = c)}
                        size={90}
                        value={value.toString()}
                    />
                </View>


                <Text
                    style={styles.label}
                >
                    SSID
            </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Bağlanmak istediğiniz wifi ismi"
                    onChangeText={text => this.setState({ ssid: text })}
                    value={ssid}
                />

                <Text
                    style={styles.label}
                >
                    Şifre
            </Text>
                <TextInput
                    placeholder="Bağlanmak istediğiniz wifi şifresi"
                    style={styles.textInput}
                    onChangeText={text => this.setState({ password: text })}
                    value={password}
                />


                <View style={styles.subContent}>
                    <View style={styles.rowContent}>
                        <Text style={styles.label}>
                            Şifreleme
            </Text>
                        <Picker
                            selectedValue={encryptionType}
                            style={styles.pickerInput}
                            onValueChange={(itemValue, itemIndex) => this.setState({ encryptionType: itemValue })}
                        >
                            <Picker.Item label="WPA/WPA2" value="wpawpa2" />
                            <Picker.Item label="WEP" value="wep" />
                            <Picker.Item label="none" value="None" />
                        </Picker>
                    </View>

                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={isHiddenNetwork}
                            onValueChange={(isHiddenNetwork) => this.setState({ isHiddenNetwork })}
                            style={styles.checkbox}
                        />
                        <Text style={styles.label}>Gizli ağ?</Text>
                    </View>
                </View>
                {
                    ssid
                        ?
                        <>
                            <View style={{ height: 40, flexDirection: "row" }}>
                                <TouchableOpacity onPress={this.shareQRCode}
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 0.5, borderRadius: 10, backgroundColor: '#fff', padding: 10 }}>

                                    <AntDesign name="sharealt" />
                                    <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>
                                        PAYLAŞ
                        </Text>
                                </TouchableOpacity>
                                <View style={{ flex: 0.02 }} />
                                <TouchableOpacity onPress={this.saveQrToDisk}
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 0.5, borderRadius: 10, backgroundColor: '#fff', padding: 10 }}>
                                    <MaterialIcons name="save-alt" />
                                    <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>
                                        GALERİYE KAYDET
                                            </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                        :
                        null
                }

            </View>

        );
    }
}


export default Wifi;

