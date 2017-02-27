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

//Select posts
$sql = "SELECT * FROM posts
				WHERE classId='" . mysqli_real_escape_string($conn, $_POST['classId']) .
				"' ORDER BY created DESC" .
				" LIMIT " . mysqli_real_escape_string($conn, $_POST['limit']) .
				" OFFSET " . mysqli_real_escape_string($conn, $_POST['offset']);
$query = mysqli_query($conn, $sql);

if($query) {
	$data = mysqli_fetch_all($query, MYSQLI_ASSOC);

	$dataLength = count($data);

	for($i = 0; $i < $dataLength; $i++){
		//Decode tags
		$data[$i]['tags'] = json_decode($data[$i]['tags']);

		//Get user
		$query = mysqli_query($conn, "SELECT id, username, name, surname, gender, image, cheatpoints FROM users WHERE id='" . $data[$i]['authorId'] . "'");
		if($query) {
			$secondQueryData = mysqli_fetch_all($query, MYSQLI_ASSOC);
			$data[$i]['author'] = $secondQueryData[0];
			unset($data[$i]['authorId']);
		} else {
			$response->success = false;
			$response->error->code = 3;
			$response->error->message = ERR_MSG_QUERY_FAILED;
			$response->error->details = "Query fetching user data failed. Error: " . mysqli_error($conn);
			die(json_encode($response));
		}
	}
	$response->success = true;
	$response->data->posts = $data;

} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query fetching posts failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));

?>
