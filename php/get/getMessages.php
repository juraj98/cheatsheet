<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads


//Check post variables
checkPostVariables('idToken', 'classId');


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
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Select messages
$sql = "SELECT m.id, m.content, m.created, m.userId, u.name, u.surname, u.image
				FROM messages m, users u
				WHERE m.classId='" . mysqli_real_escape_string($conn, $_POST['classId']) .
				"' AND m.userId = u.id
				ORDER BY m.created ASC
				LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) .
				" OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);
//die($sql);
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

die(json_encode($response));

?>
