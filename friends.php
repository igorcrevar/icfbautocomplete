<?php
$term = isset($_GET['term']) ? $_GET['term'] : '';

//TODO: you should retrieve this list from database
//list of users
$allUsers = array(
	array('id' => 20, 'title' => 'Dan Wellman'),
	array('id' => 10, 'title' => 'Igor Crevar'),
	array('id' => 30, 'title' => 'Abcdef John'),
	array('id' => 40, 'title' => 'Qwerty Symon'),
	array('id' => 50, 'title' => 'Jon Lajoie'),
	array('id' => 60, 'title' => 'Fifth Beatles'),
	array('id' => 70, 'title' => 'Bree Olson'),
	array('id' => 80, 'title' => 'Mark Zuckerberg')
);

$users = array();
foreach ($allUsers as $user)
{
	if (stripos($user['title'], $term ) !== false) {
		$users[] = $user;
	}
}

//generate output
echo json_encode($users);