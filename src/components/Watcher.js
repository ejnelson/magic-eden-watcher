import { useRef, useEffect } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import { filter, find } from 'lodash'

const LISTED_NFT_API =
    'https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery'

const API = 'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/'

// const LAMPORTS_PER_SOL = 1000000000

export const Watcher = ({ projectName, chartType }) => {
    const chartComponent = useRef(null)

    useEffect(() => {
        if (chartType === 'Floor') {
            chartComponent.current.chart.addSeries({
                name: 'Floor',
                data: [],
            })
            chartComponent.current.chart.addSeries({
                name: '5th from Floor',
                data: [],
            })
            chartComponent.current.chart.addSeries({
                name: '10th from Floor',
                data: [],
            })
        } else {
            chartComponent.current.chart.addSeries({
                name: chartType,
                data: [],
            })
        }
    }, [])
    const options = {
        time: {
            useUTC: false,
        },

        rangeSelector: {
            buttons: [
                {
                    count: 1,
                    type: 'minute',
                    text: '1M',
                },
                {
                    count: 5,
                    type: 'minute',
                    text: '5M',
                },
                {
                    type: 'all',
                    text: 'All',
                },
            ],
            inputEnabled: false,
            selected: 0,
        },

        title: {
            text: chartType,
        },

        exporting: {
            enabled: false,
        },

        credits: {
            enabled: false,
        },
    }

    const getNewData = async () => {
        if (chartComponent.current?.chart?.series) {
            if (chartType === 'Floor') {
                const seriesFloor = chartComponent.current.chart.series[0]
                const series5th = chartComponent.current.chart.series[1]
                const series10th = chartComponent.current.chart.series[2]

                let {
                    data: { results },
                } = await axios.get(LISTED_NFT_API, {
                    params: {
                        q: {
                            $match: { collectionSymbol: projectName },
                            $sort: { takerAmount: 1, createdAt: -1 },
                            $skip: 0,
                            $limit: 15,
                        },
                    },
                })
                const filteredResults = filter(
                    results,
                    (result) => result.price > 0
                )
                console.log('filteredResults', filteredResults)
                const floorPrice = filteredResults[0].price
                const fifthFromFloorPrice = filteredResults[4].price
                const tenthFromFloorPrice = filteredResults[9].price

                seriesFloor.addPoint(
                    [new Date().getTime(), floorPrice],
                    false,
                    false
                )
                series5th.addPoint(
                    [new Date().getTime(), fifthFromFloorPrice],
                    false,
                    false
                )

                series10th.addPoint(
                    [new Date().getTime(), tenthFromFloorPrice],
                    true,
                    false
                )
            } else {
                const series = chartComponent.current.chart.series[0]
                let response = await axios.get(`${API}${projectName}`)

                const results = response.data.results
                const newData =
                    chartType === 'Listed'
                        ? results.listedCount
                        : results.volumeAll / results.floorPrice
                series.addPoint([new Date().getTime(), newData], true, false)
            }
        }
    }
    setInterval(getNewData, 1000)
    return (
        <>
            <HighchartsReact
                constructorType={'stockChart'}
                ref={chartComponent}
                highcharts={Highcharts}
                options={options}
            />
        </>
    )
}
