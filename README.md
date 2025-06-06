## Omniwin Docker setup

- nginx container for reverse proxy

- backend API container
- frontend app container
- MySQL database container

## Follow the steps to spin up the environment

### 1. cd to project folder where docker-compose.yml can be found

### 2. Run create_aliases.sh to add the custom aliases to your system

- ```./create_aliases.sh```
- ```source $HOME/.zshrc``` (Unix based system)
- ```source $HOME/.bashrc``` (Linux based system)

### 3. In your terminal, create local env config

- ```cp .env.omniwin .env```
- ```cp backend/api/.env.omniwin backend/api/.env```
- ```cp website/.env.omniwin website/.env```

### 4. Run 'dc-start' to spin up the project

- ```dc-start```

### 5. Run in your terminal

- ```echo "127.0.0.1    omniwin.local" | sudo tee -a /etc/hosts```

### 6. Seed your environment with data

- ```docker cp mysql-db/01-omniwin-seed.sql mysql-db:/```
- ```docker exec -it mysql-db sh``` or ```bash```
- ```mysql -u root -p omniwin < 01-omniwin-seed.sql```

- password: ```root```

## Rebuild only one service

```
docker-compose stop frontend-app
docker-compose rm -f frontend-app
docker-compose up --build -d frontend-app
```

## Custom aliases

- dc = docker-compose shortcut
- dc-start = Start the project by spinning up the container's setup
- dc-destroy = Stop and remove containers, networks, volumes, and other resources
- dc-logs = View the logs of services created
- dc-list = Only lists running containers
- dc-listall = List all containers on your system, including both running and stopped containers
- dc-stop = Stops all running containers on your host
- dc-delete-all = Removes all stopped containers from your host
- dc-exec = Execute a command inside a running Docker container (eg. dc-exec my-container ls /app)
- dc-bash = Open a Bash terminal to your container (eg. dc-bash frontend-app)
- dc-sh = Open a SH terminal to your container (eg. dc-sh frontend-app)



## PRISMA Commands:
- create new migration without applying it      =   npx prisma migrate dev --create-only --name migration_name
- create new migration applying it in db        =   npx prisma migrate dev --name migration_name
- check which migrations have been applied      =   npx prisma migrate status
- apply latest migration for dev                =   npx prisma migrate dev
- apply latest migration for prod               =   npx prisma migrate deploy
- whenever you update the schema check ur app   =   npx prisma generate
    is sync with db schema 

