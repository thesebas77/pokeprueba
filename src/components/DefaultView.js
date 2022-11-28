import React from 'react'

import { KeyboardAvoidingView, View, Platform } from "react-native"

const DefaultView = ({ children, offset=80 }) => {
    return <KeyboardAvoidingView 
                keyboardVerticalOffset={offset} 
                behavior={Platform.OS === "ios" ? "padding" : null} 
                style={{ flex: 1}}>
                    <View style={{ flex: 1 }} >
                        {children}
                    </View>
            </KeyboardAvoidingView>
  }

  export default DefaultView