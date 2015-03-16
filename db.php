<?php
//create a mySQL DB connection:
$dbhost = "82.80.211.156";
$dbuser = "ezcom_roni";
$dbpass = "roni123roni";
$dbname = "ezcom_roni";

			
$connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

//testing connection success
if ($connection -> connect_errno){
	echo "DB connection failed: " . $connection -> connect_errno;
}

//make the DB to be also Hebrew supporter!!!
if (!mysqli_set_charset($connection, 'utf8')) {
	echo 'the connection is not in utf8';
	exit();
}

//if the request came from the entry of the parent.
//then get the food and sharing data from the DB
if(isset($_REQUEST['childName'])) {
   //nanny Profiles post new details
	$other = '';
	$note = '';
	$childName = '';
	$childShareFood = '';
	$food = '';
	$meal = '';
	$share ='';
	if (isset($_REQUEST['childName']))
		$childName = $_POST['childName'];
	
	if (isset($_REQUEST['notee']))
		$note = $_POST['notee'];

	if (isset($_REQUEST['other']))
		$other = $_POST['other'];

	if (isset($_REQUEST['childShareFood'])) {
		$childShareFood = $_POST["childShareFood"];
		//seperate the aray values
		$share = implode(",", $childShareFood);
	}

	if (isset($_REQUEST['foodSelected'])) {
		//seperate the aray values
		$food = $_POST["foodSelected"];
		$meal = implode(",", $food);
	}
	//check if there is sumting inside the veriables
	if (!empty($other) || !empty($note) || !empty($share) || !empty($meal)){
		$sql = "INSERT INTO tbl_users_105 (childName ,other,meal, share, note ) VALUES ('$childName','$other','$meal','$share','$note')";

		if ($connection -> query($sql) === FALSE)
			echo "problem sending to DB";
	}
}
	
//nanny specific profile get detail from dataBase
	if (isset($_REQUEST['childDetails'])) {
		$i=1;
		//get dynamicly the child name (when the nanny pressed on the button, to get all his details)
		$childName2 = $_REQUEST['childDetails'];
		$sql2 = "SELECT * FROM tbl_users_105 WHERE childName='$childName2'";
		$result2 = mysqli_query($connection, $sql2);
		if (mysqli_num_rows($result2) > 0) {
   		// output data of each row
   			while($row = mysqli_fetch_assoc($result2)) {
        		echo $i .". ".$row["meal"] ."<b> בשיתוף : </b>" .  $row["share"] ."<b> אחר: </b>" .  $row["other"] ."<b> הערות: </b>" .  $row["note"] . "<br>";
				$i++;	
			}
		} 
		else 
    		echo "אין ארוחות מוזנות<br>";
	}
	
//get the data from web and print it to parentHP in #foodfromDB
if (isset($_REQUEST['parentChildPage'])) {
	$i=1;
	$childName3 = $_REQUEST['parentChildPage'];
	$sql3 = "SELECT * FROM tbl_users_105 WHERE childName='$childName3' ORDER BY id DESC";
	$result3 = $connection -> query($sql3);
	if ($result3 -> num_rows > 0)
		while ($row = $result3 -> fetch_assoc()) {
			echo $i .".<b> ארוחה: </b> ".$row["meal"] ."<b> אחר: </b>" .  $row["other"] ."<b> הערות: </b>" .  $row["note"] . "<br><br><hr><br>";
			$i++;
		}
		
}

mysqli_close($connection);
?>

