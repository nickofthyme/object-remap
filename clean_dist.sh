#!/bin/bash

# Needed to cleanup ncc output for CRLF error
# Note: Avoid space between -i and empty string
# so this works on linux and mac machines
sed -i"" "s/$(printf '\r')\$//" dist/index.js
