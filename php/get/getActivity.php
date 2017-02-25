<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken');
//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Set optional post variables if not defined
if(!isset($_POST['limit'])){
	$_POST['limit'] = 25;
}

//Select
$sql = 	"(SELECT m.id AS id, 'message' as activityType, m.content AS header, Null AS subject, u.name AS name, u.surname AS surname, m.created AS created, Null AS reminderType FROM messages m, users u, classMembers cm WHERE m.userId=u.id AND cm.userId=" . $userId . " AND m.classId=cm.classId) UNION (SELECT p.id as id, 'post' as activityType, p.name AS header, p.subject AS subject, u.name AS name, u.surname AS surname, p.created AS created, Null AS reminderType FROM posts p, users u, classMembers cm WHERE p.authorId=u.id AND cm.userId=" . $userId . " AND p.classId=cm.classId) UNION (SELECT r.id as id, 'reminder' as activityType, r.name AS header, r.subject AS subject, u.name AS name, u.surname AS surname, r.created AS created, r.type AS reminderType FROM reminders r, users u, classMembers cm WHERE r.authorId=u.id AND cm.userId=" . $userId . " AND r.classId=cm.classId) ORDER BY created DESC LIMIT " . mysqli_real_escape_string($conn, $_POST["limit"]);

$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
	$response->data->activity = mysqli_fetch_all($query, MYSQLI_ASSOC);

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching data failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));
?>
