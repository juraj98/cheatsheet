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
//Check optional post varaibles
$userIdSet = isset($_POST['userId']);

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);

//Get user data
if($userIdSet) {
	$sql = "SELECT id, username, name, surname, gander, image, cheatpoints FROM users WHERE id='" . mysqli_real_escape_string( $conn, trim($_POST['userId']) ) . "'";
} else {
	$sql = "SELECT id, username, name, surname, gander, image, cheatpoints, mail FROM users WHERE googleSUB = '" . mysqli_real_escape_string( $conn, trim($idTokenData->{'sub'}) ) . "'";
}

$query = mysqli_query($conn, $sql);

if($query) {
	$userData = mysqli_fetch_all($query, MYSQLI_ASSOC);

	//Download classes data
	$response->success = true;

	if(!$userIdSet) {
		$sql = "SELECT c.classId, c.nameShort, c.school, c.name FROM classes c, classMembers cm WHERE cm.userId='" . mysqli_real_escape_string($conn, $userData[0]['id']) . "' AND c.classId = cm.classId";
		$query = mysqli_query($conn, $sql);

		if($query){
			$userData[0]['classes'] = mysqli_fetch_all($query, MYSQLI_ASSOC);
		} else {
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query fetching class data for class with id " . $idsOfClasses[$i] . " failed. Error: " . mysqli_error($conn);
		}
	}
	$response->data->userData = $userData[0];
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching user data failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
