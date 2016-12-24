import React, { Component } from 'react';
import firebase from 'firebase';
import logo from './logo.svg';
import './App.css';

import Reactable from 'reactable';

var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th;

class App extends Component {
	
	constructor(props) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleKeyChanged = this.handleKeyChanged.bind(this);
		this.handleAuthenticationResult = this.handleAuthenticationResult.bind(this);
		this.state = {
			items: [],
			username: ''
		};
	}
	
	componentWillMount() {
		var config = {
			apiKey: "AIzaSyDxZcpU8r64lzJzPYcw0J8MhbpGHZLE5Iw",
			authDomain: "inventorysearch-9682b.firebaseapp.com",
			databaseURL: "https://inventorysearch-9682b.firebaseio.com",
			storageBucket: "inventorysearch-9682b.appspot.com",
			messagingSenderId: "489170894056"
		};
		firebase.initializeApp(config);
		
		firebase.auth().onAuthStateChanged(function(user) {
		  if ( user ) {
			this.setState({username: user.displayName});
			
	  		this.firebaseRef = firebase.database().ref('items');
	  		this.firebaseRef.on('value', (snapshot) => {
	  			var items = [];
	  			snapshot.forEach((data)=> {
	  				const item = data.val();
	  				item['price'] = +(parseFloat(item['retailPriceVAT'].replace(',', '.')).toFixed(2));
	  				item['fifPctPrice'] = +((0.15*item['price']).toFixed(2));
	  				item['eigPctPrice'] = +((0.18*item['price']).toFixed(2));
	  				items.push(item);
	  			});
			
	  			this.setState({items});
	  		});
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

	handleClick() {
		const name = this.name.value;
		const code = this.code.value;
		const price = this.price.value;

		if (name && code && price) {
			const item = {name, code, price};
			this.firebaseRef.push(item);
			this.code.value='';
			this.name.value='';
			this.price.value='';
		}
	}
	
	handleSearch() {
		const key = this.searchKey.value;
		if (key) {
			this.firebaseRef.orderByChild('Code').equalTo(key).on('value', (snapshot) => {
				var items = [];
				snapshot.forEach((data)=> {					
					items.push(data.val());
				});
			
				this.setState({items});
			});
		}
	}
	
	handleKeyChanged() {
		const key = this.searchKey.value;
		if (!key) {
			this.firebaseRef.once('value', (snapshot) => {
				var items = [];
				snapshot.forEach((data)=> {
					items.push(data.val());
				});
			
				this.setState({items});
			});
		}
	}
	
	getNoDataText() {
		return this.state.items.length === 0 ? "Loading..." : "No matching records found";
	}
	
	render() {
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
					<div className="table-responsive">
				      <Table className="table table-striped"
						filterable={['Code', 'VmName']}
				        noDataText={this.getNoDataText()}
				        itemsPerPage={20}
				        currentPage={0}
				        sortable={true}
				        data={this.state.items}>
				        <Thead>
				          <Th column="Code">Code</Th>
				          <Th column="VmName">Name</Th>
				          <Th column="price">Price</Th>
						  <Th column="fifPctPrice">15% Price</Th>
						  <Th column="eigPctPrice">18% Price</Th>
				        </Thead>
				      </Table>			
					</div>
				</div>
			</div>
		  </div>
		);
	}
}

export default App;
