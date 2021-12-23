import {useState, useEffect,useRef} from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
const LAMPORTS_PER_SOL = 1000000000;
const API = 'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/bat_city_underground'

const firstOptions = {
  title: {
    text: 'My stock chart'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
    }
  ]
};
export const Watcher=()=> {
const [hoverData, setHoverData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    xAxis: {
      categories: ['A', 'B', 'C'],
    },
    series: [
      { data: [1, 2, 3] }
    ],
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver(e){
              setHoverData(e.target.category)
            }
          }
        }
      }
    }
  });


  const getNewData = async () => {
    let response = await axios.get(
      API,
    )
    console.log('response', response)

    setChartOptions({ 
      xAxis: {
        categories: [...chartOptions.xAxis.categories, 1],
      },
      series: [
          { data: [...chartOptions.series[0].data, Math.random() * 5] }
        ]
    });
  }
  setInterval(getNewData, 3000);

  return   (<div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
        <button onClick={getNewData}>Add data</button>
</div>)
}
