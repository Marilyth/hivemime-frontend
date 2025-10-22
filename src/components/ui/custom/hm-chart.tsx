import { ChartDataPoints } from '@/lib/view-models';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import ReactECharts, { EChartsOption } from 'echarts-for-react';


interface ChartProps extends React.HTMLAttributes<ReactECharts>{
  data: ChartDataPoints;
}

export const HiveMimeChart: React.FC<ChartProps> = observer(({ data, ...props }) => {
  function getOption() : EChartsOption {
    const dataValues = data.dataPoints.map(dp => dp.value);

    return {
        yAxis: {
            type: 'category',
            data: data.dataPoints.map(dp => dp.label)
        },
        xAxis: {
            type: 'value'
        },
        series: [{
            data: dataValues,
            type: "bar"
        }]
    }
  }

  return <ReactECharts option={getOption()} {...props} />;
});