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
if(!isset($_POST['offset'])){
	$_POST['offset'] = 0;
}

if(isset($_POST['filter'])){
	$_POST['filter'] = json_decode($_POST['filter']);
	if($_POST['filter']){
		$filterLength = count($_POST['filter']);
		$filterSql = true;
		$filterMessages = " AND (";
		$filterPosts = " WHERE (";
		$filterReminders = " WHERE (";
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
//$sql = 	"
//(
//	SELECT
//		m.id AS id,
//		'message' AS activityType,
//		m.content AS header,
//		Null AS subject,
//		u.id AS userId,
//		u.name AS name,
//		u.surname AS surname,
//		u.image AS userImage,
//		m.created AS created,
//		Null AS reminderType,
//		Null AS reminderDate,
//		Null AS postContent,
//		Null AS likeCount,
//		Null AS dislikeCount
//	FROM
//		messages m,
//		users u,
//		classMembers cm
//	WHERE
//		m.userId=u.id AND
//		cm.userId=" . $userId . " AND
//		m.classId=cm.classId" .
//		($filterSql ? $filterMessages : "") . "
//) UNION (
//	SELECT
//		p.id AS id,
//		'post' AS activityType,
//		p.name AS header,
//		p.subject AS subject,
//		u.id AS userId,
//		u.name AS name,
//		u.surname AS surname,
//		u.image AS userImage,
//		p.created AS created,
//		Null AS reminderType,
//		Null AS reminderDate,
//		p.content AS postContent,
//		SUM(CASE po.opinion WHEN 'like' THEN 1 ELSE 0 END) AS likeCount,
//		SUM(CASE po.opinion WHEN 'dislike' THEN 1 ELSE 0 END) AS dislikeCount
//	FROM
//		posts p,
//		users u,
//		classMembers cm,
//		postOpinions po
//	WHERE
//		p.authorId=u.id AND
//		cm.userId=" . $userId . " AND
//		p.classId=cm.classId AND
//		po.postId=p.id" .
//		($filterSql ? $filterPosts : "") . "
//	GROUP BY id
//) UNION (
//	SELECT
//		r.id AS id,
//		'reminder' AS activityType,
//		r.name AS header,
//		r.subject AS subject,
//		u.id AS userId,
//		u.name AS name,
//		u.surname AS surname,
//		u.image AS userImage,
//		r.created AS created,
//		r.type AS reminderType,
//		r.dateOfReminder AS reminderDate,
//		Null AS postContent,
//		Null AS likeCount,
//		Null AS dislikeCount
//	FROM
//		reminders r,
//		users u,
//		classMembers cm
//	WHERE
//		r.authorId=u.id AND
//		cm.userId=" . $userId . " AND
//		r.classId=cm.classId" .
//		($filterSql ? $filterReminders : "") . "
//)
//ORDER BY created DESC
//LIMIT " . mysqli_real_escape_string($conn, $_POST["limit"]) . "
//OFFSET " . mysqli_real_escape_string($conn, $_POST["offset"]);
$sql = "
(
	SELECT
		m.id AS id,
		'message' AS activityType,
		m.content AS header,
		Null AS subject,
		u.id AS userId,
		u.name AS name,
		u.surname AS surname,
		u.image AS userImage,
		m.created AS created,
		Null AS reminderType,
		Null AS reminderDate,
		Null AS postContent,
		Null AS likeCount,
		Null AS dislikeCount
	FROM
		messages m,
		users u,
		classMembers cm
	WHERE
		m.userId=u.id AND
		cm.userId=" . $userId . " AND
		m.classId=cm.classId" .
		($filterSql ? $filterMessages : "") . "
	GROUP BY id
) UNION (
	SELECT
		p.id AS id,
		'post' AS activityType,
		p.name AS header,
		p.subject AS subject,
		u.id AS userId,
		u.name AS name,
		u.surname AS surname,
		u.image AS userImage,
		p.created AS created,
		Null AS reminderType,
		Null AS reminderDate,
		p.content AS postContent,
		SUM(CASE po.opinion WHEN 'like' THEN 1 ELSE 0 END) AS likeCount,
		SUM(CASE po.opinion WHEN 'dislike' THEN 1 ELSE 0 END) AS dislikeCount
	FROM
		posts p
	JOIN classMembers cm ON cm.userId=" . $userId . "  AND cm.classId=p.classId
	LEFT JOIN users u ON u.id=p.authorId
	LEFT JOIN postOpinions po ON po.postId=p.id
	".($filterSql ? $filterPosts : "") . "
	GROUP BY id
) UNION (
	SELECT
		r.id AS id,
		'reminder' AS activityType,
		r.name AS header,
		r.subject AS subject,
		u.id AS userId,
		u.name AS name,
		u.surname AS surname,
		u.image AS userImage,
		r.created AS created,
		r.type AS reminderType,
		r.dateOfReminder AS reminderDate,
		Null AS postContent,
		Null AS likeCount,
		Null AS dislikeCount
	FROM
		reminders r
	JOIN classMembers cm ON cm.userId=$userId AND cm.classId=r.classId
	LEFT JOIN users u ON r.authorId=u.id
	LEFT JOIN postOpinions po ON po.postId=r.id
	".($filterSql ? $filterReminders : "") . "
	GROUP BY id
)
ORDER BY created DESC
LIMIT " . mysqli_real_escape_string($conn, $_POST["limit"]) . "
OFFSET " . mysqli_real_escape_string($conn, $_POST["offset"]);


//die("SQL: " . $sql);

$query = mysqli_query($conn, $sql);

if($query) {
	$response->data->activity = mysqli_fetch_all($query, MYSQLI_ASSOC);

	$activityLength = count($response->data->activity);

	for($i = 0; $i < $activityLength; $i++){
		if($response->data->activity[$i]['activityType'] == "post"){
			$sql = "SELECT id, tag FROM postTags WHERE postId=" .	$response->data->activity[$i]['id'];


			//Get user
			$query = mysqli_query($conn, $sql);
			if($query) {
				$response->data->activity[$i]['tags'] = mysqli_fetch_all($query, MYSQLI_ASSOC);
			} else {
				$response->success = false;
				$response->error->code = 3;
				$response->error->message = ERR_MSG_QUERY_FAILED;
				$response->error->details = "Query fetching post tags failed. Error: " . mysqli_error($conn);
				die(json_encode($response));
			}
		}
	}
	$response->success = true;


} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching data failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));
?>
