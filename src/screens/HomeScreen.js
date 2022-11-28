import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import DefaultView from '../components/DefaultView';
import { useNavigation } from '@react-navigation/native';
import envs from '../../envs'
import COLORS_REGION from '../utils/RegionsUtils'

export default function HomeScreen(){
    const [regions, setRegions] = React.useState()
    
    const navigation = useNavigation()

    const fetchData = async () => {
        const response = await fetch(`${envs.pokeApi}region`)
        if(response.status === 200){
            const responseJSON = await response.json()
            setRegions(responseJSON.results)
        }else{
            console.log('error =>',response)
        }
    }

    React.useEffect(() => {
        fetchData()
    },[])

    if(!regions) return <Text>CARGANDO...</Text>

    return (
        <DefaultView offset={0}>
            <Image source={require('../assets/mew.png')} style={{zIndex: -1, position: 'absolute', bottom: 0, right: 0, width: 250, height: 250}}/>
            <ScrollView style={styles.regions}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginHorizontal: 10}}>Regiones</Text>
                {regions.map((region,index) => (
                    <TouchableOpacity 
                        key={index}
                        style={[styles.button, {backgroundColor: '#F1F1F1', borderColor: COLORS_REGION[region.name]}]} 
                        onPress={() => navigation.navigate('TeamCreate',{name: region.name, url: region.url, editMode: false})}
                    >
                        <View style={{position: 'absolute',width: 50, height: '100%', backgroundColor: COLORS_REGION[region.name]}} />
                        <View>
                            <Text style={[styles.textButton, {color: COLORS_REGION[region.name]}]}>{region.name}</Text>
                            <Image 
                                source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Math.floor(Math.random() * 888)}.png`}}
                                style={styles.image}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
             
        </DefaultView>
    )
}

const styles = StyleSheet.create({
    regions: {
        marginHorizontal: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        backgroundColor: 'green',
        width: '80%',
    },
    button: {
        height: 100,
        marginVertical: 25,
        borderWidth: 1,
        borderRadius: 5,

        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 2,
    },
    textButton: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 15,
        marginVertical: 15,
    },
    image: {
        width: 100, 
        height: 100,
        position: 'absolute',
        right: 0,
        marginVertical: 20,

        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
});