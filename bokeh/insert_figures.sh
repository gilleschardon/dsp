#!/bin/sh

ls *html | sed -n 's/\(.*\)_template.html/python3 insert_figure.py \1_template\.html \1\.html/p' | sh
