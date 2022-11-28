import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../contexts/AuthContext'

import { auth } from '../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LoginScreen = () => {
    const {setUser, setLogged} = React.useContext(AuthContext);

    const [resource, setResource] = React.useState({
        email: '',
        pass: ''
    }) 
    const [registerMode, setRegisterMode] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleChange = (key,text) => {
        setResource({...resource, [key]: text.toLowerCase() })
    }

    const handleClickGoogle = async () => {
        setLoading(true)
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        provider.setCustomParameters({
            prompt: "select_account"
        });

        await signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setLoading(false)
                console.log(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                setLoading(false)
                console.log(errorCode, ' => ',errorMessage )
                // ...
            });
    }

    const handleClickLogin = async () => {
        setLoading(true)
        signInWithEmailAndPassword(auth, resource.email, resource.pass)
            .then( async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                setLogged(true)
                await AsyncStorage.setItem('poke-user', JSON.stringify(user))
                await AsyncStorage.setItem('poke-logged', JSON.stringify(true))
                setLoading(false)
                // ...
            })
            .catch(async (error) => {
                const errorMessage = error.message;
                setLogged(false)
                setUser(null)
                await AsyncStorage.removeItem('poke-user')
                await AsyncStorage.removeItem('poke-logged')
                setLoading(false)
                console.log('errorMessage',errorMessage)
            });
    }

    const handleClickRegister = async () => {
        setLoading(true)
        if(resource.pass.length >= 6){
            createUserWithEmailAndPassword(auth, resource.email, resource.pass)
                .then( async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    setUser(user)
                    setLogged(true)
                    await AsyncStorage.setItem('poke-user', JSON.stringify(user))
                    await AsyncStorage.setItem('poke-logged', JSON.stringify(true))
                    setLoading(false)
                    // ...
                })
                .catch(async (error) => {
                    const errorMessage = error.message;
                    setLogged(false)
                    setUser(null)
                    await AsyncStorage.removeItem('poke-user')
                    await AsyncStorage.removeItem('poke-logged')
                    setLoading(false)
                    console.log('errorMessage',errorMessage)
                    // ..
                });
        }else{
            setLoading(false)
            Alert.alert('La contraseña tiene que tener minimo 6 caracteres.')
        }
    }

    if(loading) return <ActivityIndicator style={{height: 120}} size={20} color="teal" />

    return (
        <View style={styles.login}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{registerMode ? 'Registro' : 'Ingreso'}</Text>
                <View style={styles.separator} />
                <TextInput
                    style={styles.input}
                    placeholder='email'
                    value={resource.email}
                    keyboardType="email-address"
                    onChangeText={(text) => {handleChange('email',text)}}
                />
                <TextInput
                    style={styles.input}
                    placeholder='password'
                    secureTextEntry={true}
                    onChangeText={(text) => {handleChange('pass',text)}}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={registerMode ? handleClickRegister : handleClickLogin}
                >
                    <Text style={styles.textButton}>{registerMode ? 'Registrarme' : 'Ingresar'}</Text>
                </TouchableOpacity>

                {!registerMode ? <React.Fragment>
                    <View style={[styles.separator, {backgroundColor: 'purple'}]} />

                    <Text>Ingresa con </Text>
                    <TouchableOpacity
                        style={styles.disabledButton}
                        onPress={() => console.log('in revision.')}
                    >
                        <Text style={[styles.textButton, {color: 'white'}]}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.disabledButton}
                        onPress={() => console.log('in revision.')}
                    >
                        <Text style={[styles.textButton, {color: 'white'}]}>Facebook</Text>
                    </TouchableOpacity>

                    <Text>o</Text>
                </React.Fragment> : null}
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: 'orange'}]}
                    onPress={() => {setRegisterMode(!registerMode)}}
                >
                    <Text style={styles.textButton}>{registerMode ? 'Atras' : 'Registrate'}</Text>
                </TouchableOpacity>

            </SafeAreaView>

        </View>
    )
}

const styles = StyleSheet.create({
    login:{
        display: 'flex',
        justifyContent: 'center',
        height: "100%"
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: '#E3E3E3',

        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5.84,

        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 32,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        backgroundColor: 'purple',
        width: '80%',
    },
    input: {
        marginVertical: 5,
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        fontWeight: 'bold',
        borderColor: 'purple',
    },
    button: {
        width: '80%',
        height: 40,
        marginVertical: 10,
        backgroundColor: 'purple',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        borderColor: 'black',
        justifyContent: 'center',
    },
    disabledButton: {
        width: '80%',
        height: 40,
        marginVertical: 10,
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        borderColor: 'black',
        justifyContent: 'center',
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'

    }
});



export default LoginScreen;