import json
from bottle import request, get, post, run, static_file

# starting screen
@get('/')
def home():
  return static_file('index.html', root=".")

@get('/home.css')
def get_css():
  return static_file('home.css', root=".")

@get('/index.js')
def get_js():
  return static_file('index.js', root=".")

# @get('/lib/rbush.js')
# def get_json():
#   return static_file('rbush.js', root="./lib")

@post('/generate')
def generate():
  
  print(request.body.read())

  return '{"success":"success"}'


run(host='0.0.0.0', port=8080, debug=True, reloader=True)