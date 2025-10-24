import { ChartDataPoints, ChartType } from '@/lib/view-models';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { mutedColors, getComputedColor } from '@/lib/colors';
import { EChartsOption, LineSeriesOption, PieSeriesOption, SeriesOption, registerMap, getMap } from 'echarts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import worldJson from "@/lib/world-geo.json";


interface ChartProps extends React.HTMLAttributes<ReactECharts>{
  data: ChartDataPoints;
  canChangeType?: boolean;
  options?: EChartsOption;
}

export const HiveMimeChart: React.FC<ChartProps> = observer(({ data, canChangeType = true, ...props }) => {
  function getChartHeight() : string {
    switch (data.chartType) {
      case ChartType.Bar:
      case ChartType.Line:
      case ChartType.SmoothLine:
      case ChartType.Area:
      case ChartType.Scatter:
        return `${data.dataPoints.length * 5}rem`;
      default:
        return "20rem";
    }
  }

  function getChartWidth() : string {
    switch (data.chartType) {
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

      series: {
          data: dataValues,
          type: "bar",
          itemStyle: {
            borderRadius: [0, 5, 5, 0],
          }
      },

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

      series: {
          data: dataValues,
          type: "bar",
          itemStyle: {
            borderRadius: [5, 5, 0, 0]
          }
      },

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getLineOption() : EChartsOption {
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

      series: {
          data: dataValues,
          type: "line"
      },

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getSmoothLineOption() : EChartsOption {
    const lineOption = getLineOption();
    const lineSeries = lineOption.series as LineSeriesOption;

    lineSeries.smooth = true;

    return lineOption;
  }

  function getAreaOption() : EChartsOption {
    const lineOption = getLineOption();
    const lineSeries = lineOption.series as LineSeriesOption;

    lineSeries.areaStyle = {};

    return lineOption;
  }

  function getScatterOption() : EChartsOption {
    const orderedData = getOrderedDataPoints();
    const dataValues = orderedData.map(dp => dp.value);
    const dataLabels = orderedData.map(dp => dp.label);

    return {
      color: [mutedColors.honeyBrown],
      xAxis: {
        type: 'value',
        splitLine: { show: false },
        axisLabel: { color: getComputedColor("muted-foreground") },
        axisLine: { show: true }
      },
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
      series: {
        data: dataValues,
        type: "scatter"
      },
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

      series: {
          data: dataValues,
          type: "pie",
          label: {
            color: "inherit"
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 5
          }
      },

      tooltip: {
        show: true
      },

      ...props.options
    };
  }

  function getDoughnutOption() : EChartsOption {
    const pieOption = getPieOption();
    const pieSeries = pieOption.series as PieSeriesOption;

    pieSeries.radius = ['50%', '75%'];

    return pieOption;
  }

  function getHalfDoughnutOption() : EChartsOption {
    const pieOption = getDoughnutOption();
    const pieSeries = pieOption.series as PieSeriesOption;

    pieSeries.startAngle = 180;
    pieSeries.endAngle = 360;
    pieSeries.center = ['50%', '75%'];

    return pieOption;
  }

  function getWorldOption() : EChartsOption {
    // Load world map data.
    if (!getMap('world'))
      registerMap('world', JSON.stringify(worldJson));

    const dataPoints = data.dataPoints.map(dp => ({name: dp.label, value: dp.value}));

    return {
      visualMap: {
        show: false,
        calculable: true
      },

      tooltip: {
        trigger: 'item'
      },

      series: {
        name: "Voters",
        type: 'map',
        map: 'world',
        roam: true,
        data: dataPoints,
        emphasis: {
          label: {
            show: false
          }
        },
        select: {
          label: {
            show: false
          }
        }
      }
    };
  }

  function getCalendarOption() : EChartsOption {
    const dataPoints = data.dataPoints.map(dp => [dp.label, dp.value])
      .toSorted((a, b) => (a[0] as string).localeCompare(b[0] as string));

    const today = new Date();

    const startDateRange = dataPoints.length > 0 ?
      dataPoints[0][0] :
      today.toISOString();

    const endDateRange = dataPoints.length > 0 ?
      dataPoints[dataPoints.length -1][0] :
      new Date(today.getTime() + 7 * 60 * 60 * 1000).toISOString();

    return {
      visualMap: {
        show: false,
        calculable: true
      },

      calendar: {
        orient: "vertical",
        range: [startDateRange, endDateRange],
      },

      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: dataPoints,
      },
    };
  }

  function getOption() : EChartsOption {
    let option = null;

    switch (data.chartType) {
      case ChartType.Bar:
        option = getBarOption();
        break;
      case ChartType.Pie:
        option = getPieOption();
        break;
      case ChartType.Doughnut:
        option = getDoughnutOption();
        break;
      case ChartType.HalfDoughnut:
        option = getHalfDoughnutOption();
        break;
      case ChartType.Line:
        option = getLineOption();
        break;
      case ChartType.SmoothLine:
        option = getSmoothLineOption();
        break;
      case ChartType.Area:
        option = getAreaOption();
        break;
      case ChartType.Scatter:
        option = getScatterOption();
        break;
      case ChartType.World:
        option = getWorldOption();
        break;
      case ChartType.Calendar:
        option = getCalendarOption();
        break;
      default:
        option = {};
    }

    (option.series as SeriesOption).universalTransition = false;
    (option.series as SeriesOption).animation = true;

    return option;
  }

  return (
    <div>
      <ReactECharts style={{minHeight: getChartHeight(), minWidth: getChartWidth()}} notMerge option={getOption()} {...props} />

      {canChangeType && (
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
      )}
    </div>
  );
});
