import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [logged, setLogged] = useState(false)

  
    const storageFill = async () => {

        const localUser = await AsyncStorage.getItem('poke-user')
        const localLogged = await AsyncStorage.getItem('poke-logged')
    
        if (await AsyncStorage.getItem('poke-user')) setUser(JSON.parse(localUser))
        if (await AsyncStorage.getItem('poke-logged')) setLogged(JSON.parse(localLogged));
    }
  
  useEffect(() => {
    storageFill()
  }, [logged])

  const contextValue = {
    user,
    setUser,
    logged, 
    setLogged,
  }
    return (
        <AuthContext.Provider 
            value={contextValue}
        > 
            {children}
        </AuthContext.Provider>
    )
}
