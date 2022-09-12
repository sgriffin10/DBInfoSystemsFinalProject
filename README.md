# Musical PlayLand :crystal_ball:
### Description
We wanted to make a web application for all music lovers - one that people of all ages can use to engage with music in a unique way. On our app, visitors can play song game quizzes, visualize music information in a pretty word cloud, and search/listen to track previews of their favorite artists and songs. Our app, Musical Playland, is not only a music player like many other products on the market, but an app that combines music with games and much more. 

# Technologies + Architecture 

For this project, we originally acquired three datasets all in .csv format: Albums, Artists, and Tracks from https://www.kaggle.com/saurabhshahane/spotgen-music-dataset. We cleaned & pre-processed these tables in Pandas then stored them in a MySQL database hosted on Amazon’s AWS. For our web app, we used Node.js (Express.js) for the back-end API and React on the front-end. We utilized the material UI library and shards-react to customize stylistic elements within our web app such as the menu bar.   

**Technologies:**
* Pandas (Python) for data cleaning & pre-processing 
* MySQL
* DataGrip
* AWS
* HTML
* CSS
* Bootstrap
* Node.js (Express.js)
* React

# Web App Pages :sparkles:

**Main page** - The default page for the website. The menu bar on top of the page has a main link, link to the About page, and three icons each routed to one of the three main functionalities of the website. The user can search for a song here or go directly to the search page.

![alt text](https://github.com/sgriffin10/DBInfoSystemsFinalProject/blob/main/DemoPics/LandingPage.png?raw=true)

**Search page** - The user is able to search for his/her favorite artist and/or song in the search bar, then listen to track previews of the search results while seeing which album(s) the tracks are from.
![alt text](https://github.com/sgriffin10/DBInfoSystemsFinalProject/blob/main/DemoPics/PlaylistPage.png?raw=true)

**WordCloud page** - Upon landing on this page, the user is shown a snapshot of the most popular songs on Spotify at the time the dataset was collected. Additionally, the user is able to search for their favorite artist, producing a colorful word cloud of track names and the associated albums. 
![alt text](https://github.com/sgriffin10/DBInfoSystemsFinalProject/blob/main/DemoPics/WordcloudPage.png?raw=true)

**Who sang it better** – Game quiz that displays a random track name that is sung by more than one artist and prompts the user to guess which rendition of the track is the most popular, based on the track popularity metrics.
![alt text](https://github.com/sgriffin10/DBInfoSystemsFinalProject/blob/main/DemoPics/ComparisonPage.png?raw=true)

**About page** - General info about the team, Database Demons, and its members.



# Build Instructions
1. Before building, please ensure that the Application Structure contains the following folders and files. See the accompanying descriptions for context.
   1. Server Folder (/server):
      1. .gitignore: A gitignore file for the Node application. Read more on .gitignore files here.
      2. config.json: Holds the RDS connection credentials/information and application configuration settings (like port and host). 
      3. package.json: maintains the project dependency tree; defines project properties, scripts, etc 
      4. package-lock.json: saves the exact version of each package in the application dependency tree for installs and maintenance. 
      5. routes.js: where the code for the API routes’ handler functions go. 
      6. server.js: the code for the routed HTTP application. It imports routes.js and maps each route function to an API route and type (like GET, POST, etc). It also ‘listens’ to a specific port on a host using the parameters in config.json
   2. Server Tests Folder (/server/__tests__): 
      1. results.json: stores (some) expected results for the tests in a json encoding. 
      2. tests.js
   3. Client Folder (/client)
      1. .gitignore: a gitignore file for the client application. 
      2. package.json: maintains the project dependency tree; defines project properties, scripts, etc 
      3. package-lock.json: saves the exact version of each package in the application dependency tree for installs and maintenance 
   4. Client Public Folder (/client/public): this folder contains static files like index.html file and other assets for specifying web page titles, crawlability, etc.
   5. Client Source Folder (/client/src): this folder contains the main source code for the React application. 
      1. config.json: holds server connection information (like port and host). Could be replaced by a .env file, but students find this easier to manage 
      2. fetcher.js: contains helper functions that wrap calls to API routes. improved testability, reusability, and usability 
      3. index.js: this the main JavaScript entry point to the application and stores the main DOM render call in React. For this application, page routing via components and imports for stylesheets are also embedded in this file. 
   6. Pages Folder (/client/src/pages): this folder contains files for React components corresponding to the pages in the application (see the sections below for more details). 
   7. Component Folder (/client/src/components): similar to the /pages folder, but this folder contains files for React components corresponding to smaller, reusable components, especially those used by pages. 
2. Cd into server using `cd server` command on the command line
3. Install npm package manager using `npm install` command.
4. Cd into the client folder from the root directory using `cd client` and repeat step #3.
5. In the client folder, install the react word cloud package using the command: `npm install react-cloud --force`. Please note that the installation will need to be forced given that the package has a dependency on an older version of react (v16).
6. In both the client and server folders on the command line, run `npm start`. The webpage should pop up momentarily after.
