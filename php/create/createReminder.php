<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads


//Check post variables
checkPostVariables('idToken', 'classId', 'reminderData');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Decode reminderData from post
$reminderData = json_decode($_POST['reminderData']);
if(!$reminderData){
	$response->success = false;
	$response->error->code = 5;
	$response->error->message = ERR_MSG_WRONG_FORMAT;
	$response->error->details = "JSON parse of 'reminderData' post variable failed.";
	die(json_encode($response));
}

//Check reminderData limits

//Check reminder name
if($reminderData->reminderName == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder name is null. ";
} else if($reminderData->reminderName == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder name is an empty string. ";
} else if($reminderData->reminderName.length > 25){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder name length is greater than 25. ";
}

//Check reminder subject
if($reminderData->subject == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder subject is null. ";

} else if($reminderData->subject == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder subject is an empty string. ";

} else if($reminderData->subject.length > 25){
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder subject length is greater than 500. ";
}

//Check reminder type
if(
	!($reminderData->reminderType == "0" ||
	  $reminderData->reminderType == "1" ||
	  $reminderData->reminderType == "2" ||
	  $reminderData->reminderType == "3" ||
	  $reminderData->reminderType == "4" ||
	  $reminderData->reminderType == "5" )
  ) {
	$response->success = false;
	$response->error->details = $response->error->details . "Reminder type can be only 0, 1, 2, 3, 4 or 5. Reminder type entered: " . $reminderData->reminderType;
}
//Check reminder date
if($reminderData->dateOfReminder == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Date of reminder is null. ";

} else if($reminderData->dateOfReminder == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Date of reminder is an empty string. ";

}

if($response->success === false){
	$response->error->code = 6;
	$response->error->message = ERR_MSG_LIMITS_VIOLATED;
	die(json_encode($response));
}

//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);
addCheatpoints($userId, 1);

//Create reminder
$stmt = $conn->prepare("INSERT INTO reminders (classId, name, type, subject, dateOfReminder, authorId, created) VALUES (?,?,?,?,?,?, NOW())");
$stmt->bind_param("ssssss", $_POST['classId'], $reminderData->reminderName, $reminderData->reminderType, $reminderData->subject, $reminderData->dateOfReminder, $userId);

if($stmt->execute()){
	$response->success = true;
//	$response->data = $stmt->get_result(); TODO: Send back inserted data
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query inserting new reminder failed. Error: " . mysqli_error($conn) . " (Maybe wrong date format? Supported formats YYYY-MM-DD/YYYY-M-D/YYYY-M-DD/YYYY-MM-D)";
}
die(json_encode($response));

?>
