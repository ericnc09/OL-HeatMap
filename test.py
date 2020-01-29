import time
from overlapGraph.generator import Randoms, RegionGenerator
from overlapGraph.slig.datastructs import Region,RegionSet,RIGraph,Interval


gen = RegionGenerator(dimension=2)


start_experiment = time.process_time()

regionset = gen.get_regionset(1000000)

end_experiment = time.process_time()

print(int(end_experiment - start_experiment))