const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.teletal.hu/etlap').then((response)=>{
	const dom = cheerio.load(response.data);
	console.log(dom(".ar").length);
})
.catch((error)=>{
		console.log(error);
});