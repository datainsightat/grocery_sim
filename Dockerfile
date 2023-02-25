FROM ubuntu:20.04

###############
# Environment #
###############

ENV NODE_VERSION=16.13.0
ENV NVM_DIR=/root/.nvm
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
ENV PATH /opt/conda/bin:$PATH

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
RUN bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda

RUN conda create -n grocery_sim python=3.8
RUN conda init bash
# RUN conda activate grocery_sim

RUN echo "conda activate grocery_sim" > ~/.bashrc

########
# NODE #
########

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

RUN node --version
RUN npm --version
