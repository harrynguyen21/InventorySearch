import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router';

import logo from './logo.svg';
import './App.css';
import keys from './api_keys.js'

class App extends Component {
	
	constructor(props) {
		super(props);
		
		this.handleAuthenticationResult = this.handleAuthenticationResult.bind(this);
		this.state = {
			username: ''
		};
	}
	
	componentWillMount() {
		var config = {
			apiKey: keys.firebase,
			authDomain: "inventorysearch-9682b.firebaseapp.com",
			databaseURL: "https://inventorysearch-9682b.firebaseio.com",
			storageBucket: "inventorysearch-9682b.appspot.com",
			messagingSenderId: "489170894056"
		};
		firebase.initializeApp(config);
		
		firebase.auth().onAuthStateChanged(function(user) {
		  if ( user ) {
			this.setState({username: user.displayName});
		  } else {
			  var provider = new firebase.auth.GoogleAuthProvider();
			  firebase.auth().signInWithRedirect(provider);
		  }
		}.bind(this));
		
  		firebase.auth().getRedirectResult().then(this.handleAuthenticationResult).catch(function(error) {
  		  // Handle Errors here.
  		  var errorCode = error.code;
  		  var errorMessage = error.message;
  		  // The email of the user's account used.
  		  var email = error.email;
  		  // The firebase.auth.AuthCredential type that was used.
  		  var credential = error.credential;
	  
  		  console.log(errorCode, errorMessage);
  		});
	}
	
	handleAuthenticationResult( result ) {
	  // The signed-in user info.
	  var user = result.user;
	  if ( user ) {
	  	  this.setState({username: user.displayName});
	  }
	}
	
	render() {
		if (!firebase.auth().currentUser) {
			return (
				<div>
					Please wait while you are being redirected to authentication service...
				</div>
			);
		}
		
		return (
		  <div className="container">
			<div className="row">
			    <div className="col-xs-12 col-md-12 App-header">
			      <img src={logo} className="App-logo" alt="logo" />
			      <h2>Welcome to Inventory Search, {this.state.username}</h2>
			    </div>
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-12">
					<h2></h2>
					<ul className="nav nav-tabs">
						<li role="presentation" ><Link to="/searchStats">Item Statistics<sup className="bg-danger">New</sup></Link></li>
						<li role="presentation" ><Link to="/itemSearch2">Item Search<sup className="bg-danger">New</sup></Link></li>
						<li role="presentation" ><Link to="/itemSearch">Item Search</Link></li>						
					</ul>
				</div>				
			</div>
			<div className="row">
				<div className="col-xs-12 col-md-12">
					{this.props.children}
				</div>
			</div>
		  </div>
		);
	}
}

export default App;
