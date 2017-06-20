# INSTRUCTION DOCUMENT FOR INTERN-PROJECT


### You need to setup your machine for the following technologies (click below to download):
- [Java](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html)
- [Node JS](https://nodejs.org/en/download/) 
- [Neo4j](https://neo4j.com/download/)
### Follow the steps mentioned below to run the app in your machine.
STEPS: 
  1. Start neo4j and check if it is up and running by accessing it on the web-browser and navigating to the link: 
     - localhost:7474/
  2. Download or clone the directory from the below mentioned public link:
https://github.com/NHJain/internproject
  3. Open server.js file in server folder.
  4. Find the below mentioned line and edit the credentials with those set by you in the system
     - db = new neo4j(‘http://username:Password@0.0.0.0:7474');
  5. Further, open the console (cmd or terminal, based on Windows/Mac) and change the directory (cd) 
     to the project root directory.
  6. Run the following commands as is :
     - npm install node-neo4j
     - npm install body-parser
     - npm install -g gulp bower nodemon
     - npm install webpack babel-loader babel-preset-es2015 babel-preset-react serve --save-dev
     - touch webpack.config.js
     - touch .babelrc
     - npm install
  7. Copy and paste below given data in .babelrc file
        {
            "presets" : ["es2015", "react"]
        }
  8. Go ahead now and  run the commands in the following order
      - npm run build
      - nodemon index.js
  9. In your web-browser navigate to the link:
      - localhost:8081
  10. Use the web-page to add the processes and verify the same in the neo4j  console.
  11. Compile all the java files using the command mentioned below:
	    - javac  “filename.java”
  12. After compilation is complete, proceed to run CreateProcessInstance.java by running the following command:
      - java CreateProcessInstance
  13. Enter the name of existing process you created and check neo4j to have process instance and logs associated with it created. 
