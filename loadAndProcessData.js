function loadAndProcessData(){

	return new Promise((res, rej) => {

		//load tsv data, assign to var
		return d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv').then(dataRes => {
			let tsvData = dataRes;

			//load json data, assign to var
			return d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json').then(jsonRes => {
				let jsonData = jsonRes;

				/*
					take loaded data and convert to a 'countries' var
					get row-by-ID lookup fn
					make countries from json data
					adding the country row data to a 'properties' key
					
				*/
				const getRowById = tsvData.reduce((accumulator, d) => {
					accumulator[d.iso_n3] = d;
					return accumulator;
				}, {})


				//define countries from json Data
				const countries = topojson.feature(jsonData, jsonData.objects.countries);

				countries.features.forEach(d => {
					Object.assign(d.properties, getRowById[d.id])
				})

				res(countries);
			})
		});
	})
}