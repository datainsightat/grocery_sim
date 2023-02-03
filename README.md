# grocery_sim
Simulate the dynamics in a grocery store

## Setup

### Setup Docker container

    $ docker container run -it -p 8080:80 --name grocery_sim ubuntu:20.04
  
    grocery_sim$ apt-get update
    grocery_sim$ apt-get upgrade
    
    grocery_sim$ apt-get install wget git ffmpeg software-properties-common
    grocery_sim$ add-apt-repository multiverse
    grocery_sim$ apt-get update
    grocery_sim$ apt install ubuntu-restricted-extras

    grocery_sim$ wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
    grocery_sim$ chmod +x Miniconda3-latest-Linux-x86_64.sh
    grocery_sim$ bash Miniconda3-latest-Linux-x86_64.sh
    
### Create Virtual Environment

    conda create -n grocery_sim python=3.8
    conda activate grocery_sim
    
### Clone repo

    grocery_sim$ ssh-keygen -t ed25519 -C "your_email@example.com"
    
copy /root/.ssh/id_ed25519.pub to git repo

    grocery_sim$ ssh-keygen -t ed25519 -C "your_email@example.com"
    grocery_sim$ git clone git@github.com:datainsightat/grocery_sim.git

### Install Required Packages

    grocery_sim$ cd /root/grocery_sim
    grocery_sim$ pip install -r requirements.txt
    grocery_sim$ ipython kernel install --name "grocery_sim" --user

### Run Demo

    grocery_sim$ abmarl train multi_corridor_example.py
    grocery_sim$ tensorboard --logdir abmarl_relts
    grocery_sim$ abmarl visualize abmarl_results/MultiCorridor_2023-02-03_12-26/ -n 5 --record