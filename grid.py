from rtree import index
from overlapGraph.slig.datastructs import Region, RegionSet
from overlapGraph.slig import SLIG
from networkx import networkx as nx
from pprint import pprint


class OverlapGrid(object):
  """Handler for grid generation and grid cell overlap calculation"""

  def __init__(self, regionset, size):
    self.regionset = regionset
    self.size = int(size)
    self.cells = self.construct_cells()


  def construct_cells(self):
    """Create the grid cells based on the size parameter"""

    bounds = self.regionset.bounds.factors

    if self.regionset.dimension == 1:

      cell_width=(bounds[0].upper - bounds[0].lower)/self.size
      cells = []

      #The two for loops are essentially x and y. They create the grid
      #based on the formula of these two things right here
      for i in range(self.size):
        new_cell = Region(id="cell_{}".format(i),
          lower=[cell_width * i],
          upper=[cell_width * (i + 1)])
        cells.append(new_cell)
      
      return cells

    else:
      
      cell_width=(bounds[0].upper - bounds[0].lower)/self.size
      cell_height=(bounds[1].upper - bounds[1].lower)/self.size

      cells = []

      #The two for loops are essentially x and y. They create the grid
      #based on the formula of these two things right here
      for i in range(self.size):
        for j in range(self.size):
          new_cell = Region(id="cell_{}_{}".format(i,j),
            lower=[cell_width * i, cell_height * j],
            upper=[cell_width * (i + 1), cell_height * (j + 1)])
          cells.append(new_cell)
      
      return cells


  def construct_rtree(self):
    """Construct an rtree containing the regionset regions"""

    self.idx = index.Index()


    if self.regionset.dimension == 1:

      for i, region in enumerate(self.regionset.regions):
        
        xmin = region.factors[0].lower
        xmax = region.factors[0].upper

        self.idx.insert(i, (xmin, 0, xmax, 1), region.id)

      return self.idx

    else:

      for i, region in enumerate(self.regionset.regions):
        
        xmin = region.factors[0].lower
        ymin = region.factors[1].lower
        xmax = region.factors[0].upper
        ymax = region.factors[1].upper

        self.idx.insert(i, (xmin, ymin, xmax, ymax), region.id)

      return self.idx


  def get_cell_overlaps(self):
    """Get the overlap value of each cell"""
    
    self.grid_set = RegionSet(bounds=self.regionset.bounds)

    for cell in self.cells:

      if self.regionset.dimension == 1:
        overlaps = list(self.idx.intersection(
          (cell.factors[0].lower, 0, 
           cell.factors[0].upper, 1), objects='raw'))
      else:
        overlaps = list(self.idx.intersection(
          (cell.factors[0].lower, cell.factors[1].lower, 
           cell.factors[0].upper, cell.factors[1].upper), objects='raw'))
      

      cell.originals = overlaps
      self.grid_set.add(cell)


    return self.grid_set


  def get_cell_evals(self, alg):
    """Evaluate each cell for overlap accuracy."""

    eval_bool = []
    eval_size = []
    cell_size = self.cells[0].size

    for cell in self.cells:

      cell_value = len(cell.originals)

      if cell_value == 0:
        cell_correct = True
        cell_correct_size = 1

      elif cell_value == 1:

        region = self.regionset[cell.originals[0]]
        cell_correct = region.encloses(cell)
        cell_correct_size = region.get_intersection_size(cell)/cell_size

      else:
        cell_correct = False
        cell_correct_size = 0

        subgraph = alg.graph.G.subgraph(cell.originals)
        for clique in nx.enumerate_all_cliques(subgraph):

          if len(clique) == cell_value:
            intersect = [self.regionset[r] for r in clique]
            region    = Region.from_intersection(intersect)

            cell_correct = region.encloses(cell)
            cell_correct_size += region.get_intersection_size(cell)/cell_size

      eval_bool.append(cell_correct)
      eval_size.append(cell_correct_size)

    bool_score = sum(int(cell) for cell in eval_bool)/len(self.cells)
    size_score = sum(eval_size)/len(self.cells)
    return(bool_score, size_score)