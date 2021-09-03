let mapURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let eduURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let countyData
let eduData

let svg = d3.select('#canvas')
let tooltip = d3.select("#tooltip")

let drawMap = () => {
    svg.selectAll('path')//when working with maps like rect, circle etc
       .data(countyData)
       .enter()
       .append('path')
       .attr('d',d3.geoPath())//special attr for map lines
       .attr("class","county")
       .attr('fill',(countyDataItem)=>{
           let id = countyDataItem['id']
           let county = eduData.find((d)=>{
               return d['fips'] === id
           })
           let perc = county['bachelorsOrHigher']
           if(perc <= 15) {
               return '#EDBB99'
           }else if (perc <= 25){
               return '#F9E79F'
           }else if (perc <= 45){
               return "lightgreen"
           }else {
               return "#A3E4D7"
           }
       })
       .attr("data-fips",(countyDataItem)=>{
           return countyDataItem['id']
       })
       .attr("data-education",(countyDataItem)=>{
        let id = countyDataItem['id']
        let county = eduData.find((d)=>{
            return d['fips'] === id
        })
        let perc = county['bachelorsOrHigher']
        return perc
       })
       //tooltip
       .on("mouseover", (countyDataItem)=>{
           tooltip.transition()
            .style("visibility","visible")

        let id = countyDataItem['id']
        let county = eduData.find((d)=>{
            return d['fips'] === id
        })
        
        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ' - ' + county['bachelorsOrHigher'] + '%')

        tooltip.attr("data-education",county['bachelorsOrHigher'])
       })
       .on("mouseout",(countyDataItem)=>{
           tooltip.transition()
           .style("visibility","hidden")
       })



}







//different method to fetch data
d3.json(mapURL).then(
    (data,error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data,data.objects.counties).features

            d3.json(eduURL).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        eduData = data
                        drawMap()
                    }
                }
            )
        }
    }
)