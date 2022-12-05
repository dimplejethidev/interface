import {
    IMetricChartData,
    IMetricMappedDataPoint,
    IMetricOppositeLine,
} from "../types/metric";

// height of the svg element
const SVG_HEIGHT = 4600;

// width of the svg element
const SVG_WIDTH = 7000;

// radius of the circle at the tip of the line
// TODO: Do we need this?
// const CIRCLE_RADIUS = 5;

// [start, end] of the x axis of the grid
// const GRID_AXIS_X = [0, SVG_WIDTH - CIRCLE_RADIUS];
const GRID_AXIS_X = [0, SVG_WIDTH];

// [start, end] of the y axis of the grid
// const GRID_AXIS_Y = [CIRCLE_RADIUS, SVG_HEIGHT - 2];
const GRID_AXIS_Y = [0, SVG_HEIGHT];

function getAxisLength(axis: number[]): number {
    return axis[1] - axis[0];
}

export function mapDataToSvgCoordinates(
    dataPoints: IMetricChartData
): IMetricMappedDataPoint[] {
    // We want the max x value to be the time value of the last data point
    const xMax = dataPoints[dataPoints.length - 1].UnixTimeStamp;

    // We want the time value of the first data point to be x=0 in the SVG
    const xMin = dataPoints[0].UnixTimeStamp;

    // We want the max y value to be the "value" value of the last dataPoint
    const yMax = dataPoints[dataPoints.length - 1].Value + 4000;

    // We want the y axis to start at 0
    const yMin = 0;

    return dataPoints.map((dataPoint) => {
        // Get a factor to scale an API datapoint's x value to
        // an x value in the SVG grid
        const xScaleFactor = getAxisLength(GRID_AXIS_X) / (xMax - xMin);

        // Subtract xMin from the current xValue (since xMin is going
        // to be treated as 0 in the SVG grid), and multiply it by the
        // xScaleFactor value to scale the x value to an appropriate value
        // in the SVG grid
        const mappedX = (dataPoint.UnixTimeStamp - xMin) * xScaleFactor;

        // Same logic as with getting the xScaleFactor
        const yScaleFactor = getAxisLength(GRID_AXIS_Y) / (yMax - yMin);

        // Same logic as with scaling the xValue. The only difference here is
        // the positive Y direction goes DOWNWARD in the SVG coordinate system,
        // which means this is an inverted y value of what needs to be shown
        // in the SVG grid
        const invertedMappedY = (dataPoint.Value - yMin) * yScaleFactor;

        // Get the correct mapped Y value by subtracting the invertedYValue
        // from the max value of the SVG grid y axis
        const mappedY = GRID_AXIS_Y[1] - invertedMappedY;

        return { x: mappedX, y: mappedY };
    });
}

function computeOppositeLine(
    pointA: IMetricMappedDataPoint,
    pointB: IMetricMappedDataPoint
): IMetricOppositeLine {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
        length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
        angle: Math.atan2(lengthY, lengthX),
    };
}

function computeControlPoint(
    current: IMetricMappedDataPoint,
    previous: IMetricMappedDataPoint,
    next: IMetricMappedDataPoint,
    reverse: boolean
): number[] {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current; // The smoothing ratio
    const smoothing = 0.2; // Properties of the opposed-line
    const o = computeOppositeLine(p, n); // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing; // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return [x, y];
}

function computeBezierCommand(
    point: IMetricMappedDataPoint,
    i: number,
    a: IMetricMappedDataPoint[]
): string {
    // start control point
    const [cpsX, cpsY] = computeControlPoint(a[i - 1], a[i - 2], point, false); // end control point
    const [cpeX, cpeY] = computeControlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX} ${cpsY}, ${cpeX} ${cpeY}, ${point.x} ${point.y}`;
}

function calculatePathSmooth(dataPoints: IMetricMappedDataPoint[]): string {
    return dataPoints.reduce<string>((generated, dataPoint, i) => {
        if (i === 0) return generated;

        const bezier = computeBezierCommand(dataPoint, i, dataPoints);
        return `${generated} ${bezier}`;
    }, `M 0 ${dataPoints[0].y}`);
}

export default calculatePathSmooth;
