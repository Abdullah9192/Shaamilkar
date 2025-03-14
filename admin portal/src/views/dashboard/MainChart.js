import React, { useEffect, useRef } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          )
          chartRef.current.options.scales.x.grid.color = getStyle(
            '--cui-border-color-translucent'
          )
          chartRef.current.options.scales.x.ticks.color =
            getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          )
          chartRef.current.options.scales.y.grid.color = getStyle(
            '--cui-border-color-translucent'
          )
          chartRef.current.options.scales.y.ticks.color =
            getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const random = (min, max) => Math.round(Math.random() * (max - min) + min)

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '350px', marginTop: '40px' }}
        data={{
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ],
          datasets: [
            {
              label: 'Earnings',
              backgroundColor: 'transparent',
              borderColor: '#41d9b5',
              pointHoverBackgroundColor: '#41d9b5',
              borderWidth: 2,
              data: [
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000),
                random(10050, 200000)
              ]
            }
          ]
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false
              },
              ticks: {
                color: getStyle('--cui-body-color')
              }
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent')
              },
              grid: {
                color: getStyle('--cui-border-color-translucent')
              },
              max: 200000,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 10,
                stepSize: Math.ceil(200000 / 5)
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3
            }
          }
        }}
      />
    </>
  )
}

export default MainChart
