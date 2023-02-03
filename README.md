# grocery_sim
Simulate the dynamics in a grocery store

## Setup

### Setup Docker container

    $ docker container run -it -p 8080:80 --name grocery_sim ubuntu:20.04
  
    grocery_sim$ apt-get update
    grocery_sim$ apt-get upgrade
    
    grocery_sim$ apt-get install wget git
    grocery_sim$ wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
    grocery_sim$ chmod +x Miniconda3-latest-Linux-x86_64.sh
    grocery_sim$ bash Miniconda3-latest-Linux-x86_64.sh
    
### Create Virtual Environment

    conda create -n grocery
    conda activate grocery
    
### Clone repo

    grocery_sim$ ssh-keygen -t ed25519 -C "your_email@example.com"
    
copy /root/.ssh/id_ed25519.pub to git repo

    grocery_sim$ ssh-keygen -t ed25519 -C "your_email@example.com"
    grocery_sim$ git clone git@github.com:datainsightat/grocery_sim.git

### Install Required Packages

    pip install -r requirements.txt

