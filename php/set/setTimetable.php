<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json');	//Needed for not showing ads



//Check post variables
checkPostVariables('idToken', 'classId', 'timetable');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);


$timetable = json_decode($_POST['timetable']);

$sql = "UPDATE timetables SET ";

//Clean changed notifications and create SQL
if($timetable->{'monday'}){
	for($i = 0; $i < count($timetable->{'monday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'monday'}[$i]->{'bodies'});$j++){
			$timetable->{'monday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "monday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'monday'}) ) . "'";

	if($timetable->{'tuesday'} || $timetable->{'wednesday'} || $timetable->{'thursday'} || $timetable->{'friday'} || $timetable->{'saturday'} || $timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}
if($timetable->{'tuesday'}){
	for($i = 0; $i < count($timetable->{'tuesday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'tuesday'}[$i]->{'bodies'});$j++){
			$timetable->{'tuesday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "tuesday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'tuesday'}) ) . "'";

	if($timetable->{'wednesday'} || $timetable->{'thursday'} || $timetable->{'friday'} || $timetable->{'saturday'} || $timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}

if($timetable->{'wednesday'}){
	for($i = 0; $i < count($timetable->{'wednesday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'wednesday'}[$i]->{'bodies'});$j++){
			$timetable->{'wednesday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "wednesday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'wednesday'}) ) . "'";

	if($timetable->{'thursday'} || $timetable->{'friday'} || $timetable->{'saturday'} || $timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}

if($timetable->{'thursday'}){
	for($i = 0; $i < count($timetable->{'thursday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'thursday'}[$i]->{'bodies'});$j++){
			$timetable->{'thursday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}

	}
	$sql .= "thursday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'thursday'}) ) . "'";

	if($timetable->{'friday'} || $timetable->{'saturday'} || $timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}

if($timetable->{'friday'}){
	for($i = 0; $i < count($timetable->{'friday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'friday'}[$i]->{'bodies'});$j++){
			$timetable->{'friday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "friday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'friday'}) ) . "'";

	if($timetable->{'saturday'} || $timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}

if($timetable->{'saturday'}){
	for($i = 0; $i < count($timetable->{'saturday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'saturday'}[$i]->{'bodies'});$j++){
			$timetable->{'saturday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "saturday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'saturday'}) . "'" );

	if($timetable->{'sunday'}) {
		$sql .= ", ";
	} else {
		$sql .= " ";
	}
}

if($timetable->{'sunday'}){
	for($i = 0; $i < count($timetable->{'sunday'}); $i++){
		for($j = 0; $j < sizeof($timetable->{'sunday'}[$i]->{'bodies'});$j++){
			$timetable->{'sunday'}[$i]->{'bodies'}[$j]->{"changed"} = false ;
		}
	}
	$sql .= "sunday='" . mysqli_real_escape_string( $conn, json_encode($timetable->{'sunday'}) ) . "'";
}

$sql .= "WHERE class='" . mysqli_real_escape_string( $conn, $_POST['classId'] ) . "'";

//Save query
//die($sql);

$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;

	die(json_encode($response));
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query setting timetable failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}


?>
