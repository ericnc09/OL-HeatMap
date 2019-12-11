import json, math
from bottle import request, get, post, run, static_file, response
from pprint import pprint

from overlapGraph.generator import Randoms, RegionGenerator
from overlapGraph.slig.datastructs import Region, RegionSet, RIGraph, Interval
from overlapGraph.slig import SLIG
from grid import OverlapGrid


# starting screen
@get('/')
def home():
  return static_file('static/index.html', root=".")

@get('/home.css')
def get_css():
  return static_file('static/home.css', root=".")

@get('/index.js')
def get_js():
  return static_file('static/index.js', root=".")

@get('/vis.js')
def get_vis_js():
  return static_file('static/vis.js', root=".")

@get('/us_map.png')
def get_us_map():
  return static_file('static/us_map.png', root=".")

@post('/generate')
def generate():

  params = json.loads(request.body.read())
  rng_params = [float(p) for p in params['params'] if p != ""]

  if params['posnrng'] == "uniform":
    posnrng = Randoms.uniform()

  elif params['posnrng'] == "gauss" and len(rng_params) >= 2:
    posnrng = Randoms.gauss(*rng_params[:2])

  elif params['posnrng'] == "triangular" and len(rng_params) >= 1:
    posnrng = Randoms.triangular(rng_params[0])

  elif params['posnrng'] == "bimodal" and len(rng_params) >= 4:
    posnrng = Randoms.bimodal(*rng_params[:4])

  else:
    response.status = 400
    return 'Invalid distribution parameters!'

  # pprint(*params['sizepc'])
  gen = RegionGenerator(dimension=int(params['dimension']),
    posnrng=posnrng,
    sizepc=Interval(*params['sizepc']))

  regionset = gen.get_regionset(int(params['nr_obj']))

  return json.dumps(regionset.to_dict())

@post('/visualize')
def visualize():
  data = json.loads(request.body.read())
  if (data['regions']['dimension'] == 1
    and len(data['regions']['bounds']['factors']) > 1):
    data['regions']['bounds']['factors'].pop()
  regionset = RegionSet.from_dict(data['regions'])

  alg = SLIG(regionset)
  alg.sweep()
  estim_cliques = len(alg.graph.G.edges)**2 / len(regionset.regions)**1.8

  if estim_cliques > 140:
    response.status = 420
    return "Too many intersections!"

  intersections = alg.enumerate_visible()
  overlap_results = regionset.copy().merge(intersections)

  grid_size = data['grid_size']

  grid = OverlapGrid(regionset, grid_size)

  grid.construct_rtree()
  grid_results = grid.get_cell_overlaps()

  return json.dumps({'overlap':overlap_results.to_dict(),
    'grid':grid_results.to_dict()})


@post('/evaluate')
def evaluate():

  data = json.loads(request.body.read())
  if (data['regions']['dimension'] == 1
    and len(data['regions']['bounds']['factors']) > 1):
    data['regions']['bounds']['factors'].pop()
  regionset = RegionSet.from_dict(data['regions'])

  alg = SLIG(regionset)
  alg.sweep()
  intersections = alg.enumerate_all()
  cover_intersections = alg.enumerate_visible()
  count_results = (len(intersections), len(cover_intersections))

  grid_size = data['grid_size']

  grid = OverlapGrid(regionset, grid_size)

  grid.construct_rtree()
  grid_results = grid.get_cell_overlaps()

  eval_results = grid.get_cell_evals(alg)

  return json.dumps({'eval': eval_results, 'count': count_results})


run(host='0.0.0.0', port=8080, debug=True, reloader=True)