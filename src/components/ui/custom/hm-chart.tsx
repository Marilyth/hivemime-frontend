import { ChartDataPoints, ChartType } from '@/lib/view-models';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { mutedColors, getComputedColor } from '@/lib/colors';
import { EChartsOption, PieSeriesOption } from 'echarts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';


interface ChartProps extends React.HTMLAttributes<ReactECharts>{
  data: ChartDataPoints;
  options?: EChartsOption;
}

export const HiveMimeChart: React.FC<ChartProps> = observer(({ data, ...props }) => {
  function getChartHeight() : string {
    switch (data.chartType) {
      case ChartType.Bar:
        return `${data.dataPoints.length * 5}rem`;
      default:
        return "20rem";
    }
  }

  function getChartWidth() : string {
    switch (data.chartType) {
      case ChartType.Column:
        return `${data.dataPoints.length * 5}rem`;
      default:
        return "100%";
    }
  }

  function labelFormatter(label: string) :string {
    return label.length > 10 ? label.slice(0, 10) + '…' : label;
  }

  function getOrderedDataPoints() : { label: string; value: number }[] {
    return data.dataPoints.toSorted((a, b) => b.value - a.value);
  }

  function getOrderedDataPointsWithValue() : { label: string; value: number }[] {
    return getOrderedDataPoints().filter(dp => dp.value > 0);
  }

  function getBarOption() : EChartsOption {
    const orderedData = getOrderedDataPoints();
    const dataValues = orderedData.map(dp => dp.value);
    const dataLabels = orderedData.map(dp => dp.label);

    return {
      color: [mutedColors.honeyBrown],
      yAxis: {
          type: 'category',
          data: dataLabels,
          axisLabel: {
            color: getComputedColor("muted-foreground"),
            rotate: 45,
            formatter: labelFormatter
          },
          axisLine: { show: true }
      },

      xAxis: {
          type: 'value',
          splitLine: { show: false },
          axisLabel: { color: getComputedColor("muted-foreground") },
          axisLine: { show: true }
      },

      series: [{
          data: dataValues,
          type: "bar",
          itemStyle: {
            borderRadius: [0, 5, 5, 0]
          }
      }],

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getColumnOption() : EChartsOption {
    const orderedData = getOrderedDataPoints();
    const dataValues = orderedData.map(dp => dp.value);
    const dataLabels = orderedData.map(dp => dp.label);

    return {
      color: [mutedColors.honeyBrown],

      xAxis: {
          type: 'category',
          data: dataLabels,
          axisLabel: {
            color: getComputedColor("muted-foreground"),
            rotate: 45,
            formatter: labelFormatter
          },
          axisLine: { show: true }
      },

      yAxis: {
          type: 'value',
          splitLine: { show: false },
          axisLabel: { color: getComputedColor("muted-foreground") },
          axisLine: { show: true }
      },

      series: [{
          data: dataValues,
          type: "bar",
          itemStyle: {
            borderRadius: [5, 5, 0, 0]
          }
      }],

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getPieOption() : EChartsOption {
    const dataValues = getOrderedDataPointsWithValue().map(dp => ({ name: dp.label, value: dp.value }));

    return {
      color: [mutedColors.honeyBrown, mutedColors.red, mutedColors.blue, mutedColors.green, mutedColors.purple, mutedColors.rose],

      series: [{
          data: dataValues,
          type: "pie",
          label: {
            color: getComputedColor("muted-foreground")
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            }
          },
          itemStyle: {}
      }],

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getDoughnutOption() : EChartsOption {
    const pieOption = getPieOption();
    const pieSeries = (pieOption.series as PieSeriesOption[])[0];

    pieSeries.itemStyle!.borderRadius = 5;
    pieSeries.radius = ['50%', '75%'];
    pieSeries.padAngle = 4;

    return pieOption;
  }

  function getHalfDoughnutOption() : EChartsOption {
    const pieOption = getDoughnutOption();
    const pieSeries = (pieOption.series as PieSeriesOption[])[0];

    pieSeries.startAngle = 180;
    pieSeries.endAngle = 360;
    pieSeries.center = ['50%', '75%'];

    return pieOption;
  }

  function getOption() : EChartsOption {
    switch (data.chartType) {
      case ChartType.Bar:
        return getBarOption();
      case ChartType.Column:
        return getColumnOption();
      case ChartType.Pie:
        return getPieOption();
      case ChartType.Doughnut:
        return getDoughnutOption();
      case ChartType.HalfDoughnut:
        return getHalfDoughnutOption();
      default:
        return {};
    }
  }

  return (
    <div>
      <ReactECharts style={{minHeight: getChartHeight(), minWidth: getChartWidth()}} option={getOption()} notMerge {...props} />
      
      <Select
        value={data.chartType.toString()}
        onValueChange={(value) => data.chartType = ChartType[value as keyof typeof ChartType]}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ChartType).filter((value) => typeof value === "string").map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
