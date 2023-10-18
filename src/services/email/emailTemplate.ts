export const emailTemplate = `
<!-- emailTemplate.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Submission Details</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f4f4f4;
				padding: 20px;
			}
			.container {
				background-color: #fff;
				padding: 20px;
				border-radius: 5px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
				max-width: 600px;
				margin: 0 auto;
			}
			h2 {
				color: #333;
				border-bottom: 2px solid #e4e4e4;
				padding-bottom: 10px;
				margin-bottom: 20px;
			}
			p {
				color: #666;
				line-height: 1.5;
				margin-bottom: 10px;
			}
			strong {
				color: #444;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h2>Submission Details</h2>
			<p><strong>Name:</strong> {{name}}</p>
			<p><strong>Email:</strong> {{email}}</p>
			<p><strong>Address:</strong> {{address}}</p>
			<p><strong>Phone Number:</strong> {{phoneNumber}}</p>
			<p>
				<strong>Document Photo:</strong> <br />
				<img src="{{documentPhoto}}" alt="Document Photo" style="max-width: 100%; border: 1px solid #e4e4e4; border-radius: 5px; margin-top: 10px" />
			</p>
		</div>
	</body>
</html>
`;
