/* @flow */
'use strict';
import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	xAxisContainer: {
		flexDirection: 'row',
		flex: 0,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
	},
	axisText: {
		flex: 1,
		backgroundColor: 'transparent',
	},
});

export default class XAxis extends Component {

	static propTypes = {
		axisColor: PropTypes.any.isRequired,
		axisLabelColor: PropTypes.any.isRequired,
		axisLineWidth: PropTypes.number.isRequired,
		data: PropTypes.arrayOf(PropTypes.array),
		showXAxisLabels: PropTypes.bool.isRequired,
		style: PropTypes.any,
		width: PropTypes.number.isRequired,
		align: PropTypes.string,
		labelFontSize: PropTypes.number.isRequired,
		xAxisTransform: PropTypes.func,
		xValueCount: PropTypes.number,
	};
	static defaultProps = {
		align: 'center',
	};

	render() {
		const data = this.props.data || [];
		const xValueCount = this.props.xValueCount
		let transform = (d) => d;
		if (this.props.xAxisTransform && typeof this.props.xAxisTransform === 'function') {
			transform = this.props.xAxisTransform;
		}
		return (
			<View
				style={[
					styles.xAxisContainer,
					{
						borderTopColor: this.props.axisColor,
						borderTopWidth: this.props.axisLineWidth,
					},
					this.props.style,
				]}
			>
			{(() => {
				if (!this.props.showXAxisLabels) return null;
				let xValues = xValueCount
				xValues = Array.from({length: xValues}, (v, k) => k);
				return xValues.map((value) => {
					const item = transform(value)
					return (
						<Text
							key={value}
							style={[
								styles.axisText,
								{
									textAlign: this.props.align,
									color: this.props.axisLabelColor,
									fontSize: this.props.labelFontSize,
								},
							]}
						>{item}</Text>
				);
				});
			})()}
			</View>
		);
	}
}
