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

//Check if user is in database
$query = mysqli_query($conn, "SELECT COUNT(*) FROM users WHERE googleSub = " . mysqli_real_escape_string( $conn, $idTokenData->{"sub"} ));

if(!$query){
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query checking if user exists in database failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}
$data = mysqli_fetch_assoc($query);

if($data['COUNT(*)'] == 0){
	//Insert user
	$stmt = $conn->prepare("INSERT INTO users (googleSub, mail, name, surname, image, classes, created) VALUES (?,?,?,?,?,'[]','NOW()')");

	$stmt->bind_param("sssss", $idTokenData->{'sub'}, $idTokenData->{'email'}, $idTokenData->{'given_name'}, $idTokenData->{'family_name'}, $idTokenData->{'picture'});

	if($stmt->execute()){
		$response->success = true;
		$response->details = 'New user inserted.';
	} else {
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query inserting new user failed. Error: " . mysqli_error($conn);
	}
} else {
	$response->success = true;
	$response->details = 'User already exists in database.';
}

die(json_encode($response));

?>
