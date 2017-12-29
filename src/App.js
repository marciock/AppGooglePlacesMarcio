 import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import{
  Root,
  Body,
  Button,
  Container,
  Content,
  Header,
  Item,
  Input,
  List,
  ListItem,
  Thumbnail,
  Icon,
  Text,
  Toast,
  Spinner
} from 'native-base';
import axios from 'axios';
import ListScreen from './screens/Finder';
import { Dialog } from 'react-native-simple-dialogs';

const KEY_GOOGLE = "AIzaSyAhkb2tLLkVtOdmiiVgFXQBZHXI-zh6e3U"; // <- Chave API GOOGLE MARCIO

export default class App extends Component {

  componentDidMount() {
    const config = {
      enableHighAccuracy: false
    };
    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
}
locationSuccess = (position) => { // quando a localização é obtida
    this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    })
    this.EfetuarBuscarMapa()
}
// se por acaso obter algum tipo de erro
locationError = (error) => {
    console.warn(error);
}

  render() {
      <Container>
        <Header searchBar rounded style={{ backgroundColor: '#840217' }}>
          <Item>
            <Icon color='#38345c' name='map' />
            <Input placeholder="Buscar"
                                returnKeyLabel='search'
                                returnKeyType='search'
                                onSubmitEditing={this.EfetuarBuscarMapa}
                                value={this.state.buscar}
                                onChangeText={(buscar) => this.setState({ buscar })} />
            <Button onPress={this.EfetuarBuscarMapa}><Icon  name="ios-search" /></Button>
          </Item>
        </Header>
        <Content>
            {this.renderContent()}
        </Content>
      </Container>
    );
  }
}

EfetuarBuscarMapa = () => {
    let erro = false
    let list = null
    let url = null
    let dialogVisible = false
    this.setState({
        load: true
    })
    if (this.state.buscar != null && this.state.buscar.length > 0) {
        url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + this.state.buscar + '&location=' + this.state.latitude + ',' + this.state.longitude + '&rankby=distance&key=' + KEY_GOOGLE
    } else {
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.latitude + ',' + this.state.longitude + '&rankby=distance&key=' + KEY_GOOGLE

    }
    axios.get(url)
           .then((response) => {
               if (response.data.results != undefined) {
                   list = response.data.results
               } else {
                   erro = "Local Não Encontrado"
                   dialogVisible = true
               }
           })
           .catch((error) => {
               erro = "Vetifique sua internet"
               dialogVisible = true
           })
           .finally(() => {
               this.setState({
                   load: false,
                   erro: erro,
                   lista: list,
                   dialogVisible: dialogVisible
               })
           });
   }
}
renderItem = (item) => {
       if (item.formatted_address != undefined) {
           if (item.photos != undefined) {
               return (
                   <ListItem onPress={this.pressList}>
                       <Thumbnail square size={100} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=110&photoreference=' + item.photos[0].photo_reference + '&key=AIzaSyAhkb2tLLkVtOdmiiVgFXQBZHXI-zh6e3U' }} />
                       <Body>
                           <Text>{item.name}</Text>
                           <Text note> {item.formatted_address}</Text>
                       </Body>
                   </ListItem>
               )
           }
           return (
               <ListItem onPress={this.pressList}>
                   <Body>
                       <Text>{item.name}</Text>
                       <Text note> {item.formatted_address}</Text>
                   </Body>
               </ListItem>
           )
       } else {
           if (item.photos != undefined) {
               return (
                   <ListItem onPress={this.pressList}>
                       <Thumbnail square size={100} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=110&photoreference=' + item.photos[0].photo_reference + '&key=AIzaSyAhkb2tLLkVtOdmiiVgFXQBZHXI-zh6e3U' }} />
                       <Body>
                           <Text>{item.name}</Text>
                           <Text note> {item.vicinity}</Text>
                       </Body>
                   </ListItem>
               )}
           return (
               <ListItem onPress={this.pressList}>
                   <Body>
                       <Text>{item.name}</Text>
                       <Text note> {item.vicinity}</Text>
                   </Body>
               </ListItem>
           )
       }
   }

   renderContent = () => {
     if (this.state.load) {
            return (
                <Spinner color='#006099' />
            )}
     if (this.state.lista) {
            return (
                <List dataArray={this.state.lista}
                    renderRow={this.renderItem}/>
            )}
}


AppRegistry.registerComponent('AppGooglePlacesMarcio', () => App);
