<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'reminderId');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Remove reminder
$stmt = $conn->prepare("DELETE FROM reminders WHERE id=? AND authorId=?");
$stmt->bind_param("ss", $_POST['reminderId'], $userId);

if($stmt->execute()){
	if($stmt->affected_rows == 0){
		$response->success = false;
		$response->error->code = 7;
		$response->error->message = ERR_MSG_NO_ROWS_AFFECTED;
		$response->error->details = "Query removing reminder was successful, but no reminders were deleted. Probably reminder with id " . $_POST['reminderId'] . " doesn't exists, or user is not it's author.";
	} else {
		$response->success = true;
	}
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query removing reminder failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
