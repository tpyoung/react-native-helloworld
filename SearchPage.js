'use strict';

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';

var SearchResults = require('./SearchResults');
var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
  marginTop: 10,
  width: 217,
  height: 138
}
});

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
 
  return 'http://api.nestoria.co.uk/api?' + querystring;
 };

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchString: 'london',
			isLoading: false,
			message: ''
		};
	}
	onSearchTextChanged(event) {
		this.setState({searchString: event.nativeEvent.text});
	}
	_executeQuery(query) {
		console.log(query);
		this.setState({ isLoading : true });
		fetch(query)
			.then(response => response.json())
			.then(json => this._handleResponse(json.response))
			.catch(error => this.setState({
				isLoading: false,
				message: 'something bad happened ' + error
			}));
	}
	_handleResponse(response) {
		this.setState({isLoading: false, message: ''});
			console.log('HI HI HI');
		if (response.application_response_code.substr(0,1) === '1') {
			console.log('YAY YAY YAY');
			this.props.navigator.push({
				title: 'Results',
				component: SearchResults,
				passProps: {listings: response.listings}
			});
		} else {
			this.setState({message: 'Location not reconized. Please try again.'});
		}
	}

	onSearchPressed() {
		var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
  	this._executeQuery(query);
	}		


	render() {
		var spinner = this.state.isLoading ?
  ( <ActivityIndicator
      size='large'/> ) :
  ( <View/>);
  	<Text style={styles.description}>
  		{this.state.message}
  	</Text>

		return (
			<View style={styles.container}>
				<Text style={styles.description}> 
					Search for houses to buy! 
				</Text>
				<Text style={styles.description}>
					Search by city, zipcode, or near your location.
				</Text>
				<View style={styles.flowRight}>
				  <TextInput
				    style={styles.searchInput}
				    value={this.state.searchString}
				    onChange={this.onSearchTextChanged.bind(this)}
				    placeholder='Search Here'/>
				  <TouchableHighlight style={styles.button}
				  	onPress={this.onSearchPressed.bind(this)}
				    underlayColor='#99d9f4'>
				    <Text style={styles.buttonText}>
				    	Go
				    </Text>
				  </TouchableHighlight>
				</View>
				<View style={styles.flowRight}>
					<TouchableHighlight style={styles.button}
					    underlayColor='#99d9f4'>
					  <Text style={styles.buttonText}>
					  	Location
					  </Text>
					</TouchableHighlight>
				</View>
				<Image source={require('./Resources/house.png')} style={styles.image}/>
				{spinner}
			</View>
		);
	}
}

module.exports=SearchPage;