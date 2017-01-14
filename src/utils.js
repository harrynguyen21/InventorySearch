module.exports = {
	formatRawNumber: function(str) {
		return str ? parseInt(str.replace(/,/g, ''), 10) : 0;
	},
	formatString: function(str) {
		if (typeof str === 'number') {
			return str.toLocaleString();
		}
		
		return str;
	}	
};