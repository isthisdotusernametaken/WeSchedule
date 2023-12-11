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
			email: admin				password: Password0!		This is the Global Admin account.
			email: aGroupOwner@test.com		password: Password0!
			email: aGroupMember1@test.com		password: Password0!
			email: aGroupMember2@test.com		password: Password0!
			email: aGroupMember3@test.com		password: Password0!
			
			Note: While your account information will be saved to the database, your session information is only stored in memory for this prototype, and any changes that cause the Express server to restart will discard session information, requiring you to log in again.
		(c) Once logged in, use the tabs at the top of the screen to select a group you are in, view the group's calendar, view the group's topics, and view/send messages in one of the topic chats. Within each of these categories, if you have the proper permissions, you can view and possibly change the data.


Development platform:
	Windows 10/11
	Backend:
		XAMPP 8.0.28 (Apache and MySQL)
		Express for routing
		Functions (JS, not HTTP) for requests to internal services
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
			components (custom React components)
				...



Additional Notes
	The 4 distinct custom headers in 4 different services are as follows:
		Request header in topics WS-5 to get just names or names and descriptions (for choosing topics from a list vs choosing topics from a simple dropdown in the frontend; avoiding sending many long descriptions only for them to be discarded on arrival will save bandwidth and processing time).
		Request header in messages WS-7 to enable/disable automatic translation to the user's preferred language.
		Request header in language WS-10 to specify the destination language for translation.
		Response header in users WS-4, topics WS-5, topic members WS-6, messages WS-7, and events WS-8 indicating which parameter was invalid (group doesn't exist or is inaccessible, user isn't in group, topic isn't in group, message isn't in topic, event isn't in topic).
	In order to avoid requiring the frontend to manage storage of the user's username, this information is retrieved from the server-side session data rather than sent as part of the resource identifier.
	Group membership is checked and required for most operations to ensure privacy among groups.
	Usernames are used in resource identifiers within groups so that no one but a user or a global admin may see the user's email address. If emails were used in resource identifiers, the emails of the users in a group would need to be sent to a group owner's client to configure operations that must refer to specific users.
	Usernames are prefered over autogenerated integer IDs for customizability.
	For simplicity for this prototype, usernames cannot be changed, and users cannot be deleted.
	Also for simplicity, if a group is deleted, this cascades and deletes all information associated with a group. Only the owner of a group or a global admin can perform this action. In the future, adding a boolean to specify whether a group is marked as deleted may be preferable to allow for easier data recovery after accidental deletes.
	The length of input fields is restricted to 50 characters (~7-10 words) for event and topic and group names, 256 characters for user's names and separately for their emails, 20 characters for usernames, and 1000 characters (~140 words) for descriptions of events, topics, and logged points.