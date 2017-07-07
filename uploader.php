<?php

// get the q parameter from URL
$q = $_REQUEST ["q"];


if(empty($q)){
	$q="client1";
}

$target_dir= "/home/maxprodisplays/public_html/client/clientImages/" . $q ."/";

//$target_dir="D:/xampp/htdocs/client/clientImages/" . $q ."/";

if (!is_dir ( $target_dir)) {
	mkdir( $target_dir);
	echo "directory created as didn't existed before";

}

$target_file = $target_dir . basename($_FILES["file"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["file"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}

// Check file size
if ($_FILES["file"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {

    $uploadOk = 0;

		header ( 'HTTP/1.1 400 Internal Server' );
		header ( 'Content-Type: application/json; charset=UTF-8' );
		die ( json_encode ( array (
				'message' => 'File type not supported',
				'code' => 400
		) ) );
} else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
    } else {

				header ( 'HTTP/1.1 400 Internal Server' );
				header ( 'Content-Type: application/json; charset=UTF-8' );
				die ( json_encode ( array (
						'message' => 'Error uploading image',
						'code' => 400
				) ) );
    }
}
?>
