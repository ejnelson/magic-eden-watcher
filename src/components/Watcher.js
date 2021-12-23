import {useRef, } from "react";
// Import Highcharts
import Highcharts from "highcharts/highstock";
//import HighchartsReact from "./HighchartsReact.min.js";
import HighchartsReact from "highcharts-react-official";
import axios from 'axios';

// import HC_more from "highcharts/highcharts-more"; //module
// HC_more(Highcharts); //init module



















const API = 'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/'

const LAMPORTS_PER_SOL = 1000000000;

export const Watcher=({projectName,type})=> {
const chartComponent=useRef(null); 

const options= {
  time: {
      useUTC: false
  },
  
  rangeSelector: {
      buttons: [{
          count: 1,
          type: 'minute',
          text: '1M'
      }, {
          count: 5,
          type: 'minute',
          text: '5M'
      }, {
          type: 'all',
          text: 'All'
      }],
      inputEnabled: false,
      selected: 0
  },
  
  title: {
      text: type
  },
  
  exporting: {
      enabled: false
  },
  
  series: [{
      name: 'chart',
      data: [ ]
  }],
  credits: {
    enabled: false
  },
  }

const getNewData = async () => {
  if(chartComponent.current?.chart?.series){

    let response = await axios.get(
      `${API}${projectName}`,
      )
      const series = chartComponent.current.chart.series[0]
      const results = response.data.results
      console.log('results', results)
const newData = type==='Floor'? results.floorPrice/LAMPORTS_PER_SOL: type ==='Listed'? results.listedCount:results.volumeAll
      series.addPoint([(new Date()).getTime(), newData], true, false);

    }
 
}
setInterval(getNewData, 1000);
  return (
    <>
      <HighchartsReact
        constructorType={"stockChart"}
        ref={chartComponent}
        highcharts={Highcharts}
        options={options}
      />
      

    </>
    );
}


