<?php

require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

require_once	"../_includes/errorMessagesAndDetails.php";

header('Content-Type: application/json');	//Needed for not showing ads


//Check post variables
checkPostVariables('idToken', 'userId', 'username', 'mail', 'name', 'surname', 'gender', 'image');


//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);


//Update user query
$stmt = $conn->prepare("UPDATE users SET username='?', mail='?', name='?', surname='?', gender='?', image='?', cheatpoints='?', classes='?' WHERE id='?' AND googleSub='?' LIMIT 1");
$stmt->bind_param("ssssssssss",
				 $_POST['username'],
				 $_POST['mail'],
				 $_POST['name'],
				 $_POST['surname'],
				 $_POST['gender'],
				 $_POST['image'],
				 $_POST['cheatpoints'],
				 $_POST['classes'],
				 $_POST['userId'],
				 $idTokenData->{'sub'}
				 );

if($stmt->execute()){
	if($stmt->affected_rows == 0){
		$response->success = false;
		$response->error->code = 0;
		$response->error->message = ERR_MSG_UNKNOW;
		$response->error->details = "User query was sucessful, but no rows were affected. (Maybe wrong userId?)";
		die(json_encode($response));
	} else {
		$response->success = true;
		die(json_encode($response));
	}
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = ERR_MSG_QUERY_FAILED;
	$response->error->details = "Query updating user failed. Error: " . mysqli_error($conn);
	die(json_encode($response));
}

?>
