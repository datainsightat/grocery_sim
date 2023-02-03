# grocery_sim
Simulate the dynamics in a grocery store

## Setup

### Get Docker Image

    docker pull ubuntu
    docker container run -it -p 8080:80 --name grocery_sim ubuntu

### Create Virtual Environment

    python3 -m venv grocery
    source env/bin/activate

### Install Required Packages

    pip install -r requirements.txt

