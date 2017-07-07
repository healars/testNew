<?php
header ( "Access-Control-Allow-Origin: *" );
header ( "Content-Type: application/json; charset=UTF-8" );

// get the q parameter from URL
$q = $_REQUEST ["q"];

if (! empty ( $q )) {

	$dir = "/home/maxprodisplays/public_html/client/clientImages/" . $q;

	//$dir = "D:/xampp/htdocs/client/clientImages/" . $q;

	if(! empty($_REQUEST ["action"]) && ! empty($_REQUEST ["img"]) && $_REQUEST ["action"]=="del"){
		if (is_dir ( $dir )) {

			if(unlink($dir ."/" . $_REQUEST ["img"])){
				echo(json_encode ("deleted"));
			}else{
				header ( 'HTTP/1.1 500 Internal Server' );
				header ( 'Content-Type: application/json; charset=UTF-8' );
				die ( json_encode ( array (
						'message' => 'Not able to delete file at= ' . $dir ."/" . $_REQUEST ["img"],
						'code' => 400
				) ) );
			}
		}
	}else{

	// Open a directory, and read its contents
	if (is_dir ( $dir )) {
		$a = array ();

		if ($dh = opendir ( $dir )) {
			$str="[";
			$isFirst = true;
			while ( ($file = readdir ( $dh )) !== false ) {

				if (is_file ( $dir . "/" . $file )) {
					if (!$isFirst) {
						$str.=",";
					}

					$str.="{\"id\":\"";
					$str.=$file;
					$str.="\", \"src\":\"./clientImages/";
					$str.= $q . "/";
					$str.=$file;
					$str.="\"}";
					$isFirst = false;

				}
			}
			$str.="]";
			closedir ( $dh );
		}

		$myJSON = json_encode ( $a );

		echo ($str);
	} else {
		header ( 'HTTP/1.1 500 Internal Server' );
		header ( 'Content-Type: application/json; charset=UTF-8' );
		die ( json_encode ( array (
				'message' => 'Directory Not found= ' . $dir,
				'code' => 500
		) ) );
	}
	}
} else {
	header ( 'HTTP/1.1 400 Internal Server' );
	header ( 'Content-Type: application/json; charset=UTF-8' );
	die ( json_encode ( array (
			'message' => 'No client param provided',
			'code' => 400
	) ) );
}

?>
