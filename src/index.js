import React from 'react';
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App';
import ItemSearch from './ItemSearch.js';
import ItemSearch2 from './ItemSearch2.js';
import ChartReport from './ChartReport.js';
import 'bootstrap/dist/css/bootstrap.css';

render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={ChartReport} />
			<Route path="searchStats" component={ChartReport} />
			<Route path="itemSearch2" component={ItemSearch2} />
			<Route path="itemSearch" component={ItemSearch} />
		</Route>
	</Router>,
	document.getElementById('root')
);
