import json,csv, time
from pprint import pprint
from os import path

from overlapGraph.generator import Randoms, RegionGenerator
from overlapGraph.slig.datastructs import Region,RegionSet,RIGraph,Interval
from overlapGraph.slig import SLIG
from grid import OverlapGrid


def run_experiment(distribution, n, sizepc, grid_sizes):
  
  start_experiment = time.process_time()

  if path.exists("data/{}_{}_{}.json".format(distribution[0], n, sizepc)):

    with open("data/{}_{}_{}.json".format(distribution[0], n, sizepc)) as file:
      regionset_dict = json.load(file)
      regionset = RegionSet.from_dict(regionset_dict)

    print("Loaded dataset: {}_{}_{}".format(distribution[0], n, sizepc))

  else:

    gen = RegionGenerator(dimension=2,posnrng=distribution[1],
      sizepc=Interval(0,sizepc))

    regionset = gen.get_regionset(n)

    with open("data/{}_{}_{}.json".format(distribution[0],n,sizepc),'w+') as file:
      regionset.to_output(file)

    print("Generated dataset: {}_{}_{}".format(distribution[0], n, sizepc))

  start_slig = time.process_time()

  alg = SLIG(regionset)
  alg.scan_line()
  # nr_of_intersections = len(alg.graph.G.edges)
  # print(nr_of_intersections)
  intersections = alg.enumerate_all()
  overlap_results = regionset.copy().merge(intersections)

  end_slig = time.process_time()
  elapsed_slig = end_slig - start_slig
  print("SLIG complete, time: ",elapsed_slig)

  results = [distribution[0], n, "0-" + str(sizepc), elapsed_slig]
  # results = [distribution[0], n, "0-" + str(sizepc), nr_of_intersections]

  # for grid_size in grid_sizes:
    
  #   start_grid = time.process_time()

  #   grid = OverlapGrid(regionset, grid_size)
  #   grid.construct_rtree()
  #   grid_results = grid.get_cell_overlaps()

  #   end_grid = time.process_time()
  #   elapsed_grid = end_grid - start_grid
  #   print("Grid {}x{} complete, time: ".format(grid_size,grid_size),
  #     elapsed_grid)

  #   eval_results = grid.get_cell_evals(alg)
  #   print("Grid {}x{} accuracy: {:.2%} correct cells, {:.2%} correct area"
  #     .format(grid_size, grid_size, eval_results[0], eval_results[1]))

  #   results.append(elapsed_grid)
  #   results.append(eval_results[0])
  #   results.append(eval_results[1])
  
  # end_experiment = time.process_time()
  # elapsed_experiment = end_experiment - start_experiment
  # print("Experiment complete, time: ", elapsed_experiment)

  return(results)


distributions = [
  ("uniform", Randoms.uniform()),
  # ("triangular", Randoms.triangular()),
  # ("gauss", Randoms.gauss(sigma=0.1)),
  # ("bimodal", Randoms.bimodal())
]
n_sizes = [500,1000,5000,10000,50000]
# n_sizes = [1000]
# sizepc_sizes = [0.01,0.05,0.1]
sizepc_sizes = [0.01]

grid_sizes = [100,250,500,750,1000]

with open("data/results.csv","w+") as csvfile:
  writer = csv.writer(csvfile)

  headers = ["Distribution","Nr. of objects","Size%","SLIG time"]
  for grid_size in grid_sizes:
    headers.append("Grid time ({}x{})".format(grid_size,grid_size))
    headers.append("Grid cell accuracy ({}x{})".format(grid_size,grid_size))
    headers.append("Grid area accuracy ({}x{})".format(grid_size,grid_size))
  writer.writerow(headers)
  csvfile.flush()


  for distribution in distributions:
    for n in n_sizes:
      for sizepc in sizepc_sizes:
        
        results = run_experiment(distribution, n, sizepc, grid_sizes)
        writer.writerow(results)
        csvfile.flush()
