import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../contexts/AuthContext'

import { auth } from '../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LoginScreen = () => {
    const {setUser, setLogged} = React.useContext(AuthContext);

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    provider.setCustomParameters({
        prompt: "select_account"
    });

    const [resource, setResource] = React.useState({
        email: '',
        pass: ''
    }) 
    const [registerMode, setRegisterMode] = React.useState(false)

    const handleChange = (key,text) => {
        setResource({...resource, [key]: text })
    }

    const handleClickGoogle = async () => {

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
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
                console.log(errorCode, ' => ',errorMessage )
                // ...
            });
    }

    const handleClickLogin = async () => {
        signInWithEmailAndPassword(auth, resource.email, resource.pass)
            .then( async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                setLogged(true)
                await AsyncStorage.setItem('poke-user', JSON.stringify(user))
                await AsyncStorage.setItem('poke-logged', JSON.stringify(true))
                // ...
            })
            .catch(async (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLogged(false)
                setUser(null)
                await AsyncStorage.removeItem('poke-user')
                await AsyncStorage.removeItem('poke-logged')
                console.log('errorMessage',errorMessage)
            });
    }

    const handleClickRegister = async () => {
        createUserWithEmailAndPassword(auth, resource.email, resource.pass)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }

    return (
        <View style={styles.login}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{registerMode ? 'Registro' : 'Ingreso'}</Text>
                <View style={styles.separator} />
                <TextInput
                    style={styles.input}
                    placeholder='email'
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
                    <View style={[styles.separator, {backgroundColor: 'blue'}]} />

                    <Text>Ingresa con </Text>
                    <TouchableOpacity
                        style={[styles.button, {borderColor: 'red'}]}
                        onPress={handleClickGoogle}
                    >
                        <Text style={[styles.textButton, {color: 'red'}]}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, {borderColor: 'blue'}]}
                        onPress={handleClickGoogle}
                    >
                        <Text style={[styles.textButton, {color: 'blue'}]}>Facebook</Text>
                    </TouchableOpacity>

                    <Text>o</Text>
                </React.Fragment> : null}
                <TouchableOpacity
                    style={[styles.button, {borderColor: 'indigo'}]}
                    onPress={() => {setRegisterMode(!registerMode)}}
                >
                    <Text style={[styles.textButton, {color: 'indigo'}]}>{registerMode ? 'Atras' : 'Registrate'}</Text>
                </TouchableOpacity>

            </SafeAreaView>

        </View>
    )
}

const styles = StyleSheet.create({
    login:{
        display: 'flex',
        justifyContent: 'center',
        height: "100%",
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 32,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        backgroundColor: 'green',
        width: '80%',
    },
    input: {
        marginVertical: 5,
        textAlign: 'center',
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'green',
    },
    button: {
        width: '50%',
        height: 40,
        marginVertical: 10,
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
    },
    textButton: {
        color: 'green',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'

    }
});



export default LoginScreen;