#!/bin/bash

# Get current git branch
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH=$([ -z "$TRAVIS_BRANCH" ] && echo "$GIT_BRANCH" || echo "$TRAVIS_BRANCH")

function build {
  echo "docker build >>> mariuslundgard/simpleweb:$1"
  docker build -t mariuslundgard/simpleweb:$1 .
}

if [ $BRANCH = "master" ]
then
  build latest
else
  build $(echo "$BRANCH" | sed 's|/|-|g')
fi
