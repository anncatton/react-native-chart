/* @flow */
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React, { Component } from 'react';
import * as C from './constants';
import Grid from './Grid';
import numeral from 'numeral'

const styles = StyleSheet.create({
	default: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default class BarChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = { };
	}

	_handlePress = (e : Object, dataPoint : number, index : number) => {
		if (this.props.data.onDataPointPress) {
			this.props.data.onDataPointPress(e, dataPoint, index);
		}
	};

	_drawBar = (_dataPoint : [number, number], index : number) => {
		const [_x, dataPoint] = _dataPoint;
		const backgroundColor = (typeof this.props.barColors !== 'undefined' && this.props.barColors[index] ? this.props.barColors[index] : C.BLUE);
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		let widthPercent = this.props.widthPercent || 0.5;
		if (widthPercent > 1) widthPercent = 1;
		if (widthPercent < 0) widthPercent = 0;

		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const data = this.props.data || [];

		const width = (WIDTH / data.length * this.props.horizontalScale * 0.5) * widthPercent;
		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		let height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
		// removed this because it incorrectly represented the last year of amortization, which is
		// always 0 or 0.01
		// if (height <= 0) height = 20;
		const { xAxisTitle, xAxisUnit, accessibilityIndices, regularLabel } = this.props
		const accessibleBarValue = (xAxisUnit === 'currency') ? numeral(dataPoint).format('$0,0.00') : dataPoint

		return (
			<TouchableWithoutFeedback
				accessibilityLabel={`${regularLabel} ${ accessibilityIndices[index].option} ${xAxisTitle} ${accessibilityIndices[index].index}: ${accessibleBarValue}.`}
				key={index}
				onPress={(e) => this._handlePress(e, dataPoint, index)}
			>
				<View
					style={{
						borderTopLeftRadius: this.props.cornerRadius || 0,
						borderTopRightRadius: this.props.cornerRadius || 0,
						backgroundColor,
						width,
						height,
					}}
				/>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		const data = this.props.data || [];
		return (
			<View ref="container" style={[styles.default]}>
				<Grid {...this.props} />
				{data.map(this._drawBar)}
			</View>
		);
	}
}
