import os

def check_new_urls(dir_name):
    return [file for file in os.listdir(dir_name) if file.endswith('.html')]
