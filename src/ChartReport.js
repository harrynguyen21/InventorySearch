import React, { Component } from 'react';
import {Chart} from 'react-google-charts';
import firebase from 'firebase';
import moment from 'moment';

export default class ChartReport extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			data: [
			        ['Month', 'Searches', { role: 'blue' } ],			     
			      ]
		};
	}
	
	componentWillMount() {
		this.searchRef = firebase.database().ref('searches');
		
		let startDt = moment([moment().year()]);
		this.getSearchStats(+startDt, +(startDt.endOf('year')));
	}
	
	getSearchStats(startDt, endDt) {
		let stats = [0,0,0,0,0,0,0,0,0,0,0,0];
		this.searchRef.orderByChild('date').startAt(startDt).endAt(endDt).once('value', function(snapshot) {
			snapshot.forEach((entry) => {
				const search = entry.val();
				const curMoment = moment(search.date); 
				const month = curMoment.month();
				stats[month]++;
			});
			
			stats = stats.map((count, idx) => {
				return [moment().month(idx).format('MMM'), count || 0, 'color: red'];
			});
			
			let data = this.state.data;
			data = data.concat(stats);
			this.setState({data});
		}.bind(this));
	}
	
    render() {
      return (
	      <div className='container'>
			<div className="row">
				<div className="col-xs-12 col-md-12">
			        <Chart
			          chartType="BarChart" 
			          data={this.state.data}
			          options={{}}
			          graph_id="ColumnChart"
			          width="100%"
			          height="400px"
			         />
				</div>
			</div>
		</div>
      )
    }
}