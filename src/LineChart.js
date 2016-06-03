/* @flow */
import React, { Component } from 'react';
import { Animated, ART, View } from 'react-native';
const { Surface, Shape, Path } = ART;
// import Morph from 'art/morph/path';
import * as C from './constants';
import Circle from './Circle';
const AnimatedShape = Animated.createAnimatedComponent(Shape);
import Grid from './Grid';

const makeDataPoint = (x : number, y : number, data : any) => {
	return { x, y, radius: data.dataPointRadius, fill: data.dataPointFillColor, stroke: data.dataPointColor };
};

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
		this.state = { opacity: new Animated.Value(0) };
	}

	componentWillUpdate() {
		Animated.timing(this.state.opacity, { duration: 0, toValue: 0 }).start();
	}

	componentDidUpdate() {
		Animated.timing(this.state.opacity, { duration: 500, toValue: 1 }).start();
	}

	_drawLine = () => {
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		const data = this.props.data || [];
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		const horizontalStep = WIDTH / data.length;

		const PATHS = [];
		const dataPoints = [];

		const firstDataPoint = data[0][1];

		const height = (minBound * scale) + (HEIGHT - (firstDataPoint * scale));
		const path = new Path().moveTo(0, height);
		dataPoints.push(makeDataPoint(0, height, this.props));
		PATHS.push(path);

		data.slice(1).forEach(([_, dataPoint], i) => {
			let _height = (minBound * scale) + (HEIGHT - (dataPoint * scale));
			if (height < 0) _height = 20;
			const x = horizontalStep * (i) + horizontalStep;
			const y = Math.round(_height);
			PATHS.push(path.lineTo(x, y));
			dataPoints.push(makeDataPoint(x, y, this.props));
		});
		if (path.path.some(isNaN)) return null;
		return (
			<View>
				<View style={{ position: 'absolute' }}>
					<Surface width={WIDTH} height={HEIGHT}>
						<AnimatedShape
							d={path}
							fill={this.props.fillColor}
							stroke={this.props.color || C.BLUE}
							strokeWidth={this.props.lineWidth}
						/>
					</Surface>
				</View>
				{(() => {
					if (!this.props.showDataPoint) return null;
					return (
						<Surface width={WIDTH} height={HEIGHT + 3}>
							{dataPoints.map((d, i) => <Circle key={i} {...d} />)}
						</Surface>
					);
				})()}
			</View>
		);
	};

	render() : any {
		return (
			<View>
				<Grid {...this.props} />
				<Animated.View style={{ opacity: this.state.opacity, backgroundColor: 'transparent' }}>
					{this._drawLine()}
				</Animated.View>
			</View>
		);
	}
}
