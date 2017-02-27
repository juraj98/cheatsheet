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
	$_POST['limit'] = 25;
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

$sql = "
SELECT
	p.id, p.name, p.subject, p.content, p.created,
	u.id AS userId, u.name AS userName, u.surname AS userSurname, u.image AS userImage,
	SUM(CASE po.opinion WHEN 'like' THEN 1 ELSE 0 END) AS likeCount,
	SUM(CASE po.opinion WHEN 'dislike' THEN 1 ELSE 0 END) AS dislikeCount
FROM posts p
LEFT JOIN users u ON u.id=p.authorId
LEFT JOIN postOpinions po ON po.postId=p.id
WHERE p.classId=" . mysqli_real_escape_string($conn, $_POST['classId']) . "
GROUP BY p.id
ORDER BY p.created DESC
LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) . "
OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);

//Select posts
$query = mysqli_query($conn, $sql);


if($query) {
	$response->data->posts = mysqli_fetch_all($query, MYSQLI_ASSOC);

	$postsLength = count($response->data->posts);

	for($i = 0; $i < $postsLength; $i++){
		$sql = "SELECT id, tag FROM postTags WHERE postId=" .	$response->data->posts[$i]['id'];


		//Get user
		$query = mysqli_query($conn, $sql);
		if($query) {
			$response->data->posts[$i]['tags'] = mysqli_fetch_all($query, MYSQLI_ASSOC);
		} else {
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query fetching post tags failed. Error: " . mysqli_error($conn);
			die(json_encode($response));
		}
	}
	$response->success = true;

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching posts failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
