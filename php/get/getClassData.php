<?php
require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json; charset=utf8');	//Needed for not showing ads

//Check post variables

checkPostVariables('idToken', 'classId', 'dateNow');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Get class info
$sql = "SELECT name, nameShort, school, created FROM classes WHERE classId='" . mysqli_real_escape_string( $conn, $_POST['classId'] )  . "'";
$query = mysqli_query($conn, $sql);

if($query) {
	$data = mysqli_fetch_all($query, MYSQLI_ASSOC);

	$response->data->classInfo = $data[0];

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching class info failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

//Get class members
$sql = "SELECT u.id, u.username, u.name, u.surname, u.gander, u.image, u.cheatpoints FROM users u, classMembers cm WHERE classId='" . mysqli_real_escape_string($conn, $_POST['classId']) . "' AND u.id = cm.userId ORDER BY u.name ASC, u.surname ASC";
$query = mysqli_query($conn, $sql);

if($query) {
	$response->data->members = mysqli_fetch_all($query, MYSQLI_ASSOC);
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching class members failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

//Get date from post variable
$date = strtotime($_POST['dateNow']);
if(!$date){
		$response->success = false;
		$response->error->code = 5;
		$response->error->message = "Wrong format of object.";
		$response->error->details = "Value recieved on post(dateNow) is not a valid date format. Recieved value = " . $_POST['dateNow'];
		die(json_encode($response));
}

$dayIndex = getdate($date)['wday'];

//TODO: 14 Check what happens if database is empty

//Get timetable for today
$attempts = 0;
$timetableDay;
$subjectNotFound = true;
$response->data->timetableData->isCurrent = true;

$date = getdate($date);
$currentTime = strtotime($date['hours'] . ":" . $date['minutes']);

while($subjectNotFound && $attempts < 7){
	$sql = "SELECT " . getDayByIndex($dayIndex + $attempts) . " FROM timetables WHERE class='" . mysqli_real_escape_string( $conn, $_POST['classId'] ) . "'";

	$query = mysqli_query($conn, $sql);

	if($query) {
		$data = json_decode(mysqli_fetch_all($query, MYSQLI_ASSOC)[0][getDayByIndex($dayIndex+ $attempts)]);
		if(count($data) == 0) {
			$attempts++;
			$response->data->timetableData->isCurrent = false;
			continue;
		} else {

			if($attempts != 0){
				$response->data->timetableData->subject = $data[0];
				break;
			}

			foreach($data as $subject){
				$start = strtotime($subject->start);
				$end = strtotime($subject->end);

				if($start < $currentTime && $end > $currentTime) {
					//Current subject
					$response->data->timetableData->subject = $subject;
					break;
				} else if(!($end < $currentTime)){
					//Next subject
					$response->data->timetableData->isCurrent = false;
					$response->data->timetableData->subject = $subject;
					break;
				}

			}

			if($response->data->timetableData->subject){
				$subjectNotFound = false;
			} else {
				$attempts++;
			}

		}
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = "Query failed.";
		$response->error->details = "Query fetching timetable failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
}

//Get reminders
if($_POST['numberOfReminers']){
	$sql = "SELECT * FROM reminders WHERE
	(classId=" . mysqli_real_escape_string($conn, $_POST['classId']) . "
	AND dateOfReminder>=NOW()) LIMIT " . mysqli_real_escape_string($conn, $_POST['numberOfReminers']);

	$query = mysqli_query($conn, $sql);

	if($query) {
		$response->data->reminders = mysqli_fetch_all($query, MYSQLI_ASSOC);
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = "Query failed.";
		$response->error->details = "Query fetching reminders failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
}

$response->success = true;
die(json_encode($response));

function getDayByIndex($index){
	if($index > 6){
		$index -= 7;
	}

	switch($index){
		case 0:
			return "sunday";
		case 1:
			return "monday";
		case 2:
			return "tuesday";
		case 3:
			return "wednesday";
		case 4:
			return "thursday";
		case 5:
			return "friday";
		case 6:
			return "saturday";
	}
}



?>
