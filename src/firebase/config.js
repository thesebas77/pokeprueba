import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAOjm2mC1doY9eRuDvGNr6Lroge5HDjCXo",
    authDomain: "poke-prueba-a9627.firebaseapp.com",
    databaseURL: "https://poke-prueba-a9627-default-rtdb.firebaseio.com",
    projectId: "poke-prueba-a9627",
    storageBucket: "poke-prueba-a9627.appspot.com",
    messagingSenderId: "495467819498",
    appId: "1:495467819498:web:2c483e5b0423df877e8293"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth =  getAuth(firebaseApp);
export const database =  getDatabase(firebaseApp);