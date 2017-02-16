function getMonthById(_id) {
	switch (_id) {
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

function getDayById(_id) {
	if (_id < 0) {
		_id += 7;
	} else if (_id > 6) {
		_id -= 7;
	}
	switch (_id) {
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
	default:
		console.error("Wrong id: " + _id);
	}
}

function dateToSqlFormat(_date) { //YYYY-MM-DD
	return _date.getFullYear() + "-" + (_date.getMonth()+1)+ "-" +_date.getDate();
}
function sqlDateToJSFormat(_date){
	var dateSplited = _date.split(/[- :]/);
	if(dateSplited[3]){
		return new Date(dateSplited[0], dateSplited[1]-1, dateSplited[2], dateSplited[3], dateSplited[4], dateSplited[5]);
	} else {
		return new Date(dateSplited[0], dateSplited[1]-1, dateSplited[2]);

	}
}

//From stackOverflow
function mergeSortRemindersDays(arr)
{
    if (arr.length < 2)
        return arr;

    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];

    while (left.length && right.length) {
        if (left[0].date.getTime() <= right[0].date.getTime()) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

	console.log("FINISH");
    return result;
}

function sortObject(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
