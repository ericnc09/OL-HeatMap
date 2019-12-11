import json, csv
from datetime import datetime
from pprint import pprint

from overlapGraph.slig.datastructs import Region, RegionSet



regionset = RegionSet(id="airport", dimension=1)
# read events csv
# with open("data/airport_sample.csv") as infile:
with open("data/airport.csv") as infile:
  reader = csv.DictReader(infile)

  # collect all arrivals and departures at selected airport pler plane
  planes = {}
  for i, event in enumerate(reader):
    print("Input file line: " + str(i), end='\r')


    if event["DEP_TIME"] == "" or event["ARR_TIME"] == "":
      continue

    # filter dates
    if event["FL_DATE"] != "2019-02-01":
      continue

    if event["DEP_TIME"] == "2400":
      event["DEP_TIME"] = "0000"

    if event["ARR_TIME"] == "2400":
      event["ARR_TIME"] = "0000"


    timefrmt = "%Y-%m-%d%H%M"

    # select airport
    # airport_id = "12478" # JFK
    # airport_id = "12953" # LAG
    # airport_id = "14747" # SEA
    # airport_id = "13303" # MIA
    # airport_id = "12892" # LAX
    airport_id = "14908" # SNA


    # if plane is departing
    if event["ORIGIN_AIRPORT_ID"] == airport_id:
      event['time'] = int(datetime.strptime(
        event["FL_DATE"] + event["DEP_TIME"], timefrmt).timestamp())

      if event["TAIL_NUM"] not in planes:
        planes[event["TAIL_NUM"]] = {"arrivals":[], "departures":[event]}
      else:
        planes[event["TAIL_NUM"]]["departures"].append(event)

    # if plane is arriving
    if event["DEST_AIRPORT_ID"] == airport_id:
      event['time'] = int(datetime.strptime(
        event["FL_DATE"] + event["ARR_TIME"], timefrmt).timestamp())
      
      if event["TAIL_NUM"] not in planes:
        planes[event["TAIL_NUM"]] = {"arrivals":[event], "departures":[]}
      else:
        planes[event["TAIL_NUM"]]["arrivals"].append(event)


  # each plane has 1 more more visits to the airport
  for plane in planes.values():
    
    # sort arrivals by reverse time to guarantee smallest durations
    plane["arrivals"].sort(key=lambda x: x["time"],reverse=True)
    plane["departures"].sort(key=lambda x: x["time"])

    # for each arrival, find all departures after it
    for arrival in plane["arrivals"]:
      dep_candidates = [dep for dep in plane["departures"]
        if dep["time"] > arrival["time"]]

      # get first departure, remove it to prevent double departure selection
      if len(dep_candidates) > 0:
        departure = dep_candidates[0]
        plane["departures"].remove(departure)

        lower = [arrival["time"]/60 - 25816500]
        upper = [departure["time"]/60 - 25816500]

        region = Region(lower=lower, upper=upper,
          id=arrival["FL_DATE"]+"-"+arrival["DEP_TIME"]+"-"+arrival["TAIL_NUM"])
        
        # # filter by duration
        # if region.size > 6 * 60:
        #   continue
        
        regionset.add(region)








  print("")
  print("Final regions: " + str(len(regionset.regions)))
  regionset.calculate_bounds()
  with open("airport_feb1.json","w") as outfile:
    regionset.to_output(outfile)
