
import React, { Component } from 'react'
import { Dimensions } from 'react-native';
import { primaryColor, secondaryColor } from '../../../helper';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const styles = {
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: secondaryColor
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
        alignSelf: 'flex-start',
        color: '#000'
    },
    textInput: {
        borderWidth: .4,
        width: '100%',
        borderColor: '#303030',
        borderRadius: 10,
        color: '#FFF'
    },
    rowContent: {
        //  flexDirection: "row",
        alignSelf: 'flex-start'
    },
    subContent: {
        alignSelf: 'flex-start',
        paddingTop: 50
    },
    pickerInput: {
        borderWidth: .4,
        width: '100%',
        borderColor: '#303030',
        borderRadius: 10,
        color: '#FFF',
        width: 180,
        marginTop: -20
    },
    cardView: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    shareView: {
        flexDirection: "row",
        alignSelf: 'flex-start'
    }
}
export default styles;