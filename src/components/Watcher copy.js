import {useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const LAMPORTS_PER_SOL = 1000000000;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [];
const api = 'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/bat_city_underground'
// export const data = {
//   labels,
//   datasets: [

//     {
//       label: 'Dataset 2',
//       data: [700, 600, 500, 400, 300, 200, 100],
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

export const Watcher=()=> {
  const [data, updateData] = useState({
    labels:[],
    datasets: [
      {
        label: 'Price',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });
  const getNewData = async () => {
    let response = await axios.get(
      api,
    )
    console.log('response', data)
    const newData = {
      labels:[...data.labels,2],
      datasets: [
        {
          label: 'Price',
          data: [...data.datasets[0].data, response.data.results.floorPrice/LAMPORTS_PER_SOL],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    }
    updateData(newData)
  }
  // setInterval(getNewData, 3000);

  return <Line options={options} data={data} />;
}
