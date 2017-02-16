//TODO: Animate this
var activeDate = new Date();
activeDate.setHours(0, 0, 0, 0);
var today = new Date(activeDate);
var previousDate = new Date(activeDate);
var displayedDate = new Date(activeDate);
var activeDatePicker;

function materialDatePickerInit() {

    setupDatePicker(activeDate);
    updateSide();
    $('.materialDatePicker').click(function () {
        activeDatePicker = $(this);
        console.log($(this).attr("result"));
        console.log(activeDate);
        if ($(this).attr("result") != undefined) {
            console.log("if");
            activeDate = previousDate = new Date($(this).attr("result"));
        } else {
            activeDate = new Date(today);
        }
        setupDatePicker(activeDate);
        $("#dpMain").show();
    });
}

function updateSide(only = 0) {
    switch (only) {
    case 0:
        $("#dpSide > h2").html(activeDate.getFullYear());
        $("#dpSide > .dpTextDay").html(getDayById(activeDate.getDay()).substring(0, 3));
        $("#dpSide > .dpDate").html(getMonthById(activeDate.getMonth()).substring(0, 3) + ", " + activeDate.getDate());
        break;
    case 1:
        $("#dpSide > h2").html(activeDate.getFullYear());
        break;
    case 2:
        $("#dpSide > .dpTextDay").html(getDayById(activeDate.getDay()).substring(0, 3));
        break;
    case 3:
        $("#dpSide > .dpDate").html(getMonthById(activeDate.getMonth()).substring(0, 3) + ", " + activeDate.getDate());
        break;
    }
}

function setupDatePicker(day) {
    var m = day.getMonth(),
        y = day.getFullYear();
    var firstDayOfMonth = new Date(y, m, 1);
    var lastDayOfMonth = new Date(y, m + 1, 0);
    var tempDate = new Date(firstDayOfMonth);
    tempDate.setHours(0, 0, 0, 0);
    var html = '<table><tbody><tr><td class="dpHeader">Su</td><td class="dpHeader">Mo</td><td class="dpHeader">Tu</td><td class="dpHeader">We</td><td class="dpHeader">Th</td><td class="dpHeader">Fr</td><td class="dpHeader">Sa</td></tr><tr>';
    var i;

    for (i = 0; i < firstDayOfMonth.getDay(); i++) {
        if (i != 0 && i % 7 == 0) {
            html += "</tr><tr>";
        }
        html += "<td></td>";
    }
    if (i != 0 && i % 7 == 0) {
        html += "</tr><tr>";
    }
    for (; tempDate <= lastDayOfMonth; tempDate.setDate(tempDate.getDate() + 1)) {

        html += '<td class="dpDay ' + (tempDate.getTime() == today.getTime() ? 'today ' : '') + (tempDate.getTime() == activeDate.getTime() ? 'active"' : '"') + '>' + tempDate.getDate() + '</td>';
        if (++i != 0 && i % 7 == 0) {
            html += "</tr><tr>";
        }

    }


    $("#dpCalendar > #dpContent").html(html + '</tr></tbody></table><div id="dpFooter"><span id=dpCancel>Cancel</span><span id="dpOk">Ok</span></div>');


    $("#dpHeader > .month").html(getMonthById(day.getMonth()));
    $("#dpHeader > .year").html(day.getFullYear());

    $("#dpHeader > .year").off().on("click", function () {
        setupYearPicker(displayedDate);
    });
    $("#dpHeader > .month").off().on("click", function () {
        setupMonthPicker(displayedDate);
    });

    $("#dpCalendar .dpDay").click(function () {
        activeDate.setDate($(this).html());
        activeDate.setFullYear(displayedDate.getFullYear());
        activeDate.setMonth(displayedDate.getMonth());

        updateSide();

        $("#dpCalendar td.active").removeClass("active");
        $(this).addClass("active");
    });
    $("#dpHeader > .leftArrow").off().on("click", function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        setupDatePicker(displayedDate);
    });
    $("#dpHeader > .rightArrow").off().on("click", function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        setupDatePicker(displayedDate);
    });
    $("#dpMain").click(function (e) {
        if (e.target !== this) {
            return;
        }
        $("#dpMain").hide();
        activeDatePicker = null;
    });
    $("#dpCancel").click(function (e) {
        $(activeDatePicker).removeClass("invalid").removeClass("valid").attr("result", "").children("span").html("Select date");
        activeDatePicker = null;
        $("#dpMain").hide();
    });
    $("#dpOk").click(function () {
        $(activeDatePicker).attr("result", activeDate);

        $(activeDatePicker).children("span").html(activeDate.getDate() + ". " + (activeDate.getMonth() + 1) + ". " + activeDate.getFullYear());

        if ($(activeDatePicker).attr("past") == "true") {
            $(activeDatePicker).addClass("valid");
        } else {
            if (activeDate.getTime() < today.getTime()) {
                $(activeDatePicker).removeClass("valid").addClass("invalid");
            } else {
                $(activeDatePicker).removeClass("invalid").addClass("valid");

            }
        }


        $("#dpMain").hide();
    });
}

function setupYearPicker(date) {
    var html = "";
    $("#dpHeader div").remove();
    $("#dpHeader .leftArrow").after('<div>Year</div>');

    for (var j = 1; j <= 12; j++) {
        html = '<div class="yearOption">' + (date.getFullYear() - j) + '</div>' + html;
    }
    html += '<div class="yearOption active">' + date.getFullYear() + '</div>';
    for (var j = 1; j <= 12; j++) {
        html += '<div class="yearOption">' + (date.getFullYear() + j) + '</div>';
    }
    $("#dpContent").html(html);

    $("#dpHeader > .leftArrow").off().on("click", function () {
        displayedDate.setFullYear(displayedDate.getFullYear() - 25);
        setupYearPicker(displayedDate);
    });
    $("#dpHeader > .rightArrow").off().on("click", function () {
        displayedDate.setFullYear(displayedDate.getFullYear() + 25);
        setupYearPicker(displayedDate);
    });

    $("#dpContent > .yearOption").click(function () {
        displayedDate.setFullYear($(this).html());
        setupMonthPicker(displayedDate);

    });
}

function setupMonthPicker(date) {
    $("#dpHeader div").remove();
    $("#dpHeader .leftArrow").after('<div>Month</div>');
    var html = "";
    for (var j = 0; j < 12; j++) {
        html += '<div id="' + j + '"  class="month ' + (j == today.getMonth() ? 'active' : '') + '">' + getMonthById(j) + '</div>';
    }
    $("#dpContent").html(html);
    $("#dpHeader > .leftArrow").off().on("click", function () {
        displayedDate.setMonth(displayedDate.getMonth() - 12);
        setupMonthPicker(displayedDate);
    });
    $("#dpHeader > .rightArrow").off().on("click", function () {
        displayedDate.setMonth(displayedDate.getMonth() + 12);
        setupMonthPicker(displayedDate);
    });

    $("#dpContent > .month").click(function () {
        displayedDate.setMonth($(this).attr("id"));
        setupDatePicker(displayedDate);
        $("#dpHeader div").remove();
        $("#dpHeader .leftArrow").after('<div class="month">January</div><div class="year">1990</div>');

        $("#dpHeader > .year").off().on("click", function () {
            setupYearPicker(displayedDate);
        });
        $("#dpHeader > .month").off().on("click", function () {
            setupMonthPicker(displayedDate);
        });
    });
}
//DELETE
function getMonthById(id) {
    switch (id) {
    case 0:
        return "January";
    case 1:
        return "February";
    case 2:
        return "March";
    case 3:
        return "April";
    case 4:
        return "May";
    case 5:
        return "June";
    case 6:
        return "July";
    case 7:
        return "August";
    case 8:
        return "September";
    case 9:
        return "October";
    case 10:
        return "November";
    case 11:
        return "December";
    }
}

function getDayById(id) {
    switch (id) {
    case 0:
        return "Sunday";
    case 1:
        return "Monday";
    case 2:
        return "Tuesday";
    case 3:
        return "Wednesday";
    case 4:
        return "Thursday";
    case 5:
        return "Friday";
    case 6:
        return "Saturday";
    }
}
