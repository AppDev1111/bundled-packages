var table;
let dataTable = [];
let currentProject = getStorage('currentProject') != null ? getStorage('currentProject') : 'DNWHP';
let currentFacility = getStorage('currentFacility') != null ? getStorage('currentFacility') : 'DN TOPSIDE';

// console.log(currentProject, currentFacility)

const user_fields = ['login_id', 'full_name', 'short_name', 'password', 'gender', 'birthday', 'company_id', 'department_id', 'team_id', 'position', 'address', 'email', 'phone', 'skype', 'level', 'group_id', 'first_working_date', 'active'];
var resultData = [];
var tableData = [];
var targetId = 0;

var active_user = 0;
var active_user_info = {};
var active_dept = 0;
var active_team = 0;

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;

//#region Master filter
const getProjects = async (elements, selected = null) => {
	await $.ajax({
		url: base_url + "general/getProjects",
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			let projects = response.map(x => x['ProjectCode']).distinct();
			let options

			if (selected == null) {
				options = projects.map((x, i) => {
					if (i == 0) {
						currentProject = x
					}
					return `<option value="${x}" ${i == 0 ? 'selected' : ''}>${x}</option>`
				})

			} else {
				options = projects.map(x => `<option value="${x}" ${x == selected ? 'selected' : ''}>${x}</option>`)
			}

			// console.log(options);
			$(elements).html(options);
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}

const getFacilities = async (elements, project, selected = null) => {
	$.ajax({
		url: base_url + "general/getFacilities/" + project,
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.table(response)
			let facilities = response.map(x => x['FacilityCode']).distinct();
			let options

			if (selected == null) {
				options = facilities.map((x, i) => {
					if (i == 0) {
						currentFacility = x
						setStorage('currentFacility', currentFacility)
					}
					return `<option value="${x}" ${i == 0 ? 'selected' : ''}>${x}</option>`
				})

			} else {
				options = facilities.map(x => `<option value="${x}" ${x == selected ? 'selected' : ''}>${x}</option>`)
			}

			// console.log(options);
			$(elements).html(options);
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}
//#endregion
//Remove loader on document fully loaded
$(window).on('load', () => {
	$('.loader').addClass('hidden')
	// $('.content-wrapper').css('min-height', 0)

	$('.btn-apply').on('click', function () {
		location.reload();
	})

	getProjects('#project', getStorage('currentProject'))
		.then(async () => await getFacilities('#facility', currentProject, getStorage('currentFacility')))
		.then(() => {
				$('#project').on('change', function (e) {
					currentProject = $(this).val();
					currentFacility = null;
					getFacilities('#facility', currentProject, null)
					setStorage('currentProject', currentProject);
					$('.btn-apply').addClass('show');
				})
				$('#facility').on('change', function (e) {
					currentFacility = $(this).val();
					setStorage('currentFacility', currentFacility)
					$('.btn-apply').addClass('show');
				})
			}
		)
		.catch(err => {
			console.log(err);
		})
})
//#region  Fullscreen
document.fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.documentElement.webkitRequestFullScreen;

/**
 * Request to show fullscreen
 * @param {Element} element 
 */
function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}

	setStorage('fullscreen', 'on')

}

function fullscreenF11() {
	var e = new Event('keyup');
	e.which = 122; // Character F11 equivalent.
	e.altKey = false;
	e.ctrlKey = false;
	e.shiftKey = false;
	e.metaKey = false;
	e.bubbles = true;
	window.dispatchEvent(e);
}

/**
 * Close full screen
 */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen();
	}

	setStorage('fullscreen', 'off')

}

/** Instant JS function */
(() => {
	$('[data-widget="fullscreen"]').on("click", function () {
		const dataTarget = $(this).attr("data-target");

		if (dataTarget == 'body') {
			// document.dispatchEvent(new KeyboardEvent('keydown', {'key':'F11'} ));
			// fullscreenF11();
			// localStorage.set('fullscreen', 'on')
			requestFullscreen(document);
		} else {
			const target = $(dataTarget)[0];
			requestFullscreen(target);
		}
	});

	$('#floating-drawer').on("click", function () {
		const dataTarget = $(this).attr("data-target");
		const target = $(dataTarget)[0];
		$(target).toggleClass("show");
		$('.hidden-chamber').removeClass("show")

	});

	$('[data-toggle="dropdown"]').on("click", function (e) {
		const target = $(e.target).parents('.dropdown').find('.dropdown-menu');
		$(target).toggleClass("show");

	});

	$('.drawer-area').on('dblclick', function(e){		
		$('.hidden-chamber').toggleClass("show")
	})

	$('#btnProduction').on('click', function(e){
		exec_sp_AutoUpdateProduction()
		$(e.target).attr('disabled', 'disabled')
	})

	$('[data-widget="print"]').on("click", function () {
		const dataTarget = $(this).attr("data-target");
		const targets = $(dataTarget);
		let title = $('.main-title')[0]
		let logo = '../assets/logo/Company_logo.png';
		let header = 'PTSC M&C PROJECT MANAGEMENT REPORT SYSTEM';
		var img = new Image(100, 60);
		img.src = logo;

		$('.loader').removeClass('hidden')

		// const { jsPDF } = window.jspdf;
		const _printHigh = (quality = 1) => {
			const filename = `PMS Rport - ${(new Date()).toDateString()}.pdf`;

			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: 'a4'
			});
			page = 0;

			const pdfProcessing = async () => {
				for (let i = 0; i < targets.length; i++) {
					_target = $(targets[i])[0];

					await html2canvas(_target, {
							scale: quality,
							x: 1,
						},


					).then(canvas => {
						pdf.setPage(i + 1);

						pdf.setFontSize(11);
						pdf.text(header, 50, 10);
						pdf.addImage(img, 'PNG', 2, 2, 22, 12);
						pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 5, 20, 200, (canvas.height / canvas.width) * 190);
						pdf.addPage(210, 291);
					});
				};
			}

			pdfProcessing().then(() => {
				pdf.deletePage(targets.length + 1);
				pdf.save(filename);

				$('.loader').addClass('hidden')

			})
		}

		_printHigh(2);

	});

	$('.chart-tool').on('click', function () {
		$(this).find('.toolbox').toggleClass('show');
	})

	$('.chart-daterange .daterange').daterangepicker({
		opens: 'left',
		autoApply: true,
		autoUpdateInput: true,
		defaultDate: '',
		minYear: 2017,
		maxYear: parseInt(moment().format('YYYY'), 10),
		locale: {
			format: 'DD/MM/YYYY',
			cancelLabel: 'Clear'
		},
		ranges: {
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'Last 3 Months': [moment().subtract(3, 'months').startOf('month'), moment()],
			'Last Year': [moment().subtract(12, 'month').startOf('month'), moment()]
		}
	}, function (start, end, label) {

	});


	let autoClose = $(".auto-close");
	let timer = setTimeout(() => {
		$(autoClose).removeClass("show");
	}, 10000);

	$(autoClose).on('mouseleave', () => {
		timer = setTimeout(() => {
			$(autoClose).removeClass("show");
		}, 10000);
	});
	$(autoClose).on('mouseenter', () => {
		clearTimeout(timer);
	})

	/** Web App installation  */
	// let deferredPrompt;
	// const addBtn = document.querySelector('#webapp-btn');

	// window.addEventListener('beforeinstallprompt', (e) => {
	// 	// Prevent Chrome 67 and earlier from automatically showing the prompt
	// 	e.preventDefault();
	// 	// Stash the event so it can be triggered later.
	// 	deferredPrompt = e;
	// 	// Update UI to notify the user they can add to home screen
	// 	addBtn.style.display = 'block';

	// 	addBtn.addEventListener('click', (e) => {
	// 		// hide our user interface that shows our A2HS button
	// 		addBtn.style.display = 'none';
	// 		// Show the prompt
	// 		deferredPrompt.prompt();
	// 		// Wait for the user to respond to the prompt
	// 		deferredPrompt.userChoice.then((choiceResult) => {
	// 			if (choiceResult.outcome === 'accepted') {
	// 				// console.log('User accepted the A2HS prompt');
	// 			} else {
	// 				// console.log('User dismissed the A2HS prompt');
	// 			}
	// 			deferredPrompt = null;
	// 		});
	// 	});
	// });



})();

const applyDrag = () => {
	let draggables = document.getElementsByClassName("draggable");
	for (draggable of draggables) {
		dragElement(draggable);
	}

	let draggablesY = document.getElementsByClassName("draggableY");
	for (draggable of draggablesY) {
		dragElement(draggable, {
			dragY: true
		});
	}

	function dragElement(elmnt, options = {}) {
		var offsetX = 0,
			offsetY = 0,
			oldX = 0,
			oldY = 0;
		let container = elmnt.parentElement;
		const w = container.getBoundingClientRect().width;
		const h = container.getBoundingClientRect().height;


		if (elmnt.getElementsByClassName("draggable-header").length > 0) {
			// if present, the header is where you move the DIV from:
			elmnt.getElementsByClassName("draggable-header")[0].onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elmnt.onmousedown = dragMouseDown;
		}

		var dismissElement = elmnt.getElementsByClassName("cell-dismiss")[0];
		// console.log(dismissElement)
		dismissElement.onclick = dismiss;


		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();

			// get the mouse cursor position at startup:
			oldX = e.clientX;
			oldY = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			if (options.dragY == true) {
				//Move element only Vertical
				// calculate the new cursor position:
				offsetY = oldY - e.clientY;
				oldY = e.clientY;

				// console.log(`w:${w}, h:${h}, clientY: ${e.clientY}, windowheight: ${window.innerHeight}, oldY: ${oldY}`)
				if (e.clientY < 80 || e.clientY > window.innerHeight - 50) {
					return;
				}
				// set the element's new position:
				elmnt.style.top = (elmnt.offsetTop - offsetY) + "px";
				elmnt.style.left = (elmnt.offsetLeft) + "px";
			} else {
				//Move element freely
				// calculate the new cursor position:
				offsetX = oldX - e.clientX;
				offsetY = oldY - e.clientY;
				oldX = e.clientX;
				oldY = e.clientY;
				// set the element's new position:
				elmnt.style.top = (elmnt.offsetTop - offsetY) + "px";
				elmnt.style.left = (elmnt.offsetLeft - offsetX) + "px";
			}


		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
		}

		function dismiss() {
			elmnt.style.display = "none";
		}
	}
}

//#endregion


/* ConsoleBan.init({
  // callback: () => {
  //   console.clear(); 
  //   // console.log("Dev tool is not allowed");
  // },
  redirect: base_url+'views/errors/html/error_general'
}) */

//#endregion

//#region  actions with Cookies

function setCookie(cname, cvalue, exdays = null) {
	if (exdays != null) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
	} else {
		document.cookie = cname + "=" + cvalue + ";path=/"
	}
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function clearCookies() {
	var allCookies = document.cookie.split(';');

	// The "expire" attribute of every cookie is  
	// Set to "Thu, 01 Jan 1970 00:00:00 GMT" 
	for (var i = 0; i < allCookies.length; i++)
		document.cookie = allCookies[i] + "=;expires=" +
		new Date(0).toUTCString();
}

function setStorage(key, value) {
	localStorage.setItem(key, value);
}

function getStorage(key) {
	return localStorage.getItem(key);
}

function clearStorage() {
	localStorage.clear();
}
//#endregion

//#region Basic CRUD for forms

/**
 * Remove an item with modal display
 * @param {Number} id 
 * @param {DOMPoint} formElement 
 * @param {Function} callback 
 */
function removeByModal(id, formElement, callback, formType = "user") {
	if (!id) {
		showSnackbar("error", `No valid item was selected`);
	}
	try {

		$(formElement).off('submit').on('submit', function (e) {
			e.preventDefault();
			let form = $(this);
			$.ajax({
				url: `${form.attr('action')}/${id}`,
				type: form.attr('method'),
				data: [],
				dataType: 'json',
				dataFilter: function (res) {
					// console.log(res);
					return res;
				},
				success: function (response) {

					$(formElement).parents().find('.modal').modal('hide');

					if (response.success === true) {
						showSnackbar("success", response.messages);
					} else {
						showSnackbar("error", response.messages);
					}

					// setTimeout(callback,200);
					setTimeout(callback, 0);

					// callback;
				},
				complete: function (data) {

				},
				error: function (error) {
					// console.log(error);
				}
			});
			return false; // return false to disbale default form submission 
		});

	} catch (e) {
		// console.log(e);
	}


}

function addByModal(formElement, callback, formType = "user") {
	try {
		$(formElement).off('submit').on('submit', function (e) {
			e.preventDefault();
			let form = $(this);

			//Check and validate all information 
			if (!validate(formElement, formType)) {
				return false;
			}

			//Validated
			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: form.serialize(),
				dataType: 'json',
				beforeSend: function () {
					// console.log(form.serialize());
				},
				dataFilter: function (res) {
					// console.log(res);
					return res;
				},
				success: function (response) {

					$(formElement).parents().find('.modal').modal('hide');

					if (response.success === true) {
						showSnackbar("success", response.messages);
					} else {
						showSnackbar("error", response.messages);
					}
					//    setTimeout(callback, 200);
					setTimeout(callback, 0);

					// callback;
				},
				complete: function () {


				},
				error: function (error) {
					// console.log(error);
				}
			});
			return false; // return false to disbale default form submission 
		});
	} catch (e) {
		// console.log(e);
	}
}

function assignByModal(formElement, callback, formType = "user") {

	try {
		$(formElement).off('submit').on('submit', function (e) {
			e.preventDefault();
			let form = $(this);
			//Check and validate all information          
			if (!validate(formElement, formType)) {
				return false;
			}

			//Validated
			$.ajax({
				url: `${form.attr('action')}/${active_user}`,
				type: form.attr('method'),
				data: form.serialize(),
				dataType: 'json',
				beforeSend: function () {
					// console.log(form.serialize());
				},
				dataFilter: function (res) {
					// console.log(res);
					return res;
				},
				success: function (response) {

					$(formElement).parents().find('.modal').modal('hide');

					if (response.success === true) {
						showSnackbar("success", response.messages);
					} else {
						showSnackbar("error", response.messages);
					}
					// setTimeout(callback, 200);
					setTimeout(callback, 0);

					// callback;
				},
				complete: function () {


				},
				error: function (error) {
					// console.log(error);
				}
			});
			return false; // return false to disbale default form submission 
		});
	} catch (e) {
		// console.log(e);
	}
}

function editByModal(id, formElement, callback, formType = "user") {
	try {
		$(formElement).off('submit').on('submit', function (e) {
			e.preventDefault();
			let form = $(this);
			//Check and validate all information 
			if (!validate(formElement, formType)) {
				return false;
			}

			//Validated
			$.ajax({
				url: `${form.attr('action')}/${id}`,
				type: form.attr('method'),
				data: form.serialize(),
				dataType: 'json',
				beforeSend: function () {
					// console.log(form.serialize());
				},
				dataFilter: function (res) {
					// console.log(res);
					return res;
				},
				success: function (response) {

					$(formElement).parents().find('.modal').modal('hide');

					if (response.success === true) {
						showSnackbar("success", response.messages);
					} else {
						showSnackbar("error", response.messages);
					}
					// setTimeout(callback, 200);
					setTimeout(callback, 0);

					// callback;
				},
				complete: function () {

				},
				error: function (error) {
					// console.log(error);
				}
			});
			return false; // return false to disbale default form submission 
		});
	} catch (e) {
		// console.log(e);
	}
}

//#endregion


//#region  Users & Organization

async function getUserInfo(user_id) {

	await $.ajax({
		url: base_url + "users/getUserById/" + user_id,
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			const fields = ['login_id', 'full_name', 'short_name', 'password', 'gender', 'birthday', 'company_id', 'department_id', 'team_id', 'position', 'address', 'email', 'phone', 'skype', 'level', 'group_id', 'first_working_day', 'active'];

			loadDataToFields(fields, response, "#userEditForm");
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});

}

async function getGroupInfo(parent, group_id) {

	await $.ajax({
		url: base_url + "groups/getGroupById/" + group_id,
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			permission = response['permission'];
			// const fields = ['viewUserGroup','editUserGroup', 'viewOrganization', 'editOrganization', 'viewMemberTasks', 'editMemberTasks', 'approveMemberTasks', 'commentMemberTasks', 'viewTeamTasks', 'editTeamTasks', 'approveTeamTasks', 'commentTeamTasks','viewSquadTasks', 'editSquadTasks', 'approveSquadTasks', 'commentSquadTasks','viewDepartmentTasks', 'editDepartmentTasks', 'approveDepartmentTasks', 'commentDepartmentTasks', 'viewTeamGoals', 'editTeamGoals', 'approveTeamGoals', 'commentTeamGoals','viewTimeline', 'editTimeline', 'commentTimeline'];
			// fields.forEach((item)=>{
			//     element = $(parent).find(`[value="${item}"]`);
			//     element.attr('checked', false);
			// });

			$(parent).find('[name = "name"]').val(response["name"]);
			$(parent).find('[name = "description"]').val(response["description"]);

			checkboxes = $(parent).find('[type="checkbox"]');
			checkboxes.each(function () {
				$(this).attr('checked', false);
			});


			if (permission instanceof Array) {
				permission.forEach((item) => {
					element = $(parent).find(`[value="${item}"]`);
					element.attr('checked', true);
				});
			}

		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});

}

function genShortName(full_name) {
	if (full_name.length > 1) {
		let words = full_name.trim().split(" ");
		let short_name = "";
		short_name += words[words.length - 1] + " ";
		for (let i = 0; i < words.length - 1; i++) {
			short_name += words[i][0];
		}

		return short_name;
	}
}

function loadCompany(elements, preset = null, options = null) {
	$.ajax({
		url: base_url + "organization/fetchCompanySelect",
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			for (element of elements) {
				$(element).html(response);
				if (options) {
					if (options['disableOthers']) {
						$(element).find(`[value!="${preset}"]`).attr('disabled', true);
					}
					if (options['selectPreset']) {
						$(element).find(`[value="${preset}"]`).attr('selected', true);
					}
				}
			}
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}
/**
 * Load departments and fill into elements
 * @param {Array} elements 
 * @param {String} preset 
 * @param {Array} options 
 */
function loadDepartments(elements, preset = null, options = null) {
	$.ajax({
		url: base_url + "organization/fetchDepartmentSelect",
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			for (element of elements) {
				$(element).html(response);
				if (options) {
					if (options['disableOthers']) {
						$(element).find(`[value!="${preset}"]`).attr('disabled', true);
					}
					if (options['selectPreset']) {
						$(element).find(`[value="${preset}"]`).attr('selected', true);
					}
				}

			}
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}

function loadTeams(elements, department_id, preset = null, options = null) {
	$.ajax({
		url: base_url + "organization/fetchTeamSelect/" + department_id,
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			for (element of elements) {
				$(element).html(response);
				if (options) {
					if (options['disableOthers']) {
						$(element).find(`[value!="${preset}"]`).attr('disabled', true);
					}
					if (options['selectPreset']) {
						$(element).find(`[value="${preset}"]`).attr('selected', true);
					}
				}
			}
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}

function loadGroups(elements, preset = null) {
	$.ajax({
		url: base_url + "groups/fetchGroupSelect",
		type: "POST",
		data: [],
		dataType: 'json',
		beforeSend: function () {

		},
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			for (element of elements) {
				$(element).html(response);
			}
		},
		complete: function () {

		},
		error: function (error) {
			// console.log(error);
		}
	});
}

const exec_sp_AutoUpdateProduction = async () => {
	await $.ajax({
		url: `${base_url}production_control/exec_sp_AutoUpdateProduction`,
		type: 'POST',
		data: [],
		dataType: 'json',
		dataFilter: function (res) {
			// console.log(res);
			return res;
		},
		success: function (response) {
			// console.log(response);
			
		},
		complete: function (data) {
			showSnackbar("success", 'Successfully update Production')
		},
		error: function (error) {
			console.log(error);
		}
	});
}

//#endregion




//#region Utility functions
function togglePasswordVisible(elementID) {
	element = $(elementID);
	if (element.type === "password") {
		element.type = "text";
	} else {
		element.type = "password";
	}
}

function notifyMe(message, link) {
	if (!window.Notification) {
		alert('Browser does not support notifications.');
	} else {
		// check if permission is already granted
		if (Notification.permission === 'granted') {
			// show notification here
			var notify = new Notification('JMS Notify', {
				body: message,
				icon: base_url + 'assets/logo/jms.ico',
				// image: base_url + 'images/logo.png',
				vibrate: true,
				// requireInteraction: true
			});
			notify.onclick = function (e) {
				window.open(link);
			};
			notify.onshow = function (e) {
				let src = base_url + 'assets/sounds/ding-dong.mp3';
				let audio = new Audio(src);
				audio.play();
			}

		} else {
			// request permission from user
			Notification.requestPermission().then(function (p) {
				if (p === 'granted') {
					// show notification here
					var notify = new Notification('VTS Notification', {
						body: message,
						icon: base_url + 'assets/logo/jms.ico',
						// image: base_url + 'images/logo.png',
						vibrate: true,
						// requireInteraction: true
					});
				} else {
					// console.log('User blocked notifications.');
				}
				notify.onclick = function () {
					window.open(link);
				};
				notify.onshow = function (e) {
					let src = base_url + 'assets/sounds/ding-dong.mp3';
					let audio = new Audio(src);
					audio.play();
				}
			}).catch(function (err) {
				console.error(err);
			});
		}
	}
}

function loadDataToFields(fields, data, container) {
	parent = $(container);

	fields.forEach((item) => {
		element = parent.find(`[name="${item}"]`);

		if (element.attr("type") == 'text' || element.attr("type") == 'number' || element.attr("type") == 'date' || element.attr("type") == 'email' || element.is('select')) {
			element.val(data[item]);
		} else if (element.attr("type") == 'checkbox') {
			if (data[item] == '1') {
				element.attr('checked', true);
			}
		} else if (element.attr("type") == 'radio') {
			element.each(function () {
				if ($(this).val() == data[item]) {
					$(this).attr('checked', true);
				}
			})
		} else if (element.is('textarea')) {
			element.text(data[item]);
		} else {
			element.text(data[item]);
		}

	});

}

function convertDateFormat(input, format_from = 'dd/mm/yyyy', format_to = 'yyyy-mm-dd') {
	if (input == null || input == '') {
		return '';
	}
	var result = '';
	var date = [];
	var d, m, y, h, i, s;
	switch (format_from) {
		case "dd/mm/yyyy":
			date = input.split('/');
			d = date[0];
			m = date[1];
			y = date[2];
			break;

		case "yyyy-mm-dd":
			date = input.split('-');
			d = date[2];
			m = date[1];
			y = date[0];
			break;

		case "yyyy-mm-dd h:i:s":
			datetime = input.split(' ');
			// console.log(datetime)
			date = datetime[0].split('-');
			d = date[2];
			m = date[1];
			y = date[0];
			time = datetime[1].split(':');
			h = time[0];
			i = time[1];
			s = time[2];
			break;
	}

	switch (format_to) {
		case "yyyy-mm-dd":
			result = y + '-' + m + '-' + d;
			break;
		case "dd/mm/yyyy":
			result = d + '/' + m + '/' + y;
			break;

		case "dd/mm/yyyy h:i:s":
			result = d + '/' + m + '/' + y + ' ' + h + ':' + i + ':' + s;
			break;

	}

	return result;

}

function blankIt(input, defaultOutput = "") {
	if (input == null) {
		return defaultOutput;
	}
	return input.trim();
}

const duplicateBlock = (element, data, callback = null, removeOriginal = true) => {
	let wrapper = $(element).parent()
	for (let i = 0; i < data.length; i++) {
		let clonedDiv = $(element).clone()

		wrapper.append(clonedDiv)
		if (callback) {
			callback(clonedDiv, data[i])
		}
	}

	if (removeOriginal) {
		wrapper.children().eq(0).remove()
	}


}

function setSidebarActive(elementID) {
	let el = $(`${elementID}`);
	// console.log(el.parents('.nav-treeview'))
	el.addClass('active');

	el.parents('.has-treeview').addClass('menu-open menu-is-opening');
	el.parents('.has-treeview').find('.nav-link').eq(0).addClass('active');
	el.parents('.nav-treeview').css("display", "block");
}

function isValidNumber(num) {
	return num != null && isFinite(num);
}

/**
 * Show flash snicky bar notification
 * @param {String} status (normal, error, success)
 * @param {Array} message 
 */
function showSnackbar(status = 'normal', message = null, duration = 2000) {

	// let successColor = "linear-gradient(to right, #4CAF50, #96c93d)";
	// let errorColor = "linear-gradient(to right, #FF6F00, #FF3D00)";
	// let normalColor = "linear-gradient(to right, #00b09b, #96c93d)";
	let successColor = "linear-gradient(to right, #4CAF50, #96c93d)";
	let errorColor = "linear-gradient(to right, #FF6F00, #FF3D00)";
	let normalColor = "linear-gradient(to right, #00b09b, #96c93d)";
	let color = normalColor;

	switch (status) {
		case 'error':
			color = errorColor;
			break;
		case 'success':
			color = successColor;
			break;
		default:
			color = normalColor;
			break;
	}

	if (message != null) {
		if (message instanceof Array) {
			message.forEach((msg) => {
				Toastify({
					text: msg,
					close: true,
					duration: duration,
					gravity: 'bottom',
					position: 'center',
					stopOnFocus: true, // Prevents dismissing of toast on hover            
					style: {
						background: color,
					},
					offset: {
						x: 0,
						y: 20
					}
					// onClick: function(){} // Callback after click
				}).showToast();
			})
		} else {
			Toastify({
				text: message,
				close: true,
				duration: duration,
				gravity: 'bottom',
				position: 'center',
				stopOnFocus: true, // Prevents dismissing of toast on hover            
				style: {
					background: color,
				},
				offset: {
					x: 0,
					y: 20
				}
				// onClick: function(){} // Callback after click
			}).showToast();
		}
	}
}

/**
 * Add custom buttons to expand, collapse on each level of table
 * and master buttons to expand/ collapse all
 * @param  {string} tableElement DOM element of table with jQuery/ querySelector
 */
const customButtons = (tableElement) => {
	//Custom expdander/ collapse on row column 0
	$('.expander').on('click', async function (e) {
		if ($(this).hasClass('expanded')) {
			//Hide all child rows in collaped
			await $(this).removeClass('fa-minus-square expanded');
			$(this).addClass('fa-plus-square');
			$(this).parents('tr').attr('collapsed', true)

			let cLevel = $(this).parents('tr').attr("level");
			let _nextRows = $(this).parents('tr').nextUntil(`[level="${cLevel}"]`);
			let nextRows = $.grep(_nextRows, function (item) {
				return parseInt($(item).attr('level')) >= parseInt(cLevel)
			});
			await $(nextRows).css('visibility', 'collapse');

		} else {
			// Expand all rows except the collaped child rows
			await $(this).removeClass('fa-plus-square');
			$(this).addClass('fa-minus-square expanded');
			$(this).parents('tr').attr('collapsed', false);

			let cLevel = $(this).parents('tr').attr("level");
			let _nextRows = $(this).parents('tr').nextUntil(`[level="${cLevel}"]`);
			let nextRows = $.grep(_nextRows, function (item) {
				return parseInt($(item).attr('level')) >= parseInt(cLevel)
			});
			let lowerLevel = $.grep(nextRows, function (item) {
				return $(item).attr('level') == parseInt(cLevel) + 1
			})

			lowerLevel.forEach(function (row) {
				let _lvl = $(row).attr('level');
				let _collapsed = $(row).attr('collapsed');


				if (_collapsed == 'true') {
					$(row).css('visibility', 'visible');
					$(row).nextUntil(`[level="${_lvl}"]`).css('visibility', 'collapse');
				} else {
					$(row).css('visibility', 'visible');
					$(row).nextUntil(`[level="${_lvl}"]`).css('visibility', 'visible');
				}
			})
		}
	})

	//Custom buttons
	$('.expand-all').on('click', async function () {
		let parent = $(tableElement).parents().eq(0)
		if ($(parent).has($(this)).length == 0)
			return;

		let tableBody = $(tableElement).find('tbody');
		$(tableBody).find('tr').css('visibility', 'visible');
		$(tableBody).find('tr[collapsed="true"]').attr('collapsed', false);

		let tick = $(tableBody).find('tr[level="4"],tr[level="3"], tr[level="2"],tr[level="1"]').find('td:eq(0) i');
		await tick.addClass('fa-minus-square expanded');
		await tick.removeClass('fa-plus-square');
	})
	$('.expand-level1').on('click', async function () {
		let parent = $(tableElement).parents().eq(0)
		if ($(parent).has($(this)).length == 0)
			return;

		let tableBody = $(tableElement).find('tbody');
		$(tableBody).find('tr:not([level="1"])').css('visibility', 'collapse');
		$(tableBody).find('tr[level="1"]').css('visibility', 'visible');
		let tick = $(tableBody).find('tr[level="1"]').find('td:eq(0) i');
		await tick.removeClass('fa-minus-square expanded');
		await tick.addClass('fa-plus-square');
	})
	$('.expand-level2').on('click', async function () {
		let parent = $(tableElement).parents().eq(0)
		if ($(parent).has($(this)).length == 0)
			return;
		let tableBody = $(tableElement).find('tbody');
		$(tableBody).find('tr:not([level="1"]),tr:not([level="2"])').css('visibility', 'collapse');
		$(tableBody).find('tr[level="1"],tr[level="2"]').css('visibility', 'visible');
		let tick = $(tableBody).find('tr[level="2"]').find('td:eq(0) i');
		tick.removeClass('fa-minus-square expanded');
		tick.addClass('fa-plus-square');
	})
	$('.expand-level3').on('click', async function () {
		let parent = $(tableElement).parents().eq(0)

		if ($(parent).has($(this)).length == 0)
			return;

		let tableBody = $(tableElement).find('tbody');

		$(tableBody).find('tr:not([level="1"]),tr:not([level="2"])tr:not([level="3"])').css('visibility', 'collapse');
		$(tableBody).find('tr[level="1"],tr[level="2"], tr[level="3"]').css('visibility', 'visible');
		$(tableBody).find('tr[level="3"]').attr('collapsed', true);

		let tick = $(tableBody).find('tr[level="3"]').find('td:eq(0) i');
		await tick.removeClass('fa-minus-square expanded');
		await tick.addClass('fa-plus-square');
	})
}
//#endregion


//#region Base Class extensions
Array.prototype.distinct = function () {
	// Method cannot be run on an array that does not exist.
	if (this == null) {
		throw new TypeError('this is null or not defined');
	}

	function _distinct(row, index, self) {
		return self.indexOf(row) === index;
	}

	return this.filter(_distinct);

}

Array.prototype.groupBy = function (key) {
	// Method cannot be run on an array that does not exist.
	if (this == null) {
		throw new TypeError('This is null or not defined');
	}
	// The callback must be a function.
	if (key == null) {
		throw new TypeError('Key is null or not defined');
	}

	if (typeof key === 'array') {
		throw new TypeError('Key should not be array');
	}

	let len = this.length;
	let _distinct = [...new Set(this.map(x => x.key))];
	let _result = _distinct.map(x => {
		return {
			[x]: []
		};
	});
	for (let item in this) {

	}

}


//#endregion
