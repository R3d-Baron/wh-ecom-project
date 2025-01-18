Instructions to run this project:

1. Clone the repo

2. Open the cloned project in vs code

3. Open vs code terminal

4. Create a .env file in the root directory of the project (.env file details shared seperately)

5. Run: npm i

6. Open mongo compass

7. Create a database named "WHECOMDB"

8. Unzip the zip file located inside folder "DB-BKP"

9. Import it in mongocompass using mongodb database tools; run command : mongorestore --uri "mongodb://localhost:27017/WHECOMDB" --db WHECOMDB "<path_of_unzipped_DB-BKP>"

10. Create uploads folder in this structure: ![image](https://github.com/user-attachments/assets/5ccdb140-bd47-44f6-8dac-cce7f6528bdb)
;

11. You can find the API collection inside folder "api-collection"; which I should not have shared here in the repo, but here you go.

12. After importing the API collection it should look something like this ![image](https://github.com/user-attachments/assets/ebc7c2b6-e426-4aa6-b486-c95535faa821)


13. Set up the {{wh-ecom-url}} in environment variables:- "http://localhost:4100/"

14. Use no auth. No login functionality is implemented.

Finally run: "nodemon" or "npm start"; whichever you prefer

--- If you find any problem setting up or running the project in your localhost, feel free to contact me;
