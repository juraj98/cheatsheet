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

if(isset($_POST['filter'])){
	$_POST['filter'] = json_decode($_POST['filter']);
	if($_POST['filter']){
		$filterLength = count($_POST['filter']);
		$filterSql = true;
		$filterMessages = " AND (";
		$filterPosts = " AND (";
		$filterReminders = " AND (";
		for($i = 0; $i < $filterLength; $i++){
			$filterMessages .= ($i == 0 ? " " : " OR") . " m.classId=" . mysqli_real_escape_string($conn, $_POST["filter"][$i]);
			$filterPosts .= ($i == 0 ? " " : " OR") . " p.classId="  . mysqli_real_escape_string($conn, $_POST["filter"][$i]);
			$filterReminders .= ($i == 0 ? " " : " OR") . " r.classId="  . mysqli_real_escape_string($conn, $_POST["filter"][$i]);
		}
		$filterMessages .= ") ";
		$filterPosts .= ") ";
		$filterReminders .= ") ";

	} else {
		$response->success = false;
		$response->error->code = 5;
		$response->error->message = "Wrong format of object.";
		$response->error->details = "JSON decoding of 'filter' failed. Error: " . mysqli_error($conn);
	}
}

//Select
$sql = 	"(SELECT m.id AS id, 'message' as activityType, m.content AS header, Null AS subject, u.name AS name, u.surname AS surname, m.created AS created, Null AS reminderType, Null AS remainderDate, Null AS postContent FROM messages m, users u, classMembers cm WHERE m.userId=u.id AND cm.userId=" . $userId . " AND m.classId=cm.classId" . ($filterSql ? $fiterMessages : "") . ") UNION (SELECT p.id as id, 'post' as activityType, p.name AS header, p.subject AS subject, u.name AS name, u.surname AS surname, p.created AS created, Null AS reminderType, Null AS remainderDate, p.content AS postContent FROM posts p, users u, classMembers cm WHERE p.authorId=u.id AND cm.userId=" . $userId . " AND p.classId=cm.classId" . ($filterSql ? $filterPosts : "") . ") UNION (SELECT r.id as id, 'reminder' as activityType, r.name AS header, r.subject AS subject, u.name AS name, u.surname AS surname, r.created AS created, r.type AS reminderType, r.dateOfReminder AS remainderDate, Null AS postContent FROM reminders r, users u, classMembers cm WHERE r.authorId=u.id AND cm.userId=" . $userId . " AND r.classId=cm.classId" . ($filterSql ? $filterReminders : "") . ") ORDER BY created DESC LIMIT " . mysqli_real_escape_string($conn, $_POST["limit"]);


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
