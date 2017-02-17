<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId', 'content');
//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Check variables limits
if($_POST['content'] == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Content is null. ";
} else if($_POST['content'] == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Content is an empty string. ";
} else if($_POST['content'].length > 65535){
	$response->success = false;
	$response->error->details = $response->error->details . "Content length is greater than 65535. ";
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

//Create message
$stmt = $conn->prepare("INSERT INTO messages (classId, userId, content, created) VALUES (?,?,?, NOW())");
$stmt->bind_param("sss", $_POST["classId"], $userId, $_POST["content"]);
if($stmt->execute()){
	$response->success = true;
	die(json_encode($response));
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query inserting new message failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

?>
