<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId');

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Get groups
$query = mysqli_query($conn, "SELECT * FROM groups WHERE class = '" . mysqli_real_escape_string( $conn, trim( $_POST['classId'] ) ) . "'");

if($query) {
	$groups = mysqli_fetch_all($query, MYSQLI_ASSOC);

	for($i = 0; $i < count($groups); $i++){
		if($groups[$i]->privacy == 2){
			$groups[$i]->members = null;
		}
	}

	$response->success = true;
	$response->data->groups = $groups;

	die(json_encode($response));
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query fetching groups failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}
?>
