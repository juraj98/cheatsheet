<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'nameShort');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Check class limits
if($_POST['nameShort'] == null || $_POST['nameShort'].length == ""){
	$response->success = false;
	$response->error->details = $response->error->details . "'nameShort' is null or an empty string.";
} else if($_POST['nameShort'].length > 10){
	$response->success = false;
	$response->error->details = $response->error->details . "'nameShort' length is greater than 10. ";
}

if(isset($_POST['school'])){
	if($_POST['school'].length > 100){
		$response->success = false;
		$response->error->details = $response->error->details . "'school' length is greater than 100. ";
	}
} else {
	$_POST['school'] = null;
}
if(isset($_POST['name'])){
	if($_POST['name'].length > 50){
		$response->success = false;
		$response->error->details = $response->error->details . "'name' length is greater than 50. ";
	}
} else {
	$_POST['name'] = null;
}

if($response->success === false){
	$response->error->code = 6;
	$response->error->message = ERR_MSG_LIMITS_VIOLATED;
	die(json_encode($response));
}


//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Create class and add user to be member of that class
$stmt = $conn->prepare("INSERT INTO classes (nameShort, name, school, createdBy, created) VALUES (?,?,?,?, NOW())");
$stmt->bind_param("ssss", $_POST['nameShort'], $_POST['name'], $_POST['school'], $userId);

if(!$stmt->execute()){
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query inserting new class failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

$classId = $stmt->insert_id . "";

$stmt = $conn->prepare("INSERT INTO classMembers (classId, userId) VALUES (?, ?)");
$stmt->bind_param("ss", $classId, $userId);

if($stmt->execute()){
	$response->success = true;
	$response->data->newClassId = $classId;
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query adding user to class failed. Error: " . mysqli_error($conn);
}

$sql = "INSERT INTO newTimetables (classId, created) VALUES ($classId, NOW())";
$query = mysqli_query($conn, $sql);

if(!$query){
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query creating class timetable failed. Error: " . mysqli_error($conn);		
}

die(json_encode($response));

?>
