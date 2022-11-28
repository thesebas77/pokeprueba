import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../contexts/AuthContext'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native'

export default function PerfilScreen(){
    const {user, setLogged, setUser} = React.useContext(AuthContext);

    const handleSignOut = async () => {
        await AsyncStorage.clear()
        setLogged(false)
        setUser(null)
    }
    return (
        <View style={styles.perfil}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{user.email}</Text>
                <TouchableOpacity
                    onPress={handleSignOut}
                    style={{backgroundColor: 'red', padding: 5, marginVertical: 20}}
                >
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>Cerrar Sesion</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    perfil:{
        display: 'flex',
        justifyContent: 'center',
        height: "100%",
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 32,
    },
});