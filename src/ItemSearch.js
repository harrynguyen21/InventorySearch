import React, { Component } from 'react';
import firebase from 'firebase';
import Reactable from 'reactable';
import {formatRawNumber} from './utils.js';

var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th;

export default class ItemSearch extends Component {
	
	constructor(props) {
		super(props);
		
		this.handleSearch = this.handleSearch.bind(this);
		this.handleFilterByCode = this.handleFilterByCode.bind(this);
		this.state = {
			items: []
		};
	}
	
	componentWillMount() {
		this.itemsRef = firebase.database().ref('items');
  		this.itemsRef.once('value', (snapshot) => {
  			var items = [];
  			snapshot.forEach((data)=> {
  				const item = data.val();
  				item['price'] = formatRawNumber(item['retailPriceVAT']);
  				item['fifPctPrice'] = (0.85*item['price']).toLocaleString();
  				item['eigPctPrice'] = (0.82*item['price']).toLocaleString();
				item['price'] = item['price'].toLocaleString();
				
  				items.push(item);
  			});
		
  			this.setState({items});
  		});
	}
	
	handleSearch(key) {
		if (key) {
			this.itemsRef.orderByChild('Code').equalTo(key).on('value', (snapshot) => {
				var items = [];
				snapshot.forEach((data)=> {					
					items.push(data.val());
				});
			
				this.setState({items});
			});
		}
	}
	
	handleFilterByCode(contents, filter) {
		/*this.itemsRef.orderByChild('Code').equalTo(filter.toUpperCase()).on('value', (snapshot)=> {
			var items = [];
			snapshot.forEach((data)=> {					
				items.push(data.val());
			});
			console.log(filter, items);
		});*/
        return (contents.toLowerCase().indexOf(filter) > -1);
    }

	getNoDataText() {
		return this.state.items.length === 0 ? "Loading..." : "No matching records found";
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
				<div className="col-xs-12 col-md-12">
					<div className="table-responsive">
				      <Table 
						className="table table-striped"
						filterable={
							[
								{
									column: 'Code',
									filterFunction: this.handleFilterByCode
								}, 
								'VmName'
							]
						}
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