import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native'
import DefaultView from '../components/DefaultView';
import {database} from '../firebase/config'
import {ref, set, onValue} from 'firebase/database'
import { AuthContext } from '../contexts/AuthContext'

export default function TeamCreateScreen(props){
    const {user} = React.useContext(AuthContext);
    const [pokemons, setPokemons] = React.useState([])
    const [selectPokemon, setSelectPokemon] = React.useState([])
    const [dataTeams, setDataTeams] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [editMode, setEditMode] = React.useState(false)
    const [imgLoading, setImgLoading] = React.useState(true)

    const fetchData = async () => {
        setLoading(true)
        const response = await fetch(props.route.params.url)
        if(response.status === 200){
            const responseJSON = await response.json()
            
            let url = responseJSON.pokedexes[responseJSON.pokedexes.length-1].url

            const response2 = await fetch(url)
            if(response2.status === 200){
                const responseJSON2 = await response2.json()
                if(responseJSON2.pokemon_entries.length > 0){
                    setPokemons(responseJSON2.pokemon_entries)

                    const starCountRef = ref(database, `teams/${user.uid}/`);
                    onValue(starCountRef, (snapshot) => {
                        const data = snapshot.val();
                        setDataTeams(data)
                    });

                    setLoading(false)
                }else{
                    setLoading(false)
                    console.log('not data in array pokemon_entries')
                }
            }else{
                setLoading(false)
                console.log('error =>',response2)
            }
        }else{
            setLoading(false)
            console.log('error =>',response)
        }
    }

    const handleSelectPokemon = (name, image) => {
        let findPoke = selectPokemon.find(poke => poke.name == name)
        if(findPoke){
            setSelectPokemon(selectPokemon.filter(item => item.name !== name))      
        }else{
            setSelectPokemon(current => [...current, {name: name, image: image}]);
        }
    }

    const handleAddTeam = () => {
        setLoading(true)
        if(dataTeams && dataTeams.length > 0){
            set(ref(database, `teams/${user.uid}/${dataTeams.length}`), {
                id: dataTeams.length,
                token: Math.random().toString(36).substr(6)+dataTeams.length,
                region: props.route.params.name,
                regionUrl: props.route.params.url,
                pokemons: selectPokemon,

            }).then(() => {
                Alert.alert('Se creo el equipo con exito.')
                setSelectPokemon([])
                setLoading(false)
            }).catch((err) => {
                Alert.alert('Hubo un problema.')
                console.log(err)
                setLoading(false)
            })
        }else{
            set(ref(database, `teams/${user.uid}/1`), {
                id: 1,
                token: Math.random().toString(36).substr(6)+1,
                region: props.route.params.name,
                regionUrl: props.route.params.url,
                pokemons: selectPokemon
            }).then(() => {
                Alert.alert('Se creo el equipo con exito.')
                setSelectPokemon([])
                setLoading(false)
            }).catch((err) => {
                Alert.alert('Hubo un problema.')
                console.log(err)
                setLoading(false)
            })
        }
    }

    const handleUpdateTeam = () => {
        setLoading(true)
        set(ref(database, `teams/${user.uid}/${props.route.params.id}`), {
            id: props.route.params.id,
            token: Math.random().toString(36).substr(6)+props.route.params.id,
            pokemons: selectPokemon,
            region: props.route.params.name,
            regionUrl: props.route.params.url

        }).then(() => {
            Alert.alert('Se edito el equipo con exito.')
            setLoading(false)
        }).catch((err) => {
            Alert.alert('Hubo un problema.')
            console.log(err)
            setLoading(false)
        })
    }
    
    React.useEffect(() => {
        fetchData()
    },[])

    React.useEffect(() => {
        if(props.route.params.editMode){
            setEditMode(true)
            setSelectPokemon(props.route.params.pokemons)
        }else{
            setEditMode(false)
        }
    },[props])

    const widthView = Dimensions.get('window').width

    if(loading) return <ActivityIndicator style={{height: 120}} size={20} color="green" />
    if(pokemons.length < 0) return <ActivityIndicator style={{height: 120}} size={20} color="green" />

    return (
        <DefaultView offset={0}>
            <View style={{flex: 1}}>
                <FlatList
                    data={pokemons}
                    keyExtractor={(pokemon) => pokemon.pokemon_species.name}
                    numColumns={2}
                    style={{height: 180}}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => handleSelectPokemon(item.pokemon_species.name, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.pokemon_species.url.split('/')[item.pokemon_species.url.split('/').length -2]}.png`)}
                        >
                            <View style={[styles.card, selectPokemon.find((poke) => poke.name == item.pokemon_species.name) ? { backgroundColor: '#DEF3ED' ,borderColor: 'green', width: widthView * 0.45} : { width: widthView * 0.45}]}>
                                <Image 
                                    style={styles.image} 
                                    source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.pokemon_species.url.split('/')[item.pokemon_species.url.split('/').length -2]}.png`}} 
                                    onLoadEnd={() => {
                                        setImgLoading(false)
                                    }}
                                />
                                {imgLoading ? <ActivityIndicator style={{height: 120}} size={20} color="red" /> : null}
                                <Text style={{position: 'absolute', right: 0, fontWeight: 'bold', fontSize: 15, marginVertical: 2, marginHorizontal: 5}} >#{item.pokemon_species.url.split('/')[item.pokemon_species.url.split('/').length -2]}</Text>
                                <Text style={{fontSize: 20,fontWeight: 'bold', marginHorizontal: 10, color: 'brown' }} >{item.pokemon_species.name}</Text>
                                {item.pokemon_species.name.split('').filter((t,i) => i != 0).map((text,i) => (
                                    <Text key={i} style={{fontSize: 10,fontWeight: 'bold', marginHorizontal: 10, color: 'gray' }} >{text}</Text>
                                ))}
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.navTeam}>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center'}}>Seleccione su equipo</Text>
                    <View style={{marginVertical: 10}}>
                        {selectPokemon.length > 0 
                            ?   <FlatList
                                    data={selectPokemon}
                                    keyExtractor={(pokemon) => pokemon.name}
                                    numColumns={4}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            onPress={() => handleSelectPokemon(item.name, item.image)}
                                            style={{marginHorizontal: 5, marginVertical: 5}}
                                        >
                                            <Image style={{width: 60, height: 60}} source={{uri: item.image}} />
                                            <Text style={{fontSize: 10,fontWeight: 'bold', marginHorizontal: 10, color: 'brown' }} >{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            : <Text style={{textAlign: 'center', fontSize: 14}}>Aun no eligio equipo</Text>
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => selectPokemon.length < 3 ? Alert.alert('Minimo hay que tener 3 pokemon seleccionados.') : selectPokemon.length > 6 ? Alert.alert('Maximo hay que tener 6 pokemon seleccionados.') : editMode ? handleUpdateTeam() : handleAddTeam()}
                        style={{position:'absolute', bottom: 0, marginBottom: 10, backgroundColor: selectPokemon.length < 3 ? 'gray' : selectPokemon.length > 6 ? 'gray' : 'orange', padding: 5, borderRadius: 5, width: '50%'}}
                    >
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>{editMode ? 'Editar Equipo' : 'Crear Equipo'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DefaultView>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        padding: 2,
        marginHorizontal: 10,
        height: 120,
        width: 160,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    navTeam: {
        flex: 1,
        alignItems: 'center', 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

        borderTopWidth: 2,
        borderTopColor: 'teal'

    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 2,
    },
    image: {
        width: 100, 
        height: 100,
        position: 'absolute',
        right: 0,
        marginTop: 20,
    }
});