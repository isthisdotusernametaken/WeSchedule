Running the application:
	(1) Ensure that ports 3000 and 3001 are unused.
	(2) To run the backend:
		(a) Run XAMPP 8.0.28 (the same version installed in Assignment 4).
		(b) Run Apache and MySQL from XAMPP.
		(c) If this is the first time the application is being run:
			(i) Import the "weschedule_db.sql" file in phpMyAdmin.
			(ii) Ensure testuser exists and uses mypassword in phpMyAdmin (the same as in Assignment 4, so this may be done already)
			(iii) Execute "npm i" in the /backend folder.
		(d) Execute "npm start" in the /backend folder.
	(3) To run the frontend React dev server:
		(a) If this is the first time the application is being run:
			(i) Execute "npm i" in the /frontend folder.
		(b) Execute "npm start" in the /frontend folder.
	(4) To access the Swagger API Docs:
		(a) Navigate to http://localhost:3001/docs in a browser.

		Note: Because authentication is required for most services and Swagger does not support cookies, the "Try it out" feature likely will not work for any endpoints
	(5) Using the frontend:
		(a) Navigate to http://localhost:3000 in a browser.
		(b) Sign up with an account with a valid email, name, and password, OR login with one of the following prebuilt accounts:
			email: aGroupOwner@test.com		password: Password0!
			email: aGroupMember1@test.com		password: Password0!
			email: aGroupMember2@test.com		password: Password0!
			email: aGroupMember3@test.com		password: Password0!
			
			Note: While your account information will be saved to the database, your session information is only stored in memory for this prototype, and any changes that cause the Express server to restart will discard session information, requiring you to log in again.
		(c) Once logged in, use the tabs at the top of the page to choose between the following views, and follow the instructions on the pages to create and manage groups and use the application's features:
			Topics
			

			Note that the length of input fields is restricted to 50 characters (~7-10 words) for event and topic names, 256 characters for user's names and separately for their emails, and 1000 characters (~140 words) for event and topic descriptions


Development platform:
	Windows 10/11
	Backend:
		XAMPP 8.0.28 (Apache and MySQL)
		Express for routing
		Axios for requests to external services
		Swagger for API documentation
	Frontend
		React
		Axios for requests to the backend


Files
	backend
		config
			azureKey.json (key to access translation service)
			sessionKey.json (secret key for session management)
		src (source code)
			services (a file for each service)
				auth.js (/auth)
				users.js (/users)
				groups.js (/groups)
				groupUsers.js (/groups/:group/users)
				topics.js (/groups/:group/topics)
				messages.js (/groups/:group/topics/:topic/messages)
				translate.js (/translate)
				events.js (/groups/:group/events)
				stats.js (/groups/:group/stats)
				visualization.js (/groups/:group/visualization)
			dbConfig.js (connecting to MySQL DB)
			routing.js (utilities used in routing code)
		index.js (custom code entry point)
		weschedule_db.sql
	frontend
		public
			logo.png (WeSchedule logo PNG)
			favicon.ico (WeSchedule logo ICO)
			index.html (SPA base HTML, including custom CDN references)
		src
			theme.js (Bootswatch theme switching code)
			App.js (top-level UI design)
			App.css (custom CSS)
			components (custom React components)
				...
			