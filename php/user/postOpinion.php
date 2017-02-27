<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'postId', 'opinion');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Check if post is in user's class
$sql = "SELECT COUNT(*) FROM posts p, classMembers cm, classes c, users u WHERE p.id=" . mysqli_real_escape_string($conn, $_POST['postId']) . " AND p.classId=c.classId AND c.classId=cm.classId AND cm.userId=u.id";

$query = mysqli_query($conn, $sql);

if(!$query){
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query checking if user is member of same class as post failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}
$data = mysqli_fetch_assoc($query);

if($data['COUNT(*)'] == 0){
		$response->success = false;
		$response->error->code = 4;
		$response->error->message = ERR_MSG_NO_PERMISSIONS;
		$response->error->details = "User it's not a member of a class to which post belongs.";
		die(json_encode($response));
}

if($_POST['opinion'] == "none"){
	$sql = "DELETE FROM postOpinions WHERE postId=" . mysqli_real_escape_string($conn, $_POST['postId']) . " AND userId=$userId";
} else if ($_POST['opinion'] == "like" || $_POST['opinion'] == "dislike"){
	$sql = "INSERT INTO postOpinions (postId, userId, opinion) VALUES (" . mysqli_real_escape_string($conn, $_POST['postId']) . ", $userId, '" . mysqli_real_escape_string($conn, $_POST['opinion']) . "') ON DUPLICATE KEY UPDATE opinion='" . mysqli_real_escape_string($conn, $_POST['opinion']) . "'";
}


$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query saving/deleting opinion failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
