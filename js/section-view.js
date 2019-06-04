/*-----------------------------------
* Dropdowns
*-----------------------------------*/

// Toggle the buttons
// $('#sv-toggle-campus').click(function() {
//     $(this).find('.btn').toggleClass('active');
    
//     if ($(this).find('.btn-primary').length > 0) {
//     	$(this).find('.btn').toggleClass('btn-primary');
//     }

//     $(this).find('.btn').toggleClass('btn-default');
// });

// Load the years on document ready
function onSectionViewPageLoad() {
    $.ajax({
        url: "https://ubcgrades.com/api/yearsessions",
        type: "GET",
        success: function (response) {
            var data = response.reverse();
            $('#sv-dropdown-year').selectize({
                // Build option array
                options: data.map(x => ({'value': x, 'text': x})),
                onChange: updateSVSubjectDropdown
            });
            $('#sv-dropdown-subject').selectize({
                onChange: updateSVCourseDropdown
            });
            $('#sv-dropdown-course').selectize({
                onChange: updateSVSectionDropdown,
            });
            $('#sv-dropdown-section').selectize();
        },
        error: function () {
            displayError("Unable to connect to API");
        }
    });
};

function updateSVDropdown(id, response) {
    let control = $(id).selectize()[0].selectize;
    let data = response.map(x => ({'value': x, 'text': x}));

    let singleElement = response.length == 1

    if (id == "#sv-dropdown-section" && response.length == 2 && response.includes("OVERALL")) {
        // Auto select if the only two elements are the section and OVERALL
        singleElement = true;
    }

    control.clear(true);
    control.clearOptions();
    control.load(function(callback) {
        callback(data);
    });

    // Auto select the first detail and trigger event if it is the only option.
    if (singleElement) control.addItem(response[0], false);
    return singleElement;
}

// var $selectize = $("#sv-dropdown-subject").selectize()[0].selectize;
function clearSVDropdowns(ids) {
    ids.forEach(function(id) {
        var control = $(id).selectize()[0].selectize;
        control.clear(true);
        control.clearOptions();
    });
}

function updateSVSubjectDropdown(yearsession) {
    if (yearsession == "") return;
    $.ajax({
        url: `https://ubcgrades.com/api/subjects/${yearsession}`,
        type: "GET",
        success: function (response) {
            updateSVDropdown('#sv-dropdown-subject', response);
            // There will always be at least one subject per year, so it will never auto-select.
            // Clear the other dropdowns and move on to the next.
            clearSVDropdowns(["#sv-dropdown-course", "#sv-dropdown-section"]);
            $("#sv-dropdown-subject").selectize()[0].selectize.open();
        },
        error: function () {
            displayError("Unable to connect to API");
        }
    });
}

function updateSVCourseDropdown(subject) {
    if (subject == "") return;
    let yearsession = $("#sv-dropdown-year").selectize()[0].selectize.items[0];
    $.ajax({
        url: `https://ubcgrades.com/api/courses/${yearsession}/${subject}`,
        type: "GET",
        success: function (response) {
            var autoSelected = updateSVDropdown('#sv-dropdown-course', response);
            if (!autoSelected) {
                clearSVDropdowns(["#sv-dropdown-section"]);
                $("#sv-dropdown-course").selectize()[0].selectize.open();
            }
        },
        error: function () {
            displayError("Unable to connect to API");
        }
    });
}

function updateSVSectionDropdown(course) {
    if (course == "") return;
    let yearsession = $("#sv-dropdown-year").selectize()[0].selectize.items[0];
    let subject = $("#sv-dropdown-subject").selectize()[0].selectize.items[0];
    $.ajax({
        url: `https://ubcgrades.com/api/sections/${yearsession}/${subject}/${course}`,
        type: "GET",
        success: function (response) {
            var autoSelected = updateSVDropdown('#sv-dropdown-section', response.sort());
            if (!autoSelected) $("#sv-dropdown-section").selectize()[0].selectize.open();
        },
        error: function () {
            displayError("Unable to connect to API");
        }
    });
}


/*-----------------------------------
* API submission
*-----------------------------------*/

function getSectionGrades(button, yearsession, subject, course, section) {
    let $button = $(button);
    let loadingText = '<i class="fa fa-circle-o-notch fa-spin mr-1"></i> Loading...';
    if ($button.html() !== loadingText) {
        // Store original text
        $button.data('original-text', $button.html());
        // Set disabled state for button
        $button.addClass('disabled');
        // Set loading text
        $button.html(loadingText);
    }
    // Send API request
    $.ajax({
        url: `https://ubcgrades.com/api/grades/${yearsession}/${subject}/${course}/${section}`,
        type: "GET",
        // Function to run on success
        success: function (response) {
            console.log(response);
            if ($.isEmptyObject(response)) {
                // Invalid ID, or ID does not exist
                clearSectionViewTable();
                clearSectionDistChart();
                displayError('Invalid ID, or ID does not exist.');
            } else {
                updateSectionViewTable(response);
                updateSectionDistChart(response["grades"]);
            }
            $button.html($button.data('original-text'));
            $button.removeClass('disabled');
        },
        // Function to run on error
        error: function (response) {
            displayError("Unable to connect to API");
            clearSectionViewTable();
            clearSectionDistChart();
        }
    });
};

/*-----------------------------------
* Entry Points
*-----------------------------------*/

// Takes an input string and attempts to extract an array containing YEARSESSION, SUBJECT, COURSE, SECTION
function parseSVID(inputStr) {
    // Remove all non-character/numbers
    let stripped = inputStr.replace(/(?![A-Za-z0-9]+)./gi, "");
    // Split the result into four groups by regex. Index 0 contains the full match
    let results = stripped.match(/([0-9]{4}[A-Z])([A-Z]+?(?=[0-9]))([0-9]{3}[A-Z]?)([0-9]{1,3})/i)

    if (results.length != 5) return false;

    return results.slice(1, 5).map(str => str.toUpperCase());
}

$("#sv-submit-btn").click(function(){
    let idSplit = parseSVID($('#sv-submit-text').val());
    if (idSplit.length != 4 || idSplit == false) {
        displayError('Invalid ID. Check again');
    } else {
        getSectionGrades('#id-submit-btn', idSplit[0], idSplit[1], idSplit[2], idSplit[3]);
    }
});
// Launch if user hits enter.
$('#sv-submit-text').keypress(function(e) {
    if (e.which == 13) {
        let idSplit = parseSVID($('#sv-submit-text').val());
        if (idSplit.length != 4 || idSplit == false) {
            displayError('Invalid ID. Check again');
        } else {
            getSectionGrades('#sv-submit-btn', idSplit[0], idSplit[1], idSplit[2], idSplit[3]);
        }
    }
});
$("#sv-form").submit(function(){
    getSectionGrades('#form-submit-button', $('#sv-dropdown-year').val(), $('#sv-dropdown-subject').val(), $('#sv-dropdown-course').val(), $('#sv-dropdown-section').val());
    return false; // Don't refresh the page.
});

/*-----------------------------------
* Data Callbacks
*-----------------------------------*/

// Update Headmatter
let stats_cat = ["average", "stdev", "high", "low", "pass", "fail", "withdrew", "audit", "other"];
function updateSectionViewTable(data) {
    $('#head-matter tr').each(function(){
        // Find each td pair and update
        let keyVal = $(this).find('td');
        keyVal[1].innerText = data[keyVal[0].innerText.toLowerCase()];
    });
    $('#statistics td').each(function(index) {
        // This function loops through each TD
        $(this)[0].innerText = data["stats"][stats_cat[index]];
    });
    $('#grades tr').each(function(){
        // Find each td pair and update
        let keyVal = $(this).find('td');
        keyVal[1].innerText = data["grades"][keyVal[0].innerText.toLowerCase()];
    });
}

function clearSectionViewTable() {
    $('#head-matter tr').each(function(){
        // Find each td pair and update
        let keyVal = $(this).find('td');
        keyVal[1].innerText = "";
    });
    $('#statistics td').each(function() {
        // This function loops through each TD
        $(this)[0].innerText = "";
    });
    $('#grades tr').each(function(){
        // Find each td pair and update
        let keyVal = $(this).find('td');
        keyVal[1].innerText = "";
    });
}

/*-----------------------------------
* Charts
*-----------------------------------*/

var sectionDistChart;
function updateSectionDistChart(grades) {
    document.getElementById('sectionDist').style.display = "block";
    var grades_data = grades_cat.map(function(i) { return grades[i]});

    if (sectionDistChart == null) {
        sectionDistChart = new Chart(document.getElementById('sectionDist'), {
            type: 'bar',
            data: {
                labels: grades_cat,
                datasets: [{
                    label: '# of students',
                    data: grades_data,
                    backgroundColor: gradeDistColors
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Grade Distribution",
                    fontFamily: "'Product Sans', 'Helvetica Neue'",
                    fontSize: 24,
                    fontStyle: 'normal'
                },
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
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
        sectionDistChart.data.datasets[0].data = grades_data;
        sectionDistChart.update();
    }
};

function clearSectionDistChart() {
    document.getElementById('sectionDist').style.display = "none";
}