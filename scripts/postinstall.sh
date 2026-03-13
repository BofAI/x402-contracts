#!/bin/bash
set -e  

echo "Cloning openzeppelin-contracts..."
git clone --branch v5.5.0 --depth 1 https://github.com/OpenZeppelin/openzeppelin-contracts ./lib/openzeppelin-contracts
