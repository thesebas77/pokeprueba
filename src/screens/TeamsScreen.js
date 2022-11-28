import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DefaultView from '../components/DefaultView';
import {database} from '../firebase/config'
import {ref, onValue, remove, set} from 'firebase/database'
import { ActivityIndicator, Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import COLORS_REGION from '../utils/RegionsUtils'
import { AuthContext } from '../contexts/AuthContext'
import envs from '../../envs'

export default function TeamsScreen(){
    const {user} = React.useContext(AuthContext);
    const [teams, setTeams] = React.useState([])
    const [idCurrent, setIdCurrent] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [token, setToken] = React.useState()

    const navigation = useNavigation()

    const fetchData = () => {
        setLoading(true)
        const starCountRef = ref(database, `teams/${user.uid}/`);
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                setIdCurrent(data)
                const arrayTemp = [];
                for(let id in data){
                    arrayTemp.push({id, ...data[id] });
                }
                if (arrayTemp){
                    setTeams(arrayTemp);
                }
                setLoading(false)
            });
    }

    const handleDeleteTeam = (id) => {
        setLoading(true)
        const starCountRef = ref(database, `teams/${user.uid}/${id}`);

        remove(starCountRef).then(() => {
            Alert.alert('Se elimino con exito.')
            setLoading(false)
        })
    }

    const handleChangeToken = (text) => {
        setToken(text)
    }

    const handleSearchToken = () => {
        setLoading(true)
        let confirm = false
        let arrayConfirm = []
        const starCountRef = ref(database, `teams/`);
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                const arrayTemp = [];
                for(let id in data){
                    arrayTemp.push({id, ...data[id] });
                }
                if (arrayTemp){
                    arrayTemp.map(obs => {
                        for (let key in obs) {
                          let newArr = obs[key];
                          for(let i in newArr){
                            if(token == newArr[i]){
                                confirm = true
                                arrayConfirm = newArr
                            }
                          }
                        }
                    })
                    
                }
                setLoading(false)
            });

            if(confirm){
                if(idCurrent && idCurrent.length > 0){
                    set(ref(database, `teams/${user.uid}/${idCurrent.length}`), {
                        id: idCurrent.length,
                        region: arrayConfirm.region,
                        regionUrl: arrayConfirm.regionUrl,
                        pokemons: arrayConfirm.pokemons,
                    }).then(() => {
                        Alert.alert('Se copio con exito.')
                        setToken()
                        setLoading(false)
                    }).catch((err) => {
                        Alert.alert('Hubo un problema.')
                        console.log(err)
                        setLoading(false)
                    })
                }else{
                    set(ref(database, `teams/${user.uid}/1`), {
                        id: 1,
                        region: arrayConfirm.region,
                        regionUrl: arrayConfirm.regionUrl,
                        pokemons: arrayConfirm.pokemons,
                    }).then(() => {
                        Alert.alert('Se copio con exito.')
                        setToken()
                        setLoading(false)
                    }).catch((err) => {
                        Alert.alert('Hubo un problema.')
                        console.log(err)
                        setLoading(false)
                    })
                }
            }else{
                Alert.alert('No hubo resultados')
            }
    }

    const handleClickInfo = async (name) => {
        setLoading(true)
        const response = await fetch(`${envs.pokeApi}pokemon/${name}`)
        if(response.status === 200){
            const responseJSON = await response.json()
            let temp = []
            responseJSON.types.map((t) => temp.push(t.type.name) )
            Alert.alert(`Tipo ${JSON.stringify(temp)}`)
            setLoading(false)
        }else{
            setLoading(false)
            console.log('error =>',response)
        }
        
    }

    React.useEffect(() => {
        fetchData()
    },[])

    if(loading) return <ActivityIndicator style={{height: 120}} size={20} color="red" />
    if(!teams) return <ActivityIndicator style={{height: 120}} size={20} color="red" />

    return (
        <DefaultView offset={0}>            
            <View style={{display: 'flex', alignItems: 'center'}}>
                <View style={{display: 'flex', flexDirection: 'row' ,alignItems: 'center', marginVertical: 10}}>
                    <TextInput
                        style={styles.input}
                        placeholder='TOKEN'
                        value={token}
                        onChangeText={(text) => {handleChangeToken(text)}}
                    />
                    <TouchableOpacity
                        style={{height: 40, justifyContent: 'center' , backgroundColor: 'orange', borderTopRightRadius: 10, borderBottomRightRadius: 10}}
                        onPress={handleSearchToken}
                    >
                        <Text style={{color: 'white'}}>Buscar</Text>
                    </TouchableOpacity>
                </View>
                <Text>Copiar equipo de amigo/a</Text>
            </View>
            <ScrollView style={{marginHorizontal: 20, marginVertical: 5}}>
                {teams.length > 0 
                    ? teams.map((team,index) => (
                        <View key={index} style={[styles.card, {borderColor: COLORS_REGION[team.region], backgroundColor: '#E5E5E5'}]}>
                            <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', marginVertical: 10, marginHorizontal: 10}}>
                                <View style={{display: 'flex', flexDirection: 'column'}}>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>#{index + 1}</Text>
                                    <Text style={{marginTop: 5, fontSize: 19, fontWeight: 'bold', color: COLORS_REGION[team.region]}}>{team.region}</Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={() => handleDeleteTeam(team.id)}
                                > 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white',backgroundColor: 'red', padding: 2}}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 15}}>
                                {team.pokemons.map((t,i) => (
                                    <View key={i} >
                                        <TouchableOpacity
                                            onPress={() => handleClickInfo(t.name)}
                                        >
                                            <Image style={styles.image} source={{uri: t.image}} />
                                        </TouchableOpacity>
                                        <Text style={{fontSize: 15,fontWeight: 'bold', marginHorizontal: 10, color: COLORS_REGION[team.region], textAlign: 'center'}}>{t.name}</Text>
                                    </View>   
                                ))}
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10}}>
                                <TouchableOpacity 
                                    onPress={() =>  navigation.navigate('TeamCreate',{name: team.region, url: team.regionUrl, editMode: true, id: team.id ,pokemons: team.pokemons})}
                                    style={{backgroundColor: COLORS_REGION[team.region], padding: 5, borderRadius: 5}}
                                > 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )) 
                    : <Text>Aun no hay equipos creados</Text>
                }
            </ScrollView>
        </DefaultView>
    )
}

const styles = StyleSheet.create({
    card: {
        borderColor: 'orange',
        borderWidth: 2,
        padding: 2,
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 10,
        textAlign: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5.84,

        elevation: 10,

    },
    image: {
        width: 100, 
        height: 100,
        marginVertical: 10
    },
    input: {
        marginVertical: 5,
        textAlign: 'center',
        width: '50%',
        height: 40,
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: 'orange',
        fontWeight: 'bold',
        fontSize: 20
    },
});