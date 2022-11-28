* Instructions *

Seguir la guia de instalacion de React Native Cli: https://reactnative.dev/docs/environment-setup

instalar ruby version: 2.7.5

correrlo con node version 16.18.1

Abra la terminal ir hasta la carpeta del proyecto: "/pokePrueba" y seguir estos pasos:

1) npm i
2) cd /ios
3) export LANG=en_US.UTF-8
4) pod install && pod update
5) cd ../
6) npx react-native run-ios

nota: En caso de fallar el build agregar el archivo " GoogleService-info.plist " y agregarlo al proyecto desde xcode