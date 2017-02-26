<?php
require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json; charset=utf8');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'otherUserId');

//Set optional post variables if not defined
if(!isset($_POST['limit'])){
	$_POST['limit'] = 20;
}
if(!isset($_POST['offset'])){
	$_POST['offset'] = 0;
}

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});


//Select messages
$sql = "SELECT dm.id, dm.content, dm.created, dm.authorId
				FROM directMessages dm
				WHERE
					(
						dm.authorId='" . $userId . "'
					AND
						dm.receiverId='" . mysqli_real_escape_string($conn, $_POST['otherUserId']) . "'
					)
					OR
					(
							dm.receiverId = '" . $userId . "'
						AND
							dm.authorId='" . mysqli_real_escape_string($conn, $_POST['otherUserId']) . "'
					)
				ORDER BY dm.created DESC
				LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) .
				" OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);

//$response->debug->sql = $sql;

$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
	$response->data->messages = mysqli_fetch_all($query, MYSQLI_ASSOC);

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching messages failed. Error: " . mysqli_error($conn);
}

//Select other user data
$sql = "SELECT id, name, surname, image
				FROM users
				WHERE id= '" . mysqli_real_escape_string($conn, $_POST['otherUserId']) . "'";
//$response->debug->sql = $sql;

$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
	$response->data->user = mysqli_fetch_all($query, MYSQLI_ASSOC)[0];

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching other user info failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));


?>
