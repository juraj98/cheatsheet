<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken');
//Set cahrset
mysqli_set_charset($conn, 'utf8');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
if(isset($_POST["classId"])) {
	//Load class timetable
	ckeckIfMemberOfClass($userId, $_POST['classId']);
	//SQL Query
	$sql = "
	SELECT
		subjects.id AS subjectId, subjects.dayIndex, subjects.number, subjects.startTime, subjects.endTime,
		bodies.id AS bodyId, bodies.name AS bodyName, bodies.acronym, bodies.icon, bodies.color,
		teachers.id AS teacherId, teachers.name AS teacherName, teachers.surname AS teacherSurname, teachers.description AS teacherDescription,
		locations.id AS locationId, locations.name AS locationName, locations.description AS locationDescription
	FROM
		newTimetables
	INNER JOIN timetableRelations	ON timetableRelations.timetableId=newTimetables.id
	LEFT JOIN subjects ON timetableRelations.subjectId=subjects.id
	LEFT JOIN bodies ON timetableRelations.bodyId=bodies.id
	LEFT JOIN locations ON timetableRelations.locationId=locations.id
	LEFT JOIN teachers ON timetableRelations.teacherId=teachers.id
	WHERE newTimetables.classId=" . mysqli_real_escape_string($conn, $_POST["classId"]);
	//Execute query
	$query = mysqli_query($conn, $sql);
	if($query) {

		$downloadedData = mysqli_fetch_all($query, MYSQLI_ASSOC);

		// print_r($downloadedData[0]);
		$downloadedDataLength = sizeOf($downloadedData);

		for($i = 0; $i < $downloadedDataLength; $i++){
			//Check subject
					// print_r($downloadedData[$i]);
					// die();
			if(isset($response->data->timetable[getDayByIndex($downloadedData[$i]["dayIndex"])][$downloadedData[$i]["subjectId"]])){
				//Subject is created - check body
			} else {
				//Subject is not created
				//Add subject
				$response->data->timetable[getDayByIndex($downloadedData[$i]["dayIndex"])][$downloadedData[$i]["subjectId"]]["number"] = $downloadedData[$i]["number"];
				$response->data->timetable[getDayByIndex($downloadedData[$i]["dayIndex"])][$downloadedData[$i]["subjectId"]]["startTime"] = $downloadedData[$i]["startTime"];
				$response->data->timetable[getDayByIndex($downloadedData[$i]["dayIndex"])][$downloadedData[$i]["subjectId"]]["endTime"] = $downloadedData[$i]["endTime"];
			}

			//Add bodyData
			$body["locationId"] = $downloadedData[$i]["locationId"];
			$body["teacherId"] = $downloadedData[$i]["teacherId"];
			$body["bodyId"] = $downloadedData[$i]["bodyId"];

			$response->data->timetable[getDayByIndex($downloadedData[$i]["dayIndex"])][$downloadedData[$i]["subjectId"]]["bodies"][] = $body;

			//Check bodies
			if(isset($response->data->bodies[$downloadedData[$i]["bodyId"]])){
				//Body exists
			} else {
				//Body is not added
				$response->data->bodies[$downloadedData[$i]["bodyId"]]["name"] = $downloadedData[$i]["bodyName"];
				$response->data->bodies[$downloadedData[$i]["bodyId"]]["acronym"] = $downloadedData[$i]["acronym"];
				$response->data->bodies[$downloadedData[$i]["bodyId"]]["icon"] = $downloadedData[$i]["icon"];
				$response->data->bodies[$downloadedData[$i]["bodyId"]]["color"] = $downloadedData[$i]["color"];
			}

			//Check teacher
			if(isset($response->data->teachers[$downloadedData[$i]["teacherId"]])){
				//Teacher exists
			} else {
				//Teacher is not added
				$response->data->teachers[$downloadedData[$i]["teacherId"]]["name"] = $downloadedData[$i]["teacherName"];
				$response->data->teachers[$downloadedData[$i]["teacherId"]]["surname"] = $downloadedData[$i]["teacherSurname"];
				$response->data->teachers[$downloadedData[$i]["teacherId"]]["description"] = $downloadedData[$i]["teacherDescription"];
			}

			//Check if location exists
			if(isset($response->data->locations[$downloadedData[$i]["locationId"]])){
				//location exists
			} else {
				//location is not added
				$response->data->locations[$downloadedData[$i]["locationId"]]["name"] = $downloadedData[$i]["locationName"];
				$response->data->locations[$downloadedData[$i]["locationId"]]["surname"] = $downloadedData[$i]["locationDescription"];
			}
		}


		$response->success = true;
	} else {
		//Failed query response build;
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = "Query failed.";
		$response->error->details = "Query fetching data failed. Error: " . mysqli_error($conn);
	}
	//Return response
	die(json_encode($response));

} else if(isset($_POST["groupId"])) {
	//Load group timetable

} else {
	//Load user's timetable

}
function getDayByIndex($index){
	switch ($index) {
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
