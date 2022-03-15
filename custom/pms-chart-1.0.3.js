//#region Chart.js
let myChart;
let myPie;
let myCurve;
let myCombo;
let barChartImg;
let pieChartImg;
let curveChartImg;
let comboChartImg;

let [vintage, macaron, shine, terran, walden] = [
	[
		"#d87c7c",
		"#919e8b",
		"#d7ab82",
		"#6e7074",
		"#61a0a8",
		"#efa18d",
		"#787464",
		"#cc7e63",
		"#724e58",
		"#4b565b"
	],
	[
		"#2ec7c9",
		"#b6a2de",
		"#5ab1ef",
		"#ffb980",
		"#d87a80",
		"#8d98b3",
		"#e5cf0d",
		"#97b552",
		"#95706d",
		"#dc69aa",
		"#07a2a4",
		"#9a7fd1",
		"#588dd5",
		"#f5994e",
		"#c05050",
		"#59678c",
		"#c9ab00",
		"#7eb00a",
		"#6f5553",
		"#c14089"
	],
	[
		"#c12e34",
		"#e6b600",
		"#0098d9",
		"#2b821d",
		"#005eaa",
		"#339ca8",
		"#cda819",
		"#32a487"
	],
	[
		"#893448",
		"#d95850",
		"#eb8146",
		"#ffb248",
		"#f2d643",
		"#ebdba4"
	],
	[
		"#3fb1e3",
		"#6be6c1",
		"#626c91",
		"#a0a7e6",
		"#c4ebad",
		"#96dee8"
	],
]
let background1_opacity = [
	"rgba(92,107,192,0.2)",
	"rgba(236,64,122,0.2)",
	"rgba(149,117,205,0.2)",
	"rgba(36,166,154,0.2)",
	"rgba(30, 136, 229,0.2)",
	"rgba(36,175,80,0.2)",
	"rgba(245,124,0,0.2)",
	"rgba(0, 229, 255,0.2)",
	"rgba(255, 255, 0,0.2)",
	"rgba(0,150,136,0.2)",
]
let background1 = [
	"rgba(92,107,192,0.6)",
	"rgba(236,64,122,0.6)",
	"rgba(149,117,205,0.6)",
	"rgba(36,166,154,0.6)",
	"rgba(30, 136, 229,0.6)",
	"rgba(36,175,80,0.6)",
	"rgba(245,124,0,0.6)",
	"rgba(0, 229, 255,0.6)",
	"rgba(255, 255, 0,0.6)",
	"rgba(0,150,136,0.6)",
]
let border1 = [
	"rgba(92,107,192,1)",
	"rgba(236,64,122,1)",
	"rgba(149,117,205,1)",
	"rgba(36,166,154,1)",
	"rgba(30, 136, 229,1)",
	"rgba(36,175,80,1)",
	"rgba(245,124,0,1)",
	"rgba(0, 229, 255,1)",
	"rgba(255, 255, 0,1)",
	"rgba(0,150,136,1)",

]
let pointSt = [
	'circle',
	'triangle',
	'rect',
	'cross',
	'rectRot',
	'star',
	'crossRot',
	'dash',
	'line',
	'rectRounded',

]

let [plannedColor, actualColor] = [
	[
		"rgba(53, 78, 219, 1)",
		"rgba(241, 62, 122, 1)",
		"rgba(231, 131, 37, 1)",
		"rgba(129, 69, 231, 1)",
		"rgba(236, 205, 68, 1)",
		"rgba(83, 90, 89, 1)",
		"rgba(226, 67, 67, 1)",
		"rgba(44, 144, 231, 1)",
		"rgba(76, 240, 128, 1)",
		"rgba(236, 108, 230, 1)",
		"rgba(73, 194, 231, 1)",
		"rgba(230, 230, 96, 1)",
		"rgba(9, 36, 189, 1)",
		"rgba(192, 14, 183, 1)",
		"rgba(109, 177, 46, 1)",
		"rgba(62, 134, 131, 1)",
		"rgba(185, 51, 125, 1)",
		"rgba(0, 110, 124, 1)",
		"rgba(160, 88, 228, 1)",
		"rgba(138, 92, 1, 1)"
	],
	[
		"rgba(53, 78, 219, 0.7)",
		"rgba(241, 62, 122, 0.7)",
		"rgba(231, 131, 37, 0.7)",
		"rgba(129, 69, 231, 0.7)",
		"rgba(236, 205, 68, 0.7)",
		"rgba(83, 90, 89, 0.7)",
		"rgba(226, 67, 67, 0.7)",
		"rgba(44, 144, 231, 0.7)",
		"rgba(76, 240, 128, 0.7)",
		"rgba(236, 108, 230, 0.7)",
		"rgba(73, 194, 231, 0.7)",
		"rgba(230, 230, 96, 0.7)",
		"rgba(9, 36, 189, 0.7)",
		"rgba(192, 14, 183, 0.7)",
		"rgba(109, 177, 46, 0.7)",
		"rgba(62, 134, 131, 0.7)",
		"rgba(185, 51, 125, 0.7)",
		"rgba(0, 110, 124, 0.7)",
		"rgba(160, 88, 228, 0.7)",
		"rgba(138, 92, 1, 0.7)"
	]
]

Chart.plugins.register(ChartDataLabels);

/**
 * Draw curve chart based on labels and chart data
 * using Chart.js library
 * @param  {Element} chartContainer Element DOM with jQuery
 * @param  {string} chartTitle Chart title
 * @param  {Array<string>} labels Array of string as chart labels
 * @param  {Array<Array>} chartData Array of chart data 
 */
function showCurveChart(chartContainer, chartTitle, labels, chartData) {
	let _dataset = [];
	no = 0;
	chartData.forEach((set) => {
		_label = Object.keys(set)[0];
		_data = Object.values(set)[0].map(x => Object.values(x)[0]);
		_dataset = [..._dataset, {
			label: _label,
			data: _data,
			borderColor: border1[no],
			fill: false,
			pointStyle: pointSt[no]
		}]
		no++;
	});

	let ctx = $(chartContainer);
	myCurve = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: _dataset
		},
		options: {
			responsive: true,
			bezierCurve: false,
			maintainAspectRatio: false,
			pointRadius: 5,
			pointHoverRadius: 10,
			pointBorderWidth: 3,
			legend: {
				position: 'top' // place legend on the top side of chart
			},
			title: {
				display: true,
				text: chartTitle
			},
			scales: {
				yAxes: [{
					display: true,
					position: 'left',
					type: "linear",
					ticks: {
						callback: function (value, index, values) {
							return Intl.NumberFormat().format((value / 1000)) + 'K';
						}
					}
				}]
			},
			animation: {
				onComplete: curveRendered
			},
			plugins: {
				datalabels: false
			}

		}
	})
}

/**
 * Draw Combo chart of Bar and Curve type 
 * using eCharts
 * @param  {ElementID} chartContainer Element ID
 * @param  {string} chartTitle Chart title
 * @param  {Array<string>} labels Array of label in X Axis
 * @param  {Array<T>} chartData Array of chart data shown as bar
 * @param  {Array<T>} curveData Array of chart data shown as curve
 */
function showComboChart(chartContainer, chartTitle, labels, chartData, curveData) {
	let _dataset = [];
	no = 0;
	chartData.forEach((set) => {
		_label = Object.keys(set)[0];
		_data = Object.values(set)[0].map(x => Object.values(x)[0]);
		_dataset = [..._dataset, {
			label: _label,
			type: 'bar',
			data: _data,
			backgroundColor: background1[no],
			borderColor: border1[no],
			fill: true,
			yAxisID: 'y-left',
		}]
		no++;
	});

	curveData.forEach((set) => {
		_label = Object.keys(set)[0];
		_data = Object.values(set)[0].map(x => Object.values(x)[0]);
		_dataset = [..._dataset, {
			label: _label,
			type: 'line',
			data: _data,
			borderColor: border1[no],
			fill: false,
			pointStyle: pointSt[no],
			yAxisID: 'y-right',
		}]
		no++;
	});

	let ctx = $(chartContainer);
	myCurve = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: _dataset
		},
		options: {
			responsive: true,
			bezierCurve: false,
			maintainAspectRatio: false,
			pointRadius: 5,
			pointHoverRadius: 10,
			pointBorderWidth: 3,
			legend: {
				position: 'top' // place legend on the top side of chart
			},
			title: {
				display: false,
				text: chartTitle
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
						return datasetLabel + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
					}
				}
			},
			scales: {
				yAxes: [{
					display: true,
					position: 'left',
					type: "linear",
					id: 'y-left',
					ticks: {
						beginAtZero: true,
						callback: function (value, index, values) {
							return Intl.NumberFormat().format((value / 1000)) + 'K';
						}
					}
				}, {
					display: true,
					position: 'right',
					type: "linear",
					max: 100,
					min: 0,
					id: "y-right",
					ticks: {
						beginAtZero: true,
						callback: function (value, index, values) {
							return Intl.NumberFormat().format((value));
						}
					}

				}]
			},
			animation: {
				onComplete: curveRendered
			},
			plugins: {
				datalabels: {
					render: 'value',
					anchor: 'start',
					clamp: true,
					align: 'top',
					offset: 5,
					rotation: '270',
					precision: 2,
					color: '#666',
					formatter: function (value, ctx) {
						return value.toLocaleString('en-US');
						// return (value/1000).toFixed(2).toLocaleString('en-US') + "K";
					}
				}
			}

		}
	})
}


function showPieChart(chartContainer, chartTitle, labels, chartData) {
	let ctx = $(chartContainer);

	myPie = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{
				label: chartTitle,
				data: chartData,
				backgroundColor: background1,
				hoverBorderWidth: 5,
				hoverBorderColor: background1,
			}]
		},
		options: {
			responsive: false,
			bezierCurve: false,
			maintainAspectRatio: true,

			legend: {
				position: 'top' // place legend on the top side of chart
			},
			title: {
				display: false,
				text: chartTitle
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						var label = data.labels[tooltipItem.index] || '';
						if (label) {
							label += ': ';
						}
						label += Intl.NumberFormat().format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
						return label;
					},
					overlap: false,
					position: "outside",
				}
			},
			animation: {
				onComplete: pieRendered
			},
			plugins: {
				datalabels: {
					render: 'percentage',
					precision: 2,
					color: '#fff',
					display: 'auto',
					formatter: function (value, ctx) {
						let datasets = ctx.chart.data.datasets;

						if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
							let sum = 0;
							datasets.map((dataset) => {
								dataset.data.map((ds) => {
									sum += ds;
								})
							});
							let percentage = ((value / sum) * 100).toFixed(1) + '%';
							return percentage;
						} else {
							return '-';
						}
					}
				}
			}

		}
	})
}

function showPieChart1(chartContainerID, chartTitle, labels, chartData) {
	// console.log(chartData)

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()
	let option;

	option = {
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {c} ({d}%)',
			fontSize: 10
		},
		legend: {
			data: labels
		},
		series: [{
			name: chartTitle,
			type: 'pie',
			radius: ['0%', '80%'],
			center: ['50%', '57%'],
			labelLine: {
				// length: 25,
				show: false
			},

			label: {
				position: 'inner',
				formatter: '{b|{c}}\n({d}%)',
				borderRadius: 4,
				rich: {
					b: {
						fontSize: 14,
						fontWeight: 'bold',
					}
				}
			},
			data: chartData,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	option && myChart.setOption(option);
}

function showPieChart2(chartContainerID, chartTitle, labels, chartData) {
	// console.log(chartData)

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()
	let option;

	option = {
		tooltip: {
			trigger: 'item',
			formatter: '{a} \n{b}: {c} ({d}%)',
			fontSize: 10

		},
		legend: {
			data: labels
		},
		series: [{
				name: chartTitle[0],
				type: 'pie',
				radius: ['5%', '30%'],
				labelLine: {
					length: 75,
				},
				label: {
					formatter: '{b|{b}：}{c}  {per|{d}%}  ',
					backgroundColor: '#F6F8FC',
					borderColor: '#8C8D8E',
					borderWidth: 1,
					borderRadius: 4,
					rich: {
						b: {
							color: '#4C5058',
							fontSize: 12,
							fontWeight: 'bold',
							lineHeight: 24
						},
						per: {
							color: '#fff',
							backgroundColor: '#4C5058',
							padding: [2, 2],
							borderRadius: 2
						}
					}
				},
				data: chartData[0]
			},
			{
				name: chartTitle[1],
				type: 'pie',
				radius: ['40%', '65%'],
				labelLine: {
					length: 22,
				},
				label: {
					formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
					backgroundColor: '#F6F8FC',
					borderColor: '#8C8D8E',
					borderWidth: 1,
					borderRadius: 2,
					rich: {
						b: {
							color: '#4C5058',
							fontSize: 12,
							fontWeight: 'bold',
							lineHeight: 24
						},
						per: {
							color: '#fff',
							backgroundColor: '#4C5058',
							padding: [3, 4],
							borderRadius: 2
						}
					}
				},
				data: chartData[1]
			}
		]
	};

	option && myChart.setOption(option);
}

function showDonutChart(chartContainerID, chartTitle, labels, chartData) {
	// console.log(chartData)

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()
	let option;
	let dataSeries = [{
		name: Object.keys(chartData[0])[0] ,
		type: 'pie',
		radius: ['20%', '50%'],
		center: ['50%', '55%'],
		itemStyle: {
			// borderRadius: 5,
			borderColor: '#fff',
			borderWidth: 1
		  },
		labelLine: {
			show: false,
		},
		label: {
			show: true,
			formatter: '{d}%',
			position: 'inner'
		},
		data: Object.values(chartData[0])[0] 
	},
	{
		name: Object.keys(chartData[1])[0] ,
		type: 'pie',
		radius: ['55%', '85%'],
		center: ['50%', '55%'],
		itemStyle: {
			// borderRadius: 5,
			borderColor: '#fff',
			borderWidth: 1
		  },
		labelLine: {
			show: false,
		},
		label: {
			show: true,
			formatter: '{d}%',
			position: 'inner'
		},
		data: Object.values(chartData[1])[0] 
	}
]
	option = {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
			fontSize: 10,
			
		},
		legend: {
			data: labels
		},
		
		series: dataSeries
	};

	option && myChart.setOption(option);
}

function showDoublePieChart(chartContainerID, chartTitle, labels, chartData) {
	// console.log(chartData)

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()
	let option;
	let dataSeries = [{
		name: Object.keys(chartData[0])[0] ,
		type: 'pie',
		radius: ['35%', '85%'],
		center: ['25%', '55%'],
		itemStyle: {
			// borderRadius: 5,
			borderColor: '#fff',
			borderWidth: 1
		},
		labelLine: {
			show: false,
		},
		label: {
			show: true,
			formatter: '{d}%',
			position: 'inner'
		},
		data: Object.values(chartData[0])[0] 
	},
	{
		name: Object.keys(chartData[1])[0] ,
		type: 'pie',
		radius: ['35%', '85%'],
		center: ['75%', '55%'],
		itemStyle: {
			// borderRadius: 5,
			borderColor: '#fff',
			borderWidth: 1
		},
		labelLine: {
			show: false,
		},
		label: {
			show: true,
			formatter: '{d}%',
			position: 'inner'
		},
		data: Object.values(chartData[1])[0] 
	}
]
	option = {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
			fontSize: 10,
			
		},
		legend: {
			data: labels
		},
		title: [{
			text: Object.keys(chartData[0])[0],
			left: '25%',
			top: '52%',
			textAlign: 'center'
		},
		{
			text: Object.keys(chartData[1])[0],
			left: '75%',
			top: '52%',
			textAlign: 'center'
		}
	],		
		series: dataSeries
	};

	option && myChart.setOption(option);
}

function showBarChartMulti(chartContainer, chartTitle, labels, chartData) {
	let _dataset = [];
	no = 0;
	chartData.forEach((set) => {
		_label = Object.keys(set)[0];
		_data = Object.values(set)[0].map(x => Object.values(x)[0]);
		_dataset = [..._dataset, {
			label: _label,
			data: _data,
			backgroundColor: background1[no],
			borderColor: border1[no],
			type: "bar",
			borderWidth: 1,
			fill: false,
		}]
		no++;
	});
	// console.log(_dataset)

	let ctx = $(chartContainer);
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: _dataset
		},
		options: {
			responsive: false,
			bezierCurve: false,
			maintainAspectRatio: true,
			legend: {
				display: true,
				position: 'top' // place legend on the top side of chart
			},
			title: {
				display: false,
				text: chartTitle
			},
			scales: {
				yAxes: [{
					display: true,
					position: 'left',
					type: "linear",
					id: "y-left",
					ticks: {
						beginAtZero: true,
						callback: function (value, index, values) {
							// return number_format(value);
							return Intl.NumberFormat().format((value / 1000)) + 'K';
						}
					}
				}]
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
						return datasetLabel + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
					}
				}
			},

			animation: {
				onComplete: barRendered
			},
			plugins: {
				// datalabels: false
				// ,
				datalabels: {
					render: 'value',
					anchor: 'end',
					clamp: true,
					align: 'top',
					offset: 0,
					rotation: '270',
					precision: 2,
					color: '#666',
					formatter: function (value, ctx) {
						return value.toLocaleString('en-US');
						// return (value/1000).toFixed(2).toLocaleString('en-US') + "K";
					}
				}
			}

		}
	});
}

// function showBarChartMulti(chartContainer, chartTitle, labels, chartData) {
//     let _dataset = [];
//     no = 0;
//     chartData.forEach((set) => {
//         _label = Object.keys(set)[0];
//         _data = Object.values(set)[0].map(x => Object.values(x)[0]);
//         _dataset = [..._dataset, {
//             label: _label,
//             data: _data,
//             backgroundColor: background1[no],
//             borderColor: border1[no],
//             type: "bar",
//             borderWidth: 1,
//             fill: false,
//         }]
//         no++;
//     });
//     // console.log(_dataset)

//     let ctx = $(chartContainer);
//     myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: _dataset
//         },
//         options: {
//             responsive: false,
//             bezierCurve: false,
//             maintainAspectRatio: true,
//             legend: {
//                 display: true,
//                 position: 'top' // place legend on the top side of chart
//             },
//             title: {
//                 display: true,
//                 text: chartTitle
//             },
//             scales: {
//                 yAxes: [{
//                     display: true,
//                     position: 'left',
//                     type: "linear",
//                     id: "y-left",
//                     ticks: {
//                         beginAtZero: true,
//                         callback: function (value, index, values) {
//                             // return number_format(value);
//                             return Intl.NumberFormat().format((value / 1000)) + 'K';
//                         }
//                     }
//                 }]
//             },
//             tooltips: {
//                 callbacks: {
//                     label: function (tooltipItem, chart) {
//                         var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
//                         return datasetLabel + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
//                     }
//                 }
//             },

//             animation: {
//                 onComplete: barRendered
//             },
//             plugins: {
//                 // datalabels: false
//                 // ,
//                 datalabels: {
//                     render: 'value',
//                     anchor: 'end',
//                     clamp: true,
//                     align: 'top',
//                     offset: 0,
//                     rotation: '270',
//                     precision: 2,
//                     color: '#666',
//                     formatter: function (value, ctx) {
//                         return value.toLocaleString('en-US');
//                         // return (value/1000).toFixed(2).toLocaleString('en-US') + "K";
//                     }
//                 }
//             }

//         }
//     });
// }

function showBarChart(chartContainer, chartTitle, labels, chartData) {
	let ctx = $(chartContainer);
	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: labels,
				data: chartData,
				backgroundColor: background1,
				borderColor: border1,
				type: "bar",
				borderWidth: 1,
				fill: false,
				yAxisID: 'y-left',
			}]
		},
		options: {
			responsive: false,
			bezierCurve: false,
			maintainAspectRatio: true,
			legend: {
				display: false,
				position: 'top' // place legend on the top side of chart
			},
			title: {
				display: false,
				text: chartTitle
			},
			scales: {
				yAxes: [{
					display: true,
					position: 'left',
					type: "linear",
					id: "y-left",
					ticks: {
						beginAtZero: true,
						callback: function (value, index, values) {
							// return number_format(value);
							return Intl.NumberFormat().format((value / 1000)) + 'K';
						}
					}
				}]
			},
			tooltips: {
				callbacks: {

					label: function (tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label[tooltipItem.index] || '';
						return datasetLabel + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
					}
				}
			},

			animation: {
				onComplete: barRendered
			},
			plugins: {
				datalabels: {
					render: 'value',
					anchor: 'end',
					clamp: true,
					align: 'top',
					offset: 0,
					precision: 2,
					color: '#666',
					formatter: function (value, ctx) {
						return value.toLocaleString('en-US')
					}
				}
			}

		}
	});
}

function showSunburstChart(chartContainerID, chartTitle, chartData) {
	let app = {};

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()

	let option;

	let _max = chartData.reduce((_reducer, ea) => ea.value > _reducer ? ea.value : _reducer)
	let max = Math.ceil(_max.value / 1000) * 1000

	// myChart.showLoading();

	option = {
		visualMap: {
			type: 'continuous',
			min: 0,
			max: max,
			inRange: {
				color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
			}
		},
		series: {
			type: 'sunburst',
			data: chartData,
			radius: [40, '90%'],
			itemStyle: {
				borderRadius: 2,
				borderWidth: 2
			},
			label: {
				rotate: 'radial'
			}
		}
	};

	option && myChart.setOption(option);
}

function showCalendarMap(chartContainerID, years, chartData, maxRange) {
	// Show a spinner when chart loading

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()
	// console.log(myChart);
	let option = {}
	let _calendar = []
	let _series = [];

	let no = 0;
	years.forEach(y => {
		_calendar.push({
			top: 80 + no * 140,
			left: 50,
			right: 10,
			cellSize: ['auto', 13],
			range: y,
			itemStyle: {
				borderWidth: 0.5
			},
			yearLabel: {
				show: true,
				margin: 15
			}
		});

		_series.push({
			type: 'heatmap',
			coordinateSystem: 'calendar',
			calendarIndex: no,
			data: chartData[no]
		})

		no++;
	})

	// console.log(_series);

	option = {
		tooltip: {
			position: 'top',
			formatter: function (p) {
				var format = echarts.format.formatTime('dd/MM/yyyy', p.data[0]);
				return `[${format}]  ${p.data[1]}`;
			}
		},
		notMerge: true,
		position: 'top',
		visualMap: {
			min: 0,
			max: maxRange,
			// calculable: true,
			type: 'piecewise',
			orient: 'horizontal',
			left: 'center',
			top: 0
		},
		calendar: _calendar,
		series: _series
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showTreeMapChart(chartContainerID, chartTitle, labels, chartData) {
	let app = {};

	let chartDom = document.getElementById(chartContainerID);
	let myChart = echarts.init(chartDom);
	myChart.clear()

	let option;

	((data) => {

		function colorMappingChange(value) {
			var levelOption = getLevelOption(value);
			chart.setOption({
				series: [{
					levels: levelOption
				}]
			});
		}

		var formatUtil = echarts.format;

		function getLevelOption() {
			return [{
					itemStyle: {
						borderWidth: 4,
						borderColorSaturation: 0.6,
						gapWidth: 1,

					},
					upperLabel: {
						show: false
					}
				},
				{
					colorSaturation: [0.6, 0.5],
					itemStyle: {
						gapWidth: 1,
						borderColor: '#888'
					},
					upperLabel: {
						show: true,
						height: 20,
						color: '#fff',
						offset: [10, 0]

					}
				},
				{
					colorSaturation: [0.5, 0.4],
					itemStyle: {
						gapWidth: 1,
						borderColorSaturation: 0.6
					}
				},
				{
					colorSaturation: [0.4, 0.3],
					itemStyle: {
						gapWidth: 1,
						borderColorSaturation: 0.6
					}
				}
			];
		}

		myChart.setOption(option = {
			title: {
				text: '',
				left: 'center',
				textStyle: {
					fontSize: 12
				}
			},

			tooltip: {
				formatter: function (info) {
					let value = info.value;
					let percent = info.data.percent;
					let treePathInfo = info.treePathInfo;
					let treePath = [];
					for (var i = 1; i < treePathInfo.length; i++) {
						treePath.push(treePathInfo[i].name);
					}

					return [
						'<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
						value.toLocaleString('en-US') + ' MHRS (' + percent.toFixed(2) + '%)',
					].join('');
				}
			},

			series: [{
				name: chartTitle,
				type: 'treemap',
				visibleMin: 300,
				label: {
					show: true,
					formatter: function (params) {
						let _result = `${params.data["name"]} (${params.data["value"].toLocaleString('en-US')}MHRS)`;

						return _result;
					}
				},
				itemStyle: {
					borderColor: '#fff'
				},
				levels: getLevelOption(),
				data: data
			}]
		});
	})(chartData);

	option && myChart.setOption(option);
}

function showTreeMapChart_D3(chartContainer, chartTitle, labels, chartData) {
	let ctx = $(chartContainer);

	let margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		},
		width = 700 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	let svg = d3.select(chartContainer)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// Read data  `${base_url}cache/treemap.json`
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json", data => {
		// console.log(data)

		// Give the data to this cluster layout:
		var root = d3.hierarchy(data).sum(function (d) {
			return d.value
		}) // Here the size of each leave is given in the 'value' field in input data

		// Then d3.treemap computes the position of each element of the hierarchy
		d3.treemap()
			.size([width, height])
			.padding(2)
			(root)

		// use this information to add rectangles:
		svg
			.selectAll("rect")
			.data(root.leaves())
			.enter()
			.append("rect")
			.attr('x', function (d) {
				return d.x0;
			})
			.attr('y', function (d) {
				return d.y0;
			})
			.attr('width', function (d) {
				return d.x1 - d.x0;
			})
			.attr('height', function (d) {
				return d.y1 - d.y0;
			})
			.style("stroke", "black")
			.style("fill", "slateblue")

		// and to add the text labels
		svg
			.selectAll("text")
			.data(root.leaves())
			.enter()
			.append("text")
			.attr("x", function (d) {
				return d.x0 + 5
			}) // +10 to adjust position (more right)
			.attr("y", function (d) {
				return d.y0 + 20
			}) // +20 to adjust position (lower)
			.text(function (d) {
				return d.data.name
			})
			.attr("font-size", "15px")
			.attr("fill", "white")
	})
}

function showGaugeChart(chartContainerID, chartTitle, labels, chartData) {
	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;

	option = {
		series: [{
			type: 'gauge',
			startAngle: 180,
			endAngle: 0,
			min: 0.5,
			max: 1.5,
			radius: '110%',
			center: ['50%', '80%'],
			splitNumber: 4,
			axisLine: {
				lineStyle: {
					width: 30,
					color: [
						[0.25, '#FF6E76'],
						[0.5, '#FDDD60'],
						[0.75, '#58D9F9'],
						[1, '#7CFFB2']
					]
				}
			},
			pointer: {
				icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
				length: '12%',
				width: 20,
				offsetCenter: [0, '-60%'],
				itemStyle: {
					color: 'auto'
				}
			},
			axisTick: {
				show: false,
				// length: 12,
				// lineStyle: {
				//     color: 'auto',
				//     width: 2
				// }
			},
			splitLine: {
				show: false,
				// length: 20,
				// lineStyle: {
				//     color: 'auto',
				//     width: 5
				// }
			},
			axisLabel: {
				color: '#464646',
				fontSize: 20,
				distance: -50,
				formatter: function (value) {
					if (value == 1.375) {
						return 'Superb';
					} else if (value == 1.125) {
						return 'Good';
					} else if (value == 0.875) {
						return 'OK';
					} else if (value == 0.625) {
						return 'Bad';
					}
				}
			},
			title: {
				offsetCenter: [0, '-35%'],
				fontSize: 25
			},
			detail: {
				fontSize: 50,
				offsetCenter: [0, '-10%'],
				valueAnimation: true,
				formatter: function (value) {
					return (value);
				},
				color: 'auto'
			},
			data: [{
				value: chartData,
				name: chartTitle
			}]
		}]
	};

	option && myChart.setOption(option);

}

function showHorizontalBarChart(chartContainerID, chartTitle, chartLabels, chartData) {

	let dataSeries = {
		type: 'bar',
		label: {
			show: true
		},
		barMaxWidth: 50,
		// itemStyle: {
		// 		color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
		// 				offset: 0,
		// 				color: '#83bff6'
		// 			},
		// 			{
		// 				offset: 0.5,
		// 				color: '#188df0'
		// 			},
		// 			{
		// 				offset: 1,
		// 				color: '#188df0'
		// 			}
		// 		])
		// 	},
		// 	emphasis: {
		// 		itemStyle: {
		// 			color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
		// 					offset: 0,
		// 					color: '#2378f7'
		// 				},
		// 				{
		// 					offset: 0.7,
		// 					color: '#2378f7'
		// 				},
		// 				{
		// 					offset: 1,
		// 					color: '#83bff6'
		// 				}
		// 			])
		// 		}
		// 	},
		data: chartData.map(x => x.Progress)
	}
	let legends = []

	console.log(chartLabels, dataSeries);

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();

	option = {
		// tooltip: {
		// 	trigger: 'axis'
		// },
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}%',
				color: '#666'
			},
			max: 100,
		},
		yAxis: {
			type: 'category',
			data: chartLabels
		},
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showBarChart2(chartContainerID, chartTitle, chartLabels, chartData) {

	let dataSeries = chartData.map(x => {
		return {
		type: 'bar',
		name: Object.keys(x)[0],
		barGap: 0,
		// label: {
		// 	show: true
		// },
		barMaxWidth: 50,		
		data: Object.values(x)[0]
	}})

	let legends = []

	console.log(chartLabels, dataSeries);

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'item',
			formatter: (params) => `${params.name} <br /> ${params.marker} ${params.seriesName}: ${params.data.toLocaleString('en-US')}`
			
		},
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		grid: {
			left: '3%',
			// right: '4%',
			bottom: '3%',
			containLabel: true
		},
		yAxis: {
			type: 'value',
			// axisLabel: {
			// 	show: false
			// },
			// splitLine: {
			// 	show: false
			// },
			
		},
		xAxis: {
			type: 'category',
			data: chartLabels
		},
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showStackedHorizontalBarChart(chartContainerID, chartTitle, chartLabels, chartData, options = null) {
	let dataSeries = []
	let legends = []

	chartData.forEach(chart => {
		let showLegend = options ? options.showLegend : false
		if (showLegend != false){
			legends.push(Object.keys(chart)[0])
		}
		dataSeries.push({
			type: 'bar',
			barMaxWidth: 50,
			name: Object.keys(chart)[0],
			stack: 'week',
			label: {
				show: true
			},

			data: Object.values(chart)[0]
		})
	})

	console.log(chartLabels, dataSeries);

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();
	let showTitle = options ? options.showTitle : false

	let left = options?options.left:'3%'
	let right = options?options.right:'3%'
	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		title: showTitle ? {
			text: chartTitle,
			left: '50%',
			textAlign: 'center'
		}: {},
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		grid: {
			left: options ? left : '3%',
			right: options ? right : '3%',
			bottom: '3%',
			containLabel: true
		},
		legend: {
			data: legends
		},
		xAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}',
				color: '#666'
			},
			minInterval: 1,

		},
		yAxis: {
			type: 'category',
			data: chartLabels,
			axisLabel: {
				// overflow: "truncate",
				formatter: function (param) {
					return param.length > 43 ? param.slice(0, 40) + '...' : param
				}
			},
		},
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showMultiAreaChart(chartContainerID, chartTitle, graphLabels, chartDataLeft, chartDataRight = null, chartDataFuture = null) {
	// console.log(chartDataLeft)
	let symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'];

	let dataSeries = [];
	let legends = [];
	let unselectFuture = {}

	let maxLeft = 0;
	let maxRight = 0;
	let index = 0;

	chartDataLeft.forEach(chart => {
		// console.log(chart)
		dataSeries.push({
			name: Object.keys(chart)[0],
			type: 'line',
			data: Object.values(chart)[0],
			symbol: symbols[index],
			lineStyle: {
				width: 2
			},

		});
		legends.push(Object.keys(chart)[0])
		index++;
		let _max = Math.max(...(Object.values(chart)[0]).filter(x => isFinite(x) && !isNaN(x)));
		if (_max > maxLeft) {
			maxLeft = _max
		}
	})

	if (chartDataRight != null) {
		chartDataRight.forEach(chart => {
			dataSeries.push({
				name: Object.keys(chart)[0],
				type: 'line',
				data: Object.values(chart)[0],
				yAxisIndex: 1,
				// markPoint: {
				// 	data: [{
				// 			type: 'max',
				// 			name: 'Highest'
				// 		},
				// 		{
				// 			type: 'min',
				// 			name: 'Lowest'
				// 		}
				// 	]
				// }
			});
			legends.push(Object.keys(chart)[0]);

			let _max = Math.max(...(Object.values(chart)[0]).filter(x => isFinite(x) && !isNaN(x)));
			if (_max > maxRight) {
				maxRight = _max;
			}
		})
	}

	if (chartDataFuture != null) {
		chartDataFuture.forEach(chart => {
			dataSeries.push({
				name: Object.keys(chart)[0],
				type: 'line',
				data: Object.values(chart)[0],
				showSymbol: false,
				lineStyle: {
					width: 2,
					type: 'dashed'
				},
			});
			legends.push(Object.keys(chart)[0]);
			unselectFuture = {
				...unselectFuture,
				...{
					[Object.keys(chart)[0]]: false
				}
			}

			let _max = Math.max(...(Object.values(chart)[0]).filter(x => isFinite(x) && !isNaN(x)));
			if (_max > maxLeft) {
				maxLeft = _max;
			}
		})
	}

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					type: ['line', 'bar'],
					seriesIndex: {
						'line': [0, 1, 2, 3],
						'bar': [0, 1, 2]
					}
				},
				restore: {},
				dataZoom: {
					yAxisIndex: false
				},
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends,
			selected: unselectFuture
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			axisTick: {
				alignWithLabel: true
			}
		}],
		yAxis: [{
				type: 'value',
				name: 'MHRS',
				// min: 0,
				// max: 2500000,
				// interval: 500000,
				position: 'left',
				axisLabel: {
					formatter: '{value}'
				}
				// axisPointer: {
				//     snap: true
				// }
			},
			{
				type: 'value',
				name: 'CPI',
				min: 0,
				max: Math.round(maxRight * 11) / 10,
				// interval: 0.5,
				position: 'right',
				axisLabel: {
					formatter: '{value}'
				},
				splitLine: {
					show: false
				}
			}
		],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showMultiLineChart(chartContainerID, chartTitle, graphLabels, chartDataLeft) {
	// console.log(chartDataLeft)
	let symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'];

	let dataSeries = [];
	let legends = [];
	let unselectFuture = {}

	let maxLeft = 0;
	let index = 0;

	chartDataLeft.forEach(chart => {
		// console.log(chart)
		dataSeries.push({
			name: Object.keys(chart)[0],
			type: 'line',
			data: Object.values(chart)[0],
			symbol: symbols[index],
			lineStyle: {
				width: 2
			},

		});
		legends.push(Object.keys(chart)[0])
		index++;
		let _max = Math.max(...(Object.values(chart)[0]).filter(x => isFinite(x) && !isNaN(x)));
		if (_max > maxLeft) {
			maxLeft = _max
		}
	})


	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				restore: {},
				dataZoom: {
					yAxisIndex: false
				},
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends,
			selected: unselectFuture
		},
		grid: {
			left: '3%',
			right: '3%'
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			axisTick: {
				alignWithLabel: true
			}
		}],
		yAxis: [{
				type: 'value',
				name: 'Units',
				// min: 0,
				// max: 2500000,
				// interval: 500000,
				position: 'left',
				axisLabel: {
					formatter: '{value}'
				}
				// axisPointer: {
				//     snap: true
				// }
			}
			// ,
			// {
			// 	type: 'value',
			// 	name: 'CPI',
			// 	min: 0,
			// 	max: Math.round(maxRight * 11) / 10,
			// 	// interval: 0.5,
			// 	position: 'right',
			// 	axisLabel: {
			// 		formatter: '{value}'
			// 	},
			// 	splitLine: {
			// 		show: false
			// 	}
			// }
		],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

async function showStackedBarChart(chartContainerID, chartTitle, graphLabels, chartData, options = null) {
	let dataSeries = [];
	let legends = [];

	let maxLeft = 0;
	let maxRight = 0;
	let index = 0;

	chartData.forEach(chart => {
		// console.log(chart)
		dataSeries.push({
			name: Object.keys(chart)[0],
			type: 'bar',
			barMaxWidth: 50,
			stack: 'week',
			data: Object.values(chart)[0],
			label: {
				show: options ? options.showLabel : false,
			},
			// emphasis: {
			// 	focus: 'series'
			// },
		});
		legends.push(Object.keys(chart)[0])
		index++;

	})

	// console.log(dataSeries);

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()
	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends
		},
		grid: {
			left: '3%',
			right: '3%'
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			// axisTick: {
			// 	alignWithLabel: true
			// }
		}],
		yAxis: [{
			type: 'value',
			name: 'Value',
			// min: 0,
			// max: 1000,
			// interval: 500000,
			position: 'left',
			axisLabel: {
				formatter: '{value}'
			},
			minInterval: 1
			// axisPointer: {
			//     snap: true
			// }
		}],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

async function showMultiStackedBarChart(chartContainerID, chartTitle, graphLabels, chartDataArray) {
	let dataSeries = [];
	let legends = [];

	let stacksCount = chartDataArray.length
	let rowsCount = Object.values(chartDataArray[0])[0].length

	// console.log(plannedColor.slice(0, rowsCount))

	// console.log([...plannedColor.slice(0, rowsCount), ...actualColor.slice(0, rowsCount)])
	chartDataArray.forEach(stack => {
		// console.log(stack);
		let stackTitle = Object.keys(stack)[0]
		// console.log(chart)
		let chart = Object.values(stack)[0]
		let index = 0
		chart.forEach(_chart => {

			dataSeries.push({
				name: Object.keys(_chart)[0] + " " + stackTitle,
				type: 'bar',
				barMaxWidth: 50,
				stack: stackTitle.toLowerCase(),
				data: Object.values(_chart)[0],
				emphasis: {
					focus: 'series'
				},
				// fillColor: (stackTitle == 'planned') ? plannedColor[index] : actualColor[index],
				// fill:true

			});

			legends.push(Object.keys(_chart)[0] + " " + stackTitle)
			index++;
		})

		// console.log(dataSeries);		


	})

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()
	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'item',
			axisPointer: {
				// type: 'cross',
				// crossStyle: {
				//     color: '#999'
				// }
				type: 'shadow'
			}
		},
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends
		},
		grid: {
			top: '15%',
			left: '5%',
			right: '5%'
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			// axisTick: {
			// 	alignWithLabel: true
			// }
		}],
		yAxis: [{
			type: 'value',
			name: 'Value',
			// min: 0,
			// max: 1000,
			// interval: 500000,
			position: 'left',
			axisLabel: {
				formatter: '{value}'
			}
			// axisPointer: {
			//     snap: true
			// }
		}],
		color: [...plannedColor.slice(0, rowsCount), ...actualColor.slice(0, rowsCount)],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

async function showStackedBarChart2(chartContainerID, chartTitle, graphLabels, chartDataArray, options = null) {
	let dataSeries = [];
	let legends = [];

	let stacksCount = chartDataArray.length
	let rowsCount = Object.values(chartDataArray[0])[0].length

	chartDataArray.forEach(stack => {
		// console.log(stack);
		let stackTitle = Object.keys(stack)[0]
		// console.log(chart)
		let chart = Object.values(stack)[0]
		let index = 0
		chart.forEach(_chart => {
			dataSeries.push({
				name: stackTitle ,
				type: 'bar',
				barMaxWidth: 50,
				stack: stackTitle.toLowerCase(),
				data: Object.values(_chart)[0].slice(0, 50),
				itemStyle: {
					color: index % 2 == 0? '#5470c6' : '#92cc78'
				},
				label: {
					show: options ? options.showLabel : false,
					position: options.labelPosition? options.labelPosition: 'top',
					formatter: '{a}',
					rotate: 90,
					align: 'left'
				}

			});

			if (options.showLegend != false){
				legends.push(Object.keys(_chart)[0] + " " + stackTitle)
			}

			index++;
		})

		// console.log(dataSeries);		


	})

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()
	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'item',
			axisPointer: {
				type: 'shadow'
			}
		},
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends
		},
		grid: {
			left: '5%',
			right: '5%'
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			// axisTick: {
			// 	alignWithLabel: true
			// }
		}],
		yAxis: [{
			type: 'value',
			name: 'Value',
			// min: 0,
			// max: 1000,
			// interval: 500000,
			position: 'left',
			axisLabel: {
				formatter: '{value}'
			},
			minInterval: 1
			// axisPointer: {
			//     snap: true
			// }
		}],
		color: [...plannedColor.slice(0, rowsCount), ...actualColor.slice(0, rowsCount)],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function showAccumLineChart(chartContainerID, chartTitle, graphLabels, chartDataAccum, chartDataEach) {
	let symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'];

	let dataSeries = [];
	let legends = [];

	let maxLeft = 0;
	let index = 0;

	chartDataAccum.forEach(chart => {
		// console.log(chart)
		dataSeries.push({
			name: Object.keys(chart)[0],
			type: 'line',
			data: Object.values(chart)[0],
			symbol: symbols[index],
			lineStyle: {
				width: 2
			},

		});
		legends.push(Object.keys(chart)[0])
		index++;
		let _max = Math.max(...(Object.values(chart)[0]).filter(x => isFinite(x) && !isNaN(x)));
		if (_max > maxLeft) {
			maxLeft = _max
		}
	})
	chartDataEach.forEach(chart => {
		dataSeries.push({
			name: Object.keys(chart)[0],
			type: 'bar',
			barMaxWidth: 50,
			data: Object.values(chart)[0],
			yAxisIndex: 0,
			// markPoint: {
			//     data: [
			//         { type: 'max', name: 'Highest' },
			//         { type: 'min', name: 'Lowest' }
			//     ]
			// }
		});
		legends.push(Object.keys(chart)[0]);
	});

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()

	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				restore: {},
				dataZoom: {
					yAxisIndex: false
				},
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}, {
			type: 'slider'
		}],
		legend: {
			data: legends
		},
		grid: {
			left: '3%',
			right: '3%'
		},
		xAxis: [{
			type: 'category',
			data: graphLabels,
			// axisPointer: {
			//     type: 'shadow'
			// },
			axisTick: {
				alignWithLabel: true
			}
		}],
		yAxis: [{
			type: 'value',
			name: 'MT',
			// min: 0,
			// max: 2500000,
			// interval: 500000,
			position: 'left',
			axisLabel: {
				formatter: '{value}'
			}
			// axisPointer: {
			//     snap: true
			// }
		}],
		series: dataSeries
	};

	option && myChart.setOption(option);
}

function showQuarterBarChart(chartContainerID, chartTitle, graphLabels, chartDataArray, options) {
	let dataSeries = [];
	let legends = [];

	let index = 0;

	chartDataArray.forEach(week => {		
		Object.values(week).forEach(type => {
			let _color = 0
			Object.keys(type).forEach(chart => {
				dataSeries.push({
					name: Object.keys(week)[0] +'-'+ chart,
					type: 'bar',
					barMaxWidth: 50,
					stack: Object.keys(week)[0],
					data: Object.values(type[chart]),
					label: {
						show: options ? options.showLabel : false,
					},
					xAxisIndex: index,
					yAxisIndex: index,
					itemStyle: {
						color: _color % 2 == 0? '#5470c6' : '#92cc78'
					}
				});	
				
				_color++
			})

			index++;
			
		})

		

	})

	console.log(dataSeries);

	var chartDom = document.getElementById(chartContainerID);
	var myChart = echarts.init(chartDom);
	myChart.clear()
	var option;
	// myChart.showLoading();

	option = {
		tooltip: {
			// trigger: 'item',
		},
		title: [{
				text: 'Last 4 week',
				subtext: 'Total ',
				left: '75%',
				top: '50%',
				textAlign: 'center'
			},
			{
				text: 'Last 3 week',
				subtext: 'Total ',
				left: '25%',
				top: '50%',
				textAlign: 'center'
			},
			{
				text: 'Last 2 week',
				subtext: 'Total ',
				left: '75%',
				top: '2%',
				textAlign: 'center'
			},
			{
				text: 'Last week',
				subtext: 'Total ',
				left: '25%',
				top: '2%',
				textAlign: 'center'
			},
		],
		grid: [{
				top: 50,
				width: '45%',
				bottom: '50%',
				left: 10,
				containLabel: true
			},
			{
				top: 50,
				width: '45%',
				bottom: '50%',
				left: '50%',
				containLabel: true
			},
			{
				top: '55%',
				width: '45%',
				bottom: 10,
				left: 10,
				containLabel: true
			},
			{
				top: '55%',
				width: '45%',
				left: '50%',
				bottom: 10,
				containLabel: true
			}
		],
		toolbox: {
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},

		legend: {
			show: false
		},

		xAxis: [{
			type: 'value',
			splitLine: {
				show: false
			},
			minInterval: 1
		}, {
			type: 'value',
			gridIndex: 1,
			splitLine: {
				show: false
			},
			minInterval: 1
		}, {
			type: 'value',
			gridIndex: 2,
			splitLine: {
				show: false
			},
			minInterval: 1
		}, {
			type: 'value',
			gridIndex: 3,
			splitLine: {
				show: false
			},
			minInterval: 1
		}],
		yAxis: [{
			type: 'category',
			data: graphLabels,
			axisLabel: {
				formatter: function (param) {
					return param.length > 43 ? param.slice(0, 40) + '...' : param
				}
			},
			splitLine: {
				show: false
			},

		}, {
			type: 'category',
			gridIndex: 1,
			data: graphLabels,
			axisLabel: {
				formatter: function (param) {
					return param.length > 43 ? param.slice(0, 40) + '...' : param
				}
			},
			splitLine: {
				show: false
			},

		}, {
			type: 'category',
			gridIndex: 2,
			data: graphLabels,
			axisLabel: {
				formatter: function (param) {
					return param.length > 43 ? param.slice(0, 40) + '...' : param
				}
			},
			splitLine: {
				show: false
			},

		}, {
			type: 'category',
			gridIndex: 3,
			data: graphLabels,
			axisLabel: {
				formatter: function (param) {
					return param.length > 43 ? param.slice(0, 40) + '...' : param
				}
			},
			splitLine: {
				show: false
			},

		}],
		series: dataSeries
	};

	option && myChart.setOption(option);

	removeLoading(chartContainerID)
}

function chartRendered(thisChart) {
	return thisChart.toBase64Image();
}

function curveRendered() {
	curveChartImg = myCurve.toBase64Image();
	// console.log(barChartImg);
}

function barRendered() {
	barChartImg = myChart.toBase64Image();
	// console.log(barChartImg);
}

function pieRendered() {
	pieChartImg = myPie.toBase64Image();
	// console.log(pieChartImg);
}

function showLoading(hostElement) {
	let host
	if (hostElement.includes('.') || hostElement.includes('#')) {
		host = $(hostElement)
	} else {
		host = $(`#${hostElement}`)
	}

	host.after(
		`<div class="overlay loading">
            <div class="spinner"> <span /> </div>            
        </div>`
	)


}

function removeLoading(hostElement) {
	let host
	if (hostElement.includes('.') || hostElement.includes('#')) {
		host = $(hostElement).parent()
	} else {
		host = $(`#${hostElement}`).parent()
	}

	let loader = host.find('.loading')
	if (loader) {
		loader.remove()
	}
}

//#endregion
