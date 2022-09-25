export type IMetricMappedDataPoint = {
    x: number;
    y: number;
  }
  
  export type IMetricChartDataPoint = {
    UnixTimeStamp: number;
    Value: number;
  }
  
  export type IMetricOppositeLine = {
    length: number;
    angle: number;
  }
  
  export type IMetricChartData = IMetricChartDataPoint[];