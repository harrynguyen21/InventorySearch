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
		this.state = {
			items: []
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
		
		this.firebaseRef = firebase.database().ref('items');
		this.firebaseRef.on('value', (snapshot) => {
			var items = [];
			snapshot.forEach((data)=> {
				items.push(data.val());
			});
			
			this.setState({items});
		});
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
		  <div className="App">
		    <div className="App-header">
		      <img src={logo} className="App-logo" alt="logo" />
		      <h2>Welcome to React</h2>
		    </div>
		    <div className="App-intro">
				<form name="newItem">
					Code: <input name="code" ref={(input) => { this.code = input; }} />
					Name: <input name="name" ref={(input) => { this.name = input; }} />
					Price:  <input name="price" ref={(input) => { this.price = input; }} />
					<input type="button" value="Add" onClick={this.handleClick} />
				</form>
		    </div>
			<div className="wrapper">
		      <Table className="table"
				id="demo-table"
		        filterable={['Code', 'VmName']}
		        noDataText={this.getNoDataText()}
		        itemsPerPage={20}
		        currentPage={0}
		        sortable={true}
		        data={this.state.items}>
		        <Thead>
		          <Th column="Code">Code</Th>
		          <Th column="VmName">Name</Th>
		          <Th column="retailPriceVAT">Price</Th>
		        </Thead>
		      </Table>			
			</div>
		  </div>
		);
	}
}

export default App;
