let definitions = [
	{
		Abbr: ["STF", "STC", "STW", "STT", "STG"],
		Fullname: "Structure",
		Order: 1,
	},
	{
		Abbr: ["PPF", "PPC", "PPW", "PPT", "PPG"],
		Fullname: "Piping",
		Order: 2,
	},
	{
		Abbr: ["MEF", "MEW"],
		Fullname: "Mechanical",
		Order: 3,
	},
	{
		Abbr: ["ELC", "ELF", "ELW"],
		Fullname: "Electrical & Instrument",
		Order: 4,
	},
	{
		Abbr: ["HVF"],
		Fullname: "HVAC",
		Order: 5,
	},
	{
		Abbr: ["ART"],
		Fullname: "Architectural",
		Order: 6,
	},
	{
		Abbr: ["COM"],
		Fullname: "Precom/ Commissioning",
		Order: 7,
	},
	{
		Abbr: ["BP", "SCF", "RIG", "OTH", "REM"],
		Fullname: "General Service",
		Order: 8,
	},
];

//#region Production Control
const loadLevel1_Original = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel1_Original/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataLevel1 = response;
			// console.log(dataLevel1);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const getProductionDashboard = async () => {
	await $.ajax({
		url: `${base_url}production_control/getProductionDashboard `,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataDashboard = response;
			// console.log(dataLevel1);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const loadLevel1 = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel1/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			curveLevel1 = response;
			// console.log(dataLevel1);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const graphBudgetLevel1 = (graphContainer, dataLevel1) => {
	labels = ["Budget MHRS", "Actual MHRS", "Wasted MHRS", "Earned MHRS"];
	data = [
		parseFloat(dataLevel1["BaseBudgetMHRS"]),
		parseFloat(dataLevel1["ActualMHRS"]),
		parseFloat(dataLevel1["WasteMHRS"]),
		parseFloat(dataLevel1["EarnedMHRS"]),
	];

	showBarChart(graphContainer, "BUDGET & ACTUAL MANHOURS", labels, data);
};

const graphActualMHRSLevel1 = (graphContainer, dataLevel1) => {
	labels = [
		["Earned MHRS", "Var MHRS"],
		["Whithou-OT", "OT", "Sunday", "Holiday"],
	];

	// data = [ parseFloat(dataLevel1["EarnedMHRS"]),
	//      parseFloat(dataLevel1["VarMHRS"]),
	//     ];
	// showPieChart(graphContainer, 'ACTUAL EARNED MANHOURS', labels, data);

	data = [
		[],
		[
			{
				value: parseFloat(dataLevel1["ActualMHRS_WithoutOT"]),
				name: "Without-OT",
			},
			{
				value: parseFloat(dataLevel1["ActualMHRS_OT"]),
				name: "Overtime",
			},
			{
				value: parseFloat(dataLevel1["ActualMHRS_Sunday"]),
				name: "Sunday",
			},
			{
				value: parseFloat(dataLevel1["ActualMHRS_Holiday"]),
				name: "Holiday",
			},
		],
	];

	showPieChart2(graphContainer, ["Earned MHRS", "Breakdown"], labels, data);
};

const graphBreakdownMHRSLevel1 = (graphContainer, dataLevel1) => {
	labels = ["Non-OT", "OT", "Sunday", "Holiday"];
	data = [
		parseFloat(dataLevel1["ActualMHRS_WithoutOT"]),
		parseFloat(dataLevel1["ActualMHRS_OT"]),
		parseFloat(dataLevel1["ActualMHRS_Sunday"]),
		parseFloat(dataLevel1["ActualMHRS_Holiday"]),
	];

	showPieChart(graphContainer, "ACTUAL MHRS LEVEL 1 BREAKDOWN", labels, data);
};

const graphCurveLevel1 = (graphContainer, curveLevel1) => {
	labels = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return key;
	});

	let actual = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["ActualMHRS"]),
		};
	});
	let budget = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["BaseBudgetMHRS"]),
		};
	});

	let earned = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["EarnedMHRS"]),
		};
	});
	let varMHRS = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["VarMHRS"]),
		};
	});

	// let graphdata = budget;
	let graphdata = [
		{
			"Budget MHRS": budget,
		},
		{
			"Actual MHRS": actual,
		},
		{
			"Earned MHRS": earned,
		},
		{
			"Var MHRS": varMHRS,
		},
	];

	showCurveChart(
		graphContainer,
		"ACTUAL MHRS LEVEL 1 PROGRESS",
		labels,
		graphdata
	);
};

const graphProgressLevel1 = (graphContainer, curveLevel1) => {
	labels = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return key;
	});
	let budget = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["BaseBudgetMHRS"]),
		};
	});

	let actual = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["ActualMHRS"]),
		};
	});

	let earned = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		return {
			[key]: parseFloat(item["EarnedMHRS"]),
		};
	});
	let cpi = curveLevel1.map((item) => {
		let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
		let _cpi = (
			parseFloat(item["EarnedMHRS"]) / parseFloat(item["ActualMHRS"])
		).toFixed(2);
		return {
			[key]: parseFloat(_cpi),
		};
	});

	// let graphdata = budget;
	let graphdata = [
		{
			"Budget MHRS": budget,
		},
		{
			"Actual MHRS": actual,
		},
		{
			"Earned MHRS": earned,
		},
	];

	let cpidata = [
		{
			CPI: cpi,
		},
	];

	// showCurveChart(graphContainer, 'ACTUAL MHRS LEVEL 1 PROGRESS', labels, graphdata);
	showComboChart(
		graphContainer,
		"BUDGET LEVEL 1 MONITORING",
		labels,
		graphdata,
		cpidata
	);
};

const tableLevel1 = (tableElement, dataLevel1) => {
	tabledata = [
		{
			Type: "Base Budge tMHRS",
			Value: parseFloat(dataLevel1["BaseBudgetMHRS"]).toLocaleString("en-US"),
		},
		{
			Type: "Actual MHRS",
			Value: parseFloat(dataLevel1["ActualMHRS"]).toLocaleString("en-US"),
		},
		{
			Type: "Waste MHRS",
			Value: parseFloat(dataLevel1["WasteMHRS"]).toLocaleString("en-US"),
		},
		{
			Type: "Earned MHRS",
			Value: parseFloat(dataLevel1["EarnedMHRS"]).toLocaleString("en-US"),
		},
		{
			Type: "Var MHRS",
			Value: parseFloat(dataLevel1["VarMHRS"]).toLocaleString("en-US"),
		},
		{
			Type: "Actual MHRS WithoutOT",
			Value: parseFloat(dataLevel1["ActualMHRS_WithoutOT"]).toLocaleString(
				"en-US"
			),
		},
		{
			Type: "Actual MHRS OT",
			Value: parseFloat(dataLevel1["ActualMHRS_OT"]).toLocaleString("en-US"),
		},
		{
			Type: "Actual MHRS Sunday",
			Value: parseFloat(dataLevel1["ActualMHRS_Sunday"]).toLocaleString(
				"en-US"
			),
		},
		{
			Type: "Actual MHRS Holiday",
			Value: parseFloat(dataLevel1["ActualMHRS_Holiday"]).toLocaleString(
				"en-US"
			),
		},
	];
	table = $(tableElement).DataTable({
		data: tabledata,
		columns: [
			{
				data: "Type",
			},
			{
				data: "Value",
			},
		],
		searching: false,
		paging: false,
		ordering: false,
		info: false,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons at the bottom of the table
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const graphHeatmap = (tableElement, years, heatmapGraphdata, maxRange) => {
	showCalendarMap(tableElement, years, heatmapGraphdata, maxRange);
};

const loadLevel2_Original = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel2_Original/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataLevel2 = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const loadLevel2 = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel2/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			curveLevel2 = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const graphBudgetLevel2 = (graphContainer, dataLevel2Cooked) => {
	labels = dataLevel2Cooked.map((disc) => disc["DisciplineCode"]);
	budget = data = dataLevel2Cooked.map((disc) => {
		let key = disc["DisciplineCode"];
		return {
			[key]: disc["BaseBudgetMHRS"],
		};
	});
	actual = data = dataLevel2Cooked.map((disc) => {
		let key = disc["DisciplineCode"];
		return {
			[key]: disc["ActualMHRS"],
		};
	});

	earned = data = dataLevel2Cooked.map((disc) => {
		let key = disc["DisciplineCode"];
		return {
			[key]: disc["EarnedMHRS"],
		};
	});
	data = [
		{
			"Budget MHRS": budget,
		},
		{
			"Actual MHRS": actual,
		},
		{
			"Earned MHRS": earned,
		},
	];
	showBarChartMulti(graphContainer, "BUDGET & ACTUAL MANHOURS", labels, data);
};

const graphDisciplinesLevel2 = (graphContainer, dataLevel2Cooked) => {
	labels = dataLevel2Cooked.map((disc) => disc["DisciplineCode"]);
	// data = dataLevel2Cooked.map(disc => disc["BaseBudgetMHRS"]);
	// showPieChart(graphContainer, 'DISCIPLINES BUDGET SHARES', labels, data);

	data = [
		{
			BudgetMHRS: dataLevel2Cooked.map((disc) => {
				return {
					name: disc["DisciplineCode"],
					value: disc["BaseBudgetMHRS"],
				};
			}),
		},
		{
			ActualMHRS: dataLevel2Cooked.map((disc) => {
				return {
					name: disc["DisciplineCode"],
					value: disc["ActualMHRS"],
				};
			}),
		},
	];
	// console.log(data);
	// console.log(dataLevel2Cooked);
	showDoublePieChart(graphContainer, "DISCIPLINES BUDGET SHARES", labels, data);
};

const graphProgressLevel2 = (
	graphContainer,
	curveLevel2,
	selectedDiscipline
) => {
	disciplines = [...new Set(curveLevel2.map((row) => row["DisciplineCode"]))];
	let disciplinesData = disciplines.map((disc) => {
		let children = curveLevel2.filter((row) => row["DisciplineCode"] == disc);
		return {
			[disc]: children,
		};
	});
	let graphdata = [];
	let cpidata = [];
	let labels;
	disciplinesData.forEach((disc) => {
		let discipline = Object.keys(disc).toString();
		let discData = Object.values(disc)[0];

		labels = discData.map((item) => {
			let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
			return key;
		});
		let budget = discData.map((item) => {
			let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
			return {
				[key]: parseFloat(item["BaseBudgetMHRS"]),
			};
		});

		let actual = discData.map((item) => {
			let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
			return {
				[key]: parseFloat(item["ActualMHRS"]),
			};
		});

		let earned = discData.map((item) => {
			let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
			return {
				[key]: parseFloat(item["EarnedMHRS"]),
			};
		});
		let cpi = discData.map((item) => {
			let key = new Date(item["CreatedDate"]).toLocaleDateString("vi-VN");
			let _cpi = (
				parseFloat(item["EarnedMHRS"]) / parseFloat(item["ActualMHRS"])
			).toFixed(2);
			return {
				[key]: parseFloat(_cpi),
			};
		});

		// let graphdata = budget;
		let _graphdata = [
			{
				"Budget MHRS": budget,
			},
			{
				"Actual MHRS": actual,
			},
			{
				"Earned MHRS": earned,
			},
		];
		graphdata.push({
			[discipline]: _graphdata,
		});

		let _cpidata = [
			{
				CPI: cpi,
			},
		];
		cpidata.push({
			[discipline]: _cpidata,
		});
	});

	let _discGraphdata = graphdata.filter(
		(x) => Object.keys(x).toString() == selectedDiscipline
	)[0];
	let discGraphdata = Object.values(_discGraphdata)[0];
	let _discCpidata = cpidata.filter(
		(x) => Object.keys(x).toString() == selectedDiscipline
	)[0];
	let discCpidata = Object.values(_discCpidata)[0];

	// showCurveChart(graphContainer, 'ACTUAL MHRS LEVEL 1 PROGRESS', labels, graphdata);
	showComboChart(
		graphContainer,
		"BUDGET LEVEL 2 MONITORING",
		labels,
		discGraphdata,
		discCpidata
	);
};

const graphSunburstLevel2 = (graphContainer, dataLevel2Cooked) => {
	let chartdata = dataLevel2Cooked.map((disc) => {
		let _chartdata = [];
		if (disc["ActualMHRS_WithoutOT"] > 0) {
			_chartdata.push({
				name: "Non-OT",
				value: disc["ActualMHRS_WithoutOT"],
			});
		}
		if (disc["ActualMHRS_OT"] > 0) {
			_chartdata.push({
				name: "OT",
				value: disc["ActualMHRS_OT"],
			});
		}
		if (disc["ActualMHRS_Sunday"] > 0) {
			_chartdata.push({
				name: "Sunday",
				value: disc["ActualMHRS_Sunday"],
			});
		}
		if (disc["ActualMHRS_Holiday"] > 0) {
			_chartdata.push({
				name: "Holiday",
				value: disc["ActualMHRS_Holiday"],
			});
		}
		return {
			name: disc["DisciplineCode"],
			value: disc["ActualMHRS"],
			children: _chartdata,
		};
	});

	showSunburstChart(graphContainer, "", chartdata);
};

const graphTreeMapLevel2 = (graphContainer, dataLevel2) => {
	let total = dataLevel2.reduce((sum = 0, item) => {
		return {
			BaseBudgetMHRS:
				parseFloat(sum["BaseBudgetMHRS"]) + parseFloat(item["BaseBudgetMHRS"]),
		};
	});

	let chartdata = dataLevel2.map((item) => {
		let percent =
			(parseFloat(item["BaseBudgetMHRS"]) * 100) / total["BaseBudgetMHRS"];
		return {
			name: item["MainActivities"],
			percent: percent,
			path: item["MainActivities"],
			value: parseFloat(item["BaseBudgetMHRS"]),
		};
	});

	showTreeMapChart(graphContainer, "BUDGET LEVEL 1 CONTRIBUTES", "", chartdata);
};

const tableLevel2 = (tableElement, dataLevel2Cooked) => {
	table = $(tableElement).DataTable({
		data: dataLevel2Cooked,
		columns: [
			{
				data: "DisciplineCode",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "EarnedMHRS",
			},
			{
				data: "VarMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "ActualProgress",
			},
			{
				data: "CPI",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				render: function (data, type, row, meta) {
					return data.toLocaleString("en-US");
				},
			},
			{
				targets: [10],
				data: "ActualProgress",
				render: function (data, type, row, meta) {
					let percent = data;
					if (Number.isNaN(percent) || percent == 0) {
						return type === "display"
							? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">0%</div></div>'
							: percent;
					}
					return type === "display"
						? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
								percent +
								'%;">' +
								percent +
								"%</div></div>"
						: percent;
				},
			},
			{
				targets: [11],
				data: "CPI",
				render: function (data, type, row, meta) {
					let bg = "transparent";
					if (data > 1) {
						bg = "#28a745";
					} else if (data == 1) {
						bg = "#ffc107";
					} else {
						bg = "#dc3545";
					}
					return type === "display"
						? `<span style="color: ${bg};">${data.toFixed(2)}</span>`
						: data.toFixed(2);
				},
			},
		],
		searching: false,
		paging: false,
		ordering: false,
		info: false,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons at the bottom of the table
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const loadLevel3 = async (project, facility, discipline) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel3/${project}/${facility}/${discipline}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			curveLevel3 = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const graphTreeMapLevel3 = (graphContainer, dataLevel3Cooked) => {
	disciplines = [
		...new Set(dataLevel3Cooked.map((row) => row["DisciplineCode"])),
	];
	let _chartdata = disciplines.map((disc) => {
		let children = dataLevel3Cooked.filter(
			(row) => row["DisciplineCode"] == disc
		);
		return {
			[disc]: children,
		};
	});

	let sum = dataLevel3Cooked
		.map((x) => x["BaseBudgetMHRS"])
		.reduce((sum, x) => sum + x);

	const treemapLevel = (item) => {
		if (typeof item != "array") {
			return {
				name: item["MainActivities"],
				code: item["NormIDLevel3"],
				path: item["MainActivities"],
				value: item["BaseBudgetMHRS"],
				percent: (item["BaseBudgetMHRS"] * 100) / sum,
			};
		}
		return {
			name: key,
			code: item["NormIDLevel2"],
			path: key,
			value: childrenSum,
			percent: (childrenSum * 100) / sum,
			children: children.map(treemapLevel),
		};
	};

	let chartdata = _chartdata.map((item) => {
		let key = Object.keys(item).toString();
		let children = Object.values(item)[0];
		let childrenSum = children
			.map((x) => x["BaseBudgetMHRS"])
			.reduce((sum, x) => sum + x);

		return {
			name: key,
			path: key,
			code: item["NormIDLevel2"],
			value: childrenSum,
			percent: (childrenSum * 100) / sum,
			children: children.map(treemapLevel),
		};
	});

	showTreeMapChart(graphContainer, "BUDGET LEVEL 2 CONTRIBUTES", "", chartdata);
};

const loadLevel3_Original = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel3_Original/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataLevel3 = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableLevel3 = (tableElement, dataLevel2Cooked) => {
	if (typeof table != "undefined") {
		table.destroy();
	}
	table = $(tableElement).DataTable({
		data: dataLevel2Cooked,
		columns: [
			{
				data: "ConstructionID",
			},
			{
				data: "ConstructionName",
			},
			{
				data: "BudgetConstructionID",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "EarnedMHRS",
			},
			{
				data: "VarMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "ActualProgress",
			},
			{
				data: "CPI",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [2, 3, 4, 5, 6, 7, 8, 9, 10],
				render: function (data, type, row, meta) {
					return data.toLocaleString("en-US");
				},
			},
			{
				targets: [11],
				data: "ActualProgress",
				render: function (data, type, row, meta) {
					let percent = data;
					if (Number.isNaN(percent) || percent == 0) {
						return type === "display"
							? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">0%</div></div>'
							: percent;
					}
					return type === "display"
						? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
								percent +
								'%;">' +
								percent +
								"%</div></div>"
						: percent;
				},
			},
			{
				targets: [12],
				data: "CPI",
				render: function (data, type, row, meta) {
					let bg = "transparent";
					if (data > 1) {
						bg = "#28a745";
					} else if (data == 1) {
						bg = "#ffc107";
					} else {
						bg = "#dc3545";
					}
					return type === "display"
						? `<span style="color: ${bg};">${data.toFixed(2)}</span>`
						: data.toFixed(2);
				},
			},
		],
		searching: false,
		paging: false,
		ordering: false,
		info: false,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},
			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons at the bottom of the table
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const loadLevel4_Original = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchLevel4_Original/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataLevel3 = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const loadConstData = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/fetchConstructionData/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataConst = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableConstData = (tableElement, dataConst) => {
	table = $(tableElement).DataTable({
		data: dataConst,
		columns: [
			{
				data: null,
			},
			{
				data: "DisciplineCode",
			},
			{
				data: "NormIDLevel2",
			},
			{
				data: "NormIDLevel3",
			},
			{
				data: "NormIDLevel4",
			},
			{
				data: "ConstructionID",
			},
			{
				data: "Description",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "EarnedMHRS",
			},
			{
				data: "VarMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "ActualProgress",
			},
			{
				data: "CPI",
			},
			{
				data: "Level",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [7, 8, 9, 10, 11, 12, 13, 14, 15],
				render: function (data, type, row, meta) {
					return parseFloat(data).toLocaleString("en-US");
				},
			},
			{
				targets: [6],
				className: "text-left",
			},
			{
				targets: [16],
				data: "ActualProgress",
				render: function (data, type, row, meta) {
					let percent = parseFloat(data);
					if (Number.isNaN(percent) || percent == 0) {
						return type === "display"
							? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:0%;">0%</div></div>'
							: percent;
					}

					return type === "display"
						? '<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
								percent +
								'%;">' +
								percent +
								"%</div></div>"
						: percent;
				},
			},
			{
				targets: [17],
				data: "CPI",
				render: function (data, type, row, meta) {
					let bg = "transparent";
					if (data > 1) {
						bg = "#28a745";
					} else if (data == 1) {
						bg = "#ffc107";
					} else {
						bg = "#dc3545";
					}
					return type === "display"
						? `<span style="color: ${bg};">${parseFloat(data).toFixed(
								2
						  )}</span>`
						: data;
				},
			},
			{
				targets: [18],
				visible: false,
				searchable: false,
			},
			{
				targets: [0],
				render: function (data, type, row, meta) {
					if (data["Level"] != "4") {
						return type === "display"
							? '<i class="far fa-minus-square expander expanded"></i>'
							: null;
					}
					return null;
				},
			},
		],
		deferRender: true,
		searching: true,
		paging: false,
		ordering: false,
		info: true,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
		createdRow: function (row, data, index) {
			if (data["Level"] == "4") {
				$(row).attr("level", 4);
			} else {
				$(row).attr("level", data["Level"]);
				$(row).attr("collapsed", false);
			}
		},
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},
		],
	});

	// Position the buttons inside the toolbox
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));

	//Custom expdander/ collapse

	customButtons($(table.table().container()));
};

const graphGauge = (graphElementID, gaugeValue) => {
	showGaugeChart(graphElementID, "CPI", "CPI", gaugeValue);
};

const graphProductivity = async (
	graphElementID,
	graphLabels,
	graphData,
	graphData2,
	graphData3
) => {
	await showMultiAreaChart(
		graphElementID,
		"",
		graphLabels,
		graphData,
		graphData2,
		graphData3
	);
};

const exec_sp_workforces_weeks = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_Workforces_Weeks/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const getWorkforcesWeeks = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/getWorkforcesWeeks/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataWorkforces = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_Workforces_Manhours = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_Workforces_Manhours/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataManhours = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_Workforces_Manpower = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_Workforces_Manpower/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataManpower = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const graphWorkforcesHistogram = async (
	graphContainer,
	dataWorkforces,
	pediod = "weekly"
) => {
	let firstDate = dataWorkforces[0]["FirstDate"];
	let maxDuration = dataWorkforces[0]["data"].length;

	let labels = [];

	for (let i = 0; i < maxDuration; i++) {
		switch (period) {
			case "weekly":
				labels.push(moment(firstDate).add(i, "weeks").format("DD/MM/YYYY"));
				break;
			case "daily":
				labels.push(moment(firstDate).add(i, "days").format("DD/MM/YYYY"));
				break;
			case "monthly":
				labels.push(moment(firstDate).add(i, "months").format("YYYY-MMM"));
				break;
		}
	}

	let dataGraph = dataWorkforces.map((x) => {
		let title = `${x["DepartmentCode"]}-${x["TitleType"]}`;
		return {
			[title]: x["data"],
		};
	});

	// console.log(dataWorkforces);
	// console.log(dataGraph);

	await showStackedBarChart(graphContainer, "", labels, dataGraph);
};

const graphWorkforceManpower = async (
	graphContainer,
	dataWorkforces,
	period = "weekly"
) => {
	let firstDate = Date.parse(dataWorkforces[0]["FirstDate"]);
	let maxWeek;
	let labels = [];

	for (let i = 0; i < 300; i++) {
		let _weekData = dataWorkforces.map((x) => x["W_" + (i + 1)]);

		if (Object.values(_weekData).every((x) => x == null)) {
			maxWeek = i - 1;
			break;
		}

		labels.push(
			moment(firstDate + i * 7 * 24 * 3600 * 1000).format("DD/MM/YYYY")
		);
	}

	let dataGraph = dataWorkforces
		.map((x) => {
			let weekData = [];
			for (let i = 0; i < maxWeek; i++) {
				let _manhour = x["W_" + (i + 1)] ? parseFloat(x["W_" + (i + 1)]) : null;
				let _manpower = Math.ceil(_manhour / (6 * 8)); // 8 hours in 6 days

				weekData.push(_manpower);
			}

			return {
				[`${x["DepartmentCode"]}-${x["TitleType"]}`]: weekData,
			};
		})
		.sort((a, b) => {
			if (Object.keys(a) < Object.keys(b)) return -1;
			else return 1;
		});

	showStackedBarChart(graphContainer, "", labels, dataGraph);
};

const exec_sp_Heatmap = async (
	project,
	facility = null,
	discipline = null,
	budgetId = null
) => {
	if (facility && discipline && budgetId) {
		await $.ajax({
			url: `${base_url}production_control/exec_sp_Heatmap/${project}/${facility}/${discipline}/${budgetId}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				heatmapData = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (facility && discipline) {
		await $.ajax({
			url: `${base_url}production_control/exec_sp_Heatmap/${project}/${facility}/${discipline}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				heatmapData = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (facility) {
		await $.ajax({
			url: `${base_url}production_control/exec_sp_Heatmap/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				heatmapData = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/exec_sp_Heatmap/${project}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				heatmapData = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const exec_sp_HeatmapDepartment = async (project, facility, department) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_HeatmapDepartment/${project}/${facility}/${department}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			heatmapData = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_SummarizeWOByDepartment = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_SummarizeWOByDepartment/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataSumDept = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableSummaryWODepartment = (tableElement, dataSumDept) => {
	table = $(tableElement).DataTable({
		data: dataSumDept,
		columns: [
			// { data: "ProjectCode"},
			// { data: "FacilityCode"},
			{
				data: "Department",
			},
			{
				data: "WorkOrder",
			},
			{
				data: "WOCompleted",
			},
			{
				data: "WONotComplete",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "OvertimeMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "VarMHRS",
			},
		],
		// scrollX: true,
		columnDefs: [
			{
				targets: [4, 5, 6, 7, 8, 9, 10, 11, 12],
				render: function (data, type, row, meta) {
					return parseFloat(data).toLocaleString("en-US");
				},
			},
		],
		// "deferRender": true,
		searching: false,
		paging: false,
		ordering: true,
		info: false,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons inside the toolbox
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const exec_sp_SummarizeWOByDiscipline = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_SummarizeWOByDiscipline/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataSumDisc = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableSummaryWODiscipline = (tableElement, dataSumDisc) => {
	table = $(tableElement).DataTable({
		data: dataSumDisc,
		columns: [
			// { data: "ProjectCode"},
			// { data: "FacilityCode"},
			{
				data: "Discipline",
			},
			{
				data: "WorkOrder",
			},
			{
				data: "WOCompleted",
			},
			{
				data: "WONotComplete",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "OvertimeMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "VarMHRS",
			},
		],
		// scrollX: true,
		columnDefs: [
			{
				targets: [4, 5, 6, 7, 8, 9, 10, 11, 12],
				render: function (data, type, row, meta) {
					return parseFloat(data).toLocaleString("en-US");
				},
			},
		],
		// "deferRender": true,
		searching: false,
		paging: false,
		ordering: true,
		info: false,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons inside the toolbox
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const exec_sp_ListWOByDiscipline = async (
	project,
	facility,
	discipline,
	status
) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_ListWOByDiscipline/${project}/${facility}/${discipline}/${status}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataListDisc = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableListWODiscipline = (tableElement, dataListDisc) => {
	table = $(tableElement).DataTable({
		data: dataListDisc,
		columns: [
			// { data: "ProjectCode"},
			// { data: "FacilityCode"},
			{
				data: "Discipline",
			},
			{
				data: "WorkOrder",
			},
			{
				data: "WOCompleted",
			},
			{
				data: "WONotComplete",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "OvertimeMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "VarMHRS",
			},
		],
		// scrollX: true,
		columnDefs: [
			{
				targets: [4, 5, 6, 7, 8, 9, 10, 11, 12],
				render: function (data, type, row, meta) {
					return parseFloat(data).toLocaleString("en-US");
				},
			},
		],
		// "deferRender": true,
		searching: false,
		paging: false,
		ordering: true,
		info: false,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons inside the toolbox
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const graphSummaryDiscipline = (graphContainer, dataSumDisc) => {
	let count = dataSumDisc.length - 1;
	let labels = dataSumDisc.map((x) => x["Discipline"]).slice(0, count);

	let budget = dataSumDisc
		.map((x) => {
			let key = x["Discipline"];
			return {
				[key]: parseFloat(x["BaseBudgetMHRS"]),
			};
		})
		.slice(0, count);

	let actual = dataSumDisc
		.map((x) => {
			let key = x["Discipline"];
			return {
				[key]: parseFloat(x["ActualMHRS"]),
			};
		})
		.slice(0, count);

	let data = [
		{
			"Budget MHRS": budget,
		},
		{
			"Actual MHRS": actual,
		},
	];

	showBarChartMulti(
		graphContainer,
		"WORK ORDERS SUMMARY BY DISCIPLINES",
		labels,
		data
	);
};

const exec_sp_ListWO = async (
	project,
	facility,
	department,
	discipline,
	status,
	from,
	to
) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_ListWO/${project}/${facility}/${department}/${discipline}/${status}/${from}/${to}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataListWO = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableListWO = (tableElement, dataListWO) => {
	table = $(tableElement).DataTable({
		data: dataListWO,
		columns: [
			// { data: "ProjectCode"},
			// { data: "FacilityCode"},

			{
				data: "WorkOrder",
			},
			{
				data: "WorkOrderName",
				width: "100px",
			},
			{
				data: "WOStatus",
			},
			{
				data: "Department",
			},
			{
				data: "Discipline",
			},
			{
				data: "PlanStartDate",
			},
			{
				data: "PlanFinishDate",
			},
			{
				data: "ActualStartDate",
			},
			{
				data: "ActualFinishDate",
			},
			{
				data: "WOCreatebyUserName",
			},
			{
				data: "BudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualMHRS_WithoutOT",
			},
			{
				data: "ActualMHRS_OT",
			},
			{
				data: "ActualMHRS_Sunday",
			},
			{
				data: "ActualMHRS_Holiday",
			},
			{
				data: "OvertimeMHRS",
			},
			{
				data: "WasteMHRS",
			},
			{
				data: "VarMHRS",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [10, 11, 12, 13, 14, 15, 16, 17, 18],
				render: function (data, type, row, meta) {
					return parseFloat(data).toLocaleString("en-US");
				},
			},
			{
				targets: [5, 6, 7, 8],
				render: function (data, type, row, meta) {
					return data != null ? moment(data).format("DD/MM/YYYY") : "";
				},
			},
			{
				targets: [2],
				render: function (data, type, row, meta) {
					if (data == "1") {
						return '<span class="badge badge-success text-sm">Completed</span>';
					} else if (data == "0") {
						return '<span class="badge badge-warning text-sm">Ongoing</span>';
					}
				},
			},
		],
		deferRender: true,
		searching: true,
		paging: true,
		ordering: true,
		info: true,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
		lengthMenu: [
			[50, 100, -1],
			[50, 100, "All"],
		],
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},

			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons inside the toolbox
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));
};

const graphSummaryDepartment = (graphContainer, dataSumDept) => {
	let count = dataSumDept.length - 1;
	let labels = dataSumDept.map((x) => x["Department"]).slice(0, count);

	let budget = dataSumDept
		.map((x) => {
			let key = x["Department"];
			return {
				[key]: parseFloat(x["BaseBudgetMHRS"]),
			};
		})
		.slice(0, count);

	let actual = dataSumDept
		.map((x) => {
			let key = x["Department"];
			return {
				[key]: parseFloat(x["ActualMHRS"]),
			};
		})
		.slice(0, count);

	let data = [
		{
			"Budget MHRS": budget,
		},
		{
			"Actual MHRS": actual,
		},
	];

	showBarChartMulti(
		graphContainer,
		"WORK ORDERS SUMMARY BY DEPARTMENTS",
		labels,
		data
	);
};

const getWODisciplines = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/getWODisciplines/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			disciplines = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const getWODepartments = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/getWODepartments/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			departments = response;
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const getProductionPlan = async (
	project,
	facility,
	discipline = null,
	activityId = null
) => {
	if (discipline && activityId) {
		await $.ajax({
			url: `${base_url}production_control/getProductionPlan/${project}/${facility}/${discipline}/${activityId}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (discipline) {
		await $.ajax({
			url: `${base_url}production_control/getProductionPlan/${project}/${facility}/${discipline}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/getProductionPlan/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const getProductionActual = async (
	project,
	facility,
	discipline = null,
	activityId = null
) => {
	if (discipline && activityId) {
		await $.ajax({
			url: `${base_url}production_control/getProductionActual/${project}/${facility}/${discipline}/${activityId}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (discipline) {
		await $.ajax({
			url: `${base_url}production_control/getProductionActual/${project}/${facility}/${discipline}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/getProductionActual/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const getProductionEarned = async (
	project,
	facility,
	discipline = null,
	activityId = null
) => {
	if (discipline && activityId) {
		await $.ajax({
			url: `${base_url}production_control/getProductionEarned/${project}/${facility}/${discipline}/${activityId}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataEarned = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (discipline) {
		await $.ajax({
			url: `${base_url}production_control/getProductionEarned/${project}/${facility}/${discipline}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataEarned = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/getProductionEarned/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataEarned = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const exec_sp_ProductionPlan = async (project, facility, revision) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_ProductionPlan/${project}/${facility}/${revision}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_ProductionEarned = async (project, facility, revision) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_ProductionEarned/${project}/${facility}/${revision}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_ProductionPlanActual = async (project, facility, revision) => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_ProductionActual/${project}/${facility}/${revision}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_RollupMHRSConstructionID = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_RollupMHRSConstructionID/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_RollupMHRSLevel1 = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_RollupMHRSLevel1/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_RollupMHRSLevel2 = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_RollupMHRSLevel2/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_RollupMHRSLevel3 = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_RollupMHRSLevel3/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_sp_RollupMHRSLevel4 = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_RollupMHRSLevel4/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const fetchDashboardProductionPlan = async (
	project = null,
	facility = null
) => {
	if (project && facility) {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionPlan/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (project) {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionPlan/${project}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionPlan`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const fetchDashboardProductionActual = async (
	project = null,
	facility = null
) => {
	if (project && facility) {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionActual/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (project) {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionActual/${project}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}production_control/fetchDashboardProductionActual`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const fetchChartComponentData = async (chartId) => {
	await $.ajax({
		url: `${base_url}external/fetchChartComponentData/${chartId}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataFilter = response;
			// console.log(dataFilter);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_spConstructionDataWithActual = async (project, facility) => {
	await $.ajax({
		url: `${base_url}production_control/exec_spConstructionDataWithActual/${project}/${facility}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataConstruction = response;
			// console.log(dataFilter);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const exec_spWorkOrdersByConstructionID = async (
	project,
	facility,
	constructionID
) => {
	await $.ajax({
		url: `${base_url}production_control/exec_spWorkOrdersByConstructionID/${project}/${facility}/${constructionID}`,
		type: "POST",
		data: [],
		dataType: "json",
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			dataWorkOrderList = response;
			// console.log(dataFilter);
		},
		complete: function (data) {},
		error: function (error) {
			// console.log(error);
		},
	});
};

const tableConstDataWithActual = (tableElement, dataConstruction) => {
	if (typeof table != "undefined") {
		table.destroy();
	}
	table = $(tableElement).DataTable({
		data: dataConstruction,
		columns: [
			{
				data: null,
			},
			{
				data: "DisciplineCode",
			},
			{
				data: "NormIDLevel2",
			},
			{
				data: "NormIDLevel3",
			},
			{
				data: "ConstructionID",
			},
			{
				data: "Description",
			},
			{
				data: "BaseBudgetMHRS",
			},
			{
				data: "IssuedBudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "ActualProgress",
			},
			{
				data: null,
			},
			{
				data: "Level",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [6, 7, 8],
				render: function (data, type, row, meta) {
					return (Math.round(parseFloat(data) * 100) / 100).toLocaleString(
						"en-US"
					);
				},
			},
			{
				targets: [11],
				visible: false,
				searchable: false,
			},
			{
				targets: [10],
				render: function (data, type, row, meta) {
					let budget = parseFloat(data["BaseBudgetMHRS"]);
					let issued = parseFloat(data["IssuedBudgetMHRS"]);
					let percent = budget > 0 ? Math.round((issued * 100) / budget) : 0;

					return (
						'<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
						percent +
						'%;">' +
						percent +
						"%</div></div>"
					);
				},
			},
			{
				targets: [9],
				render: function (data, type, row, meta) {
					let _percent = parseFloat(data);
					let percent = !isNaN(_percent) ? Math.round(_percent) : 0;

					return (
						'<div class="progress" style="height: 20px; background: #bfbfbf;"><div role="progressbar" class="progress-bar bg-success active" style="overflow:visible; width:' +
						percent +
						'%;">' +
						percent +
						"%</div></div>"
					);
				},
			},
			{
				targets: [0],
				render: function (data, type, row, meta) {
					if (data["Level"] != "4") {
						return type === "display"
							? '<i class="far fa-minus-square expander expanded"></i>'
							: null;
					} else {
						return type === "display"
							? '<i class="fas fa-share-square open-list"></i>'
							: null;
					}
				},
			},
		],
		deferRender: true,
		searching: true,
		paging: false,
		ordering: false,
		info: true,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
		createdRow: function (row, data, index) {
			if (data["Level"] == "4") {
				$(row).attr("level", 4);
			} else {
				$(row).attr("level", data["Level"]);
				$(row).attr("collapsed", false);
			}
			$(row).attr("construction-id", data["ConstructionID"]);
		},
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},
			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons at the bottom of the table
	toolbox = $(table.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table.buttons().container().appendTo($(toolbox));

	customButtons($(table.table().container()));
};

const tableWorkOrdersFromConstID = (tableElement, dataWorkOrder) => {
	if (typeof table2 != "undefined") {
		table2.destroy();
	}
	table2 = $(tableElement).DataTable({
		data: dataWorkOrder,
		columns: [
			{
				data: "ConstructionID",
			},
			{
				data: "WorkOrder",
			},
			{
				data: "Description",
			},
			{
				data: "BudgetMHRS",
			},
			{
				data: "ActualMHRS",
			},
			{
				data: "Status",
			},
			{
				data: "PlanStart",
			},
			{
				data: "PlanFinish",
			},
			{
				data: "ActualStart",
			},
			{
				data: "ActualFinish",
			},
		],
		scrollX: true,
		columnDefs: [
			{
				targets: [6, 7, 8, 9],
				data: "Status",
				render: function (data, type, row, meta) {
					return moment(data).format("DD/MM/YYYY");
				},
			},
		],
		deferRender: true,
		searching: true,
		paging: false,
		ordering: false,
		info: true,
		scrollX: "100%",
		scrollY: "75vh",
		scrollCollapse: true,
	});

	// Add plugin functions to table
	new $.fn.dataTable.Buttons(table, {
		buttons: [
			{
				extend: "copyHtml5",
				text: '<i class="fas fa-copy"></i>',
				titleAttr: "Copy",
			},
			{
				extend: "excelHtml5",
				text: '<i class="fas fa-file-excel"></i>',
				titleAttr: "Excel",
			},
			{
				extend: "pdfHtml5",
				text: '<i class="fas fa-file-pdf"></i>',
				orientation: "landscape",
				pageSize: "LEGAL",
				titleAttr: "PDF",
			},
			{
				extend: "print",
				text: '<i class="fas fa-print"></i>',
				titleAttr: "Print",
			},
		],
	});

	// Position the buttons at the bottom of the table
	toolbox = $(table2.table().container())
		.parents(".chart-tile")
		.find(".toolbox");
	table2.buttons().container().appendTo($(toolbox));
};

const fetchChartExternalPlan = async (project = null, facility = null) => {
	if (project && facility) {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalPlan/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (project) {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalPlan/${project}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalPlan`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataPlan = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};

const fetchChartExternalActual = async (project = null, facility = null) => {
	if (project && facility) {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalActual/${project}/${facility}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else if (project) {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalActual/${project}`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	} else {
		await $.ajax({
			url: `${base_url}external/fetchChartExternalActual`,
			type: "POST",
			data: [],
			dataType: "json",
			dataFilter: function (res) {
				// console.log(res);
				return res;
			},
			success: function (response) {
				// console.log(response);
				dataActual = response;
			},
			complete: function (data) {},
			error: function (error) {
				// console.log(error);
			},
		});
	}
};
//#endregion

//#region Dashboard
let renderFacilities = async (element, data) => {
	// console.log(element);
	// console.log(data);

	let chartElementID =
		data.ProjectCode + "-" + data.FacilityCode.split(" ").join("-");

	$(element)
		.children()
		.find(".facility-pill")
		.html(data.ProjectCode + " - " + data.FacilityCode);

	$(element)
		.children()
		.find(".table")
		.attr("id", "table-" + chartElementID);

	let _dataActual = data.DataActual;
	let _dataPlan = data.DataPlan;
	let _chartLabels = [];
	let _firstDate = null;
	let _lastDate = null;
	let _duration = 0;

	let isAllTime = $("#checkbox-fromto-all").prop("checked");
	if (!isAllTime) {
		let _from = new Date(from);
		// console.log(_from);
		_firstDate = moment(from).add(5 - _from.getDay(), "days");
		_lastDate = moment(to);

		_duration = _lastDate.diff(_firstDate, "weeks");

		for (let i = 0; i < _duration; i++) {
			_chartLabels.push(_firstDate.format("DD-MMM-YYYY"));
			_firstDate.add(7, "days");
		}
	} else {
		if (_dataActual.length > _dataPlan.length) {
			_firstDate = moment(_dataActual[0]["WeekDate"]);
			_lastDate = moment(_dataActual[_dataActual.length - 1]["WeekDate"]);
			_chartLabels = _dataActual.map((x) =>
				moment(x.WeekDate).format("DD-MMM-YYYY")
			);
		} else {
			_firstDate = moment(_dataPlan[0]["WeekDate"]);
			_lastDate = moment(_dataPlan[_dataPlan.length - 1]["WeekDate"]);
			_chartLabels = _dataPlan.map((x) =>
				moment(x.WeekDate).format("DD-MMM-YYYY")
			);
		}
	}

	let chartData = [];
	let header = `<th>Order</th>
			<th style="min-width:150px;">Manpower</th>
			<th style="min-width:100px;">ID Code</th>
			<th style="min-width:200px;">Description</th>`;
	$(element)
		.find("table thead tr")
		.html(header + _chartLabels.map((x) => `<th>${x}</th>`).join(""));

	let restColumns = _chartLabels.map((d) => {
		let value = data.DataActual.filter(
			(v) => moment(v.WeekDate).format("DD-MMM-YYYY") == d
		);

		if (value.length > 0) {
			return [d, value[0]];
		} else {
			return [d, null];
		}
	});

	let bodyData = [];
	if (restColumns.length > 0) {
		bodyData = projectWorkforce.map((pos) => {
			return {
				Order: pos.Order,
				Manpower: pos.Type,
				IDCode: pos.Abbr,
				Description: pos.Column,
				...Object.fromEntries(
					restColumns.map((x) =>
						x[1] != null ? [x[0], x[1][pos.Column]] : [x[0], 0]
					)
				),
			};
		});

		let table2 = $(element)
			.find(".actual-manpower")
			.DataTable({
				data: bodyData,
				columns: Object.keys(bodyData[0]).map((x) => {
					return {
						data: x,
					};
				}),
				scrollX: true,
				columnDefs: [
					{
						targets: [0],
						visible: false,
						searchable: false,
					},
				],
				// "deferRender": true,
				searching: false,
				paging: false,
				ordering: false,
				info: false,
			});
	}

	let restColumns2 = _chartLabels.map((d) => {
		let value = data.DataPlan.filter(
			(v) => moment(v.WeekDate).format("DD-MMM-YYYY") == d
		);

		if (value.length > 0) {
			return [d, value[0]];
		} else {
			return [d, null];
		}
	});

	let bodyData2 = [];
	if (restColumns2.length > 0) {
		bodyData2 = projectWorkforce.map((pos) => {
			return {
				Order: pos.Order,
				Manpower: pos.Type,
				IDCode: pos.Abbr,
				Description: pos.Column,
				...Object.fromEntries(
					restColumns2.map((x) =>
						x[1] != null ? [x[0], x[1][pos.Column]] : [x[0], 0]
					)
				),
			};
		});

		let table1 = $(element)
			.find(".planned-manpower")
			.DataTable({
				data: bodyData2,
				columns: Object.keys(bodyData2[0]).map((x) => {
					return {
						data: x,
					};
				}),
				scrollX: true,
				columnDefs: [
					{
						targets: [0],
						visible: false,
						searchable: false,
					},
				],
				// "deferRender": true,
				searching: false,
				paging: false,
				ordering: false,
				info: false,
			});
	}
};

let chartFacilities = async (elementID, data, period) => {
	// console.log(data);
	// console.log(elementID);
	let _chartLabels = [];
	let _dataActual = data.DataActual;
	let _dataPlan = data.DataPlan;
	let isAllTime = $("#checkbox-fromto-all").prop("checked");
	if (!isAllTime) {
		let _from = new Date(from);
		// console.log(_from);
		if (period == "weekly") {
			_firstDate = moment(from).add(5 - _from.getDay(), "days");
			_lastDate = moment(to);
			_duration = _lastDate.diff(_firstDate, "weeks") + 2;
		} else if (period == "monthly") {
			_firstDate = moment(from).endOf("month");
			_lastDate = moment(to).endOf("month");
			_duration = _lastDate.diff(_firstDate, "months") + 1;
		}

		for (let i = 0; i < _duration; i++) {
			_chartLabels.push(_firstDate.format("DD-MMM-YYYY"));
			if (period == "weekly") {
				_firstDate.add(7, "days");
			} else if (period == "monthly") {
				_firstDate.add(1, "month").endOf("month");
			}
		}
	} else {
		if (_dataActual.length > _dataPlan.length) {
			_firstDate = moment(_dataActual[0]["WeekDate"]);
			_lastDate = moment(_dataActual[_dataActual.length - 1]["WeekDate"]);
			_chartLabels = _dataActual.map((x) =>
				moment(x.WeekDate).format("DD-MMM-YYYY")
			);
		} else {
			_firstDate = moment(_dataPlan[0]["WeekDate"]);
			_lastDate = moment(_dataPlan[_dataPlan.length - 1]["WeekDate"]);
			_chartLabels = _dataPlan.map((x) =>
				moment(x.WeekDate).format("DD-MMM-YYYY")
			);
		}
	}

	// console.log(_chartLabels);

	let chartDataActual = projectWorkforce.map((pos) => {
		return {
			[pos.Abbr]: _chartLabels.map((x) => {
				let found = data.DataActual.filter(
					(d) => moment(d.WeekDate).format("DD-MMM-YYYY") == x
				);

				return found.length > 0 ? found[0][pos.Column] : 0;
			}),
		};
	});

	let chartDataPlan = projectWorkforce.map((pos) => {
		return {
			[pos.Abbr]: _chartLabels.map((x) => {
				let found = data.DataPlan.filter(
					(d) => moment(d.WeekDate).format("DD-MMM-YYYY") == x
				);

				return found.length > 0 ? found[0][pos.Column] : 0;
			}),
		};
	});

	let chartDataArray = [
		{
			Planned: chartDataPlan,
		},
		{
			Actual: chartDataActual,
		},
	];

	// console.log(chartDataArray);

	if (period == "weekly") {
		showMultiStackedBarChart(elementID, "", _chartLabels, chartDataArray);
	} else {
		showMultiStackedBarChart(
			elementID,
			"",
			_chartLabels.map((x) => moment(x).format("MMM-YYYY")),
			chartDataArray
		);
	}
};

// const setActivePeriod = (period) => {
// 	$(".select-month-week-day.manpower").children().removeClass("active");

// 	switch (period) {
// 		case "weekly":
// 			$(".select-month-week-day.manpower .select-week").addClass("active");
// 			break;
// 		case "monthly":
// 			$(".select-month-week-day.manpower .select-month").addClass("active");
// 			break;
// 	}
// };

const refreshManpowerHistogram = async () => {
	// dataWorkforceManpower = await cookGraphData(dataManpower, period, "Workers")
	await graphWorkforcesHistogram(
		"manpower-histogram",
		dataWorkforceManpower,
		period
	);
};

const pickFacility = (targetProject, targetFacility, period) => {
	let chartData = [];
	switch (period) {
		case "weekly":
			if (targetProject != "All" && targetFacility != "All") {
				chartData = facilitiesData.filter(
					(x) =>
						x.ProjectCode == targetProject && x.FacilityCode == targetFacility
				)[0];
				chartFacilities(chartElementID, chartData, period);
			} else {
				// console.log(projectFacility)
				let _PlanData = dataPlan.filter(
					(x) =>
						projectFacility.map((f) => f.ProjectCode).includes(x.ProjectCode) &&
						projectFacility.map((f) => f.FacilityCode).includes(x.FacilityCode)
				);

				let _ActualData = dataActual.filter(
					(x) =>
						projectFacility.map((f) => f.ProjectCode).includes(x.ProjectCode) &&
						projectFacility.map((f) => f.FacilityCode).includes(x.FacilityCode)
				);

				chartData = {
					ProjectCode: "All",
					FacilityCode: "All",
					DataPlan: weekDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								// console.log(pos)
								let total = _PlanData
									.filter((x) => x.WeekDate == d)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								// console.log(total)
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => sum + y)
										: 0,
								];
							}),
						]);
					}),
					DataActual: weekDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								let total = _ActualData
									.filter((x) => x.WeekDate == d)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => sum + y)
										: 0,
								];
							}),
						]);
					}),
				};
				// console.log(chartData);
				chartFacilities(chartElementID, chartData, period);
			}
			break;
		case "monthly":
			// let monthData = facilitiesData
			if (targetProject != "All" && targetFacility != "All") {
				let _PlanData = dataPlan.filter(
					(x) =>
						x.ProjectCode == targetProject && x.FacilityCode == targetFacility
				);

				let _ActualData = dataActual.filter(
					(x) =>
						x.ProjectCode == targetProject && x.FacilityCode == targetFacility
				);

				chartData = {
					ProjectCode: targetProject,
					FacilityCode: targetFacility,
					DataPlan: monthDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								// console.log(pos)
								let total = _PlanData
									.filter(
										(x) =>
											moment(x.WeekDate) <= moment(d).endOf("month") &&
											moment(x.WeekDate) >= moment(d).startOf("month")
									)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => Math.round(sum + y)) /
										  total.length
										: 0,
								];
							}),
						]);
					}),
					DataActual: monthDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								let total = _ActualData
									.filter(
										(x) =>
											moment(x.WeekDate) <= moment(d).endOf("month") &&
											moment(x.WeekDate) >= moment(d).startOf("month")
									)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								// console.log(total)
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => Math.round(sum + y)) /
										  total.length
										: 0,
								];
							}),
						]);
					}),
				};

				// console.log(facilitiesData)
				// console.log(chartData)
				chartFacilities(chartElementID, chartData, period);
			} else {
				// console.log(projectFacility)
				let _PlanData = dataPlan.filter(
					(x) =>
						projectFacility.map((f) => f.ProjectCode).includes(x.ProjectCode) &&
						projectFacility.map((f) => f.FacilityCode).includes(x.FacilityCode)
				);

				let _ActualData = dataActual.filter(
					(x) =>
						projectFacility.map((f) => f.ProjectCode).includes(x.ProjectCode) &&
						projectFacility.map((f) => f.FacilityCode).includes(x.FacilityCode)
				);

				chartData = {
					ProjectCode: "All",
					FacilityCode: "All",
					DataPlan: monthDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								// console.log(pos)
								let total = _PlanData
									.filter(
										(x) =>
											moment(x.WeekDate) <= moment(d).endOf("month") &&
											moment(x.WeekDate) >= moment(d).startOf("month")
									)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => sum + y) / total.length
										: 0,
								];
							}),
						]);
					}),
					DataActual: monthDates.map((d) => {
						return Object.fromEntries([
							["WeekDate", d],
							...projectWorkforce.map((pos) => {
								let total = _ActualData
									.filter(
										(x) =>
											moment(x.WeekDate) <= moment(d).endOf("month") &&
											moment(x.WeekDate) >= moment(d).startOf("month")
									)
									.map((x) =>
										typeof x[pos.Column] != "undefined" &&
										!isNaN(parseFloat(x[pos.Column]))
											? parseFloat(x[pos.Column])
											: 0
									);
								return [
									pos.Column,
									total.length > 0 && typeof total != undefined
										? total.reduce((sum = 0, y) => sum + y) / total.length
										: 0,
								];
							}),
						]);
					}),
				};
				// console.log(chartData);
				chartFacilities(chartElementID, chartData, period);
			}
			break;
	}
};

const dashboard = () => {
	Promise.all([
		getProductionDashboard(),
		fetchDashboardProductionPlan(),
		fetchDashboardProductionActual(),
	])
		.then(async () => {
			// console.log(dataDashboard)
			let tile = $(".project-tile")[0];
			duplicateBlock(tile, dataDashboard, (el, data) => {
				// console.log(data)

				$(el).find("img").attr("src", data.CustomerLogo);
				$(el).find(".project").text(data.ProjectCode);
				$(el)
					.find(".budget-mhrs")
					.text(
						Math.floor((data.BaseBudgetMHRS * 100) / 100).toLocaleString(
							"en-US"
						)
					);
				$(el)
					.find(".actual-mhrs")
					.text(
						Math.floor((data.ActualMHRS * 100) / 100).toLocaleString("en-US")
					);
				$(el)
					.find(".cpi")
					.text(Math.floor(data.CPI * 100) / 100);
				$(el)
					.find(".percentage")
					.text(Math.floor(data.Progress * 10000) / 100 + "%");
			});
		})
		.then(async () => {
			Object.keys(dataActual[0]).forEach((x) => {
				if (x.split("_").length > 1) {
					let abbr = x.split("_")[0];
					positions.push({
						Type: definitions.filter((def) => def.Abbr.includes(abbr))[0][
							"Fullname"
						],
						Order: definitions.filter((def) => def.Abbr.includes(abbr))[0][
							"Order"
						],
						Abbr: abbr,
						Fullname: x.split("_")[1],
						Column: x,
					});
				}
			});

			projectWorkforce = [...positions];

			columns = ["WeekDate", ...projectWorkforce.map((x) => x.Column)];

			facilitiesData = dataActual
				.map((x) => x.ProjectCode + "@" + x.FacilityCode)
				.distinct()
				.map((x) => {
					_projectCode = x.split("@")[0];
					_facilityCode = x.split("@")[1];
					return {
						ProjectCode: _projectCode,
						FacilityCode: _facilityCode,
						DataPlan: dataPlan
							.filter(
								(d) =>
									d.FacilityCode == _facilityCode &&
									d.ProjectCode == _projectCode
							)
							.map((row) => {
								let result = Object.fromEntries(
									columns.map((col) => [
										col,
										col == "WeekDate"
											? row[col]
											: !isNaN(parseFloat(row[col]))
											? parseFloat(row[col])
											: 0,
									])
								);
								return result;
							}),
						DataActual: dataActual
							.filter(
								(d) =>
									d.FacilityCode == _facilityCode &&
									d.ProjectCode == _projectCode
							)
							.map((row) => {
								let result = Object.fromEntries(
									columns.map((col) => [
										col,
										col == "WeekDate"
											? row[col]
											: !isNaN(parseFloat(row[col]))
											? parseFloat(row[col])
											: 0,
									])
								);
								return result;
							}),
					};
				});

			// console.log(facilitiesData);
		})
		.then(async () => {
			$("#dashboard-facility").select2({
				placeholder: {
					id: "-1", // the value of the option
					text: "Pick multiple",
				},
				minimumResultsForSearch: -1,
				data: facilitiesData.map((x) => {
					return {
						id: x.ProjectCode + "-" + x.FacilityCode,
						text: x.ProjectCode + "-" + x.FacilityCode,
					};
				}),
			});

			$("#dashboard-facility").on("change", () => {
				projectFacility = $("#dashboard-facility")
					.val()
					.map((x) => {
						return {
							ProjectCode: x.split("-")[0],
							FacilityCode: x.split("-")[1],
						};
					});
			});

			$("#dashboard-workforce").select2({
				placeholder: {
					id: "-1", // the value of the option
					text: "Pick multiple",
				},
				minimumResultsForSearch: -1,
				data: positions.map((x) => x.Fullname),
			});

			$("#dashboard-workforce").on("change", () => {
				projectWorkforce = $("#dashboard-workforce")
					.val()
					.map((x) => {
						return positions.filter((pos) => pos.Fullname == x)[0];
					});
			});

			$("#checkbox-facility-all").on("change", (e) => {
				let isAllFacilities = $("#checkbox-facility-all").attr("checked");
				// console.log(isAllFacilities)
				$("#dashboard-facility").attr("disabled", !isAllFacilities);

				if (isAllFacilities == true) {
					projectFacility = facilitiesData;
				}
			});

			$("#checkbox-workforce-all").on("change", (e) => {
				let isAllWorkforce = $("#dashboard-workforce").attr("disabled");
				$("#dashboard-workforce").attr("disabled", !isAllWorkforce);

				if (isAllWorkforce == true) {
					projectWorkforce = positions.map((x) => {
						return {
							ProjectCode: x.split("-")[0],
							FacilityCode: x.split("-")[1],
						};
					});
				}
			});

			$("#checkbox-fromto-all").on("change", (e) => {
				let isAllFromTo = $("#daterange").attr("disabled");
				$("#daterange").attr("disabled", !isAllFromTo);
			});

			$("#daterange").daterangepicker(
				{
					startDate: from,
					endDate: to,
					opens: "left",
					autoApply: true,
					autoUpdateInput: true,
					defaultDate: "",
					minYear: 2017,
					maxYear: parseInt(moment().format("YYYY"), 10),
					locale: {
						format: "DD-MMM-YYYY",
						cancelLabel: "Clear",
						fromLabel: "From",
						toLabel: "To",
					},
					ranges: {
						"Last 7 Days": [moment().subtract(6, "days"), moment()],
						"Last 30 Days": [moment().subtract(29, "days"), moment()],
						"Last 3 Months": [
							moment().subtract(3, "months").startOf("month"),
							moment(),
						],
						"Last Year": [
							moment().subtract(12, "month").startOf("month"),
							moment(),
						],
						"Last 2 Year": [
							moment().subtract(24, "month").startOf("month"),
							moment(),
						],
					},
				},
				function (start, end, label) {}
			);

			$("#daterange").on("change", () => {
				from = $("#daterange").data("daterangepicker").startDate;
				to = $("#daterange").data("daterangepicker").endDate;
			});

			$("#btn-filter").on("click", (e) => {
				let valid = true;
				if ($("#dashboard-facility").val() == []) {
					showSnackbar("error", "Please select Project and Facility");
					valid &= false;
				}

				$("#btn-filter").prop("disabled", true);
				$(".control-box input").attr("disabled", true);
				$(".control-box select").select2({
					disabled: true,
				});

				let selectedData = projectFacility.map((fac) => {
					let _result = facilitiesData.filter(
						(x) =>
							x.ProjectCode == fac.ProjectCode &&
							x.FacilityCode == fac.FacilityCode
					)[0];

					if (_result.DataActual.length > 0)
						weekDates = [
							...weekDates,
							..._result.DataActual.map((x) => x.WeekDate),
						];
					if (_result.DataPlan.length > 0)
						weekDates = [
							...weekDates,
							..._result.DataPlan.map((x) => x.WeekDate),
						];

					return _result;
				});

				weekDates = weekDates.distinct().sort();
				// console.log(weekDates)
				monthDates = weekDates
					.map((x) => moment(x).endOf("month").format("YYYY-MM-DD"))
					.distinct();
				// console.log(monthDates)

				duplicateBlock($(".table-histogram"), selectedData, (el, data) => {
					renderFacilities(el, data);

					// console.log($(el).parents().eq(1).find('.header-collapse'));
					$(el)
						.find(".header-collapse")
						.on("click", function (e) {
							let _target = $(this);

							if ($(_target).hasClass("open")) {
								$(_target).html('<i class="far fa-plus-square"></i>');
								$(_target).toggleClass("open");
								$(_target).toggleClass("close");
								let _histogram = $(_target)
									.parents()
									.eq(1)
									.find(".data-histogram");
								// _histogram.hide()
								_histogram.css("height", "0");
								_histogram.css("visibility", "hidden");
							} else {
								$(_target).html('<i class="far fa-minus-square"></i>');
								$(_target).toggleClass("open");
								$(_target).toggleClass("close");
								let _histogram = $(_target)
									.parents()
									.eq(1)
									.find(".data-histogram");
								// _histogram.show()
								_histogram.css("height", "max-content");
								_histogram.css("visibility", "visible");
							}
						});
				});

				duplicateBlock(
					$(".discipline-list").children().eq(0),
					projectFacility,
					(el, data) => {
						el.html(data.ProjectCode + "-" + data.FacilityCode);
						$(el).attr("target-project", data.ProjectCode);
						$(el).attr("target-facility", data.FacilityCode);
					},
					false
				);

				$(".btn-facility").on("click", function (e) {
					targetProject = $(e.target).attr("target-project");
					targetFacility = $(e.target).attr("target-facility");
					$(e.target).siblings().removeClass("active");
					$(e.target).addClass("active");

					pickFacility(targetProject, targetFacility, period);
				});
			});

			$(".select-month-week-day .select-month").on("click", async function (e) {
				period = "monthly";

				setActivePeriod(period);

				if (targetProject != "" && targetFacility != "") {
					pickFacility(targetProject, targetFacility, "monthly");
				}
			});

			$(".select-month-week-day .select-week").on("click", async function (e) {
				period = "weekly";

				setActivePeriod(period);
				if (targetProject != "" && targetFacility != "") {
					pickFacility(targetProject, targetFacility, "weekly");
				}
			});
		});
};

//#endregion

//#region WorkOrder ConstructionID
const WorkOrderConstID = () => {
	Promise.all([
		exec_spConstructionDataWithActual(currentProject, currentFacility),
	])
		.then(async () => {
			// console.log(dataConstruction)

			tableConstDataWithActual("#tableConstruction", dataConstruction);
		})
		.then(async () => {
			let disciplines = dataConstruction
				.map((x) => x.DisciplineCode)
				.distinct();
			// console.log(disciplines);
			let dataLevel2 = dataConstruction.filter((x) => x.Level == 2);
			let dataDisciplines = disciplines
				.map((disc) => dataLevel2.filter((x) => x.DisciplineCode == disc)[0])
				.sort((x, y) =>
					parseFloat(x.BaseBudgetMHRS) < parseFloat(y.BaseBudgetMHRS) ? 1 : -1
				);

			disciplines = dataDisciplines.map((x) => x.DisciplineCode);

			let dataTotal = {
				DisciplineCode: "Total",
				Level: 1,
				BaseBudgetMHRS: dataDisciplines.reduce(
					(sum, x) =>
						sum + Math.round(parseFloat(x.BaseBudgetMHRS) * 100) / 100,
					0
				),
				ActualMHRS: dataDisciplines.reduce(
					(sum, x) => sum + Math.round(parseFloat(x.ActualMHRS) * 100) / 100,
					0
				),
				IssuedBudgetMHRS: dataDisciplines.reduce(
					(sum, x) =>
						sum + Math.round(parseFloat(x.IssuedBudgetMHRS) * 100) / 100,
					0
				),
			};

			let labels = ["Total", ...disciplines];
			let chartData = [
				{
					Budget: [
						dataTotal.BaseBudgetMHRS,
						...dataDisciplines.map((x) => parseFloat(x.BaseBudgetMHRS)),
					],
				},
				{
					Issued: [
						dataTotal.IssuedBudgetMHRS,
						...dataDisciplines.map((x) => parseFloat(x.IssuedBudgetMHRS)),
					],
				},
				{
					Actual: [
						dataTotal.ActualMHRS,
						...dataDisciplines.map((x) => parseFloat(x.ActualMHRS)),
					],
				},
			];

			// console.log(chartData);
			$(".loader").addClass("hidden");

			showBarChart2("budget-share", "", labels, chartData);
		})
		.then(() => {
			$("#tableConstruction tbody .open-list").hover(function (e) {
				$(this).css("cursor", "pointer");
			});
			$("#tableConstruction tbody .open-list").on("click", function (e) {
				let target = $(this).parents("tr");
				// console.log(target);
				let constructionID = $(target).attr("construction-id");

				exec_spWorkOrdersByConstructionID(
					currentProject,
					currentFacility,
					constructionID
				).then(async () => {
					// console.log(dataWorkOrderList);
					await tableWorkOrdersFromConstID(
						"#tableWorkOrders",
						dataWorkOrderList
					);
				});
			});
		});
};

//#endregion

//#region  Level1
const TreemapLevel1 = async () => {
	await loadLevel3_Original(currentProject, currentFacility);
	// await loadLevel3(currentProject, currentFacility);
	dataLevel3Contribute = dataLevel3
		.map((disc) => {
			return {
				DisciplineCode: disc["DisciplineCode"],
				NormIDLevel2: disc["NormIDLevel2"],
				NormIDLevel3: disc["NormIDLevel3"],
				MainActivities: disc["MainActivities"],
				BaseBudgetMHRS: parseFloat(disc["BaseBudgetMHRS"]),
				ActualMHRS: parseFloat(disc["ActualMHRS"]),
				ActualMHRS_OT: parseFloat(disc["ActualMHRS_OT"]),
				ActualMHRS_WithoutOT: parseFloat(disc["ActualMHRS_WithoutOT"]),
				ActualMHRS_Sunday: parseFloat(disc["ActualMHRS_Sunday"]),
				ActualMHRS_Holiday: parseFloat(disc["ActualMHRS_Holiday"]),
				EarnedMHRS: parseFloat(disc["EarnedMHRS"]),
				VarMHRS: parseFloat(disc["VarMHRS"]),
				WasteMHRS: parseFloat(disc["WasteMHRS"]),
				ActualProgress: parseFloat(disc["ActualProgress"]),
				CPI: parseFloat(disc["EarnedMHRS"]) / parseFloat(disc["ActualMHRS"]),
			};
		})
		.sort((x, y) => {
			if (x["BaseBudgetMHRS"] > y["BaseBudgetMHRS"]) {
				return -1;
			} else {
				return 1;
			}
			return 0;
		})
		.sort((x, y) => {
			if (x["Discipline"] > y["Discipline"]) {
				return -1;
			} else {
				return 1;
			}
			return 0;
		});
	await graphTreeMapLevel3("treemap-chart", dataLevel3Contribute);
};

const BudgetLevel1 = async () => {
	loadLevel1_Original(currentProject, currentFacility).then(async () => {
		_data = dataLevel1[0];
		$("#budgetMHRS").text(
			parseFloat(_data["BaseBudgetMHRS"]).toLocaleString("en-US")
		);
		$("#progress").text(_data["ActualProgress"] + "%");
		$("#actualMHRS").text(
			parseFloat(_data["ActualMHRS"]).toLocaleString("en-US")
		);
		$("#cpi").text(
			(
				parseFloat(_data["EarnedMHRS"]) / parseFloat(_data["ActualMHRS"])
			).toFixed(2)
		);

		await graphActualMHRSLevel1("pie-chart-actual", _data);
		await graphBudgetLevel1("#bar-chart-budget", _data);
		await tableLevel1("#table", _data);
	});
};

const HeatmapLevel1 = async () => {
	exec_sp_Heatmap(currentProject, currentFacility).then(async () => {
		let heatmapGraphdata = [];
		// console.log(heatmapData);

		years = [...new Set(heatmapData.map((x) => x["Date"].substring(0, 4)))];

		years.forEach((year) => {
			let _graphdata = heatmapData
				.filter((x) => x["Date"].substring(0, 4) == year)
				.map((x) => {
					return [x["Date"].toString(), parseFloat(x["Workforce"])];
				});
			heatmapGraphdata.push(_graphdata);
		});
		let _maxRange = heatmapData
			.map((x) => parseFloat(x["Workforce"]))
			.reduce((max, y) => (max > y ? max : y));

		maxRange = (Math.round(_maxRange / 100) + 1) * 100;
		graphHeatmap("calendarmap", years, heatmapGraphdata, maxRange);
	});
};

const ProductionLevel1 = async () => {
	Promise.all([
		getProductionPlan(currentProject, currentFacility),
		getProductionActual(currentProject, currentFacility),
		getProductionEarned(currentProject, currentFacility),
	]).then(async () => {
		let dataPlanWeek = [];
		let dataActualWeek = [];
		let dataEarnedWeek = [];

		let minPlan = dataPlan.map((x) => x.FirstDate)[0];
		let minActual = dataActual.map((x) => x.FirstDate)[0];
		let minEarned = dataEarned.map((x) => x.FirstDate)[0];
		let _minDate = [minPlan, minActual].reduce((p, v) => (p < v ? p : v));

		for (let i = 1; i <= 300; i++) {
			let cDate = moment(minPlan)
				.add((i - 1) * 7, "days")
				.format("YYYY-MM-DD");
			if (dataPlan.every((x) => x["W_" + i] == null)) {
				dataPlanWeek[i - 1] = {
					[cDate]: null,
				};
			} else {
				dataPlanWeek[i - 1] = {
					[cDate]: dataPlan
						.map((x) =>
							!isNaN(parseFloat(x["W_" + i]))
								? Math.round(parseFloat(x["W_" + i]))
								: 0
						)
						.reduce((sum, y) => sum + y),
				};
			}

			let cDate2 = moment(minActual)
				.add((i - 1) * 7, "days")
				.format("YYYY-MM-DD");
			if (dataActual.every((x) => x["W_" + i] == null)) {
				dataActualWeek[i - 1] = {
					[cDate2]: null,
				};
			} else {
				dataActualWeek[i - 1] = {
					[cDate2]: dataActual
						.map((x) =>
							!isNaN(parseFloat(x["W_" + i])) ? parseFloat(x["W_" + i]) : 0
						)
						.reduce((sum, y) => sum + y),
				};
			}

			let cDate3 = moment(minEarned)
				.add((i - 1) * 7, "days")
				.format("YYYY-MM-DD");
			if (dataEarned.every((x) => x["W_" + i] == null)) {
				dataEarnedWeek[i - 1] = {
					[cDate3]: null,
				};
			} else {
				dataEarnedWeek[i - 1] = {
					[cDate3]: dataEarned
						.map((x) =>
							!isNaN(parseFloat(x["W_" + i]))
								? Math.round(parseFloat(x["W_" + i]))
								: 0
						)
						.reduce((sum, y) => sum + y),
				};
			}
		}

		let _maxPlan = dataPlanWeek
			.filter((x) => Object.values(x)[0] > 0)
			.slice(-1)[0];
		let maxPlan = Object.keys(_maxPlan)[0];
		let _maxActual = dataActualWeek
			.filter((x) => Object.values(x)[0] > 0)
			.slice(-1)[0];
		let maxActual = Object.keys(_maxActual)[0];
		let _maxDate = [maxPlan, maxActual].reduce((p, v) => (p > v ? p : v));
		let maxDate = Date.parse(_maxDate);
		let minDate = Date.parse(_minDate);
		let weekCount = Math.ceil((maxDate - minDate) / (7 * 24 * 3600 * 1000));

		let graphData = [];
		let graphData2 = [];

		let graphLabels = [];
		let graphPlan = [];
		let graphActual = [];
		let graphEarned = [];
		let graphCPI = [];
		let graphSPI = [];

		let planAccum = 0;
		let actualAccum = 0;
		let earnedAccum = 0;

		let prevEarned = 0;
		let prevPlan = 0;

		for (let i = 0; i < weekCount; i++) {
			let _refdate = moment(_minDate)
				.add(i * 7, "days")
				.format("YYYY-MM-DD");
			let _date = moment(_minDate)
				.add(i * 7, "days")
				.format("DD-MM-YYYY");
			graphLabels.push(_date);

			let _planFound = dataPlanWeek.filter(
				(x) => Object.keys(x)[0] == _refdate
			)[0];
			if (typeof _planFound != "undefined") {
				if (Object.values(_planFound)[0] == null) {
					planAccum = null;
				} else {
					planAccum +=
						Object.values(_planFound)[0] != 0
							? Object.values(_planFound)[0]
							: 0;
				}
			} else {
				planAccum = 0;
			}
			graphPlan.push(planAccum);

			let _actualFound = dataActualWeek.filter(
				(x) => Object.keys(x)[0] == _refdate
			)[0];
			if (typeof _actualFound != "undefined") {
				if (Object.values(_actualFound)[0] == null) {
					actualAccum = null;
				} else {
					actualAccum +=
						Object.values(_actualFound)[0] != 0
							? Object.values(_actualFound)[0]
							: 0;
				}
			} else {
				actualAccum = 0;
			}
			graphActual.push(actualAccum);

			let _earnedFound = dataEarnedWeek.filter(
				(x) => Object.keys(x)[0] == _refdate
			)[0];
			if (typeof _earnedFound != "undefined") {
				if (Object.values(_earnedFound)[0] == null) {
					earnedAccum = null;
				} else {
					earnedAccum =
						Object.values(_earnedFound)[0] != 0
							? Object.values(_earnedFound)[0]
							: prevEarned;
					prevEarned = earnedAccum;
				}
			} else {
				earnedAccum = 0;
			}
			graphEarned.push(earnedAccum);
		}

		graphData = [
			{
				"Plan MHRS": graphPlan,
			},
			{
				"Actual MHRS": graphActual,
			},
			{
				"Earned MHRS": graphEarned,
			},
		];

		for (let i = 0; i < graphActual.length; i++) {
			if (graphEarned[i] != null && graphEarned[i] != 0) {
				let _earned = graphEarned[i];
				let _actual = graphActual[i];
				let cpi = parseFloat((_earned / _actual).toFixed(2));
				// cpi = (cpi > 3 && cpi != Infinity) ? 1.5 : cpi;
				graphCPI.push(cpi);
			} else {
				graphCPI.push(null);
			}
		}

		for (let i = 0; i < graphPlan.length; i++) {
			if (graphEarned[i] != null && graphEarned[i] != 0) {
				let _earned = graphEarned[i];
				let _plan = graphPlan[i];
				let spi = parseFloat((_earned / _plan).toFixed(2));
				// spi = (spi > 3 && spi != Infinity) ? 1.5 : spi;
				graphSPI.push(spi);
			} else {
				graphSPI.push(null);
			}
		}

		graphData2 = [
			{
				CPI: graphCPI,
			},
			{
				SPI: graphSPI,
			},
		];

		let _current = moment().format("YYYY-MM-DD");
		let _currentWeek = Math.floor(
			(Date.parse(_current) - minDate) / (7 * 24 * 3600 * 1000)
		);

		let graphData3 = [];
		let graphForecast1 = [];
		let graphForecast2 = [];
		let graphForecast3 = [];
		let graphForecast4 = [];

		if (_currentWeek <= 1) {
			return;
		}

		let _Bac = graphPlan[graphPlan.length - 1];
		let _Av1 = (_Av2 = _Av3 = _Av4 = graphActual[_currentWeek]);
		let _Pv1 = graphPlan[_currentWeek - 1];
		let _Pv = graphPlan[_currentWeek];
		let _Ev = graphEarned[_currentWeek];
		let _Cpi = (_Ev * 100) / _Av1 / 100;
		let _Spi = (_Ev * 100) / _Pv / 100;

		let _Etc1 = _Bac - _Ev;
		let _Etc2 = (_Bac - _Ev) / _Cpi;
		let _Etc3 = (_Bac - _Ev) / (_Cpi * _Spi);

		for (let i = 0; i < _currentWeek; i++) {
			graphForecast1.push(null);
			graphForecast2.push(null);
			graphForecast3.push(null);
			// graphForecast4.push(null);
		}

		for (let i = _currentWeek; i < weekCount; i++) {
			graphForecast1.push(_Av1);
			graphForecast2.push(_Av2);
			graphForecast3.push(_Av3);

			_Av1 += Math.floor(
				((graphPlan[i + 1] - graphPlan[i]) * _Etc1) / (_Bac - _Pv)
			);
			_Av2 += Math.floor(
				((graphPlan[i + 1] - graphPlan[i]) * _Etc2) / (_Bac - _Pv)
			);
			_Av3 += Math.floor(
				((graphPlan[i + 1] - graphPlan[i]) * _Etc3) / (_Bac - _Pv)
			);
		}

		graphData3 = [
			{
				"ETC-1": graphForecast1,
			},
			{
				"ETC-2": graphForecast2,
			},
			{
				"ETC-3": graphForecast3,
			},
		];

		graphProductivity(
			"productivity-general",
			graphLabels,
			graphData,
			graphData2,
			graphData3
		);
	});

	const graphElements = ["calendarmap", "productivity-general"];
	graphElements.forEach((el) => {
		showLoading(el);
	});
};

//#endregion

//#region Level2
const showProductivityLevel2 = (_project, _facility, _discipline) => {
	Promise.all([
		getProductionPlan(_project, _facility, _discipline),
		getProductionActual(_project, _facility, _discipline),
		getProductionEarned(_project, _facility, _discipline),
	]).then(async () => {
		//// console.log(dataPlan);
		//// console.log(dataActual);
		//// console.log(dataEarned);
		try {
			$("#productivity-level2~.graph-err").remove();

			let dataPlanWeek = [];
			let dataActualWeek = [];
			let dataEarnedWeek = [];

			let minPlan = dataPlan.map((x) => x.FirstDate)[0];
			let minActual = dataActual.map((x) => x.FirstDate)[0];
			let minEarned = dataEarned.map((x) => x.FirstDate)[0];
			let _minDate = [minPlan, minActual].reduce((p, v) => (p < v ? p : v));

			for (let i = 1; i <= 300; i++) {
				let cDate = moment(minPlan)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataPlan.every((x) => x["W_" + i] == null)) {
					dataPlanWeek[i - 1] = {
						[cDate]: null,
					};
				} else {
					dataPlanWeek[i - 1] = {
						[cDate]: dataPlan
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i]))
									? Math.round(parseFloat(x["W_" + i]))
									: 0
							)
							.reduce((sum, y) => sum + y),
					};
				}

				let cDate2 = moment(minActual)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataActual.every((x) => x["W_" + i] == null)) {
					dataActualWeek[i - 1] = {
						[cDate2]: null,
					};
				} else {
					dataActualWeek[i - 1] = {
						[cDate2]: dataActual
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i])) ? parseFloat(x["W_" + i]) : 0
							)
							.reduce((sum, y) => sum + y),
					};
				}

				let cDate3 = moment(minEarned)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataEarned.every((x) => x["W_" + i] == null)) {
					dataEarnedWeek[i - 1] = {
						[cDate3]: null,
					};
				} else {
					dataEarnedWeek[i - 1] = {
						[cDate3]: dataEarned
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i]))
									? Math.round(parseFloat(x["W_" + i]))
									: 0
							)
							.reduce((sum, y) => sum + y),
					};
				}
			}

			let _maxPlan = dataPlanWeek
				.filter((x) => Object.values(x)[0] > 0)
				.slice(-1)[0];
			let maxPlan = Object.keys(_maxPlan)[0];
			let _maxActual = dataActualWeek
				.filter((x) => Object.values(x)[0] > 0)
				.slice(-1)[0];
			let maxActual = Object.keys(_maxActual)[0];
			let _maxDate = [maxPlan, maxActual].reduce((p, v) => (p > v ? p : v));
			let maxDate = Date.parse(_maxDate);
			let minDate = Date.parse(_minDate);
			let weekCount = Math.ceil((maxDate - minDate) / (7 * 24 * 3600 * 1000));

			let graphData = [];
			let graphData2 = [];

			let graphLabels = [];
			let graphPlan = [];
			let graphActual = [];
			let graphEarned = [];
			let graphCPI = [];
			let graphSPI = [];

			let planAccum = 0;
			let actualAccum = 0;
			let earnedAccum = 0;

			let prevEarned = 0;
			let prevPlan = 0;

			for (let i = 0; i < weekCount; i++) {
				let _refdate = moment(_minDate)
					.add(i * 7, "days")
					.format("YYYY-MM-DD");
				let _date = moment(_minDate)
					.add(i * 7, "days")
					.format("DD-MM-YYYY");
				graphLabels.push(_date);

				let _planFound = dataPlanWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _planFound != "undefined") {
					if (Object.values(_planFound)[0] == null) {
						planAccum = null;
					} else {
						planAccum +=
							Object.values(_planFound)[0] != 0
								? Object.values(_planFound)[0]
								: 0;
					}
				} else {
					planAccum = 0;
				}
				graphPlan.push(planAccum);

				let _actualFound = dataActualWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _actualFound != "undefined") {
					if (Object.values(_actualFound)[0] == null) {
						actualAccum = null;
					} else {
						actualAccum +=
							Object.values(_actualFound)[0] != 0
								? Object.values(_actualFound)[0]
								: 0;
					}
				} else {
					actualAccum = 0;
				}
				graphActual.push(actualAccum);

				let _earnedFound = dataEarnedWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _earnedFound != "undefined") {
					if (Object.values(_earnedFound)[0] == null) {
						earnedAccum = null;
					} else {
						earnedAccum =
							Object.values(_earnedFound)[0] != 0
								? Object.values(_earnedFound)[0]
								: prevEarned;
						prevEarned = earnedAccum;
					}
				} else {
					earnedAccum = 0;
				}
				graphEarned.push(earnedAccum);
			}

			graphData = [
				{
					"Plan MHRS": graphPlan,
				},
				{
					"Actual MHRS": graphActual,
				},
				{
					"Earned MHRS": graphEarned,
				},
			];

			for (let i = 0; i < graphActual.length; i++) {
				if (graphEarned[i] != null && graphEarned[i] != 0) {
					let _earned = graphEarned[i];
					let _actual = graphActual[i];
					let cpi = parseFloat((_earned / _actual).toFixed(2));
					// cpi = (cpi > 3 && cpi != Infinity) ? 1.5 : cpi;
					graphCPI.push(cpi);
				} else {
					graphCPI.push(null);
				}
			}

			for (let i = 0; i < graphPlan.length; i++) {
				if (graphEarned[i] != null && graphEarned[i] != 0) {
					let _earned = graphEarned[i];
					let _plan = graphPlan[i];
					let spi = parseFloat((_earned / _plan).toFixed(2));
					// console.log(spi);
					// spi = (spi > 3 && spi != Infinity) ? 1.5 : spi;
					graphSPI.push(spi);
				} else {
					graphSPI.push(null);
				}
			}

			graphData2 = [
				{
					CPI: graphCPI,
				},
				{
					SPI: graphSPI,
				},
			];

			let _current = moment().format("YYYY-MM-DD");
			let _currentWeek = Math.floor(
				(Date.parse(_current) - minDate) / (7 * 24 * 3600 * 1000)
			);

			let graphData3 = [];
			let graphForecast1 = [];
			let graphForecast2 = [];
			let graphForecast3 = [];
			let graphForecast4 = [];

			if (_currentWeek <= 1) {
				return;
			}

			let _Bac = graphPlan[graphPlan.length - 1];
			let _Av1 = (_Av2 = _Av3 = _Av4 = graphActual[_currentWeek]);
			let _Pv1 = graphPlan[_currentWeek - 1];
			let _Pv = graphPlan[_currentWeek];
			let _Ev = graphEarned[_currentWeek];
			let _Cpi = (_Ev * 100) / _Av1 / 100;
			let _Spi = (_Ev * 100) / _Pv / 100;

			let _Etc1 = _Bac - _Ev;
			let _Etc2 = (_Bac - _Ev) / _Cpi;
			let _Etc3 = (_Bac - _Ev) / (_Cpi * _Spi);

			for (let i = 0; i < _currentWeek; i++) {
				graphForecast1.push(null);
				graphForecast2.push(null);
				graphForecast3.push(null);
				// graphForecast4.push(null);
			}

			for (let i = _currentWeek; i < weekCount; i++) {
				graphForecast1.push(_Av1);
				graphForecast2.push(_Av2);
				graphForecast3.push(_Av3);

				_Av1 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc1) / (_Bac - _Pv)
				);
				_Av2 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc2) / (_Bac - _Pv)
				);
				_Av3 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc3) / (_Bac - _Pv)
				);
			}

			graphData3 = [
				{
					"ETC-1": graphForecast1,
				},
				{
					"ETC-2": graphForecast2,
				},
				{
					"ETC-3": graphForecast3,
				},
			];

			graphProductivity(
				"productivity-level2",
				graphLabels,
				graphData,
				graphData2,
				graphData3
			);
		} catch (err) {
			//// console.log(err);
			$("#productivity-level2~.graph-err").remove();
			$("#productivity-level2").after(
				'<div class="graph-err">Failed to load data</div>'
			);
		}
	});
};

const showHeatmapLevel2 = (_project, _facility, _disipline) => {
	exec_sp_Heatmap(_project, _facility, _disipline).then(async () => {
		try {
			$("#calendarmap~.graph-err").remove();
			let heatmapGraphdata = [];

			//// console.log(heatmapData);

			years = [...new Set(heatmapData.map((x) => x["Date"].substring(0, 4)))];

			years.forEach((year) => {
				let _graphdata = heatmapData
					.filter((x) => x["Date"].substring(0, 4) == year)
					.map((x) => {
						return [x["Date"].toString(), parseFloat(x["Workforce"])];
					});
				heatmapGraphdata.push(_graphdata);
			});
			let _maxRange = heatmapData
				.map((x) => parseFloat(x["Workforce"]))
				.reduce((max, y) => (max > y ? max : y));

			maxRange = (Math.round(_maxRange / 100) + 1) * 100;
			graphHeatmap("calendarmap", years, heatmapGraphdata, maxRange);
		} catch (err) {
			//// console.log(err);
			$("#calendarmap~.graph-err").remove();
			$("#calendarmap").after(
				'<div class="graph-err">Failed to load data</div>'
			);
		}
	});
};

const ProductionLevel2 = async () => {
	Promise.all([
		loadLevel2_Original(currentProject, currentFacility),
		// loadLevel2(currentProject, currentFacility)
	])
		.then(async () => {
			dataLevel2Cooked = dataLevel2
				.map((disc) => {
					return {
						DisciplineCode: disc["DisciplineCode"],
						NormIDLevel2: disc["NormIDLevel2"],
						MainActivities: disc["MainActivities"],
						BaseBudgetMHRS: parseFloat(disc["BaseBudgetMHRS"]),
						ActualMHRS: parseFloat(disc["ActualMHRS"]),
						ActualMHRS_OT: parseFloat(disc["ActualMHRS_OT"]),
						ActualMHRS_WithoutOT: parseFloat(disc["ActualMHRS_WithoutOT"]),
						ActualMHRS_Sunday: parseFloat(disc["ActualMHRS_Sunday"]),
						ActualMHRS_Holiday: parseFloat(disc["ActualMHRS_Holiday"]),
						EarnedMHRS: parseFloat(disc["EarnedMHRS"]),
						VarMHRS: parseFloat(disc["VarMHRS"]),
						WasteMHRS: parseFloat(disc["WasteMHRS"]),
						ActualProgress: parseFloat(disc["ActualProgress"]),
						CPI:
							parseFloat(disc["EarnedMHRS"]) / parseFloat(disc["ActualMHRS"]),
					};
				})
				.sort((x, y) => {
					if (x["BaseBudgetMHRS"] > y["BaseBudgetMHRS"]) {
						return -1;
					} else {
						return 1;
					}
					return 0;
				});

			dataLevel2Cooked.forEach((disc) => {
				allDisciplines.push(disc["DisciplineCode"]);
				$(`#${disc["DisciplineCode"].toLowerCase()}`).text(
					disc["CPI"].toFixed(2)
				);

				$(`#${disc["DisciplineCode"].toLowerCase()}`)
					.parents()
					.eq(2)
					.css("display", "block");
			});

			allDisciplines.forEach((disc) => {
				$(".chart-selection .selection").append(
					`<li class="select-item">${disc}</li>`
				);
			});

			$(".chart-selection .selection .select-item").first().addClass("active");
			activeDiscipline = $(
				".chart-selection .selection .select-item.active"
			).text();

			$(".chart-selection .selection .select-item").on(
				"click",
				async function () {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					activeDiscipline = $(this).text();

					await showProductivityLevel2(
						currentProject,
						currentFacility,
						activeDiscipline
					);
					await showHeatmapLevel2(
						currentProject,
						currentFacility,
						activeDiscipline
					);
				}
			);
		})
		.then(async () => {
			await graphBudgetLevel2("#bar-chart-budget", dataLevel2Cooked);
			await graphDisciplinesLevel2("pie-chart-disciplines", dataLevel2Cooked);
			await tableLevel2("#table", dataLevel2Cooked);
			await graphSunburstLevel2("sunburst-chart", dataLevel2Cooked);
		})
		.then(async () => {
			await showProductivityLevel2(
				currentProject,
				currentFacility,
				activeDiscipline
			);
			await showHeatmapLevel2(
				currentProject,
				currentFacility,
				activeDiscipline
			);
		});

	const graphElements = ["calendarmap", "productivity-level2"];
	graphElements.forEach((el) => {
		showLoading(el);
	});
};

//#endregion

//#region Level3
const showProductivityLevel3 = (
	_project,
	_facility,
	_discipline,
	_activity
) => {
	Promise.all([
		getProductionPlan(_project, _facility, _discipline, _activity),
		getProductionActual(_project, _facility, _discipline, _activity),
		getProductionEarned(_project, _facility, _discipline, _activity),
	]).then(async () => {
		//console.log(dataPlan);
		//console.log(dataActual);
		//console.log(dataEarned);
		try {
			$("#productivity-level3~.graph-err").remove();
			let dataPlanWeek = [];
			let dataActualWeek = [];
			let dataEarnedWeek = [];

			let minPlan = dataPlan.map((x) => x.FirstDate)[0];
			let minActual = dataActual.map((x) => x.FirstDate)[0];
			let minEarned = dataEarned.map((x) => x.FirstDate)[0];
			let _minDate = [minPlan, minActual].reduce((p, v) => (p < v ? p : v));

			for (let i = 1; i <= 300; i++) {
				let cDate = moment(minPlan)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataPlan.every((x) => x["W_" + i] == null)) {
					dataPlanWeek[i - 1] = {
						[cDate]: null,
					};
				} else {
					dataPlanWeek[i - 1] = {
						[cDate]: dataPlan
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i]))
									? Math.round(parseFloat(x["W_" + i]))
									: 0
							)
							.reduce((sum, y) => sum + y),
					};
				}

				let cDate2 = moment(minActual)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataActual.every((x) => x["W_" + i] == null)) {
					dataActualWeek[i - 1] = {
						[cDate2]: null,
					};
				} else {
					dataActualWeek[i - 1] = {
						[cDate2]: dataActual
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i])) ? parseFloat(x["W_" + i]) : 0
							)
							.reduce((sum, y) => sum + y),
					};
				}

				let cDate3 = moment(minEarned)
					.add((i - 1) * 7, "days")
					.format("YYYY-MM-DD");
				if (dataEarned.every((x) => x["W_" + i] == null)) {
					dataEarnedWeek[i - 1] = {
						[cDate3]: null,
					};
				} else {
					dataEarnedWeek[i - 1] = {
						[cDate3]: dataEarned
							.map((x) =>
								!isNaN(parseFloat(x["W_" + i]))
									? Math.round(parseFloat(x["W_" + i]))
									: 0
							)
							.reduce((sum, y) => sum + y),
					};
				}
			}

			let _maxPlan = dataPlanWeek
				.filter((x) => Object.values(x)[0] > 0)
				.slice(-1)[0];
			let maxPlan = Object.keys(_maxPlan)[0];
			let _maxActual = dataActualWeek
				.filter((x) => Object.values(x)[0] > 0)
				.slice(-1)[0];
			let maxActual = Object.keys(_maxActual)[0];
			let _maxDate = [maxPlan, maxActual].reduce((p, v) => (p > v ? p : v));
			let maxDate = Date.parse(_maxDate);
			let minDate = Date.parse(_minDate);
			let weekCount = Math.ceil((maxDate - minDate) / (7 * 24 * 3600 * 1000));

			let graphData = [];
			let graphData2 = [];

			let graphLabels = [];
			let graphPlan = [];
			let graphActual = [];
			let graphEarned = [];
			let graphCPI = [];
			let graphSPI = [];

			let planAccum = 0;
			let actualAccum = 0;
			let earnedAccum = 0;

			let prevEarned = 0;
			let prevPlan = 0;

			for (let i = 0; i < weekCount; i++) {
				let _refdate = moment(_minDate)
					.add(i * 7, "days")
					.format("YYYY-MM-DD");
				let _date = moment(_minDate)
					.add(i * 7, "days")
					.format("DD-MM-YYYY");
				graphLabels.push(_date);

				let _planFound = dataPlanWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _planFound != "undefined") {
					if (Object.values(_planFound)[0] == null) {
						planAccum = null;
					} else {
						planAccum +=
							Object.values(_planFound)[0] != 0
								? Object.values(_planFound)[0]
								: 0;
					}
				} else {
					planAccum = 0;
				}
				graphPlan.push(planAccum);

				let _actualFound = dataActualWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _actualFound != "undefined") {
					if (Object.values(_actualFound)[0] == null) {
						actualAccum = null;
					} else {
						actualAccum +=
							Object.values(_actualFound)[0] != 0
								? Object.values(_actualFound)[0]
								: 0;
					}
				} else {
					actualAccum = 0;
				}
				graphActual.push(actualAccum);

				let _earnedFound = dataEarnedWeek.filter(
					(x) => Object.keys(x)[0] == _refdate
				)[0];
				if (typeof _earnedFound != "undefined") {
					if (Object.values(_earnedFound)[0] == null) {
						earnedAccum = null;
					} else {
						earnedAccum =
							Object.values(_earnedFound)[0] != 0
								? Object.values(_earnedFound)[0]
								: prevEarned;
						prevEarned = earnedAccum;
					}
				} else {
					earnedAccum = 0;
				}
				graphEarned.push(earnedAccum);
			}

			graphData = [
				{
					"Plan MHRS": graphPlan,
				},
				{
					"Actual MHRS": graphActual,
				},
				{
					"Earned MHRS": graphEarned,
				},
			];

			for (let i = 0; i < graphActual.length; i++) {
				if (graphEarned[i] != null && graphEarned[i] != 0) {
					let _earned = graphEarned[i];
					let _actual = graphActual[i];
					let cpi = parseFloat((_earned / _actual).toFixed(2));
					// cpi = (cpi > 3 && cpi != Infinity) ? 1.5 : cpi;
					graphCPI.push(cpi);
				} else {
					graphCPI.push(null);
				}
			}

			for (let i = 0; i < graphPlan.length; i++) {
				if (graphEarned[i] != null && graphEarned[i] != 0) {
					let _earned = graphEarned[i];
					let _plan = graphPlan[i];
					let spi = parseFloat((_earned / _plan).toFixed(2));
					// spi = (spi > 3 && spi != Infinity) ? 1.5 : spi;
					graphSPI.push(spi);
				} else {
					graphSPI.push(null);
				}
			}

			graphData2 = [
				{
					CPI: graphCPI,
				},
				{
					SPI: graphSPI,
				},
			];

			let _current = moment().format("YYYY-MM-DD");
			let _currentWeek = Math.floor(
				(Date.parse(_current) - minDate) / (7 * 24 * 3600 * 1000)
			);

			let graphData3 = [];
			let graphForecast1 = [];
			let graphForecast2 = [];
			let graphForecast3 = [];
			let graphForecast4 = [];

			if (_currentWeek <= 1) {
				return;
			}

			let _Bac = graphPlan[graphPlan.length - 1];
			let _Av1 = (_Av2 = _Av3 = _Av4 = graphActual[_currentWeek]);
			let _Pv1 = graphPlan[_currentWeek - 1];
			let _Pv = graphPlan[_currentWeek];
			let _Ev = graphEarned[_currentWeek];
			let _Cpi = (_Ev * 100) / _Av1 / 100;
			let _Spi = (_Ev * 100) / _Pv / 100;

			let _Etc1 = _Bac - _Ev;
			let _Etc2 = (_Bac - _Ev) / _Cpi;
			let _Etc3 = (_Bac - _Ev) / (_Cpi * _Spi);

			for (let i = 0; i < _currentWeek; i++) {
				graphForecast1.push(null);
				graphForecast2.push(null);
				graphForecast3.push(null);
				// graphForecast4.push(null);
			}

			for (let i = _currentWeek; i < weekCount; i++) {
				graphForecast1.push(_Av1);
				graphForecast2.push(_Av2);
				graphForecast3.push(_Av3);

				_Av1 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc1) / (_Bac - _Pv)
				);
				_Av2 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc2) / (_Bac - _Pv)
				);
				_Av3 += Math.floor(
					((graphPlan[i + 1] - graphPlan[i]) * _Etc3) / (_Bac - _Pv)
				);
			}

			graphData3 = [
				{
					"ETC-1": graphForecast1,
				},
				{
					"ETC-2": graphForecast2,
				},
				{
					"ETC-3": graphForecast3,
				},
			];

			graphProductivity(
				"productivity-level3",
				graphLabels,
				graphData,
				graphData2,
				graphData3
			);
		} catch (err) {
			//console.log(err);
			$("#productivity-level3~.graph-err").remove();
			$("#productivity-level3").after(
				'<div class="graph-err">Failed to load data</div>'
			);
		}
	});
};

const showHeatmapLevel3 = (_project, _facility, _disipline, _budgetId) => {
	exec_sp_Heatmap(_project, _facility, _disipline, _budgetId).then(async () => {
		try {
			$("#calendarmap~.graph-err").remove();
			let heatmapGraphdata = [];

			years = [...new Set(heatmapData.map((x) => x["Date"].substring(0, 4)))];

			years.forEach((year) => {
				let _graphdata = heatmapData
					.filter((x) => x["Date"].substring(0, 4) == year)
					.map((x) => {
						return [x["Date"].toString(), parseFloat(x["Workforce"])];
					});
				heatmapGraphdata.push(_graphdata);
			});
			let _maxRange = heatmapData
				.map((x) => parseFloat(x["Workforce"]))
				.reduce((max, y) => (max > y ? max : y));

			maxRange = (Math.round(_maxRange / 100) + 1) * 100;
			graphHeatmap("calendarmap", years, heatmapGraphdata, maxRange);
		} catch (err) {
			//console.log(err);
			$("#calendarmap~.graph-err").remove();
			$("#calendarmap").after(
				'<div class="graph-err">Failed to load data</div>'
			);
		}
	});
};

const ProductionLevel3 = async () => {
	Promise.all([loadLevel4_Original(currentProject, currentFacility)])
		.then(async () => {
			// console.log(dataLevel3)
			dataLevel3Cooked = dataLevel3.map((disc) => {
				return {
					DisciplineCode: disc["DisciplineCode"],
					NormIDLevel2: disc["NormIDLevel2"],
					NormIDLevel3: disc["NormIDLevel3"],
					// "NormIDLevel4": disc["NormIDLevel4"],
					MainActivities: disc["MainActivities"],
					BudgetLevel3: parseFloat(disc["BudgetLevel3"]),
					NormIDLevel4: disc["NormIDLevel4"],
					ConstructionID: disc["ConstructionID"],
					ConstructionName: disc["ConstructionName"],
					BudgetConstructionID: parseFloat(disc["BudgetConstructionID"]),

					ActualMHRS: parseFloat(disc["ActualMHRS"]),
					ActualMHRS_OT: parseFloat(disc["ActualMHRS_OT"]),
					ActualMHRS_WithoutOT: parseFloat(disc["ActualMHRS_WithoutOT"]),
					ActualMHRS_Sunday: parseFloat(disc["ActualMHRS_Sunday"]),
					ActualMHRS_Holiday: parseFloat(disc["ActualMHRS_Holiday"]),
					EarnedMHRS: parseFloat(disc["EarnedMHRS"]),
					VarMHRS: parseFloat(disc["VarMHRS"]),
					WasteMHRS: parseFloat(disc["WasteMHRS"]),
					ActualProgress: parseFloat(disc["ActualProgress"]),
					CPI:
						parseFloat(disc["ActualMHRS"]) != 0
							? parseFloat(disc["EarnedMHRS"]) / parseFloat(disc["ActualMHRS"])
							: 0,
				};
			});
		})
		.then(async () => {
			//console.log(dataLevel3)
			allDisciplines = dataLevel3.map((x) => x["DisciplineCode"]).distinct();
			allActivities = allDisciplines.map((disc) => {
				let _activityId = dataLevel3
					.filter((x) => x["DisciplineCode"] == disc)
					.map((x) => x.NormIDLevel3)
					.distinct()
					.map((x) => {
						return {
							ActivityID: x,
							Description: dataLevel3.filter((z) => z["NormIDLevel3"] == x)[0][
								"MainActivities"
							],
						};
					});
				return {
					[disc]: _activityId,
				};
			});

			console.log(allActivities);

			allDisciplines.forEach((disc) => {
				$(".chart-selection .select-discipline").append(
					`<li class="select-item">${disc}</li>`
				);
			});
			$(".chart-selection .select-discipline .select-item")
				.first()
				.addClass("active");
			activeDiscipline = $(
				".chart-selection .select-discipline .select-item.active"
			).text();

			let _selectedActivity = allActivities.filter(
				(x) => Object.keys(x)[0] == activeDiscipline
			)[0];

			_selectedActivity[activeDiscipline].forEach((x) => {
				$(".chart-selection .select-activity").append(
					`<li class="select-item" select-data=${x["ActivityID"]}>${x["ActivityID"]} - ${x["Description"]}</li>`
				);
			});
			$(".chart-selection .select-activity .select-item")
				.first()
				.addClass("active");
			activeActivity = $(
				".chart-selection .select-activity .select-item.active"
			)
				.attr("select-data")
				.trim();

			$(".chart-selection .select-discipline .select-item").on(
				"click",
				function () {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					activeDiscipline = $(this).text();

					_selectedActivity = allActivities.filter(
						(x) => Object.keys(x)[0] == activeDiscipline
					)[0];

					$(".chart-selection .select-activity").html("");

					_selectedActivity[activeDiscipline].forEach((x) => {
						$(".chart-selection .select-activity").append(
							`<li class="select-item" select-data=${x["ActivityID"]}>${x["ActivityID"]} - ${x["Description"]}</li>`
						);
					});

					$(".chart-selection .select-activity .select-item")
						.first()
						.addClass("active");
					activeActivity = $(
						".chart-selection .select-activity .select-item.active"
					)
						.attr("select-data")
						.trim();

					$(".chart-selection .select-activity .select-item").on(
						"click",
						async function () {
							$(this).addClass("active");
							$(this).siblings().removeClass("active");
							activeActivity = $(this).attr("select-data").trim();
							await showProductivityLevel3(
								currentProject,
								currentFacility,
								activeDiscipline,
								activeActivity
							);
							await showHeatmapLevel3(
								currentProject,
								currentFacility,
								activeDiscipline,
								activeActivity
							);
							await tableLevel3(
								"#table",
								dataLevel3Cooked.filter(
									(x) => x["NormIDLevel3"] == activeActivity
								)
							);
						}
					);
				}
			);

			$(".chart-selection .select-activity .select-item").on(
				"click",
				async function () {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					activeActivity = $(this).attr("select-data").trim();
					await showProductivityLevel3(
						currentProject,
						currentFacility,
						activeDiscipline,
						activeActivity
					);
					await showHeatmapLevel3(
						currentProject,
						currentFacility,
						activeDiscipline,
						activeActivity
					);
					await tableLevel3(
						"#table",
						dataLevel3Cooked.filter((x) => x["NormIDLevel3"] == activeActivity)
					);
				}
			);
		})
		.then(async () => {
			await showProductivityLevel3(
				currentProject,
				currentFacility,
				activeDiscipline,
				activeActivity
			);
			await showHeatmapLevel3(
				currentProject,
				currentFacility,
				activeDiscipline,
				activeActivity
			);
			console.log(dataLevel3Cooked);
			await tableLevel3(
				"#table",
				dataLevel3Cooked.filter((x) => x["NormIDLevel3"] == activeActivity)
			);
		});

	const graphElements = ["productivity-level3"];
	graphElements.forEach((el) => {
		showLoading(el);
	});
};

//#endregion

//#region Manpoer Histogram
const loadHistogramManpower = async (_project, _facility) => {
	await exec_sp_Workforces_Manpower(_project, _facility);
};

const cookGraphData = async (dataWorkForces, period, keyColumn) => {
	let dataWorkforce = [];
	workforceTypes = dataWorkForces
		.filter((x) => x["TitleType"] != null)
		.map((x) => `${x["DepartmentCode"]}-${x["TitleType"]}`)
		.distinct()
		.map((x) => {
			let type = x.split("-");
			return {
				DepartmentCode: type[0],
				TitleType: type[1],
			};
		});

	let minDate = dataWorkForces
		.map((x) => x["Date"])
		.reduce((min, x) => {
			let _date = Date.parse(x);
			if (min < x) return min;
			else return x;
		});

	let lastDate = dataWorkForces
		.map((x) => x["Date"])
		.reduce((max, x) => {
			let _date = Date.parse(x);
			if (max > x) return max;
			else return x;
		});

	let duration =
		moment.duration(moment(lastDate).diff(moment(minDate))).asDays() + 1;
	switch (period) {
		case "daily":
			dataWorkforce = workforceTypes.map((type) => {
				let dataEachType = dataWorkForces.filter(
					(x) =>
						x["DepartmentCode"] == type["DepartmentCode"] &&
						x["TitleType"] == type["TitleType"]
				);

				let _dataDay = [];

				for (let i = 0; i < duration; i++) {
					let today = moment(minDate).add(i, "days");
					let prevday = moment(minDate).add(i - 1, "days");
					_eachDay = dataEachType.filter((w) => {
						let _date = moment(w["Date"]);

						if (
							moment.duration(_date.diff(prevday)).asDays() > 0 &&
							moment.duration(_date.diff(today)).asDays() <= 0
						) {
							return true;
						}
					});

					if (keyColumn == "ActualMHRS") {
						_eachDay = _eachDay
							.map((w) => (w[keyColumn] ? parseFloat(w[keyColumn]) : 0))
							.reduce((sum, w) => sum + w, 0);
					} else {
						_eachDay = _eachDay
							.map((w) => (w[keyColumn] ? w[keyColumn] : 0))
							.reduce((max, w) => (max > w ? max : w), 0);
					}

					_dataDay.push(_eachDay);
				}

				return {
					DepartmentCode: type["DepartmentCode"],
					TitleType: type["TitleType"],
					FirstDate: minDate,
					data: _dataDay,
				};
			});

			break;
		case "monthly":
			minDate = moment(minDate)
				.add(-new Date(minDate).getDate() + 1, "days")
				.format("YYYY-MM-DD");

			// firstDate = minDate
			let months = moment
				.duration(moment(lastDate).diff(moment(minDate)))
				.asMonths();
			months = Math.ceil(months);

			dataWorkforce = workforceTypes.map((type) => {
				let dataEachType = dataWorkForces.filter(
					(x) =>
						x["DepartmentCode"] == type["DepartmentCode"] &&
						x["TitleType"] == type["TitleType"]
				);

				let _dataMonth = [];
				for (let i = 0; i < months; i++) {
					let thisMonth = moment(minDate).add(i + 1, "month");
					let prevMonth = moment(minDate).add(i, "month");

					_eachMonth = dataEachType.filter((w) => {
						let _date = moment(w["Date"]);

						if (
							moment.duration(_date.diff(prevMonth)).asDays() > 0 &&
							moment.duration(_date.diff(thisMonth)).asDays() <= 0
						) {
							return true;
						}
					});
					let _count = _eachMonth.length;

					if (keyColumn == "ActualMHRS") {
						_eachMonth = _eachMonth
							.map((w) => (w[keyColumn] ? parseFloat(w[keyColumn]) : 0))
							.reduce((sum, w) => sum + w, 0);
					} else {
						_eachMonth = _eachMonth
							.map((w) => (w[keyColumn] ? w[keyColumn] : 0))
							.reduce((sum, w) => sum + w, 0);

						_eachMonth = Math.ceil(_eachMonth / _count);
					}

					_dataMonth.push(_eachMonth);
				}

				return {
					DepartmentCode: type["DepartmentCode"],
					TitleType: type["TitleType"],
					FirstDate: minDate,
					data: _dataMonth,
				};
			});
			break;
		case "weekly":
			let weeks =
				new Date(minDate).getDay() == 5
					? Math.ceil(duration / 7) + 1
					: Math.ceil(duration / 7);

			minDate = moment(minDate)
				.add(-new Date(minDate).getDay(), "days")
				.add(5, "days") // Find the Friday
				.format("YYYY-MM-DD");

			// firstDate = minDate

			dataWorkforce = workforceTypes.map((type) => {
				let dataEachType = dataWorkForces.filter(
					(x) =>
						x["DepartmentCode"] == type["DepartmentCode"] &&
						x["TitleType"] == type["TitleType"]
				);

				let _dataWeek = [];
				for (let i = 0; i < weeks; i++) {
					let thisWeek = moment(minDate).add(i * 7, "days");
					let prevWeek = moment(minDate).add(i * 7 - 7, "days");

					_eachWeek = dataEachType.filter((w) => {
						let _date = moment(w["Date"]);

						if (
							moment.duration(_date.diff(prevWeek)).asDays() > 0 &&
							moment.duration(_date.diff(thisWeek)).asDays() <= 0
						) {
							return true;
						}
					});
					let _count = _eachWeek.length;

					if (keyColumn == "ActualMHRS") {
						_eachWeek = _eachWeek
							.map((w) => (w[keyColumn] ? parseFloat(w[keyColumn]) : 0))
							.reduce((sum, w) => sum + w, 0);
					} else {
						_eachWeek = _eachWeek
							.map((w) => (w[keyColumn] ? w[keyColumn] : 0))
							.reduce((sum, w) => sum + w, 0);
						_eachWeek = Math.ceil(_eachWeek / _count);
					}

					_dataWeek.push(_eachWeek);
				}

				return {
					DepartmentCode: type["DepartmentCode"],
					TitleType: type["TitleType"],
					FirstDate: minDate,
					data: _dataWeek,
				};
			});
			break;

		default:
			break;
	}

	return dataWorkforce;
};

const setActivePeriod = (period) => {
	$(".select-month-week-day.manpower").children().removeClass("active");

	switch (period) {
		case "weekly":
			$(".select-month-week-day.manpower .select-week").addClass("active");
			break;
		case "monthly":
			$(".select-month-week-day.manpower .select-month").addClass("active");
			break;
		case "daily":
			$(".select-month-week-day.manpower .select-day").addClass("active");
			break;
	}
};

const refreshManpowerHistogram2 = async () => {
	dataWorkforceManpower = await cookGraphData(dataManpower, period, "Workers");
	await graphWorkforcesHistogram(
		"manpower-histogram",
		dataWorkforceManpower,
		period
	);
};

const ManpowerHistogram = async () => {
	const graphElements = [
        // 'manhour-histogram',
        'manpower-histogram'
    ]
        graphElements.forEach(el => {
            showLoading(el)
        })

        Promise.all([
            loadHistogramManpower(currentProject, currentFacility),
            // loadHistogramManhours(currentProject, currentFacility)
        ]).then(async () => {
            Promise.all([
                // refreshManhourHistogram(),
                refreshManpowerHistogram2()
            ])
        }).then(() => {
            $('.select-month-week-day.manhour .select-month, .select-month-week-day.manpower .select-month')
                .on('click', async function(e) {
                    period = 'monthly'

                    setActivePeriod(period)
                    graphElements.forEach(el => {
                        showLoading(el)
                    });

                    setTimeout(() => {
                        Promise.all([
                            // refreshManhourHistogram(),
                            refreshManpowerHistogram2()
                        ])
                    }, 200);

                })

            $('.select-month-week-day.manpower .select-week')
                .on('click', async function(e) {
                    period = 'weekly'

                    setActivePeriod(period)
                    graphElements.forEach(el => {
                        showLoading(el)
                    });

                    setTimeout(() => {
                        Promise.all([
                            // refreshManhourHistogram(),
                            refreshManpowerHistogram2()
                        ])
                    }, 200);

                })

            $('.select-month-week-day.manpower .select-day').on('click', async function(e) {
                period = 'daily'

                setActivePeriod(period)
                graphElements.forEach(el => {
                    showLoading(el)
                });

                setTimeout(() => {
                    Promise.all([
                        // refreshManhourHistogram(),
                        refreshManpowerHistogram2()
                    ])
                }, 200);
            })
        })
}

//#endregion

//#region WorkOrder Data
const refreshTable = async () => {
	await exec_sp_ListWO(currentProject, currentFacility, currentDept, currentDisc,
		currentStatus, from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD')
	).then(async () => {
		await tableListWO('#tableListWO', dataListWO)
	})
}

const WorkOrderData = async () => {
	$('#daterange').daterangepicker({
		startDate: from,
		endDate: to,
		opens: 'left',
		autoApply: true,
		autoUpdateInput: true,
		defaultDate: '',
		minYear: 2017,
		maxYear: parseInt(moment().format('YYYY'), 10),
		locale: {
			format: 'DD/MM/YYYY',
			cancelLabel: 'Clear',
			fromLabel: 'From',
			toLabel: 'To',
		},
		ranges: {
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'Last 3 Months': [moment().subtract(3, 'months').startOf('month'), moment()],
			'Last Year': [moment().subtract(12, 'month').startOf('month'), moment()],
			'Last 2 Year': [moment().subtract(24, 'month').startOf('month'), moment()]
		}
	}, function(start, end, label) {

	});

	Promise.all([
		getWODepartments(currentProject, currentFacility),
		getWODisciplines(currentProject, currentFacility)
	]).then(async () => {

		let selectDiscs = [];

		selectDiscs = [
			...[{
				'id': 'All',
				'text': 'All'
			}],
			...disciplines.map(x => {
				return {
					'id': x.Discipline,
					'text': x.Discipline
				}
			})
		]

		$('#disciplines').select2({
			placeholder: {
				id: '-1', // the value of the option
				text: 'Pick multiple'
			},
			minimumResultsForSearch: -1,
			data: selectDiscs
		});

		let selectDepts = [];
		selectDepts.push({
			'id': 'Placeholder',
			'text': 'Pick one',
			'disabled': true,
			'selected': true
		});

		selectDepts = [
			...selectDepts,
			...[{
				'id': 'All',
				'text': 'All'
			}],
			...departments.map(x => (x.Department != null) ? {
				'id': x.Department,
				'text': x.Department
			} : {
				'id': 'null',
				'text': 'null'
			})
		];

		$('#departments').select2({
			minimumResultsForSearch: -1,
			data: selectDepts
		});

		$('#departments').on('change', () => {
			currentDept = $('#departments').val();
		})
		$('#disciplines').on('change', () => {
			currentDisc = $('#disciplines').val().join(',');
		})
		$('#status').on('change', () => {
			currentStatus = $('#status').val();
		})
		$('#daterange').on('change', () => {
			from = $('#daterange').data('daterangepicker').startDate;
			to = $('#daterange').data('daterangepicker').endDate;
		})

		$('#btn-filter').on('click', e => {
			let valid = true;
			if (currentDept == 'none') {
				showSnackbar('error', 'Please select Department');
				valid &= false
			}
			if (currentDisc == 'none') {
				showSnackbar('error', 'Please select Discipline');
				valid &= false
			}
			console.log(currentStatus)
			if (valid) {
				if (typeof table != 'undefined') {
					table.destroy();
				}
				refreshTable();
			}
		})
	})
}

//#endregion

//#region WorkOrder Summary
const showHeatmapDept = (_project, _facility, _department) => {
	exec_sp_HeatmapDepartment(_project, _facility, _department).then(async () => {
		console.log(heatmapData);
		try {
			$('#calendarmap~.graph-err').remove()
			let heatmapGraphdata = [];

			let years = []
			years = [...new Set(heatmapData.map(x => x["Date"].substring(0, 4)))];

			years.forEach(year => {
				let _graphdata = heatmapData.filter(x => x["Date"].substring(0, 4) == year)
					.map(x => {
						return [x["Date"].toString(), parseFloat(x["Workforce"])];
					});
				heatmapGraphdata.push(_graphdata)
			});

			let _maxRange = heatmapData.map(x => parseFloat(x["Workforce"]))
				.reduce((max, y) => max > y ? max : y);

			maxRange = (Math.round(_maxRange / 100) + 1) * 100;
			graphHeatmap('calendarmap', years, heatmapGraphdata, maxRange);
		} catch (err) {
			console.log(err);
			$('#calendarmap').after(
				'<div class="graph-err">Failed to load data</div>'
			)
		}

	});
}

const SummaryDiscipline = async () => {
	exec_sp_SummarizeWOByDiscipline(currentProject, currentFacility)
            .then(async () => {
                await tableSummaryWODiscipline('#tableSumDisc', dataSumDisc);
                await graphSummaryDiscipline('#bar-chart-sum-disc', dataSumDisc);
            });
}

const SummaryDeppartment = async () => {
	exec_sp_SummarizeWOByDepartment(currentProject, currentFacility)
            .then(async () => {
                await tableSummaryWODepartment('#tableSumDept', dataSumDept);
                await graphSummaryDepartment('#bar-chart-sum-dept', dataSumDept);
            })
            .then(async () => {
                listDepartments = dataSumDept.map(x => x["Department"]).slice(0, -1);
                // console.log(listDepartments);
                listDepartments.forEach(dept => {
                    if (dept != '') {
                        $('.chart-selection .selection').append(
                            `<li class="select-item">${dept}</li>`)
                    }

                })

                $('.chart-selection .selection .select-item').first().addClass('active')
                activeDepartment = $('.chart-selection .selection .select-item').first().text()
                showHeatmapDept(currentProject, currentFacility, activeDepartment);

                $('.chart-selection .selection .select-item').on('click', async function() {

                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    activeDepartment = $(this).text();

                    showHeatmapDept(currentProject, currentFacility, activeDepartment);
                })
            })
}

//#endregion
