const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cheerio = require('cheerio');
let promises = [];

const csvWriter = createCsvWriter({
    path: 'file.csv',
    header: [
        {id: 'kod', title: 'KOD'},
		{id: 'ar', title: 'AR'},
        {id: 'energia', title: 'ENERGIA'},
		{id: 'feherje', title: 'FEHERJE'},
		{id: 'nap', title: 'NAP'},
		{id: 'nev', title: 'NEV'},
    ]
});

axios.get('https://www.teletal.hu/etlap').then((response)=> {
	const dom = cheerio.load(response.data);
	const infos = dom(".ar  .info");
	let eredmenyek = [];
	infos.each((i, elem)=>{
		const kodDatum = dom(elem);
		let info = dom(elem).parent().parent();
		const ev = kodDatum.attr("ev");
		const het = kodDatum.attr("het");
		const nap = kodDatum.attr("nap");
		const kod = kodDatum.attr("kod");
		const ft = +info.text().match("(\\d+) *Ft")[1];
		
		console.log('https://www.teletal.hu/info?ev='+ ev +'&het='+het+'&nap='+nap+'&kod='+kod);
		//https://www.teletal.hu/info?ev=2017&het=47&nap=5&kod=TV4
		promises.push(
			axios.get('https://www.teletal.hu/info?ev='+ ev +'&het='+het+'&nap='+nap+'&kod='+kod)
				.then((resp)=>{
					const d = cheerio.load(resp.data);
					const tapertek = d(".tapanyag");
					const cim = d(".cim").text();
					let osszFeherje = 0;
					let osszKaloria = 0;
					tapertek.each((i, tap)=>{
						let tapertekSzoveg = dom(tap).text();
						let result = "";
						osszFeherje += tapertekSzoveg.match(/1 adagban.*\./g).map(x=>x.match("Fehérje: *(\\d+(,\\d+)?)")[1]).map(x => +x.replace(",","."))
						.reduce(function(accumulator, currentValue) {
							return accumulator + currentValue;
						 });
					});
					tapertek.each((i, tap)=>{
						let tapertekSzoveg = dom(tap).text();
						let result = "";
						osszKaloria += tapertekSzoveg.match(/1 adagban.*\./g).map(x=>x.match("Energia: *(\\d+(,\\d+)?)")[1]).map(x => +x.replace(",","."))
						.reduce(function(accumulator, currentValue) {
							return accumulator + currentValue;
						 });
					});
				
					eredmenyek.push({ "kod" : kod, "ar": ft,"energia":osszKaloria,"feherje":osszFeherje,"nap":nap,"nev":cim});
					console.log( kod+" "+cim + " "+ ft + " FT    Feherje:"+ osszFeherje + "  Kaloria: " + osszKaloria);
				}).catch((err)=>{
					console.log(err);
				})
				);
		
	//console.log(dom(".ar  .info").length);
	})
	Promise.all(promises).then(()=> {
		csvWriter.writeRecords(eredmenyek)       // returns a promise 
			.then(() => {
				console.log('...Done');
			}).catch((err)=>{
					console.log(err);
			});
		
	}).catch((err)=>{
					console.log(err);
	});
})
.catch((error)=>{
		console.log(error);
});
