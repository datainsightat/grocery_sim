NODE_VERSION=16.13.0
apt install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
NVM_DIR=/root/.nvm
. "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
. "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
. "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
node --version
npm --version
npm install express --save