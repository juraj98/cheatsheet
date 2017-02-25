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

//Set optional post variables if not defined
if(!isset($_POST['limit'])){
	$_POST['limit'] = 5;
}
if(!isset($_POST['offset'])){
	$_POST['offset'] = 0;
}
//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});

//Select messages
$sql = "SELECT lm.*, fu.name AS firstName, fu.surname AS firstSurname, fu.image AS firstImage, su.name AS secondName, su.surname AS secondSurname, su.image AS secondImage
				FROM lastMessages lm, users fu, users su
				WHERE
					(lm.firstUserId=$userId OR lm.secondUserId=$userId)
					AND fu.id=lm.firstUserId
					AND su.id=lm.secondUserId
				ORDER BY lm.lastMessage ASC
				LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) .
				" OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);
//die($sql);
$query = mysqli_query($conn, $sql);

if($query) {
	$response->success = true;
	$response->data->lastMessages = mysqli_fetch_all($query, MYSQLI_ASSOC);

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching lest messages failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
