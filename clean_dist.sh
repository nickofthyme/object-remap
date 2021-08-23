#!/bin/bash

# Needed to cleanup ncc output for CRLF error
# Note: Only runs on mac machines
sed -i "" "s/$(printf '\r')\$//" dist/index.js
