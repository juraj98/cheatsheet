<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'token');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Download data from token
$query = mysqli_query($conn, "SELECT id, classId, uses FROM classInvites WHERE token='" . mysqli_real_escape_string($conn, $_POST['token']) . "'");
if(!$query){
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching token data failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}
$tokenData = mysqli_fetch_assoc($query);

if($tokenData == null) {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_WRONG_INVITE_TOKEN;
	$response->error->details = "Invite token doesn't exists.";
	die(json_encode($response));
}

//Add user to class

$sql = "INSERT INTO classMembers (userId, classId) VALUES (" . $userId . ", " . $tokenData["classId"] . ")";

$query = mysqli_query($conn, $sql);

if($query){
	$response->success = true;

	//Remove use from token if insert is ok
	if(--$tokenData['uses'] == 0){
		$query = mysqli_query($conn, "DELETE FROM classInvites WHERE id='" . $tokenData['id'] . "'");
	} else {
		$query = mysqli_query($conn, "UPDATE classInvites SET uses='" . $tokenData["uses"] . "' WHERE id='" . $tokenData['id'] . "'");
	}

	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query updating or deleting token data failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query adding user to class failed. Error: " . mysqli_error($conn) . " SQL: " . $sql;
	$response->error->duplicate = mysqli_errno($conn) == 1062;
}

die(json_encode($response));

?>
