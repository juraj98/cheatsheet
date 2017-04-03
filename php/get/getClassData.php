<?php
require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

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
$sql = "SELECT u.id, u.username, u.name, u.surname, u.gender, u.image, u.cheatpoints FROM users u, classMembers cm WHERE classId='" . mysqli_real_escape_string($conn, $_POST['classId']) . "' AND u.id = cm.userId ORDER BY u.name ASC, u.surname ASC";
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

$date = getdate($date);
$currentTime = strtotime($date['hours'] . ":" . $date['minutes'] . ":" . $date['seconds']);


$sql = "SELECT
	subjects.id AS subjectId, subjects.dayIndex, subjects.number, subjects.startTime, subjects.endTime, subjects.position
FROM
	newTimetables
INNER JOIN timetableRelations	ON timetableRelations.timetableId=newTimetables.id
LEFT JOIN subjects ON timetableRelations.subjectId=subjects.id
WHERE newTimetables.classId=" . mysqli_real_escape_string($conn, $_POST["classId"]) . "
ORDER BY subjects.position ASC";

$query = mysqli_query($conn, $sql);

if($query){
	$downloadedData = mysqli_fetch_all($query, MYSQLI_ASSOC);
	// $response->debug->data = $downloadedData;
	$downloadedDataLength = sizeOf($downloadedData);

	for($i = 0; $i < $downloadedDataLength; $i++){

		if($dayIndex > intval($downloadedData[$i]["dayIndex"])){
			$response->debug->set = $response->debug->data . $i;
			continue;
		}

		if($response->data->timetableData->firstSubject){
			$response->data->timetableData->secondSubject = $downloadedData[$i];
			break;
		}
		$start = strtotime($downloadedData[$i]["startTime"]);
		$end = strtotime($downloadedData[$i]["endTime"]);

		// $response->debug->startTime = $start;
		// $response->debug->endTime = $end;
		// $response->debug->currentTime = $currentTime;

		if($start <= $currentTime && $end > $currentTime) {
			//Current subject
			$response->data->timetableData->firstSubject = $downloadedData[$i];
			continue;
		} else if(!($end < $currentTime)){
			//Next subject
			$response->data->timetableData->isCurrent = false;
			$response->data->timetableData->firstSubject = $downloadedData[$i];
			$subjectNotFound = false;
			continue;
		} else {

		}
	}

	//If no subject found, today are no more classes - get fisrt from tomorrow

	if(!$response->data->timetableData->firstSubject){
		$attempts = 1;

		$response->data->timetableData->isCurrent = false;

		while(!$response->data->timetableData->firstSubject && !$response->data->timetableData->seconSubject && $attempts != 7){

			for($i = 0; $i < $downloadedDataLength; $i++){

				if($response->data->timetableData->firstSubject){
					$response->data->timetableData->secondSubject = $downloadedData[$i];
					break;
				}

				if($downloadedData[$i]["dayIndex"] == getCorrentIndex($dayIndex + $attempts)){
					$response->data->timetableData->firstSubject = $downloadedData[$i];
				}

			}
			$attempts++;
		}
	}

	//Parse subjects

		//Pase first subject
		$sql = "SELECT
			bodies.id AS bodyId, bodies.name AS bodyName, bodies.acronym, bodies.icon, bodies.color,
			teachers.id AS teacherId, teachers.name AS teacherName, teachers.surname AS teacherSurname, teachers.description AS teacherDescription,
			locations.id AS locationId, locations.name AS locationName, locations.description AS locationDescription
		FROM timetableRelations
		LEFT JOIN bodies ON timetableRelations.bodyId=bodies.id
		LEFT JOIN locations ON timetableRelations.locationId=locations.id
		LEFT JOIN teachers ON timetableRelations.teacherId=teachers.id
		WHERE timetableRelations.subjectId = " . $response->data->timetableData->firstSubject["subjectId"];

		$query = mysqli_query($conn, $sql);
		if($query) {
			$downloadedData = mysqli_fetch_all($query, MYSQLI_ASSOC);
			$response->data->timetableData->firstSubject["bodies"] = $downloadedData;


		}else {
			//Failed query response build;
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = "Query failed.";
			$response->error->details = "Query fetching timetable data for firstSubject failed. Error: " . mysqli_error($conn);
		}
		//Pase second subject
		$sql = "SELECT
			bodies.id AS bodyId, bodies.name AS bodyName, bodies.acronym, bodies.icon, bodies.color,
			teachers.id AS teacherId, teachers.name AS teacherName, teachers.surname AS teacherSurname, teachers.description AS teacherDescription,
			locations.id AS locationId, locations.name AS locationName, locations.description AS locationDescription
		FROM timetableRelations
		LEFT JOIN bodies ON timetableRelations.bodyId=bodies.id
		LEFT JOIN locations ON timetableRelations.locationId=locations.id
		LEFT JOIN teachers ON timetableRelations.teacherId=teachers.id
		WHERE timetableRelations.subjectId = " . $response->data->timetableData->secondSubject["subjectId"];

		$query = mysqli_query($conn, $sql);
		if($query) {
			$downloadedData = mysqli_fetch_all($query, MYSQLI_ASSOC);
			$response->data->timetableData->secondSubject["bodies"] = $downloadedData;


		}else {
			//Failed query response build;
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = "Query failed.";
			$response->error->details = "Query fetching timetable data for firstSubject failed. Error: " . mysqli_error($conn);
		}




} else {
	//Failed query response build;
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching timetable data failed. Error: " . mysqli_error($conn);
}

//Get reminders
if($_POST['numberOfReminders']){
	$sql = "SELECT * FROM reminders WHERE
	(classId=" . mysqli_real_escape_string($conn, $_POST['classId']) . "
	AND dateOfReminder>=CURDATE()) ORDER BY dateOfReminder ASC LIMIT " . mysqli_real_escape_string($conn, $_POST['numberOfReminders']);

//die($sql);

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

function getCorrentIndex($index){
	if($index < 0){
		while($index < 0){
			$index += 6;
		}
	} else if($index > 6){
		while($index > 6) {
			$index -= 6;
		}
	}

	return $index;
}

?>
