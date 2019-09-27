import json
from bottle import request, get, post, run, static_file, response
from pprint import pprint

from overlapGraph.generator import Randoms, RegionGenerator
from overlapGraph.slig.datastructs import Region, RegionSet, RIGraph, Interval
from overlapGraph.slig import SLIG


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

@get('/vis.js')
def get_vis_js():
  return static_file('vis.js', root=".")

@post('/generate')
def generate():

  params = json.loads(request.body.read())
  rng_params = [float(p) for p in params['params'] if p != ""]

  if params['posnrng'] == "uniform":
    posnrng = Randoms.uniform()

  elif params['posnrng'] == "gauss" and len(rng_params) >= 2:
    posnrng = Randoms.gauss(*rng_params[:1])

  elif params['posnrng'] == "triangular" and len(rng_params) >= 1:
    posnrng = Randoms.triangular(rng_params[0])

  elif params['posnrng'] == "bimodal" and len(rng_params) >= 4:
    posnrng = Randoms.bimodal(*rng_params[:3])

  else:
    response.status = 400
    return 'Invalid distribution parameters!'

  # pprint(*params['sizepc'])
  gen = RegionGenerator(dimension=int(params['dimension']),
    posnrng=posnrng,
    sizepc=Interval(*params['sizepc']))

  regionset = gen.get_regionset(int(params['nr_obj']))
  alg = SLIG(regionset)
  alg.prepare()
  alg.sweep()
  intersections = alg.enumerate_all()

  results = regionset.copy().merge(intersections)

  return json.dumps({'results':results.to_dict()})


run(host='0.0.0.0', port=8080, debug=True, reloader=True)