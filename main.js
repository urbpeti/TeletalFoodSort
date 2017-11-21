const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

axios.get('https://www.teletal.hu/etlap').then((response)=>{
	const html = new JSDOM(response.data);
	console.log(html.window.document.querySelector(".ar")[1]);
})
.catch((error)=>{
		console.log(error);
});