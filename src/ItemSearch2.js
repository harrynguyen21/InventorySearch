import React, { Component } from 'react';
import firebase from 'firebase';
import {formatRawNumber, formatString} from './utils.js';

export default class ItemSearch extends Component {

	constructor(props) {
		super(props);

		this.state = {
			'item': null
		};
		this.init = false;
	}

	componentWillMount() {
		this.itemsRef = firebase.database().ref('items');
		this.searchRef = firebase.database().ref('searches');
		this.vendorPriceRef = firebase.database().ref('vendorprices');
	}

	componentDidMount() {
		this.init = true;
	}

	handleSearch() {
		const key = this.itemCode.value;
		if (key) {
			fetch(`https://istockstaker.ml/items/${key}`)
				.then(resp => {
					return resp.json();
				})
				.then(json => {
					const item = json.item;
					this.setState({item});
					this.recordSearch(item);
				});
		}
	}

	getVendorPrice(item) {
		this.vendorPriceRef.orderByChild('Code').equalTo(item.Code).once('value', (snapshot) => {
			var price = null;
			snapshot.forEach((data)=> {
				price = data.val();
			});

			if ( price ) {
				item['orderPrice'] = price.retailPriceVAT;
				item['extraPrice'] = price.extraPrice;
				this.setState({item});
			}
		});
	}

	recordSearch(item) {
		if ( item ) {
			const search = this.searchRef.push();
			search.set({
				item: item.Code,
				date: new Date().setHours(0, 0, 0, 0)
			});
		}
	}

	render() {
		return (
			<div className="container">
			    <div className="row">
					<div className="col-xs-12 col-md-12">
						<h2></h2>
						<div className="panel panel-primary">
						  <div className="panel-heading">Search Inputs</div>
						  <div className="panel-body">
							<form className="form-horizontal">
								<div className="form-group">
									<label htmlFor="itemCode" className="control-label col-xs-2">Item Code</label>
									<div className="col-xs-4">
										<input id="itemCode" type="text" ref={(input) => {this.itemCode = input}} className="form-control"/>
									</div>
								</div>
								<div className="form-group">
									<div className="col-sm-offset-2 col-sm-10">
										<input type="button" className="btn btn-default" onClick={this.handleSearch.bind(this)} value="Search" />
									</div>
								</div>
							</form>
						  </div>
						</div>
					</div>
				</div>
				{this.init ? <ResultPanel item={this.state.item} /> : ''}
			  </div>
		);
	}
}

class ResultPanel extends Component {

	render() {
		if (this.props.item) {
		    return (
				<div className="panel panel-default">
				  <div className="panel-heading">Search Results</div>
				  <div className="panel-body">
				    <div className="row">
						<div className="col-xs-12 col-md-12">
							<form className="form-horizontal">
								<DetailItem label={'Code'} value={this.props.item.code} />
								<DetailItem label={'English Name'} value={this.props.item.engName} />
								<DetailItem label={'Vietnamese Name'} value={this.props.item.name} />
								<DetailItem label={'Original VAT'} value={formatRawNumber(this.props.item.origVAT)} />
								<DetailItem label={'Original Price'} value={formatRawNumber(this.props.item.origPriceWoVAT)} />
								<DetailItem label={'Retail VAT'} value={formatRawNumber(this.props.item.retailVAT)} />
								<DetailItem label={'Retail Price'} value={formatRawNumber(this.props.item.retailPriceWoVAT)} />
								<DetailItem label={'Retail Price (VAT)'} value={formatRawNumber(this.props.item.retailPriceVAT)} />
								<DetailItem label={'18% of Retail Price (VAT)'} value={formatRawNumber(this.props.item.retailPriceVAT)*0.82} />
								<DetailItem label={'15% of Retail Price (VAT)'} value={formatRawNumber(this.props.item.retailPriceVAT)*0.85} />
								<DetailItem label={'Vendor price'} value={formatRawNumber(this.props.item.vendorPrice)} />
								<DetailItem label={'Extra Vendor price'} value={formatRawNumber(this.props.item.extraPrice)} />
							</form>
						</div>
					</div>
					</div>
				</div>
			)
		}
		else {
		    return (
				<div className="panel panel-default">
				  <div className="panel-heading">Search Results</div>
				  <div className="panel-body">
					<div className="row">
						<div className="col-xs-12 col-md-12">
							<span>No result found</span>
						</div>
					</div>
				  </div>
				</div>
			)
		}
	}
}

class DetailItem extends Component {

	render() {
		return (
			<div className="form-group">
			    <label className="col-sm-2 control-label">{this.props.label}</label>
			    <div className="col-sm-10">
					<p className="form-control-static">{formatString(this.props.value)}</p>
			    </div>
			</div>
		);
	}
}
