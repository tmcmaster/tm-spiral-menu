#!/bin/bash

polymer build
rsync -a --delete build/prod/ docs/