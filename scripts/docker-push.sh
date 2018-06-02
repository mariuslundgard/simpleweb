#!/bin/bash

# Get current git branch
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH=$([ -z "$TRAVIS_BRANCH" ] && echo "$GIT_BRANCH" || echo "$TRAVIS_BRANCH")

function push {
  echo "docker push >>> mariuslundgard/simpleweb:$1"
  docker push mariuslundgard/simpleweb:$1
}

if [ $BRANCH = "master" ]
then
  push latest
else
  push $(echo "$BRANCH" | sed 's|/|-|g')
fi
