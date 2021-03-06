<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";
require_once	"../_includes/addCheatpoints.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId', 'header', 'subject', 'content', 'tags');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Check variables limits
if($_POST['header'] == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Header is null. ";
} else if($_POST['header'] == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Header is an empty string. ";
} else if($_POST['header'].length > 50){
	$response->success = false;
	$response->error->details = $response->error->details . "Header length is greater than 50. ";
}
if($_POST['subject'] == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Subject is null. ";
} else if($_POST['subject'] == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Subject is an empty string. ";
} else if($_POST['subject'].length > 50){
	$response->success = false;
	$response->error->details = $response->error->details . "Subject length is greater than 50. ";
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

//Create post
$stmt = $conn->prepare("INSERT INTO posts (classId, authorId, name, subject, content, created) VALUES (?,?,?,?,?, NOW())");
$stmt->bind_param("sssss", $_POST["classId"], $userId, $_POST["header"], $_POST["subject"], $_POST["content"]);
if($stmt->execute()){
	$postId = $stmt->insert_id;

	$_POST['tags'] = json_decode($_POST['tags']);
	$tagsLength = count($_POST['tags']);

	$stmt = $conn->prepare("INSERT INTO postTags (postId, tag) VALUES ($postId, ?)");

	for($i = 0; $i < $tagsLength; $i++){
		$stmt->bind_param("s", $_POST["tags"][$i]);
		if(!$stmt->execute()) {
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query inserting new post failed. Error: " . mysqli_error($conn);
			die(json_encode($response));
		}
	}
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query inserting new post failed. Error: " . mysqli_error($conn);
}

$response->success = true;
die(json_encode($response));

?>
