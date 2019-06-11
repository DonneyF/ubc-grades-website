/*-----------------------------------
* Dropdowns
*-----------------------------------*/
// Load the years on document ready
function onCourseProfilePageLoad() {
    $.ajax({
        url: "https://ubcgrades.com/api/subjects",
        type: "GET",
        success: function (response) {
            $('#cp-dropdown-subject').selectize({
                // Build option array
                options: response.map(x => ({'value': x, 'text': x})),
                onChange: updateCPCourseNumberDropDown
            });
        },
        error: function (response) {
            console.log("Error");
        }
    });
    $('#cp-dropdown-avg-years').selectize({
        plugins: ['remove_button'],
        persist: false,
        maxItems: null,
        inputClass: 'form-control selectize-input',
        dropdownParent: 'body',
        onChange: function(e) {updateAverageDistributionsChart(null)}
    });
    let options = {
        info: false,
        responsive: true,
        paging: false,
        searching: false,
        scrollY: 200,
    };
    $('#cp-instructors').DataTable(options);
    $('#cp-offerings').DataTable(options);
};

function updateCPCourseNumberDropDown(subject) {
    $.ajax({
        url: `https://ubcgrades.com/api/courses/${subject}`,
        type: "GET",
        success: function (response) {
            let control = $('#cp-dropdown-course').selectize()[0].selectize;
            let data = response.map(x => ({'value': x, 'text': x}));
        
            control.clear(true);
            control.clearOptions();
            control.load(function(callback) {
                callback(data);
            });

            control.open();
        },
        error: function (response) {
            console.log("Error");
        }
    });
}

function updateAverageDistributionsDropdown(avgDistsArr) {
    let control = $('#cp-dropdown-avg-years').selectize()[0].selectize;
    // Get all the years
    let yearsessions = avgDistsArr.map(x => x.yearsession);
    yearsessions = yearsessions.filter(x => x != 'TOTAL');
    let data = yearsessions.map(x => ({'value': x, 'text': x}));

    control.clear(true);
    control.clearOptions();
    control.load(function(callback) {
        callback(data);
    });
}

function clearAverageDistributionsDropdown(clearAll) {
    let control = $('#cp-dropdown-avg-years').selectize()[0].selectize;
    if(clearAll) control.clear(true);
    control.clearOptions();
}
/*-----------------------------------
* API submission
*-----------------------------------*/

// AJAX Requests
function getCourseProfileData(button, subject, course) {
    let $button = $(button);
    let loadingText = '<i class="fa fa-circle-o-notch fa-spin mr-1"></i> Loading...';
    if ($button.html() !== loadingText) {
        $button.data('original-text', $button.html());
        $button.addClass('disabled');
        $button.html(loadingText);
    }

    // Make multiple AJAX requests
    $.when(
        $.ajax({
            url: `https://ubcgrades.com/api/course-profile/${subject}/${course}`,
            type: "GET",
            // A way for passing in variables to success/error callbacks
            indexValue: {$button: $button}
        }),
        $.get(`https://ubcgrades.com/api/course-profile/averages/${subject}/${course}`),
        $.get(`https://ubcgrades.com/api/course-profile/distributions/${subject}/${course}`),
        $.get(`https://ubcgrades.com/api/course-profile/instructors/${subject}/${course}`),
        $.get(`https://ubcgrades.com/api/course-profile/offerings/${subject}/${course}`)
    ).then(onSuccessCP, onFailCP);
}

function onSuccessCP(generalResp, avgHistResp, avgDistsResp, instructorsResp, offeringsResp){
    // Each variable argument are lists of length 3 containing the response text,
    // status, and jqXHR object for each of the ajax calls respectively.
    $button = this[0].indexValue.$button;
    if ($.isEmptyObject(generalResp[0])) {
        onFailCP();
    } else {
        // Display the data
        delete avgHistResp[0].course;
        updateCourseProfileGeneral(generalResp[0], avgHistResp[0]);
        updateAverageHistoryChart(avgHistResp[0]);
        updateAverageDistributionsDropdown(avgDistsResp[0]);
        updateAverageDistributionsChart(avgDistsResp[0]);
        updateInstructorsTable(instructorsResp[0]);
        updateOfferingsTable(offeringsResp[0])
    }
    $button.html($button.data('original-text'));
    $button.removeClass('disabled');
}

function onFailCP() {
    displayError('Invalid course, or course does not exist.');
    clearCP();
}

function clearCP() {
    clearCourseProfileGeneral();
    clearAverageHistoryDistChart();
    clearAverageDistributionsChart();
    clearInstructorsTable();
    clearOfferingsTable();
    clearAverageDistributionsDropdown(true);
}

/*-----------------------------------
* Entry Points
*-----------------------------------*/

// Takes an input string and attempts to extract an array containing SUBJECT and COURSE
function parseCPID(inputStr) {
    // Remove all non-character/numbers
    let stripped = inputStr.replace(/(?![A-Za-z0-9]+)./gi, "");
    // Split the result into 4 groups by regex. Index 0 contains the full match
    let results = stripped.match(/([A-Z]+?(?=[0-9]))([0-9]{1,3}[A-Z]?)/i)

    if (results.length != 3) return false;
    if (results[2].length != 3) return false;

    return results.slice(1, 3).map(str => str.toUpperCase());
}

$("#cp-id-btn").click(function(){
    let idSplit = parseCPID($('#cp-id-text').val());
    if (idSplit.length != 2 || idSplit == false) {
        displayError('Invalid ID. Check again');
        clearCP();
    } else {
        getCourseProfileData('#cp-id-btn', idSplit[0], idSplit[1]);
    }
});
// Launch if user hits enter.
$('#cp-id-text').keypress(function(e) {
    if (e.which == 13) {
        let idSplit = parseCPID($('#cp-id-text').val());
        if (idSplit.length != 2 || idSplit == false) {
            displayError('Invalid ID. Check again');
            clearCP();
        } else {
            getCourseProfileData('#cp-id-btn', idSplit[0], idSplit[1]);
        }
    }
});
$("#cp-form").submit(function(){
    getCourseProfileData('#cp-submit-btn', $('#cp-dropdown-subject').val(), $('#cp-dropdown-course').val());
    return false; // Don't refresh the page.
});

/*-----------------------------------
* Data Callbacks
*-----------------------------------*/

function updateCourseProfileGeneral(generalData, avgHistData) {
    // Overall Average
    $('#overall-avg')[0].innerText = generalData['average'];

    // Pass Percentage
    $('#pass-percent-text')[0].innerText = generalData['pass_percent'];
    $('#pass-percent-bar')[0].valuenow = generalData['pass_percent'];
    $('#pass-percent-bar').css('width', generalData['pass_percent'].toString() + "%");

    // Max Average. Get the key associated with the maximum value.
    delete avgHistData.subject;
    let key = Object.keys(avgHistData).reduce((a, b) => avgHistData[a] > avgHistData[b] ? a : b);
    $('#max-avg')[0].innerText = avgHistData[key].toString() + ", " + key;
}

function clearCourseProfileGeneral() {
    // Overall Average
    $('#overall-avg')[0].innerText = "-";

    // Pass Percentage
    $('#pass-percent-text')[0].innerText = "-";
    $('#pass-percent-bar')[0].valuenow = 0;
    $('#pass-percent-bar').css('width', "0%")

    // Max Average
    $('#max-avg')[0].innerText = "-";
}

/*-----------------------------------
* Charts
*-----------------------------------*/

var averageHistoryDistChart;
function updateAverageHistoryChart(avgDistMap) {
    $('#avgDistContainer').css('display', 'block');
    // Remove entries with averages of 0.
    let keys = Object.keys(avgDistMap).filter(key => avgDistMap[key] > 0);
    let values = keys.map(key => avgDistMap[key]);

    if (averageHistoryDistChart == null) {
        averageHistoryDistChart = new Chart($('#avgHist'), {
            type: 'line',
            data: {
                labels: keys,
                datasets: [{
                    label: 'Average',
                    data: values,
                    backgroundColor: '#d9534f',
                    borderColor: '#d9534f',
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
            }
        });
    } else {
        // Replace the data and update
        averageHistoryDistChart.data.labels = keys;
        averageHistoryDistChart.data.datasets[0].data = values;
        averageHistoryDistChart.update();
    }
};

function clearAverageHistoryDistChart() {
    $('#avgDistContainer').css('display', 'none');
}


var averageDistributionsChart;
var averageDistrubutions;
function updateAverageDistributionsChart(avgDistsArr) {
    $('#avgHistContainer').css('display', 'block');
    if (avgDistsArr != null) averageDistrubutions = avgDistsArr;
    let yearsessions = $('#cp-dropdown-avg-years').selectize()[0].selectize.items;
    
    if (yearsessions.length == 0) yearsessions = ['TOTAL'];

    // Sum the values of the distrubutions for each year selected
    // Get the first yearsession as a object to add values to and remove unnecessary keys
    let gradesData = JSON.parse(JSON.stringify(averageDistrubutions.filter(x => x.yearsession == yearsessions[0])[0]));
    delete gradesData["<50%"];
    delete gradesData.course;
    delete gradesData.yearsession;
    delete gradesData.subject;

    averageDistrubutions.forEach(function (dist) {
        if (yearsessions.includes(dist.yearsession) && dist.yearsession != yearsessions[0]) {
            Object.keys(gradesData).forEach(function(key){
                gradesData[key] += dist[key];
            });
        }
    });

    document.getElementById('avgDist').style.display = "block";
    // Remove entries with averages of 0.

    if (averageDistributionsChart == null) {
        averageDistributionsChart = new Chart(document.getElementById('avgDist'), {
            type: 'bar',
            data: {
                labels: Object.keys(gradesData),
                datasets: [{
                    label: '# of students',
                    data: Object.values(gradesData),
                    backgroundColor: gradeDistColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    } else {
        // Replace the data and update
        averageDistributionsChart.data.datasets[0].data = Object.values(gradesData);
        averageDistributionsChart.update();
    }
};

function clearAverageDistributionsChart() {
    $('#avgHistContainer').css('display', 'none');
}

/*-----------------------------------
* Datatables
*-----------------------------------*/
function clearInstructorsTable() {
    $('#cp-instructors').DataTable().clear().destroy();
}

function updateInstructorsTable(instructors) {

    // Map each dictionary to a dictionary that maps the instructor to a list of yearsessions
    let data = instructors.map(function(obj){
        // Get all the keys whose values are at least 1.
        let yearsessions = [];
        Object.keys(obj).forEach(function(key) {
            if (typeof obj[key] == 'number' && obj[key] > 0 && obj.instructor != '') yearsessions.push(key);
        })
        // Format array into string
        return {"instructor" : obj.instructor, "yearsessions": yearsessions.join(', ')};
    })

    // If the datatable exists, destroy it.
    if ($.fn.DataTable.isDataTable("#cp-instructors")) clearInstructorsTable();

    $('#cp-instructors').DataTable({
        info: false,
        responsive: true,
        paging: false,
        searching: false,
        scrollY: 200,
        data: data,
        columns: [
            {"data": "instructor"},
            {"data": "yearsessions"},
        ],
    });
}

function clearOfferingsTable() {
    $('#cp-offerings').DataTable().clear().destroy();
}

function updateOfferingsTable(offerings) {
    delete offerings.subject;
    delete offerings.course;

    // Format the object into an array of objects with title and data keys
    // Ignore values of no offerings
    let data = []
    Object.keys(offerings).forEach(function(key){
        if (offerings[key] > 0) data.push({'yearsession': key, 'offerings': offerings[key]});
    })

    // If the datatable exists, destroy it.
    if ($.fn.DataTable.isDataTable("#cp-offerings")) clearOfferingsTable();
    $('#cp-offerings').DataTable({
        info: false,
        responsive: true,
        paging: false,
        searching: false,
        scrollY: 200,
        data: data,
        order: [[ 0, "desc" ]],
        columns: [
            {"data": "yearsession" },
            {"data": "offerings"},
        ]
    });
}