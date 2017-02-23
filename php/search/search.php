<?php

/*Version 1.1*/

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json; charset=utf8');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'searchString');

//Optional post
if(isset($_POST['filters'])){
	$_POST['filters'] = json_decode($_POST['filters']);
} else {
	$_POST['filters'] = [true,true,true];
}

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

$searchTerms = json_decode($_POST['searchString']);
if(!$searchTerms) {
		$response->success = false;
		$response->error->code = 5;
		$response->error->message = ERR_MSG_WRONG_FORMAT;
		$response->error->details = "searchString is not valid JSON fomart. searchString: " . $_POST['searchString'];
}

//Get classes
if($_POST['filters'][0] === true){
	$sql = "
		SELECT
			c.classId, c.nameShort, c.school, c.name
		FROM
			classes c, classMembers cm
		WHERE
			cm.userId='" . mysqli_real_escape_string($conn, $userId) . "'
			AND
			c.classId = cm.classId
			AND (";
	$searchTermsLength = count($searchTerms);
	for($i = 0; $i < $searchTermsLength; $i++){
		$sql .= ($i==0 ? " " : " OR ") . "
			c.nameShort LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
			OR
			c.school LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
		";
	}
	$sql .= ")";

	$query = mysqli_query($conn, $sql);

	if($query){
		$response->data->classes = mysqli_fetch_all($query, MYSQLI_ASSOC);
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query fetching classes failed. Error: " . mysqli_error($conn);
	}
}

//Get groups
if($_POST['filters'][1] === true){
	$sql = "
		SELECT
			g.id, g.name, g.description, g.class, g.members
		FROM
			groups g, classes c, classMembers cm
		WHERE
			cm.userId='" . mysqli_real_escape_string($conn, $userId) . "'
			AND
			c.classId = g.class
			AND (";
	for($i = 0; $i < $searchTermsLength; $i++){
		$sql .= ($i==0 ? " " : " OR ") . "
			g.name LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
			OR
			g.description LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
		";
	}
	$sql .= ")";

	$query = mysqli_query($conn, $sql);

	if($query){
		$response->data->groups = mysqli_fetch_all($query, MYSQLI_ASSOC);
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query fetching groups failed. Error: " . mysqli_error($conn);
	}
}

//Get users
if($_POST['filters'][2] === true){
	$sql = "
		SELECT
			u.username, u.mail, u.name, u.surname
		FROM
			users u
		WHERE";
	for($i = 0; $i < $searchTermsLength; $i++){
		$sql .= ($i==0 ? " " : " OR ") . "
			u.username LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
			OR
			u.mail LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
			OR
			u.name LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
			OR
			u.surname LIKE '%" . mysqli_real_escape_string($conn, $searchTerms[$i]) . "%'
		";
	}


	$query = mysqli_query($conn, $sql);

	if($query){
		$response->data->users = mysqli_fetch_all($query, MYSQLI_ASSOC);
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query fetching users failed. Error: " . mysqli_error($conn);
	}
}

die(json_encode($response));

?>
