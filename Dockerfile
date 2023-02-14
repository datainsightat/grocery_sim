# READ FIRST #

# You need to generate a ssh key and copy it to the github repo:

# ssh-keygen -t ed25519 -C "your_email@example.com"
# cat /root/.ssh/id_ed25519.pub

FROM ubuntu:20.04

###############
# Environment #
###############

ENV NODE_VERSION=16.13.0
ENV NVM_DIR=/root/.nvm
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

###########
# General #
###########

RUN apt-get update && \
    apt-get install -y curl wget git

#########
# CONDA #
#########

RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN chmod +x Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh

RUN conda create -n grocery_sim python=3.8
RUN conda activate grocery_sim

########
# NODE #
########

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

RUN node --version
RUN npm --version
RUN npm install express --save

############
# Get Repo #
############

RUN git clone git@github.com:datainsightat/grocery_sim.git

RUN cd /root/grocery_sim/grocery_sim_20
RUN pip install -r requirements.txt
RUN ipython kernel install --name "grocery_sim" --user

###########
# RUN App #
###########

RUN 