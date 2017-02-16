<?php

require_once "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId', 'groupData');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Decode groupData from post
$groupData = json_decode($_POST['groupData']);
if(!$groupData){
	$response->success = false;
	$response->error->code = 5;
	$response->error->message = "Wrong format of object.";
	$response->error->details = "JSON parse of 'groupData' post variable failed.";
	die(json_encode($response));
}

//Check groupData limits
if($groupData->groupName == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Group name is null. ";
} else if($groupData->groupName == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Group name is an empty string. ";
} else if($groupData->groupName.length > 25){
	$response->success = false;
	$response->error->details = $response->error->details . "Group name length is greater than 25. ";
}

if($groupData->groupDesc == null){
	$response->success = false;
	$response->error->details = $response->error->details . "Group description is null. ";

} else if($groupData->groupDesc == ''){
	$response->success = false;
	$response->error->details = $response->error->details . "Group description is an empty string. ";

} else if($groupData->groupDesc.length > 500){
	$response->success = false;
	$response->error->details = $response->error->details . "Group description length is greater than 500. ";
}

if(
	!($groupData->groupPrivacy == "0" ||
	  $groupData->groupPrivacy == "1" ||
	  $groupData->groupPrivacy == "2" )
  ) {
	$response->success = false;
	$response->error->details = $response->error->details . "Group privacy can be only 0, 1 or 2. Group privacy entered: " . $groupData->groupPrivacy;
}

if($response->success === false){
	$response->error->code = 6;
	$response->error->message = "Variables limits violated.";
	die(json_encode($response));
}

//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);


$userIdJsonArray = "[" . $userId . "]" ;
//Create group
$stmt = $conn->prepare("INSERT INTO groups (name, description, class, admin, privacy, members) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("ssssss", $groupData->groupName, $groupData->groupDesc, $_POST["classId"], $userId, $groupData->groupPrivacy, $userIdJsonArray);
	
if($stmt->execute()){
	$response->success = true;
//	$response->data = $stmt->get_result(); TODO: Send back inserted data
	die(json_encode($response));
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query inserting new group failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
} 
	
?>
