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
			The 2 services with compositions and 2 with external services are marked in the Swagger docs.
	(5) Using the frontend:
		(a) Navigate to http://localhost:3000 in a browser.
		(b) Sign up with an account with a valid email, name, and password, OR login with one of the following prebuilt accounts:
			username: admin			password: Password0!		This is the Global Admin account. Global admin features are supported with Swagger but NOT with the frontend. Stable behavior is not guaranteed when using the global admin account from the React client.
			username: anotherUsername	password: Password0!
			username: bobsAccount		password: Password0!		This account owns multiple groups.
			username: mylastnameiscool	password: Password0!
			username: ray005		password: Password0!
			username: yetAnotherUser	password: Password0!
			
			Note: While your account information will be saved to the database, your session information is only stored in memory for this prototype, and any changes that cause the Express server to restart will discard session information, requiring you to log in again. In a production environment, the session store should be replaced with an option that is more stable and less likely to leak information (such as express-mysql-session with a connection to the database).
		(c) Once logged in, use the tabs at the top of the screen to select a group you are in, view the group's log, view the group's members, select a topic in the group, and view the topic's events and messages. Within each of these tabs, if you have the proper permissions, you can add or modify data.



Development platform:
	Windows 10/11
	Backend:
		XAMPP 8.0.28 (Apache and MySQL)
		Express for routing
		Functions with a custom interface (JS, not HTTP) for internal requests to services
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
				groupMembers.js (/groups/:gid/users)
				topics.js (/groups/:gid/topics)
				topicMembers.js (/groups/:gid/topics/:topic/users)
				messages.js (/groups/:gid/topics/:topic/messages)
				events.js (/groups/:gid/events)
				log.js (/groups/:gid/log)
				language.js (/language)
			dbConfig.js (connecting to MySQL DB)
			emailPassword.js (validating emails with external service and passwords with regex)
			lengths.js (validating the lengths of various fields)
			routing.js (utilities used in routing code)
			sqlQuery.js (utilities for interactiong with the database)
			swaggerBase.js (Swagger schemas and tags)
		index.js (custom code entry point)
		weschedule_db.sql
	frontend
		public
			logo.png (WeSchedule logo PNG)
			favicon.ico (WeSchedule logo ICO)
			index.html (SPA base HTML, including our added CDN references)
		src
			theme.js (Bootswatch theme switching code)
			App.js (top-level UI design)
			App.css (custom CSS)
			backendRequest (configure and send requests to the backend)
			components (custom React components)
				...



Additional Notes
	The 6 distinct custom headers in 5 different services are as follows:
		Request header in topics WS-5 to get just names or names and descriptions (this was for choosing topics from a list vs choosing topics from a simple dropdown in the frontend; avoiding sending many long descriptions only for them to be discarded on arrival will save bandwidth and processing time; but the frontend design changed, and this was note used).
		Request header in messages WS-7 to enable/disable automatic translation to the user's preferred language.
		Request header in events WS-8 to specify earliest date to show events for; the request body could have been used, but the Swagger version does not allow a request body for GET.
		Request header in language WS-10 to specify the destination language for translation.
		Response header in users WS-4, topics WS-5, topic members WS-6, messages WS-7, and events WS-8 indicating which parameter was invalid (group doesn't exist or is inaccessible, user isn't in group, topic isn't in group, message isn't in topic, event isn't in topic).
		Response header in messages WS-7 to indicate whether translation failed.
	In order to avoid requiring the frontend to manage storage of the user's username, this information is retrieved from the server-side session data rather than sent as part of the resource identifier. Additionally, note that the cookie does not include username or password information; only the session ID (which expires after at most 7 days without logging in) is sent to the backend with every request.
	Group membership is checked and required for most operations to ensure privacy among groups.
	Usernames are used in resource identifiers within groups so that no one but a user or a global admin may see the user's email address. If emails were used in resource identifiers, the emails of the users in a group would need to be sent to a group admin's client to configure operations that must refer to specific users.
	Usernames are prefered over autogenerated integer IDs for customizability.
	For simplicity for this prototype, usernames cannot be changed, and users cannot be deleted.
	Also for simplicity, if a group is deleted, this cascades and deletes all information associated with a group. Only the owner of a group or a global admin can perform this action. In the future, adding a boolean to specify whether a group is marked as deleted may be preferable to allow for easier data recovery after accidental deletes.
	The length of input fields is restricted to 50 characters (~7-10 words) for event and topic and group names, 256 characters for user's names and separately for their emails, 20 characters for usernames, and 1000 characters (~140 words) for descriptions of events, topics, and logged points.