<?php

const FILE_SERVER_PATH_USER = "http://www.cheatsheet.sk/uploadImages/user/";
const FILE_SERVER_PATH_CLASS = "http://www.cheatsheet.sk/uploadImages/class/";
const FILE_SERVER_PATH_GROUP = "http://www.cheatsheet.sk/uploadImages/group/";
const FILE_SERVER_PATH_TEACHER = "http://www.cheatsheet.sk/uploadImages/teacher/";

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
//Get user id
$userId = getUserIdFromSub($idTokenData->{"sub"});


if (empty($_FILES)) {

	//check files
	$response->success = false;
	$response->error->code = 9;
	$response->error->message = ERR_MSG_NO_FILES;
	die(json_encode($response));
}


if(isset($_POST['classId'])){
  //Set class image
	ckeckIfMemberOfClass($userId, $_POST['classId']);
  $storeFolder = '../../uploadImages/class';
  $fileName = "class" . $_POST['classId'] . ".".pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

	$fileName .= FILE_SERVER_PATH_CLASS;
	$sql = "UPDATE classes SET imageName='". FILE_SERVER_PATH_CLASS . $fileName . "' WHERE classId=" . $_POST['classId'];
	$query = mysqli_query($conn, $sql);
	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query adding image to class failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
} else if(isset($_POST['groupId']) && false){ //TODO: reenable
  //Set group image
  //TODO: Check if user is member of group
  $storeFolder = '../../uploadImages/group';
  $fileName = "group" . $_POST['groupId'] . ".".pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
} else if(isset($_POST['teacherId'])){
  //Set teacher's image

  //Check if user is member of class to which teacher belongs
  $sql = "SELECT COUNT(*)
          FROM teachers
          LEFT JOIN classMembers ON userId=$userId
          WHERE teachers.classId = classMembers.classId";

  $query = mysqli_query($conn, $sql);

  if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query checking if user is member of class to which teacher belongs failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
  if(mysqli_num_rows($query) == 0) {
		$response->success = false;
		$response->error->code = 4;
		$response->error->message = ERR_MSG_NO_PERMISSIONS;
		$response->error->details = "User it's not a member of a class to which teacher belongs.";
		die(json_encode($response));
	}

  $storeFolder = '../../uploadImages/teacher';
  $fileName = "teacher" . $_POST['teacherId'] . ".".pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

//TODO: Add comlumn
	$sql = "UPDATE teachers SET imageUrl='". FILE_SERVER_PATH_TEACHER . $fileName . "' WHERE id=" . $_POST['teacherId'];
	$query = mysqli_query($conn, $sql);
	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query adding image to class failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
} else {
  //Set user's image
  $storeFolder = '../../uploadImages/user';
  $fileName = "user" . $userId . ".".pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

	$sql = "UPDATE users SET image='". FILE_SERVER_PATH_USER . $fileName . "' WHERE id=$userId";
	$query = mysqli_query($conn, $sql);
	if(!$query){
		$response->success = false;
		$response->error->code = 3;
		$response->error->message = ERR_MSG_QUERY_FAILED;
		$response->error->details = "Query adding image to user failed. Error: " . mysqli_error($conn);
		die(json_encode($response));
	}
}

$tempFile = $_FILES['file']['tmp_name'];
$targetPath = dirname( __FILE__ ) . '/'. $storeFolder . '/';


$targetFile = $targetPath . $fileName;

$sucess = move_uploaded_file($tempFile, $targetFile);

$response->success = true;
$response->data->fileName = $fileName;
die(json_encode($response));

?>
