from rtree import index
from overlapGraph.slig.datastructs import Region, RegionSet


class OverlapGrid(object):
  """Handler for grid generation and grid cell overlap calculation"""

  def __init__(self, regionset, size):
    self.regionset = regionset
    self.size = int(size)
    self.cells = self.construct_cells()


  def construct_cells(self):
    """Create the grid cells based on the size parameter"""

    bounds = self.regionset.bounds.factors
    cell_width=(bounds[0].upper - bounds[0].lower)/self.size
    cell_height=(bounds[1].upper - bounds[1].lower)/self.size

    cells = []


    #The two for loops are essentially x and y. They create the grid
    #based on the formula of these two things right here
    for i in range(self.size):
      for j in range(self.size):
        new_cell = {
        'xmin': cell_width * i,
        'ymin': cell_height * j,
        'xmax': cell_width * (i + 1),
        'ymax': cell_height * (j + 1)}
        cells.append(new_cell)
    
    return cells


  def construct_rtree(self):
    """Construct an rtree containing the regionset regions"""

    self.idx = index.Index()

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
      
      overlaps = list(self.idx.intersection((cell['xmin'],cell['ymin'],
        cell['xmax'],cell['ymax']), objects='raw'))

      new_region = Region(lower=[cell['xmin'],cell['ymin']],
        upper=[cell['xmax'],cell['ymax']])
      new_region.originals = overlaps
      self.grid_set.add(new_region)


    return self.grid_set


  def eval_cell(self, cell, grid_set):
    """Evaluate a single grid cell for accuracy"""

    overlaps = list(self.idx.intersection(
      (cell.factors[0].lower,cell.factors[1].lower,
      cell.factors[0].upper,cell.factors[1].upper), objects='raw'))

    # if cell has value 0, cell is correct
    if len(overlaps) == 0:
      return True

    # go from list of region ids to list of regions
    overlap_regions = [self.regionset[r_id] for r_id in overlaps]

    max_overlap = sorted(overlap_regions, reverse=True,
      key=lambda r:len(r.originals))[0]
    
    if len(max_overlap.originals) != len(cell.originals):
      return False
    
    return max_overlap.encloses(cell)






  def get_cell_eval(self, grid_set):
    """Evaluate the accuracy of the grid"""

    total = 0

    for cell in grid_set.regions:
      total += 1 if self.eval_cell(cell, grid_set) else 0

    return total/len(grid_set.regions)
      
        