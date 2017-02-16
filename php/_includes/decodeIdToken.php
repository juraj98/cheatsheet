<?php

require	"../_includes/errorMessagesAndDetails.php";

function decodeIdToken($idToken){

	$idTokenData = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . $idToken));

	if(!$idTokenData) {
		$response->success = false;
		$response->error->code = 2;
		$response->error->message = ERR_MSG_WORNG_ID_TOKEN;
		die(json_encode($response));
	}

	return $idTokenData;

}

?>
