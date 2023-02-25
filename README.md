# grocery_sim

Simulate the dynamics in a grocery store

## Source

    https://abmarl.readthedocs.io/en/latest/index.html
    https://neptune.ai/blog/the-best-tools-for-reinforcement-learning-in-python
    https://strikingloo.github.io/reinforcement-learning-beginners
    https://pypi.org/project/pyqlearning/
    !!! https://samyzaf.com/ML/tdf/tdf.html

## Setup

### Create image

Get Dockerfile

    $ docker build -t grocery_sim .

### Setup Docker container

    grocery_sim$ conda activate grocery_sim
    grocery_sim$ ssh-keygen -t ed25519 -C "your_email@example.com"
    grocery_sim$ cat /root/.ssh/id_ed25519.pub

copy ssh key to dockerhub

    grocery_sim$ git clone git@github.com:datainsightat/grocery_sim.git
    grocery_sim$ cd grocery_sim/grocery_sim_20

### Run App

    grocery_sim$ node server.js