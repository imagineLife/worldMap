const geoNatural = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(geoNatural);

const buildMap = (parent, props) => {

	const {
		stateCountryFeats,
		colorScale,
		colorVal,
		selectedLegendVal
	} = props;

	const thisGSelection = parent.selectAll('g').data([null]);
	const thisGEnter = thisGSelection.enter().append('g');
	const thisGMerged = thisGSelection.merge(thisGEnter)

	//new path
	//appends on FIRST invocation of map fn, NOT on subsequent updates
	thisGEnter.append('path')
		.attr('d', pathGenerator({type: 'Sphere'}))
		.attr('class', 'globeSpherePath')
		.merge(thisGSelection.select('.globeSpherePath'))
			.attr('opacity', selectedLegendVal ? .75 : 1);

	parent.call(d3.zoom().on('zoom', function(){
		thisGMerged.attr("transform", d3.event.transform);
	}));

	//data-join for countries to paths
	const countryPaths = thisGMerged.selectAll('.countryPath').data(stateCountryFeats);

	//append a path for each country
	let countryPathsEnter = countryPaths.enter().append('path')
		.attr('class','countryPath')
		
		countryPaths.merge(countryPathsEnter)
		.attrs({
			'opacity': d => {
				return (!selectedLegendVal ||  selectedLegendVal === colorVal(d)) ? 1 : 0.25;
	        },
			'd': d => pathGenerator(d), //set d based on country;
			'fill': d => colorScale(colorVal(d))
		})
		.classed('highlightedCountryPath', d => (selectedLegendVal && colorVal(d)))
	
	//append the title for mouseover 'tooltip'
	countryPathsEnter.append('title')
		.text(d => `${d.properties.name}: ${d.properties.economy}`);

}