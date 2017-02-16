<?php

function decodeIdToken($idToken){

	$idTokenData = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . $idToken));

	if(!$idTokenData) {
		$response->success = false;
		$response->error->code = 2;
		$response->error->message = "Wrong google ID token.";
		die(json_encode($response));
	}

	return $idTokenData;

}

?>
