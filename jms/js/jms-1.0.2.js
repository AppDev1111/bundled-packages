var table;
const rating = {
    "":"-",
    "0":65, 
    "1":70,
    "2":75,
    "3":80,
    "4":85,
    "5":90,
    "6":95
}
const regulation = {
    "":"-",
    "0":0, 
    "1":20,
    "2":25,
    "3":30
}
const disableOthers = {
    'disableOthers': true,
    'selectPreset': false
};
const selectPreset = {
    'disableOthers': false,
    'selectPreset': true
};
const presetWithDisableOthers = {
    'disableOthers': true,
    'selectPreset': true
};
const user_fields = ['login_id', 'full_name', 'short_name', 'password', 'gender', 'birthday', 'company_id', 'department_id', 'team_id', 'position', 'address', 'email', 'phone', 'skype', 'level', 'group_id', 'first_working_date', 'active'];
var resultData = [];
var tableData = [];
var targetId = 0;

var active_user = 0;
var active_user_info ={};
var active_dept = 0;
var active_team = 0;

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
//#region  Fullscreen

// document.fullscreenEnabled =
// 	document.fullscreenEnabled ||
// 	document.mozFullScreenEnabled ||
// 	document.documentElement.webkitRequestFullScreen;

// function requestFullscreen(element) {
// 	if (element.requestFullscreen) {
// 		element.requestFullscreen();
// 	} else if (element.mozRequestFullScreen) {
// 		element.mozRequestFullScreen();
// 	} else if (element.webkitRequestFullScreen) {
// 		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
// 	}
// }

// if (document.fullscreenEnabled) {
// 		requestFullscreen(document.documentElement);
// 	}


//#endregion

/* ConsoleBan.init({
  // callback: () => {
  //   console.clear(); 
  //   console.log("Dev tool is not allowed");
  // },
  redirect: base_url+'views/errors/html/error_general'
}) */

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
//#endregion
//#region Save and Load Form
async function saveFormToSession(formType) {
    try {
        inputs = $('[type=text],[type=number], textarea');
        checkboxes = $('input[type=checkbox], input[type=radio]');
        selects = $('select');
        dates = $('[type=date]')
        form_fields = {};

        inputs.each(function() {
            id = $(this)[0]['id'];
            value = $(this)[0]['value'];
            form_fields[id] = value;
        });
        dates.each(function() {
            id = $(this)[0]['id'];
            value = $(this)[0]['value'];
            form_fields[id] = value;
        });
        checkboxes.each(function() {
            id = $(this)[0]['id'];
            if ($(this)[0]['checked'] == true) {
                value = 'checked';
            } else {
                value = null;
            }
            form_fields[id] = value;
        });
        selects.each(function() {
            id = $(this)[0]['id'];
            value = $(this)[0]['value'];
            form_fields[id] = value;
        });
        form = {};
        form = {
            [formType]: form_fields
        }

        console.log(form)

        await $.ajax({
            url: base_url + 'auth/saveDataToSession/' + formType,
            type: 'POST',
            data: form,
            dataType: 'json',
            dataFilter: function(res) {
                // console.log(res);
                return res;
            },
            success: function(response) {
                // console.log(response);
            },
            error: function(error) {
                console.log((error));
            }
        });
    } catch (e) {
        console.log(e);
    }

}

async function loadFormFromSession(formType) {
    try{
        await $.ajax({
            url: base_url + 'auth/loadDataFromSession/' + formType,
            type: 'POST',
            data: {},
            dataType: 'json',
            dataFilter: function(res) {
                // console.log(res);
                return res;
            },
            success: function(response) {
                // console.log(response['request_no']);
                if (response) {
                    Object.keys(response).forEach(function(k) {
                        if (response[k] == 'checked') {
                            console.log(k)
                                // $('#' + k).prop('checked', true);
                            $('[id=' + k + ']').prop('checked', true);
                        } else if (response[k] != '') {
                            $('#' + k).val(response[k]);
                            $('#' + k).css('color', '#3C8DBC');
                        }
                    });
                }
            },
            error: function(error) {
                console.log((error));
            }
        });

    } catch (e) {
        console.log(e);
    }
    
}

async function saveDataToSession(key, dataJson) {
    try{
        info = {
            key: dataJson
        }
    
        await $.ajax({
            url: base_url + 'auth/saveDataToSession/' + key,
            type: 'POST',
            data: info,
            dataType: 'json',
            // async: false,
            dataFilter: function(res) {
                console.log(res);
                return res;
            },
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                // console.log((error));
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    
}

async function loadDataFromSession(key) {
    try {
        await $.ajax({
            url: base_url + 'auth/loadDataFromSession/' + key,
            type: 'POST',
            data: {},
            dataType: 'json',
            dataFilter: function(res) {
                // console.log(res);
                return res;
            },
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log((error));
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    
}

async function clearFormFromSession(formType) {
    try {
        await $.ajax({
            url: base_url + 'auth/clearFormFromSession/' + formType,
            type: 'POST',
            data: {},
            dataType: 'json',
            dataFilter: function(res) {
                // console.log(res);
                return res;
            },
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log((error));
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

function autoSaveForm(formType, interval) {
    setInterval(function() {
        saveFormToSession(formType)
    }, interval);
}

//#region

//#region Form validation
function validateDates(formElement){
    // $(formElement).find('input:not([readonly])').css('background-color', '#fff');

    let deadline = $(formElement).find('[name="deadline"]').data('daterangepicker').startDate;
    let planStart = $(formElement).find('[name="plan_start"]').data('daterangepicker').startDate;
    let planComplete = $(formElement).find('[name="plan_complete"]').data('daterangepicker').startDate;
    let planDuration = (planComplete - planStart)/(24*3600*1000) + 1;
    $(formElement).find('[name="duration"]').val(planDuration);

    messages = [];
    if (planStart > planComplete) {
        messages.push('Plan Start should be earlier than plan Complete');
        $(formElement).find('[name="plan_start"]').css('background-color', '#ef9a9a');
        $(formElement).find('[name="plan_complete"]').css('background-color', '#ef9a9a');
    }
    if (planStart > deadline || planComplete > deadline) {
        messages.push('Deadline should be later than plan action');
        $(formElement).find('[name="deadline"]').css('background-color', '#ef9a9a');
    }
    showSnackbar('error', messages);
}

function validate(formElement, formType = "task") {
    if (formType== "task"){
        $(formElement).find('input:not([readonly])').css('background-color', '#fff');
        $(formElement).find('textarea').css('background-color', '#fff');
    
        let deadline = $(formElement).find('[name="deadline"]').data('daterangepicker').startDate;
        let planStart = $(formElement).find('[name="plan_start"]').data('daterangepicker').startDate;
        let planComplete = $(formElement).find('[name="plan_complete"]').data('daterangepicker').startDate;
    
        let description = $(formElement).find('[name="description"]').val();
        let weight = $(formElement).find('[name="weight"]').val();
        let _sumWeight = $(formElement).find('[name="total_weight"]').val();
        let project = $(formElement).find('[name="project"]').val();
    
        messages = [];
        if (planStart > planComplete) {
            messages.push('Plan Start should be earlier than plan Complete');
            $(formElement).find('[name="plan_start"]').css('background-color', '#ef9a9a');
            $(formElement).find('[name="plan_complete"]').css('background-color', '#ef9a9a');
        }    
        if (planStart > deadline || planComplete > deadline) {
            
            messages.push('Deadline should be later than plan action');
            $(formElement).find('[name="deadline"]').css('background-color', '#ef9a9a');
        }
        if (description==''){
            messages.push('Description should not be blank');
            $(formElement).find('[name="description"]').css('background-color', '#ef9a9a');
        }
        if (weight==''){
            messages.push('Weight should not be blank');
            $(formElement).find('[name="weight"]').css('background-color', '#ef9a9a');
        }
        if (_sumWeight> 100){
            messages.push('Total Weight should not exceed 100%');
        }
        if (project==''){
            messages.push('Project should not be blank');
            $(formElement).find('[name="project"]').css('background-color', '#ef9a9a');
        }
        showSnackbar('error', messages);
    
        // actualStart = $(formElement).find('[name="actual_start"]').data('daterangepicker').startDate;
        // actualComplete = $(formElement).find('[name="actual_complete"]').data('daterangepicker').endDate;
        // actualDuration = Math.round((actualComplete - actualStart) / (1000 * 60 * 60 * 24));
        // $(formElement).find('[name="actual_duration"]').val(actualDuration);
    
        if (messages == ''){
            return true;
        }
        return false;
    }
    else {
        // If there is no need for verification
        return true;

    }

    

}


//#endregion

//#region Basic CRUD for forms

/**
 * Remove an item with modal display
 * @param {Number} id 
 * @param {DOMPoint} formElement 
 * @param {Function} callback 
 */
function removeByModal(id, formElement, callback, formType = "user"){
    if (!id){
         showSnackbar("error", `No valid item was selected`);
    }
    try{
        
        $(formElement).off('submit').on('submit', function(e) {
            e.preventDefault();
            let form = $(this);
            $.ajax({
                url: `${form.attr('action')}/${id}`,
                type: form.attr('method'),
                data: [],
                dataType: 'json',
                dataFilter: function(res){
                    // console.log(res);
                    return res;
                },
                success: function(response) {

                    $(formElement).parents().find('.modal').modal('hide');

                    if (response.success === true) {
                        showSnackbar("success", response.messages);
                    } else {
                        showSnackbar("error", response.messages);
                    } 
                    
                    // setTimeout(callback,200);
                    setTimeout(callback,0);

                    // callback;
                }, 
                complete: function(data){
                
                },
                error: function(error){
                    console.log(error);
                }
            });
            return false; // return false to disbale default form submission 
        });
        
    }            
    catch (e){
        console.log(e);
    }
    
    
}

function addByModal(formElement, callback, formType = "user"){   
   try{
       $(formElement).off('submit').on('submit', function(e) {
        e.preventDefault();
        let form = $(this);
        
        //Check and validate all information 
        if(!validate(formElement, formType)) {
            return false;
        }

        //Validated
           $.ajax({
               url: form.attr('action'),
               type: form.attr('method'),
               data: form.serialize(),
               dataType: 'json',
               beforeSend: function(){
                    // console.log(form.serialize());
               },
               dataFilter: function(res){
                   console.log(res);
                   return res;
               },
               success: function(response) {

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
               complete: function(){


               },
               error: function(error){
                   console.log(error);
               }
           });
           return false; // return false to disbale default form submission 
       });
   }         
   catch (e){
       console.log(e);
   }
}

function assignByModal(formElement, callback, formType = "user"){  
     
    try{
        $(formElement).off('submit').on('submit', function(e) {
            e.preventDefault();
         let form = $(this);
         //Check and validate all information          
         if(!validate(formElement, formType)) {
             return false;
         }
 
         //Validated
            $.ajax({
                url: `${form.attr('action')}/${active_user}` ,
                type: form.attr('method'),
                data: form.serialize(),
                dataType: 'json',
                beforeSend: function(){
                     // console.log(form.serialize());
                },
                dataFilter: function(res){
                    console.log(res);
                    return res;
                },
                success: function(response) {
 
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
                complete: function(){
 
 
                },
                error: function(error){
                    console.log(error);
                }
            });
            return false; // return false to disbale default form submission 
        });
    }         
    catch (e){
        console.log(e);
    }
 }

function editByModal(id, formElement, callback, formType = "user"){    
    try{
        $(formElement).off('submit').on('submit', function(e) {
            e.preventDefault();
            let form = $(this);
            //Check and validate all information 
            if(!validate(formElement, formType)) {
                return false;
            }

            //Validated
            $.ajax({
                url: `${form.attr('action')}/${id}`,
                type: form.attr('method'),
                data: form.serialize(),
                dataType: 'json',
                beforeSend: function(){
                     // console.log(form.serialize());
                },
                dataFilter: function(res){
                    // console.log(res);
                    return res;
                },
                success: function(response) {

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
                complete: function(){                                         

                },
                error: function(error){
                    console.log(error);
                }
            });
            return false; // return false to disbale default form submission 
        });
    }         
    catch (e){
        console.log(e);
    }
 }

//#endregion

//#region  General functions
function togglePasswordVisible(elementID){
    element = $(elementID);
    if (element.type === "password"){
        element.type = "text";
    } else {
        element.type = "password";
    }
}

function test() {
    // notifyMe("This is notification from VTS app " + window.location.href, base_url);

    console.log()
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
            notify.onclick = function(e) {
                window.open(link);
            };
            notify.onshow = function(e) {
                let src = base_url + 'assets/sounds/ding-dong.mp3';
                let audio = new Audio(src);
                audio.play();
            }

        } else {
            // request permission from user
            Notification.requestPermission().then(function(p) {
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
                    console.log('User blocked notifications.');
                }
                notify.onclick = function() {
                    window.open(link);
                };
                notify.onshow = function(e) {
                    let src = base_url + 'assets/sounds/ding-dong.mp3';
                    let audio = new Audio(src);
                    audio.play();
                }
            }).catch(function(err) {
                console.error(err);
            });
        }
    }
}

function loadDataToFields(fields, data, container){
    parent = $(container);

    fields.forEach((item)=>{
        element = parent.find(`[name="${item}"]`);

        if (element.attr("type") == 'text' || element.attr("type") == 'number' || element.attr("type") == 'date' ||  element.attr("type") == 'email' || element.is('select')) {
            element.val(data[item]);
        } else if (element.attr("type") == 'checkbox') {
            if (data[item] == '1') {
                element.attr('checked', true);
            }
        } else if (element.attr("type") == 'radio') {
            element.each(function() {
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

//#endregion

//#region  Users & Organization

async function getUserInfo(user_id){
    
    await $.ajax({
        url: base_url + "users/getUserById/"+user_id,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            console.log(response);
            const fields = ['login_id','full_name', 'short_name', 'password', 'gender', 'birthday', 'company_id', 'department_id', 'team_id', 'position', 'address', 'email', 'phone', 'skype', 'level', 'group_id', 'first_working_day', 'active'];

            loadDataToFields(fields, response, "#userEditForm");
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
    
}

async function getGroupInfo(parent, group_id){
    
    await $.ajax({
        url: base_url + "groups/getGroupById/"+group_id,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            console.log(response);
            permission = response['permission'];
            // const fields = ['viewUserGroup','editUserGroup', 'viewOrganization', 'editOrganization', 'viewMemberTasks', 'editMemberTasks', 'approveMemberTasks', 'commentMemberTasks', 'viewTeamTasks', 'editTeamTasks', 'approveTeamTasks', 'commentTeamTasks','viewSquadTasks', 'editSquadTasks', 'approveSquadTasks', 'commentSquadTasks','viewDepartmentTasks', 'editDepartmentTasks', 'approveDepartmentTasks', 'commentDepartmentTasks', 'viewTeamGoals', 'editTeamGoals', 'approveTeamGoals', 'commentTeamGoals','viewTimeline', 'editTimeline', 'commentTimeline'];
            // fields.forEach((item)=>{
            //     element = $(parent).find(`[value="${item}"]`);
            //     element.attr('checked', false);
            // });

            $(parent).find('[name = "name"]').val(response["name"]);
            $(parent).find('[name = "description"]').val(response["description"]);

            checkboxes = $(parent).find('[type="checkbox"]');
            checkboxes.each(function(){
                $(this).attr('checked', false);
            });
            

            if (permission instanceof Array){
                permission.forEach((item)=>{
                    element = $(parent).find(`[value="${item}"]`);
                    element.attr('checked', true);
                });
            }

        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
    
}

function genShortName(full_name){
    if (full_name.length > 1){
        let words = full_name.trim().split(" ");
        let short_name = "";
        short_name += words[words.length - 1] + " ";
        for (let i=0; i< words.length - 1; i++){
            short_name += words[i][0];
        }

        return short_name;
    }
}

function loadCompany(elements, preset = null, options = null){
    $.ajax({
        url: base_url + "organization/fetchCompanySelect",
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            for(element of elements){
                $(element).html(response);
                if (options){
                    if (options['disableOthers']){
                        $(element).find(`[value!="${preset}"]`).attr('disabled', true);
                    }
                    if (options['selectPreset']){
                        $(element).find(`[value="${preset}"]`).attr('selected', true);
                    }
                }
            } 
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}
/**
 * Load departments and fill into elements
 * @param {Array} elements 
 * @param {String} preset 
 * @param {Array} options 
 */
function loadDepartments(elements, preset = null, options = null){
    $.ajax({
        url: base_url + "organization/fetchDepartmentSelect",
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            for(element of elements){
                $(element).html(response);
                if (options){
                    if (options['disableOthers']){
                        $(element).find(`[value!="${preset}"]`).attr('disabled', true);
                    }
                    if (options['selectPreset']){
                        $(element).find(`[value="${preset}"]`).attr('selected', true);
                    }
                }
                
            } 
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}

function loadTeams(elements, department_id, preset = null, options=null){
    $.ajax({
        url: base_url + "organization/fetchTeamSelect/"+ department_id,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            for(element of elements){
                $(element).html(response);
                if (options){
                    if (options['disableOthers']){
                        $(element).find(`[value!="${preset}"]`).attr('disabled', true);
                    }
                    if (options['selectPreset']){
                        $(element).find(`[value="${preset}"]`).attr('selected', true);
                    }
                }
            } 
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}

function loadGroups(elements, preset = null){
    $.ajax({
        url: base_url + "groups/fetchGroupSelect",
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            console.log(response);
            for(element of elements){
                $(element).html(response);
            } 
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}

function loadAwardsSelect(elements, preset){
    $.ajax({
        url: base_url + "reports/fetchAwardsSelect",
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            for(element of elements){
                $(element).html(response);

                if (preset){
                    $(element).find(`[value="${preset}"]`).attr('selected', true);
                }
            } 
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}

//#endregion

//#region Load and control tasks

/**
 * Load tasks list to dataTable
 * 
 * @param {*} user_id 
 * @param {*} year 
 * @param {*} month 
 */
function loadTasks(user_id, year, month) {
    table = $('#taskTable').DataTable({
        'ajax': {
            url: `${base_url}tasks/fetchTaskDataByUser/${user_id}/${year}/${month}`,
            type: "POST",
            "deferRender": true,
            dataFilter: function(res) {
                // do what you need to the data before it loads to the table
                // console.log(res);
                return res;
            }
        },
        "ordering": true,
        "orderMulti": true,
        "order": [
            // [4, "asc"],
            // [5, "asc"]
        ],
        "info": false,
        "lengthMenu": [
            [50, 100, -1],
            [50, 100, "All"]
        ],
        "paging": true,
        "scrollX": true,
        "scrollY": "57vh",
        "scrollCollapse": true,
        columnDefs: [{
            // targets: [11],
            // "visible": false,
            // "searchable": false
        }],
        "createdRow": function(row, data, index) {
            $(row).attr("target-id", data[11]);

            // Click event when user click on a row 
            $(row).on('click', (e) => {
                targetId = data[11];
                // $(this).parents().find('table').attr('target-id', data[9]);
            });
        },
        "rowCallback": function(row, data) {

        },
        "initComplete": function(settings, json) {
            tableData = json["data"];
            $('#loader').removeClass('show');
            $('.star-rating').barrating({
                theme: 'css-stars',
                initialRating: 0,
                // showSelectedRating: true
            })
        },
        error: function(x, y) {
            console.log(x);
        }
    });
}

function loadTeamList(elements = ['#team-list'], department_id, company_id, active_team_id = null, options=null){
    $.ajax({
        url: `${base_url}organization/fetchTeamList/${department_id}/${company_id}`,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            // console.log(response)
            elements.forEach((el)=>{
                            
                $(el).html(response);

                if (active_team_id != null){
                    if (options){
                        if (options["selectPreset"]){
                            $(el).find(`[team-id="${active_team_id}"]`).addClass('active');
                            active_team = active_team_id;
                        }
                        if (options["disableOthers"]){
                            $(el).find(`[team-id="${active_team_id}"]`).siblings().addClass('disabled');
                        }
                    }


                } else{
                    first = $(el + ' .select-item').first();
                    $(first).addClass('active');
                    active_team = $(first).attr('team-id');    
                }
    
                $(el + ' .select-item').on('click', function() {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    active_team = $(this).attr('team-id');
                    switch (type){
                        case 'team_tasks':
                            loadUserList(['#team-user-list'],active_team, myDept, myCompany);
                            break;
                        case 'team_report':
                            if (typeof table !== 'undefined'){
                                table.fnDestroy();
                            }
                            loadTeamReport("#reportTable", active_team, year, month);
                            break;
                    }
                });
            });

            
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}

function loadUserList(elements = ['#team-user-list'], team_id, department_id, company_id) {
    // Ajax call for user list 
    $.ajax({
        url: `${base_url}users/fetchUsersList/${company_id}/${department_id}/${team_id}`,
        type: "POST",
        data: [],
        dataType: 'json',
        dataFilter: function(res) {
            // console.log(res);
            return res;
        },
        success: function(response) {
            // console.log(response);
            elements.forEach((el)=>{
                $(el).html(response);

                first = $(el + ' .select-item').first();
                $(first).addClass('active');
                active_user = $(first).attr('user-id');
    
                loadTaskRows(active_user, year, month);
    
                $(el + ' .select-item').on('click', function() {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    active_user = $(this).attr('user-id');
                    active_user_info = {
                        'avatar': $(this).find(".avatar").attr("src"),
                        'name': $(this).text()
                    }
                    loadTaskRows(active_user, year, month);
                    getReport(active_user, year, month);
                });
            });
            
        },
        complete: function() {

        },
        error: function(error) {
            console.log(error);
        }
    });
}



function refreshTaskTable() {
    table.fnDestroy();
    loadTasks(active_user, year, month);
}

/**
 * Load tasks by rows
 * 
 * @param {number} user_id 
 * @param {number} year 
 * @param {number} month 
 */
function loadTaskRows(user_id, year, month){    
    $.ajax({
        cache:false,
        url: `${base_url}tasks/fetchTasksRowByUser/${user_id}/${year}/${month}`,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            resultData = response; 
            $('.tasks-container').html('');
            renderTasks('.tasks-container', resultData);            
            enhanceTasks();      
        }, 
        complete: function() {
            
        },
        error: function(error){
            console.log(error);
        }
    });
}

/**
 * Refresh the only task that get updated
 * @param {Number} taskId 
 */
function refreshTask(taskId, effect = 'shake'){
    $.ajax({
        cache:false,
        url: `${base_url}tasks/fetchSingleTaskById/${taskId}`,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) { 
            let i = resultData.findIndex(x=>x['id'] == response['id']);
            resultData[i] = response;
            
            let taskRow = genTask(response);
            $('.tasks-container').find(`[task-id="${taskId}"]`).replaceWith(taskRow);

            let newTask = $('.tasks-container').find(`[task-id="${taskId}"]`);
            newTask.addClass(`updated ${effect}`);
            setTimeout(()=>newTask.removeClass(`updated ${effect}`),3000);
            enhanceTask(newTask);
            saveReport(active_user, year, month);
        }, 
        complete: function() {

        },
        error: function(error){
            console.log(error);
        }
    });
}


function enhanceTasks(){
    $('.task .rmTaskBtn').on('click', function(e){
        targetId = $(this).parents('.task').attr('task-id');
        approved = $(this).parents('.task').hasClass('approved');

        $('#taskRemoveModal').find('#removeBtn').removeClass('fade');
        
        if (approved){
            $('#taskRemoveModal').find('#removeBtn').addClass('fade');
        }
    });
    $('.task .editTaskBtn').on('click', function(e){
        targetId = $(this).parents('.task').attr('task-id');
        rowData = resultData.filter(x=>x.id == targetId)[0];                
        editModal = $('#taskEditModal');
        $(editModal).find('#editBtn').removeClass('fade');
        
        if (rowData['status'] == '5' && !permission.includes('approveMemberTasks')){
            $(editModal).find('#editBtn').addClass('fade');
        }

        for (let key in rowData){ 
            $(editModal).find(`[name="${key}"]:not(.date-picker)`).val(blankIt(rowData[key])); 
            $(editModal).find(`[name="${key}"].date-picker`).val(blankIt(rowData[key])); 

            element = $(editModal).find(`[name="${key}"].date-picker`);
            if (element.length == 0) continue;
            if (rowData[key]){
                element.data('daterangepicker').setStartDate(convertDateFormat(rowData[key],"yyyy-mm-dd", "dd/mm/yyyy") ); 
                element.data('daterangepicker').setEndDate(convertDateFormat(rowData[key],"yyyy-mm-dd", "dd/mm/yyyy") ); 
            }

        }    

        $(editModal).find('.star-rating').eq(0).barrating('set',blankIt(rowData['rating']));
        
        $(editModal).find('.score span').eq(0).text(rowData['overall']);
        
        let planDuration = (Date.parse(rowData["plan_complete"]) - Date.parse(rowData["plan_start"]))/(24*3600*1000) + 1;
        $(editModal).find('[name="duration"]').val(planDuration);
    });    

    $('.task .sendBtn').on("click",function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let text = $(this).prev();
        content = $(text).val().trim();

        updateTask(targetId, ["remarks"],[content],()=>loadTaskRows(active_user, year, month));
    });

    $('.task').find('textarea').on("input", function(){
            this.style.height = "";
            this.style.height = this.scrollHeight + "px";
    });
     
        
    $('.task').find('.star-rating').barrating({
        theme:'css-stars',
        readonly: (permission.includes('approveMemberTasks'))? false: true,
        onSelect: function(value, text, event) {
            if (typeof(event) !== 'undefined') {                
                score_div = (this.$elem.parents('.task-assessment')).find('.score span');
                
                let taskId = $(this)[0].$elem.parents('.task').attr('task-id');
                let task = resultData.filter(x=>x['id']==taskId)[0];
                let ratings = taskRating(task, value);
                if (ratings['overall']==null){
                    return false;
                }
                task_score = parseInt(ratings['overall']);
                score_div.text(ratings['overall']);

                approveTask(taskId, ["status","rating","productivity", "efficiency", "overall"],
                ["5",value, ratings["productivity"], ratings["efficiency"],ratings["overall"]],
                ()=>refreshTask(taskId, 'blast') );
            }
        }
    });
    $('.task .startBtn').on("click", function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let rowData = resultData.filter(x=>x.id == targetId)[0]; 
        let date = new Date(); 
        let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        updateTask(targetId, ["status", "actual_start"],["1", today],()=>refreshTask(targetId) );
    })
    $('.task .stopBtn').on("click", function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let date = new Date(); 
        let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        updateTask(targetId, ["status", "actual_complete"],["3", today],()=>refreshTask(targetId) );

    })
}

function enhanceTask(taskElement){
    let taskId = $(taskElement).attr('task-id');
    rowData = resultData.filter(x=>x.id == taskId)[0]; 

    $(taskElement).find('.rmTaskBtn').on('click', function(e){
        targetId = $(this).parents('.task').attr('task-id');
        approved = $(this).parents('.task').hasClass('approved');

        $('#taskRemoveModal').find('#removeBtn').removeClass('fade');
        
        if (approved){
            $('#taskRemoveModal').find('#removeBtn').addClass('fade');
        }
        // console.log(targetId);
    });
    $(taskElement).find('.editTaskBtn').on('click', function(e){
        targetId = $(this).parents('.task').attr('task-id');
        rowData = task = resultData.filter(x=>x.id == targetId)[0];    
            
        editModal = $('#taskEditModal');
        $(editModal).find('#editBtn').removeClass('fade');
        
        if (rowData['status'] == '5'){
            $(editModal).find('#editBtn').addClass('fade');
        }

        for (let key in rowData){ 
            $(editModal).find(`[name="${key}"]:not(.date-picker)`).val(blankIt(rowData[key])); 
            $(editModal).find(`[name="${key}"].date-picker`).val(blankIt(rowData[key])); 

            element = $(editModal).find(`[name="${key}"].date-picker`);
            if (element.length == 0) continue;
            if (rowData[key]){
                element.data('daterangepicker').setStartDate(convertDateFormat(rowData[key],"yyyy-mm-dd", "dd/mm/yyyy") ); 
                element.data('daterangepicker').setEndDate(convertDateFormat(rowData[key],"yyyy-mm-dd", "dd/mm/yyyy") ); 
            }
        }    

        $(editModal).find('.star-rating').eq(0).barrating('set',blankIt(rowData['rating']));
        $(editModal).find('.score span').eq(0).text(rowData['overall']);
        
        let planDuration = (Date.parse(rowData["plan_complete"]) - Date.parse(rowData["plan_start"]))/(24*3600*1000) + 1;
        $(editModal).find('[name="duration"]').val(planDuration);
    });    

    $(taskElement).find('.sendBtn').on("click",function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let text = $(this).prev();
        content = $(text).val().trim();

        updateTask(targetId, ["remarks"],[content],()=>refreshTask(targetId));
    })

    $(taskElement).find('textarea').on("input", function(){
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
    });
    
        
    $(taskElement).find('.star-rating').barrating({
        theme:'css-stars',
        readonly: (permission.includes('approveMemberTasks'))? false: true,
        onSelect: function(value, text, event) {
            if (typeof(event) !== 'undefined') {
                score_div = (this.$elem.parents('.task-assessment')).find('.score span');
                
                // let taskId = $(this)[0].$elem.parents('.task').attr('task-id');
                let task = resultData.filter(x=>x['id']==taskId)[0];
                let ratings = taskRating(task, value);
                if (ratings['overall']==null){
                    return false;
                }
                task_score = parseInt(ratings['overall']);
                score_div.text(ratings['overall']);

                approveTask(taskId, ["status","rating","productivity", "efficiency", "overall"],
                ["5",value, ratings["productivity"], ratings["efficiency"],ratings["overall"]],
                ()=>refreshTask(taskId, 'blast') );

            }
        }
    });
    $(taskElement).find('.star-rating').eq(0).barrating('set',blankIt(rowData['rating']));


    $(taskElement).find('.startBtn').on("click", function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let rowData = resultData.filter(x=>x.id == targetId)[0]; 
        let date = new Date(); 
        let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        updateTask(targetId, ["status", "actual_start"],["1", today],()=>refreshTask(targetId) );
    })
    $(taskElement).find('.stopBtn').on("click", function(){
        let targetId = $(this).parents('.task').attr('task-id');
        let date = new Date(); 
        let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

         updateTask(targetId, ["status", "actual_complete"],["3", today],()=>refreshTask(targetId) );
    })
}

/**
 * 
 * @param {*} element 
 * @param {*} team_id 
 * @param {*} year 
 * @param {*} month 
 */
function loadTeamReport(element = '#reportTable', team_id, year, month){
    if (typeof table != 'undefined'){
        table.fnDestroy();
    }
    table = $(element).dataTable({
        'ajax': {
            url: `${base_url}reports/fetchReportByTeam/${team_id}/${year}/${month}`,
            type: "POST",
            "deferRender": true,
            dataFilter: function(res) {
                // console.log(res);
                return res;
            }
        },
        "ordering": true,
        "orderMulti": true,
        "order": [
            // [4, "asc"],
            // [5, "asc"]
        ],
        "info": false,
        "lengthMenu": [
            [50, 100, -1],
            [50, 100, "All"]
        ],
        "paging": true,
        "scrollX": true,
        "scrollY": "55vh",
        "scrollCollapse": true,
        columnDefs: [{
            // targets: [11],
            // "visible": false,
            // "searchable": false
        }],
        "createdRow": function(row, data, index) {
            $(row).attr("target-id", data[12]);

            // Click event when user click on a row 
            $(row).on('click', (e) => {
                targetId = data[12];
                targetAward.rate = data[13]!=null? parseInt(data[13]):'';
                targetAward.remarks = data[11];
            });
        },
        "rowCallback": function(row, data) {

        },
        "initComplete": function(settings, json) {
            tableData = json["data"];
            $('#loader').removeClass('show');
            count = tableData.length;

            max_excellent = Math.round(count * 0.05,0);
            max_good = Math.round(count * 0.1,0) ;

            excellent = tableData.filter(x=>x[13]==1||x[13]==2).length;
            good = tableData.filter(x=>x[13]==3||x[13]==4).length;
            // console.log(tableData);

            $('#max-excellent').text(max_excellent);
            $('#excellent').text(excellent);
            $('#max-good').text(max_good);
            $('#good').text(good);
        },
        error: function(x, y) {
            console.log(x);
        }
    });


}

function loadDepartmentReport(element = '#reportTable', department_id, year, month){
    if (typeof table != 'undefined'){
        table.fnDestroy();
    }
    table = $(element).dataTable({
        'ajax': {
            url: `${base_url}reports/fetchReportByDepartment/${department_id}/${year}/${month}`,
            type: "POST",
            "deferRender": true,
            dataFilter: function(res) {
                // console.log(res);
                return res;
            }
        },
        "ordering": true,
        "orderMulti": true,
        "order": [
            // [4, "asc"],
            // [5, "asc"]
        ],
        "info": false,
        "lengthMenu": [
            [50, 100, -1],
            [50, 100, "All"]
        ],
        "paging": true,
        "scrollX": true,
        "scrollY": "55vh",
        "scrollCollapse": true,
        columnDefs: [{
        }],
        "createdRow": function(row, data, index) {
            $(row).attr("target-id", data[12]);

            // Click event when user click on a row 
            $(row).on('click', (e) => {
                targetId = data[7];
                targetAward.rate = data[8]!=null? parseInt(data[8]):'';
                targetAward.remarks = data[6];
            });
        },
        "rowCallback": function(row, data) {

        },
        "initComplete": function(settings, json) {
            tableData = json["data"];
            $('#loader').removeClass('show');
            count = tableData.length;

            max_excellent = Math.round(count * 0.05,0);
            max_good = Math.round(count * 0.1,0) ;

            excellent = tableData.filter(x=>x[8]==1||x[8]==2).length;
            good = tableData.filter(x=>x[8]==3||x[8]==4).length;
            // console.log(tableData);

            $('#max-excellent').text(max_excellent);
            $('#excellent').text(excellent);
            $('#max-good').text(max_good);
            $('#good').text(good);
        },
        error: function(x, y) {
            console.log(x);
        }
    });


}

/**
 * 
 * @param {DOM} element 
 * @param {*} department_id 
 * @param {*} year 
 * @param {*} month 
 */
function loadExcellent(element = '#excellentTable', department_id, year, month){
    if (typeof excellentTable != 'undefined'){
        excellentTable.fnDestroy();
    }
    excellentTable = $(element).dataTable({
        'ajax': {
            url: `${base_url}reports/fetchAwardDepartment/excellent/${department_id}/${year}/${month}`,
            type: "POST",
            "deferRender": true,
            dataFilter: function(res) {
                // console.log(res);
                return res;
            }
        },
        "ordering": true,
        "orderMulti": true,
        "order": [
            // [4, "asc"],
            // [5, "asc"]
        ],
        "scrollX": true,
        "info": false,
        "paging": false,
        'searching':false,
        "lengthMenu": [
            [50, 100, -1],
            [50, 100, "All"]
        ],
        
        "createdRow": function(row, data, index) {
            $(row).attr("target-id", data[12]);

            // Click event when user click on a row 
            $(row).on('click', (e) => {
                targetId = data[4];
                targetAward.rate = data[3]!=null? parseInt(data[5]):'';
                targetAward.remarks = data[3];
            });
        },
        "rowCallback": function(row, data) {

        },
        "initComplete": function(settings, json) {
            tableExcellent = json["data"];
            $('#loader').removeClass('show');
        },
        error: function(x, y) {
            console.log(x);
        }
    });
}

function loadGood(element = '#goodTable', department_id, year, month){
    if (typeof goodTable != 'undefined'){
        goodTable.fnDestroy();
    }
    goodTable = $(element).dataTable({
        'ajax': {
            url: `${base_url}reports/fetchAwardDepartment/good/${department_id}/${year}/${month}`,
            type: "POST",
            "deferRender": true,
            dataFilter: function(res) {
                // console.log(res);
                return res;
            }
        },
        "ordering": true,
        "orderMulti": true,
        "order": [
            // [4, "asc"],
            // [5, "asc"]
        ],
        "scrollX": true,
        "info": false,
        "paging": false,
        'searching':false,
        "lengthMenu": [
            [50, 100, -1],
            [50, 100, "All"]
        ],
        
        "createdRow": function(row, data, index) {
            $(row).attr("target-id", data[12]);

            // Click event when user click on a row 
            $(row).on('click', (e) => {
                targetId = data[4];
                targetAward.rate = data[3]!=null? parseInt(data[5]):'';
                targetAward.remarks = data[3];
            });
        },
        "rowCallback": function(row, data) {

        },
        "initComplete": function(settings, json) {
            tableGood = json["data"];
        },
        error: function(x, y) {
            console.log(x);
        }
    });
}

/**
 * Update task on quick buttons
 * 
 * @param {Number} id 
 * @param {Array} fields 
 * @param {Array} values 
 * @param {Function} callback 
 */
function updateTask(id, fields, values, callback){
    try{
        push_data = {};
        fields.forEach((f)=>{
            push_data[f] = values[fields.indexOf(f)];
        });

        $.ajax({
            url: `${base_url}tasks/update/${id}`,
            type: "POST",
            data: push_data ,
            dataType: 'json',
            beforeSend: function(data){
                // console.log(data);
            },
            dataFilter: function(res){
                // console.log(res);
                return res;
            },
            success: function(response) {
                // setTimeout(callback, 200);
                setTimeout(callback, 0);

            }, 
            complete: function(){
                
                
            },
            error: function(error){
                console.log(error);
            }
        });
        
    }         
    catch (e){
        console.log(e);
    }
}



/**
 * Approve task on quick buttons
 * 
 * @param {Number} id 
 * @param {Array} fields 
 * @param {Array} values 
 * @param {Function} callback 
 */
 function approveTask(id, fields, values, callback){
    try{
        push_data = {};
        fields.forEach((f)=>{
            push_data[f] = values[fields.indexOf(f)];
        });

        $.ajax({
            url: `${base_url}tasks/approve/${id}`,
            type: "POST",
            data: push_data ,
            dataType: 'json',
            beforeSend: function(data){
                // console.log(data);
            },
            dataFilter: function(res){
                // console.log(res);
                return res;
            },
            success: function(response) {
                // setTimeout(callback, 200);
                setTimeout(callback, 0);

            }, 
            complete: function(){
                
                
            },
            error: function(error){
                console.log(error);
            }
        });
        
    }         
    catch (e){
        console.log(e);
    }
}

/**
 * Evaluate task
 * @param {JSON} task JSON object of task delivered from server
 * @param {Number} leaderRate optional rate by user
 * @returns set of ratings based on task parameters
 */
function taskRating(task, leaderRate = null){    
    let taskId =  task['id'];
    if (task['actual_start']== null || task['actual_complete'] == null){
        showSnackbar('error', 'This task has not been completed. Please complete it first.');
        return result = {
            "taskId": taskId,
            "productivity": 0,
            "efficiency": 0,
            "rating": 0,
            "overall": null
        };
    }
    let rate , productivity , efficiency , overall;
    let planDuration = (Date.parse(task['plan_complete'])  - Date.parse(task['plan_start']))/(24*3600*1000);
    let actualDuration = (Date.parse(task['actual_complete'])  - Date.parse(task['actual_start']))/(24*3600*1000);

    let span = actualDuration - planDuration;
    let overdue = (Date.parse(task['actual_complete']) - Date.parse(task['deadline']))/(24*3600*1000);
    
    if (overdue > 3){
        efficiency = 0.98;
    } else if (overdue <= 3 && overdue > 1){
        efficiency = 0.99;
    } else if (overdue <= 1 && overdue > -1){
        efficiency = 1;
    } else if (overdue <= -1 && overdue > -3){
        efficiency = 1.01;
    } else {
        efficiency = 1.02;
    }

    if (span > 3){
        productivity = 0.98;
    } else if (span <= 3 && span > 1){
        productivity = 0.99;
    } else if (span <= 1 && span > -1){
        productivity = 1;
    } else if (span <= -1 && span > -3){
        productivity = 1.01;
    } else {
        productivity = 1.02;
    }

    if (leaderRate){
        rate =rating[leaderRate];
    }
    else {
        rate = rating[task["rating"]];
    }    

    overall = Math.floor(rate * productivity * efficiency * 0.7) ;
    if (overall > 100) overall = 100;
    result = {
        "taskId": taskId,
        "productivity": productivity,
        "efficiency": efficiency,
        "rating": rate,
        "overall": overall
    }
    return result;
}

/**
 * Calculate and return overall score of all tasks
 * @param {Array} tasks List of tasks
 * @returns overall score
 */
function overallScore(tasks){
    let overall = 0;
    let sumWeight = 0;
    let weightedScore = 0;
    tasks.forEach((task)=>{
        weight = (task['weight'])? parseInt(task['weight']):0;
        score = (task['overall'])? parseInt(task['overall']):0;
        sumWeight += weight;
        weightedScore += weight * score;
    });   

    overall = Math.floor(weightedScore / sumWeight);
    result = {
        "total_weight": sumWeight,
        "overall_score": overall
    }
    return result;
}

function summarizeTasks(tasks){
    let total, ongoing, completed, overdue, missdeadline;
    let today =  new Date();

    total = tasks.length;
    ongoing = tasks.filter(x=>(x['status']=='1')).length;
    completed = tasks.filter(x=>(x['status']=='3' || x['status']=='5')).length;
    overdue = 0;
    overdue = tasks.filter(x=>(x['actual_complete']==null && ((today - Date.parse(x['deadline']))/(24*3600*1000) > 0 ))).length;
    missdeadline = tasks.filter(x=>((Date.parse(x['actual_complete']) - Date.parse(x['deadline']))/(24*3600*1000) < 0)).length;

    result = {
        'total': total,
        'ongoing': ongoing,
        'completed': completed,
        'overdue': overdue, 
        'missdeadline': missdeadline
    }
    return result;
}

function summarizeMonth(){
    
    regulation_score = regulation[$('#regulation-rating').val()];
    sumWeight = overallScore(resultData)["total_weight"];
    overall_score = overallScore(resultData)["overall_score"];
    month_score = parseInt(overall_score + regulation_score) ;
    
    $('.total-weight span').text(sumWeight + '%');
    $('.task-score span').text(overall_score);
    $('.month-score span').text(month_score);

    $(`[name="total_weight"]`).val(sumWeight);
}


function renderTasks(container, tasks, options = null){  
    
    tasks.forEach((task)=>{
        index = tasks.indexOf(task);        
        $(container).append(genTask(task));  
        
        $(container).find('.star-rating').eq(index).val(task["rating"]);        
    });    

    summarizeMonth();
    
}

function genTask(task){
    let result = '';
    let status = '';
    let status_card = '';
    let priority = '';
    let status_action = '';
    let today = new Date();
    switch (task['status']){
        case '0':
            status = 'idle';
            status_card = 'Not yet started';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs startBtn"><i class="fas fa-play fa-fw"></i></button>';
            break;
        case '1':
            status = 'ongoing';
            status_card = 'Ongoing';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs stopBtn"><i class="fas fa-stop fa-fw"></i></button>';
            break;
        // case '2':
        //     status = 'upcoming';
        //     status_card = 'Upcoming';
        //     status_action = '<button class="btn btn-outline-light btn-circle btn-xs stopBtn"><i class="fas fa-play fa-fw"></i></button>';
        //     break;
        case '3':
            status = 'completed';
            status_card = 'Completed';
            status_action = '';
            break;
        case '4':
            status = 'overdue';
            status_card = 'Overdue';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs stopBtn"><i class="fas fa-stop fa-fw"></i></button>';

            break;
        case '5':
            status = 'approved';
            status_card = 'Approved';
            status_action = '';
            break;
        default:
            status = 'idle';
            status_card = 'Not yet started';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs startBtn"><i class="fas fa-play fa-fw"></i></button>';
            break;
    }
    dateSpan = (Date.parse(task['deadline'])  - today)/(24*3600*1000);
    if (task['status']!= '5' && task['status']!='3' && dateSpan <= 3){

        if (task['actual_complete'] == null && task['actual_start'] == null  && dateSpan <= 3 && dateSpan >= 0){
            status = 'upcoming';
            status_card = 'Upcoming';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs startBtn"><i class="fas fa-play fa-fw"></i></button>';
        } 
        else if (task['actual_complete'] == null && task['actual_start'] != null  && dateSpan <= 3 && dateSpan >= 0){
            status = 'upcoming';
            status_card = 'Upcoming';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs stopBtn"><i class="fas fa-stop fa-fw"></i></button>';
        }        
        else if (task['actual_complete'] == null && dateSpan < 0){
            status = 'overdue';
            status_card = 'Overdue';
            status_action = '<button class="btn btn-outline-light btn-circle btn-xs stopBtn"><i class="fas fa-stop fa-fw"></i></button>';
        }
    }
    switch (task['priority']){
        case '0':
            priority = '<span class="badge badge-info"><i class="far fa-snowflake fa-fw"></i></span>';
            break;
        case '1':
            priority = '<span class="badge badge-warning"><i class="fas fa-fire-alt fa-fw"></i></span>';
            break;
        case '2':
            priority = '<span class="badge badge-danger"><i class="fas fa-fire-alt fa-fw"></i><i class="fas fa-fire-alt fa-fw"></i></span>';
            break;
        case '3':
            priority = '<span class="badge badge-danger"><i class="fas fa-fire-alt fa-fw"></i><i class="fas fa-fire-alt fa-fw"></i><i class="fas fa-fire-alt fa-fw"></i></span>';
            break;

    }
    result += `<div class="task ${status}" task-id=${task['id']}>                
                <div class="task-header ui-state-default">
                        <img class="avatar" src="${base_url+task['pic_ava']}" >
                        <span class="full-name">${task['pic_name']}</span>

                        <span class="status d-none d-sm-inline ml-4">
                                <i class="fas fa-chart-line fa-fw"></i>
                                ${status_card}
                        </span> 

                        <div class="right">
                            <i class="far fa-clock"></i>
                            <span class="created-date">${convertDateFormat((task['created_date']).substring(0,10),'yyyy-mm-dd','dd/mm/yyyy')}</span>
                            
                             
                            <div class="task-tools ml-2">
                                ${status_action}
                                <button class="btn btn-outline-light btn-circle btn-xs editTaskBtn" data-toggle="modal" data-target="#taskEditModal"><i class="far fa-edit fa-fw"></i></button>
                                <button class="btn btn-outline-light btn-circle btn-xs rmTaskBtn" data-toggle="modal" data-target="#taskRemoveModal"><i class="far fa-trash-alt fa-fw"></i></button>
                            </div>
                        </div> 
                    </div>
                
                <div class="task-body row">                    
                    <div class="task-info row col-lg-4 col-sm-12 col-12"> 
                        <div class="weight has-tooltip col-xl-4 col-sm-4 col-6">
                            <i class="fas fa-weight-hanging fa-fw"></i>
                            <span class="weight">${task['weight']}%</span>
                            <div class="tooltip-text top left">Weight</div>
                        </div>                        
                        <div class="priority has-tooltip col-lg-4 col-sm-4 col-6">
                            <i class="fas fa-temperature-high fa-fw"></i>
                            ${priority}
                            <div class="tooltip-text top left">Priority</div>
                        </div>
                        <div class="project has-tooltip col-lg-4 col-sm-4 col-6">
                            <i class="fas fa-building fa-fw"></i> 
                            <span>${task['project']}</span>                            
                            <div class="tooltip-text top left">Project</div>
                        </div>              
                        
                        <div class="deadline has-tooltip col-lg-4 col-sm-4 col-6">
                            <i class="fas fa-hourglass-end fa-fw"></i>
                            <span class="deadline">${convertDateFormat(task['deadline'],'yyyy-mm-dd','dd/mm/yyyy')}</span>
                            <div class="tooltip-text top left">Deadline</div>
                            </div>             
                        <div class="planFromTo has-tooltip col-lg-4 col-sm-4 col-6">
                            <i class="far fa-play-circle fa-fw"></i>
                            <span class="plan">${convertDateFormat(task['plan_start'],'yyyy-mm-dd','dd/mm/yyyy')}</span>
                            <div class="tooltip-text top left">Plan Start</div>
                        </div>
                        <div class="planFromTo has-tooltip col-lg-4 col-sm-4 col-6">
                            <i class="far fa-stop-circle fa-fw"></i>
                            <span class="plan">${convertDateFormat(task['plan_complete'],'yyyy-mm-dd','dd/mm/yyyy')}</span>
                            <div class="tooltip-text top left">Plan Complete</div>
                        </div>
                                                    
                        
                    </div>
                    <div class="task-description has-tooltip col-lg-4 col-md-12 col-12"> 
                        <span>${task['description']}</span>
                        <div class="tooltip-text top left">Task description</div>
                        </div>
                    <div class="task-remarks has-tooltip col-lg-2 col-md-12 col-12">
                        
                        <textarea class="custom-scrollbar">${blankIt(task['remarks'])}</textarea>
                        <div class="btn btn-circle btn-xs btn-within sendBtn">
                            <i class="fas fa-check"></i>
                        </div>                                                 
                        <div class="tooltip-text top left">Remarks</div>
                    </div>  
                    <div class="task-assessment row col-lg-2 col-md-12 col-12">
                        <div class="rating has-tooltip col-lg-12 col-md-8 col-8">
                            <select class="star-rating">
                                <option value="">Not rated</option>
                                <option value="0">Not comply</option>
                                <option value="1">Acceptable (II)</option>
                                <option value="2">Acceptable (I)</option>
                                <option value="3">Good (II)</option>
                                <option value="4">Good (I)</option>
                                <option value="5">Excellent (II)</option>
                                <option value="6">Excellent (I)</option>
                            </select>
                            <div class="tooltip-text top left">Leader rating</div>
                        </div>
                        <div class="score col-lg-12 col-md-4 col-4">
                            <span>${blankIt(task['overall'],"-")}</span> 
                        </div>
                    </div>
                </div>
                    
            </div>`;


    return result;
}
//#endregion

//#region Regulation
function getReport(userId, year, month){
    $.ajax({
        url: `${base_url}reports/fetchReportByUser/${userId}/${year}/${month}`,
        data: [],
        dataType: 'JSON',
        type: 'POST',
        beforeSend: function(){

        }, 
        dataFilter: function(res){
            return res;
        },
        success: function(response){
            // console.log(response)
            if (response){
                $('#regulation-rating').barrating('set', response['regulation']);

                $('.regulation-score span').text(regulation[response['regulation']]);
                regulation_score = regulation[response['regulation']];
                $('.overall-score span').text(response['overall']);
                overall_score = response['overall'];
                $('.month-score span').text(response['month_score']);
                month_score = response['month_score'];
            }
            else {
                $('#regulation-rating').barrating('set', "");

                $('.regulation-score span').text(regulation[""]);
                regulation_score = 0;
                $('.overall-score span').text("-");
                overall_score = 0;
                $('.month-score span').text("-");
                month_score = 0;
            }
            summarizeMonth();

            
        },
        error: function(error){

        },
        complete: function(){

        }
    })
}

function saveReport(userId, year, month){
    // console.log($('#regulation-rating').val())
    summarizeMonth();
    data1 = summarizeTasks(resultData);
    data2 = {
        "company_id": myCompany,
        "department_id": myDept,
        "team_id": myTeam,
        "user_id": userId,
        "year": year,
        "month": month,
        "regulation":$('#regulation-rating').val(),
        "overall": overall_score,
        "month_score": month_score
    }
    $.ajax({
        url: `${base_url}reports/saveReportByUser/${userId}/${year}/${month}`,
        data: {...data1, ...data2},
        dataType: 'JSON',
        type: 'POST',
        beforeSend: function(){

        }, 
        dataFilter: function(res){
            return res;
        },
        success: function(response){
            getReport(userId, year, month);

        },
        error: function(error){

        },
        complete: function(){

        }
    })
}


//#endregion


//#region Utility functions

function convertDateFormat(input, format_from='dd/mm/yyyy', format_to='yyyy-mm-dd') {
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

var getLatestYears = $.ajax({
        cache:false,
        url: `${base_url}tasks/getLatestYears`,
        type: "POST",
        data: [],
        dataType: 'json',
        beforeSend: function() {

        },
        dataFilter: function(res){
            // console.log(res);
            return res;
        },
        success: function(response) {
        //    console.log(response);
        },
        error: function(error){
            console.log(error);
        }, 
        complete: function() {

        }
    });

    function blankIt(input, defaultOutput = ""){
    if (input == null){
        return defaultOutput;
    }
    return input.trim();
}   

//#endregion

//#region Chart.js
var myChart;
var myPie;
var barChartImg;
var pieChartImg;

function showPieChart(labels, data1) {
    myPie = new Chart($('#pieChart'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Payment Percentage',
                data: [data1[0], data1[1]],
                backgroundColor: ["rgba(149, 117, 205, 0.8)", "rgba(236,64,122 ,0.8)"],
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
                display: true,
                text: 'PAYMENT PERCENTAGE'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.index] || '';
                        if (label) {
                            label += ': ';
                        }
                        label += Intl.NumberFormat().format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);

                        console.log(tooltipItem)
                        console.log(data)
                        return label;
                    }

                }
            },
            animation: {
                onComplete: pieRendered
            },
        }
    })
}

function showColumnChart(labels, data1, data2, data3, data4) {
    myChart = new Chart($('#stackedChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Total Received (VND)',
                    data: data1,
                    backgroundColor: 'rgba(62, 129, 205, 0.8)',
                    borderColor: 'rgba(62, 129, 205, 1)',
                    type: "bar",
                    borderWidth: 1,
                    yAxisID: 'y-left',
                },
                {
                    label: 'Total Pending (VND)',
                    data: data2,
                    backgroundColor: 'rgba(149, 117, 205, 0.8)',
                    borderColor: 'rgba(149, 117, 205, 1)',
                    type: "bar",
                    borderWidth: 1,
                    fill: false,
                    yAxisID: 'y-left',
                },
                {
                    label: 'Accum. Total (VND)',
                    data: data3,
                    backgroundColor: 'rgba(84,110,122 ,0.1)',
                    borderColor: 'rgba(84,110,122 ,1)',
                    type: "line",
                    borderWidth: 2,

                    yAxisID: 'y-right',
                },
                {
                    label: 'Accum. Received (VND)',
                    data: data4,
                    backgroundColor: 'rgba(0, 178, 148, 0.1)',
                    borderColor: 'rgba(0, 178, 148, 1)',
                    type: "line",
                    borderWidth: 2,
                    yAxisID: 'y-right',
                },
            ]
        },
        options: {
            responsive: false,
            bezierCurve: false,
            maintainAspectRatio: true,
            legend: {
                position: 'top' // place legend on the top side of chart
            },
            title: {
                display: true,
                text: 'PAYMENT RECEIVED PER MONTH'
            },
            scales: {
                yAxes: [{
                    display: true,
                    position: 'left',
                    type: "linear",
                    id: "y-left",
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            // return number_format(value);
                            return Intl.NumberFormat().format((value / 1000000)) + 'M';
                        }
                    }
                }, {
                    display: true,
                    position: 'right',
                    type: "linear",
                    id: "y-right",
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            // return number_format(value);
                            return Intl.NumberFormat().format((value / 1000000)) + 'M';
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
                    }
                }
            },

            animation: {
                onComplete: barRendered
            },


        }
    });
}

function barRendered() {
    // barChartImg = $('#stackedChart').toDataURL("image/png");
    barChartImg = myChart.toBase64Image();
    // console.log(barChartImg);
}

function pieRendered() {
    pieChartImg = myPie.toBase64Image();
    // console.log(pieChartImg);
}

//#endregion

