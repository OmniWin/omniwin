#!/bin/bash

# Check if .bashrc exists
if [ -f "$HOME/.bashrc" ]; then
    echo "Adding aliases to .bashrc..."
    # Add your aliases here
    cat <<EOT >> "$HOME/.bashrc"
    
# Custom Docker aliases
alias dc='docker-compose'
alias dcr='docker-compose run --rm'
alias dc-start='docker-compose up'
alias dc-destroy='docker-compose down'
alias dc-logs='docker-compose logs'
# Docker container management aliases
alias dc-list='docker ps'
alias dc-listall='docker ps -a'
alias dcrun='docker container run -it --rm'
alias dc-stop='docker ps --format "{{.Names}}" | xargs -I {} docker stop {} && docker ps -a --format "{{.Names}}" | xargs -I {} echo "{} Stopped"'
alias dc-delete-all='docker container rm \$(docker ps -a -q)'
# Docker container shell access aliases
alias dc-exec='docker exec -it'
alias dc-bash='docker exec -it \$1 bash'
alias dc-sh='docker exec -it \$1 sh'
EOT
    echo "Aliases added to .bashrc."
fi

# Check if .zshrc exists
if [ -f "$HOME/.zshrc" ]; then
    echo "Adding aliases to .zshrc..."
    # Add your aliases here
    cat <<EOT >> "$HOME/.zshrc"
# Custom Docker aliases
alias dc='docker-compose'
alias dcr='docker-compose run --rm'
alias dc-start='docker-compose up'
alias dc-destroy='docker-compose down'
alias dc-logs='docker-compose logs'
# Docker container management aliases
alias dc-list='docker ps'
alias dc-listall='docker ps -a'
alias dcrun='docker container run -it --rm'
alias dc-stop='docker ps --format "{{.Names}}" | xargs -I {} docker stop {} && docker ps -a --format "{{.Names}}" | xargs -I {} echo "{} Stopped"'
alias dc-delete-all='docker container rm \$(docker ps -a -q)'
# Docker container shell access aliases
alias dc-exec='docker exec -it'
alias dc-bash='docker exec -it \$1 bash'
alias dc-sh='docker exec -it \$1 sh'
EOT
    echo "Aliases added to .zshrc."
fi