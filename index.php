<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<?php
			if ( isset($_POST['max_users']) )
			{
				$_SESSION['max_users'] = $_POST['max_users'];
			}
			$maxUsers = isset($_SESSION['max_users']) ? $_SESSION['max_users'] : 0;
			
			$params = isset($_POST['send_message']) ? $_POST['send_message'] : false;
			$error = null;
			$notice = null;
			$selected = null;
			if ( $params )
			{
				if ( isset($params['user']) )
				{
					$usersIds = $params['user']['id'];
					$usersTitles = $params['user']['title'];
				}
				else
				{
					$usersIds = array();
				}
				$subject = $params['subject'];
				$message = $params['message'];
				//TODO: put your check 
				if ( !empty($subject) && !empty($message) && count($usersIds) )
				{
					$notice = 'You have sent message with <br />subject: '.htmlspecialchars($subject,ENT_QUOTES,'UTF-8').'<br /> body : '.
							  nl2br(htmlspecialchars($message,ENT_QUOTES,'UTF-8')).'<br />To: '.join(', ', $usersTitles);
				}
				else{
					$error = 'You must pick up at least one user and enter subject and message';
					
					//generate selected list of users in form {id: id1, title: "title1"}, ....
					$selected = '';
					for ($i = 0; $i < count($usersIds); ++$i)
					{
						if ( $selected != '' ) $selected .= ',';
						$selected .= '{ id: '.intval($usersIds[$i]).', title: "'.htmlspecialchars($usersTitles[$i],ENT_QUOTES,'UTF-8').'"}';
					}
				}
			}
		?>
	 
		<title>FBAutocompleter by Igor Crevar</title>
		<link href="send_message.css" rel="stylesheet" type="text/css" />
		<link href="jquery-ui/css/ui-lightness/jquery-ui-1.8.6.custom.css" rel="stylesheet" type="text/css" />
		<link href="fbautocomplete/fbautocomplete.css" rel="stylesheet" type="text/css" />    
		<script src="jquery-1.4.3.min.js" type="text/javascript"></script>
		<script src="jquery-ui/js/jquery-ui-1.8.6.custom.min.js" type="text/javascript"></script>
		<script src="fbautocomplete/fbautocomplete.js" type="text/javascript"></script>    
		<?php if (!$notice) { ?>
		<script type="text/javascript">
		$(function(){
			$('#fbautocomplete_id').fbautocomplete({
				selected: [<?php if ($selected) echo $selected;?>]
				,maxUsers: <?php echo $maxUsers;?>
			});
		});	
		</script>
		<?php } ?>
	</head>
	
	<body>    	
		
	<div id="formWrap">
	<?php if (!$notice) { ?>
		
		<div id="additional_forms">
			You can set maximum number of selected users in left form. 0 is unlimited.<br />
			<form action="index.php" method="post">
				<input type="text" name="max_users" value="<?php echo $maxUsers;?>" />
				<input type="submit" value="SET MAX Users" />
			</form>
		</div>
		
		<?php if ($error) { ?>
			<?php echo $error;?>
		<?php } ?>
		<form action="index.php" id="messageForm" method="post">
			<fieldset>
				<legend>New message form</legend>
				<label id="message_toLabel">To:</label>
				
				<div>
					<input id="fbautocomplete_id" type="text" />
				</div>
				
				<label>Subject:</label>
				<input type="text" name="send_message[subject]" id="message_subject">
				<label>Message:</label>
				<textarea cols="50" rows="5" name="send_message[message]" id="message_message"></textarea>
				<button id="send" type="submit">Send</button>
			</fieldset>
		</form>
	<?php }else { ?>
		<?php echo $notice;?>
	<?php } ?>
	</div>		
	
	
	</body>

</html>