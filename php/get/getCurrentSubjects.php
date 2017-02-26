<?php
require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json; charset=utf8');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'dateNow');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

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
$currentTime = strtotime($date['hours'] . ":" . $date['minutes']);

$sql = "SELECT cm.classId, c.nameShort FROM classMembers cm, classes c WHERE cm.userId='$userId' AND c.classId=cm.classId";
$query = mysqli_query($conn, $sql);

if($query) {
	$classesData = mysqli_fetch_all($query, MYSQLI_ASSOC);
	foreach ($classesData as $i => $classData){
		$attempts = 0;
		$firstSubjectFound = null;
		$response->data->timetableData[$i]->nameShort = $classData['nameShort'];
		$response->data->timetableData[$i]->isCurrent = true;

		while(!$response->data->timetableData[$i]->subject && !$response->data->timetableData[$i]->nextSubject && $attempts < 7){
			$sql = "SELECT " . getDayByIndex($dayIndex + $attempts) . " FROM timetables WHERE class='" . $classData['classId'] . "'";
			$query = mysqli_query($conn, $sql);
			if($query) {
				$data = json_decode(mysqli_fetch_all($query, MYSQLI_ASSOC)[0][getDayByIndex($dayIndex + $attempts)]);

				if(count($data) == 0) {
					$attempts++;
					continue;
				}
				if($response->data->timetableData[$i]->subject) {
					$response->data->timetableData[$i]->nextSubject = $data[0];
					$response->data->timetableData[$i]->nextSubjectFromToday = $attempts;
					break;
				}
				if($attempts != 0){
					$response->data->timetableData[$i]->subject = $data[0];
					$response->data->timetableData[$i]->subjectFromToday = $attempts;
					$response->data->timetableData[$i]->isCurrent = false;
					if($data[1]){
						$response->data->timetableData[$i]->nextSubject = $data[1];
						$response->data->timetableData[$i]->nextSubjectFromToday = $attempts;
						break;
					} else {
						$attempts++;
						continue;
					}
				}

				foreach($data as $subject){
					if(!$firstSubjectFound){
						$firstSubjectFound = $subject;
					}

					if(!$response->data->timetableData[$i]->subject){
						$start = strtotime($subject->start);
						$end = strtotime($subject->end);
						if($start < $currentTime && $end > $currentTime) {
							//Current subject
							$response->data->timetableData[$i]->subject = $subject;
							$response->data->timetableData[$i]->subjectFromToday = $attempts;
							$subjectNotFound = false;
							continue;
						} else if(!($end < $currentTime)){
							//Next subject

							$response->data->timetableData[$i]->isCurrent = false;
							$response->data->timetableData[$i]->subject = $subject;
							$response->data->timetableData[$i]->subjectFromToday = $attempts;
							$subjectNotFound = false;
							continue;
						}
					}

					if($response->data->timetableData[$i]->subject) {
						$response->data->timetableData[$i]->nextSubject = $subject;
						$response->data->timetableData[$i]->nextSubjectFromToday = $attempts;
						break;
					}
				}

				$attempts++;

			} else {
				$response->success = false;
				$response->error->code = 3;
				$response->error->message = "Query failed.";
				$response->error->details = "Query fetching timetable failed. Error: " . mysqli_error($conn);
				die(json_encode($response));
			}
		}

		if(!$response->data->timetableData[$i]->nextSubject) {
			$response->data->timetableData[$i]->nextSubject  = $firstSubjectFound;
			$response->data->timetableData[$i]->nextSubjectFromToday  = $attempts;
		}

	}

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching class ids failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
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
