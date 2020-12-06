import React, { Component, Fragment } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle'
import {
    TouchableOpacity,
    Text,
    StatusBar,
    Linking,
    View,
    ToastAndroid
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import WifiManager from "react-native-wifi-reborn";

import Share from 'react-native-share';

import { PermissionsAndroid } from 'react-native';


class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scan: true,
            ScanResult: false,
            result: null,
            flash: false,
            cameraType: 'back',
            autoFocus: true,
        };
    }

    componentDidMount = () => {
        //  Linking.openURL('https://piyanos.com')
    }

    onSuccess = (e) => {
        const check = e.data.substring(0, 4);
        console.log('scanned data' + check);
        if (check === 'http') {
            Linking
                .openURL(e.data)
                .catch(err => console.error('An error occured', err));


        }
        else if (check == "WIFI") {
            this.connectWifi(e.data)
            this.setState({
                scan: false,
            })
        }
        else {
            this.setState({
                result: e,
                scan: false,
                ScanResult: true
            })
        }

    }


    shareQRCode = () => {
        let options = {
            title: 'Qr',
            message: this.state.result.data
        };
        Share.open(options).catch(error => console.log(error));
    };



    connectWifi = async (data) => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'WiFi bağlantıları için konum izni gerekli',
                message:
                    'Kablosuz ağları taramak için gerekli olduğundan bu uygulamanın konum iznine ihtiyacı var.',
                buttonNegative: 'REDDET',
                buttonPositive: 'İZİN VER',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // ok
            try {
                const splits = data.split(";")
                const sSsid = splits.find(v => v.includes("S:"))
                const sPassword = splits.find(v => v.includes("P:"))
                const myssid = sSsid.substring(sSsid.lastIndexOf("S:") + 2)
                const mypassword = sPassword.substring(sSsid.lastIndexOf("P:") + 3)
                const sType = splits.find(v => v.includes("T:"))
                const myType = sType.substring(sType.lastIndexOf("T:") + 2)
                console.log({ myssid, mypassword, myType })
                //myType == "WEP" ? true : false
                WifiManager.connectToProtectedSSID(myssid.toString(), mypassword.toString(), myType == "WEP" ? true : false)
                    .then(
                        () => {
                            console.log("Connected successfully!");
                            ToastAndroid.show(`${myssid} ile bağlantı başarılı!`, ToastAndroid.LONG)
                        },
                        (err) => {
                            console.log("Connection failed!", err);
                            ToastAndroid.show(`${myssid} ile bağlantı kurulamadı!`, ToastAndroid.SHORT)
                        }
                    );

            } catch (error) {
                console.log(error)
            }
        } else {
            // Permission denied
        }
    }

    activeQR = () => {
        this.setState({
            scan: true
        })
    }
    scanAgain = () => {
        this.setState({
            scan: true,
            ScanResult: false
        })
    }
    render() {
        // this.scanner.reactivate()
        const { scan, ScanResult, result, cameraType, flash, autoFocus } = this.state
        const desccription = `QR kodu (Hızlı Yanıt Kodundan kısaltılır), ilk olarak 1994 yılında Japonya'daki otomotiv endüstrisi için tasarlanmış bir tür matris barkodunun (veya iki boyutlu barkodun) ticari markasıdır. Barkod, bağlı olduğu öğe hakkında bilgi içeren, makine tarafından okunabilir bir optik etikettir. Pratikte, QR kodları genellikle bir web sitesine veya uygulamaya işaret eden bir konum belirleyici, tanımlayıcı veya izleyici için veriler içerir. Bir QR kodu, verileri verimli bir şekilde depolamak için dört standartlaştırılmış kodlama modu (sayısal, alfasayısal, bayt / ikili ve kanji) kullanır; uzantılar da kullanılabilir.`
        return (
            <View style={styles.scrollViewStyle}>
                <StatusBar translucent backgroundColor="transparent" />
                <Fragment>
                    {!scan && !ScanResult &&
                        <View style={styles.cardView} >
                            <Text numberOfLines={18} style={styles.descText}>{desccription}</Text>

                            <TouchableOpacity onPress={this.activeQR}
                                style={styles.buttonTouchable}>
                                <AntDesign style={styles.bottonIcon} name="scan1" />
                                <Text style={styles.buttonTextStyle}>TARA</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    {ScanResult &&
                        <Fragment>
                            <Text style={styles.textTitle1}>Sonuç</Text>
                            <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                                <Text>{result.data}</Text>

                                <>
                                    <View style={{ height: 40, flexDirection: "row", marginBottom: 10 }}>
                                        <TouchableOpacity onPress={this.shareQRCode}
                                            style={styles.buttonTouchable}>

                                            <AntDesign name="sharealt" style={styles.buttonTextStyle} />
                                            <Text style={styles.buttonTextStyle}>
                                                PAYLAŞ
                                             </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>

                                <TouchableOpacity onPress={this.scanAgain} style={styles.buttonTouchable}>
                                    <Text style={styles.buttonTextStyle}>YENİDEN TARA!</Text>
                                </TouchableOpacity>

                            </View>
                        </Fragment>
                    }


                    {scan &&
                        <QRCodeScanner
                            permissionDialogMessage="Kamera erişim izni verilmesi gerekiyor"
                            permissionDialogTitle="Bilgi"
                            flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                            markerStyle={{ borderColor: '#FFF', borderWidth: .2 }}
                            reactivate={true}
                            cameraType={cameraType}
                            showMarker={true}
                            cameraStyle={styles.cameraStyle}
                            topViewStyle={styles.topViewStyle}
                            ref={(node) => { this.scanner = node }}
                            onRead={this.onSuccess}
                            bottomContent={
                                <View style={{ paddingTop: 100, alignItems: 'center', }}>

                                    <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ cameraType: cameraType == 'back' ? 'front' : 'back' })
                                        }} style={styles.iconsView}>
                                            <AntDesign style={styles.bottonIcon} name="sync" />
                                        </TouchableOpacity>
                                        <View style={{ width: 5 }} />
                                        {
                                            /*
                                             <TouchableOpacity onPress={() => { this.setState({ autoFocus: !autoFocus }) }}
                                             style={styles.iconsView}>
                                             <MaterialIcons style={styles.bottonIcon} name="filter-center-focus" />
                                         </TouchableOpacity>
                                         */
                                        }
                                        <TouchableOpacity onPress={() => { this.setState({ flash: !flash }) }}
                                            style={styles.iconsView}>
                                            <Entypo style={styles.bottonIcon} name="flashlight" />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.setState({ scan: false })}>
                                        <MaterialIcons style={styles.bottonIcon} name="stop" />
                                        <Text style={styles.buttonTextStyle}>DURDUR</Text>
                                    </TouchableOpacity>
                                </View>

                            }
                        />
                    }
                </Fragment>
            </View>

        );
    }
}



export default Scan;