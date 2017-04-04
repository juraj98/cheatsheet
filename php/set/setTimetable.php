<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId', 'timetableData');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Decode timetableData
$timetableData = json_decode($_POST['timetableData']);
if(!$timetableData) {
	//Failed query response build;
	$response->success = false;
	$response->error->code = 5;
	$response->error->message = ERR_MSG_WRONG_FORMAT;
	$response->error->details = "timetableData is not valid JSON format.";
	die(json_encode($response));
}

// TODO: Add edtiting timetable boolean variable to database and scripts.

if(isset($_POST["classId"])) {
	//Update timetable for class
	//Check if user is member of class
	ckeckIfMemberOfClass($userId, $_POST['classId']);

	$updatedBodiesIds;
	$updatedLocationsIds;
	$updatedTeachersIds;
	$updatedSubjectsIds;

	$relations;
	$i = 0;

		//Handle bodies
	  foreach ($timetableData->bodies as $key => $value) {
			if($value->changed){
				//Body was changed => check id
				if($value->id < 0){
					//Id is negative => insert new body
					$sql = "INSERT INTO bodies
									(name, acronym, icon, color, classId)
					VALUES 	('" . mysqli_real_escape_string($conn, $value->name) . "', '" .
					mysqli_real_escape_string($conn, $value->acronym) . "', '" .
					mysqli_real_escape_string($conn, $value->icon) . "', '" . mysqli_real_escape_string($conn, $value->color). "', " .
					mysqli_real_escape_string($conn, $_POST['classId']) . ")";

					$query = mysqli_query($conn, $sql);
					if($query) {
						//Update id of subject
						$updatedBodiesIds[$value->id] = mysqli_insert_id($conn);
						$value->id = mysqli_insert_id($conn);
					}  else {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query inserting body with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						$response->debug->sql = $sql;
						die(json_encode($response));
					}
				} else {
					//Id is positive => update body
					$sql = "UPDATE bodies
					SET name='" .
					mysqli_real_escape_string($conn, $value->name) . "', acronym='" .
					mysqli_real_escape_string($conn, $value->acronym) . "', icon='" .
					mysqli_real_escape_string($conn, $value->icon) . "', color='" .
					mysqli_real_escape_string($conn, $value->color) . "'
					WHERE id=". mysqli_real_escape_string($conn, $value->id);

					$query = mysqli_query($conn, $sql);

					if(!$query) {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query updating body with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						$response->debug->sql = $sql;
						die(json_encode($response));
					}
				}
			}
		}

		//Handle locations
	  foreach ($timetableData->locations as $key => $value) {
			if($value->changed){
				//Location was changed
				if($value->id < 0){
					//Id is negative => insert new location
					$sql = "INSERT INTO locations
									(name, description, classId)
					VALUES 	('" .
					mysqli_real_escape_string($conn, $value->name). "', '" .
					mysqli_real_escape_string($conn, $value->description) . "', " .
					mysqli_real_escape_string($conn, $_POST['classId']) . ")";

					$query = mysqli_query($conn, $sql);
					if($query) {
						//Update id of subject
						$updatedLocationsIds[$value->id] = mysqli_insert_id($conn);
						$value->id = mysqli_insert_id($conn);
					}  else {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query inserting location with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						$response->debug->sql = $sql;
						die(json_encode($response));
					}
				} else {
					//Id is positive => update location
					$sql = "UPDATE locations
					SET name='" .
					mysqli_real_escape_string($conn, $value->name) . "', description='" .
					mysqli_real_escape_string($conn, $value->description) . "'
					WHERE id=". mysqli_real_escape_string($conn, $value->id);

					$query = mysqli_query($conn, $sql);

					if(!$query) {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query updating location with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						$response->debug->sql = $sql;
						die(json_encode($response));
					}
				}
			}
		}

		//Handle teachers
	  foreach ($timetableData->teachers as $key => $value) {
				if($value->changed){
					//Teacher was changed => check id
					if($value->id < 0){
						//Id is negative => insert new teacher
						$sql = "INSERT INTO teachers (name, surname, description, classId) VALUES 	('" .
						mysqli_real_escape_string($conn, $value->name) . "', '" .
						mysqli_real_escape_string($conn, $value->surname). "', '" .
						mysqli_real_escape_string($conn, $value->description) . "', " .
						mysqli_real_escape_string($conn, $_POST['classId']) . ")";

						$query = mysqli_query($conn, $sql);
						if($query) {
							//Update id of teacher
							$updatedTeachersIds[$value->id] = mysqli_insert_id($conn);
							$value->id = mysqli_insert_id($conn);
						}  else {
							//Failed query response build;
							$response->success = false;
							$response->error->code = 3;
							$response->error->message = ERR_MSG_QUERY_FAILED;
							$response->error->details = "Query inserting teacher with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
							$response->debug->sql = $sql;
							die(json_encode($response));
						}
					}else {
						//Id is positive => update teacher
						$sql = "UPDATE teachers
						SET name='" .
						mysqli_real_escape_string($conn, $value->name) . "', surname='" .
						mysqli_real_escape_string($conn, $value->surname) . "', description='" .
						mysqli_real_escape_string($conn, $value->description) . "'
						WHERE id=". mysqli_real_escape_string($conn, $value->id);

						$query = mysqli_query($conn, $sql);

						if(!$query) {
							//Failed query response build;
							$response->success = false;
							$response->error->code = 3;
							$response->error->message = ERR_MSG_QUERY_FAILED;
							$response->error->details = "Query updating teacher with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
							$response->debug->sql = $sql;
							die(json_encode($response));
						}
					}
				}
			}

		//Handle subjects
		$position = 0;
		foreach ($timetableData->subjects as $key => $value) {
			//Update or insert subject
			if($value->changed){
				//Subject was changed
				if($value->id < 0){
					//Id is negative => insert new subject
					$sql = "INSERT INTO subjects (position, dayIndex, number, startTime, endTime, classId)
					VALUES 	(" . $position++ . ", '" .
					mysqli_real_escape_string($conn, $value->dayIndex) . "', '" .
					mysqli_real_escape_string($conn, $value->number) . "', '" .
					mysqli_real_escape_string($conn, $value->startTime) . "', '" .
					mysqli_real_escape_string($conn, $value->endTime) . "', " .
					mysqli_real_escape_string($conn, $_POST['classId']) . ")";

					// $position = $position + 1;
					$query = mysqli_query($conn, $sql);
					if($query) {
						//Update id of subject
						$updatedSubjectsIds[$value->id] = mysqli_insert_id($conn);
						$value->id = mysqli_insert_id($conn);
					}  else {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query inserting subject with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						$response->error->details = $sql;
						die(json_encode($response));
					}
				} else {
					//Id is positive => update subject
					$sql = "UPDATE subjects	SET position='" . $position++ . "', dayIndex='" .
					mysqli_real_escape_string($conn, $value->dayIndex) . "', number='" .
					mysqli_real_escape_string($conn, $value->number) . "', startTime='" .
					mysqli_real_escape_string($conn, $value->startTime) . "', endTime='" .
					mysqli_real_escape_string($conn, $value->endTime) . "'
					WHERE id=". mysqli_real_escape_string($conn, $value->id);

					// $position += 1;
					$query = mysqli_query($conn, $sql);

					if(!$query) {
						//Failed query response build;
						$response->success = false;
						$response->error->code = 3;
						$response->error->message = ERR_MSG_QUERY_FAILED;
						$response->error->details = "Query updating subject with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
						die(json_encode($response));
					}
				}
			} else {
				//Update position
				$sql = "UPDATE subjects	SET position='" . $position++ . "'
								WHERE id=" . mysqli_real_escape_string($conn, $value->id);

				// $position += 1;
				$query = mysqli_query($conn, $sql);

				if(!$query) {
					//Failed query response build;
					$response->success = false;
					$response->error->code = 3;
					$response->error->message = ERR_MSG_QUERY_FAILED;
					$response->error->details = "Query updating subject with id=" . $value->id . "  failed. Error: " . mysqli_error($conn);
					die(json_encode($response));
				}
			}

			// Insert relations
			foreach ($value->bodies as $bodyKey => $subjectBody) {
				$relations[$i]['subjectId'] = $value->id < 0 ? $updatedSubjectsIds[$value->id] : $value->id;
				$relations[$i]['bodyId'] = $subjectBody->bodyId < 0 ? $updatedBodiesIds[$subjectBody->bodyId] : $subjectBody->bodyId;
				$relations[$i]['locationId'] = $subjectBody->locationId < 0 ? $updatedLocationsIds[$subjectBody->locationId] : $subjectBody->locationId;
				$relations[$i]['teacherId'] = $subjectBody->teacherId < 0 ?  $updatedTeachersIds[$subjectBody->teacherId] : $subjectBody->teacherId;
				$i++;
			}
		}


		//Delete all realtions of this class
		$sql = "DELETE FROM timetableRelations WHERE timetableRelations.timetableId=(SELECT id FROM newTimetables WHERE classId=".mysqli_real_escape_string($conn, $_POST["classId"]).")";

		$query = mysqli_query($conn, $sql);

		if(!$query) {
			//Failed query response build;
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query deleting timetableRelations failed. Error: " . mysqli_error($conn);
			die(json_encode($response));
		}

		//Select timetableId

		$sql = "SELECT id FROM newTimetables WHERE classId=" . mysqli_real_escape_string($conn, $_POST["classId"]);
		$query = mysqli_query($conn, $sql);

		if(!$query) {
			//Failed query response build;
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query selecting timetable id failed. Error: " . mysqli_error($conn);
		}

		$timetableId = mysqli_fetch_all($query, MYSQLI_ASSOC)[0]["id"];

		$sql = "INSERT INTO timetableRelations (timetableId, subjectId, bodyId, locationId, teacherId) VALUES";
		$relationsLength = sizeOf($relations);
		for($i = 0; $i < $relationsLength; $i++){
			$sql .= " ($timetableId,
				'". mysqli_real_escape_string($conn, $relations[$i]["subjectId"]) ."',
				'". mysqli_real_escape_string($conn, $relations[$i]["bodyId"]) ."',
				'". mysqli_real_escape_string($conn, $relations[$i]["locationId"]) ."',
				'". mysqli_real_escape_string($conn, $relations[$i]["teacherId"]) ."'
			)" . ($i+1 == $relationsLength ? "" : ",");
		}

		// $sql .= "SELECT newTimetables.id FROM newTimetables WHERE newTimetables.classId='". mysqli_real_escape_string($conn, $_POST["classId"])."'";
		// $sql .= " LEFT JOIN newTimetables ON newTimetables.classId='". mysqli_real_escape_string($conn, $_POST["classId"])."'";

		// die($sql);
		$query = mysqli_query($conn, $sql);

		if(!$query) {
			//Failed query response build;
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query inserting timetableRelations failed. Error: " . mysqli_error($conn);
		} else {
			$response->success = true;
		}
		die(json_encode($response));

} else if(isset($_POST["groupId"])) {
	//Update timetable for group
	// TODO: Finish this
} else {
	//Update timetable for user
	// TODO: Finish this
}


?>
