## Omniwin Docker setup
	 - nginx container for reverse proxy
	 - backend API container
	 - frontend app container
	 - MySQL database container

## Follow the steps to spin up the environment:
### 1. cd to project folder where docker-compose.yml can be found
### 2. Run create_aliases.sh to add the custom aliases to your system
- ```./create_aliases.sh```
- ```source $HOME/.zshrc``` (Unix based system)
- ```source $HOME/.bashrc``` (Linux based system)
### 3. Run 'dc-start' to spin up the project
### 4. Run in your terminal: 
   - ```echo "127.0.0.1    omniwin.local" | sudo tee -a /etc/hosts```

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