Instructions on how to setup, generate, populate, and tear down the database

Step a: Install PostgreSQL
1. Open a terminal window.
2. Issue the command "sudo apt-get install postgresql".
3. Type the sudo password necessary to give you admin rights and hit Enter.

Step b: Create the cmpt470 user
1. Type in the following commands
    - psql postgres
         (Launches the postgres terminal)

    - CREATE ROLE cmpt470 WITH LOGIN PASSWORD 'cmpt470';
        (Creates user cmpt470 with password cmpt470)
        
    - ALTER ROLE cmpt470 CREATEDB;
        (Give user db creation priviledges)
    
    - \q
        (Quit the psql terminal)
    
    - psql -d postgres -U cmpt470
        (Login with the cmpt470 user)
        
    - CREATE DATABASE cmpt470;
    
    - \c cmpt470
        (Switch to the cmpt470 database)

2. Copy the sql schema from the doc file and paste it into the postgres terminal

---
Some useful commands to know:
- psql cmpt470 -U cmpt470 - Login to the cmpt470 postgres database with the cmpt470 user

Commands once logged onto the database
- \list - List actual databases
- \c DATABASE_NAME - Connect to different database
- \d - List relations of the database
- \d TABLE_NAME - list relations of the specific tabled
- \du - List all users
- \dt - List tables / relations for the table
- \q - Close session and leave psql
- Table “table name” - See entries in table
