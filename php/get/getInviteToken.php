<?php
require_once  "../connection.php";

require_once	"../_includes/decodeIdToken.php";
require_once	"../_includes/checkPostVariables.php";
require_once	"../_includes/checkIfMemberOfClass.php";
require_once	"../_includes/getUserIdFromSub.php";

header('Content-Type: application/json');	//Needed for not showing ads

//Check post variables
checkPostVariables('idToken', 'classId');

//Check optional post variables
if(!isset($_POST["uses"])){
	$_POST["uses"] = 1;
}

//Decode ID token
$idTokenData = decodeIdToken($_POST['idToken']);
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});
//Check if user is member of class
ckeckIfMemberOfClass($userId, $_POST['classId']);

//Generate invite token
//TODO: 15 Handle genetarion of duplicate token
$token = randStrGen(50);

$stmt = $conn->prepare("INSERT INTO classInvites (classId, uses, token, createdBy, created) VALUES (?,?,?,?,NOW())");
$stmt->bind_param("ssss", $_POST['classId'], $_POST["uses"], $token, $userId);

if($stmt->execute()){
	$response->success = true;
	$response->data->token = $token;
} else {
	$response->success = false;
	$response->error->code = 3;
	$response->error->message = "Query failed.";
	$response->error->details = "Query inserting new token failed. Error: " . mysqli_error($conn);
}

die(json_encode($response));


//SRC: http://www.developphp.com/video/PHP/Random-String-Generator-PHP-Function-Programming-Tutorial
function randStrGen($len){
    $result = "";
    $chars = "abcdefghijklmnopqrstuvwxyz\$_?!-0123456789";
    $charArray = str_split($chars);
    for($i = 0; $i < $len; $i++){
	    $randItem = array_rand($charArray);
	    $result .= "".$charArray[$randItem];
    }
    return $result;
}

?>
