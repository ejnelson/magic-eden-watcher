import React from "react";
import { render } from "react-dom";
// Import Highcharts
import Highcharts from "highcharts/highstock";
//import HighchartsReact from "./HighchartsReact.min.js";
import HighchartsReact from "highcharts-react-official";

import HC_more from "highcharts/highcharts-more"; //module
import axios from 'axios';
HC_more(Highcharts); //init module
const API = 'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/alpha_dragons'

const LAMPORTS_PER_SOL = 1000000000;
export class Watcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          events: {
              load: function () {
  
                  // set up the updating of the chart each second
                  var series = this.series[0];
                  setInterval(async function () {
                    let response = await axios.get(
                      API,
                    )
                    console.log('response', response.data.results.floorPrice)
                      var x = (new Date()).getTime(), // current time
                          y = response.data.results.floorPrice/LAMPORTS_PER_SOL;
                      series.addPoint([x, y], true, true);
                  }, 1000);
              }
          }
      },
  
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
          text: 'Live random data'
      },
  
      exporting: {
          enabled: false
      },
  
      series: [{
          name: 'Random data',
          data: (function () {
              // generate an array of random data
              var data = [],
                  time = (new Date()).getTime(),
                  i;
  
              for (i = -999; i <= 0; i += 1) {
                  data.push([
                      time + i * 1000,
                      Math.round(Math.random() * 1)
                  ]);
              }
              return data;
          }())
      }]
      // series:[{name:'random', data:[]}]
      }
    };
  }

  render() {
    return (
      <HighchartsReact
        constructorType={"stockChart"}
        ref={this.chartComponent}
        highcharts={Highcharts}
        options={this.state.options}
      />
    );
  }
}


