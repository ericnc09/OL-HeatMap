import json, csv, math
from pprint import pprint

from overlapGraph.slig.datastructs import Region, RegionSet



regionset = RegionSet(id="US_storms", dimension=2)
# read events csv
with open("data/master.csv") as infile:
  reader = csv.DictReader(infile)

  previous = None

  for i, event in enumerate(reader):
    print("Input file line: " + str(i), end='\r')

    # skip duplicates
    if (previous and event["EPISODE_ID"] == previous["EPISODE_ID"]
      or (previous and event["STATE"] == previous["STATE"]
      and event["BEGIN_DATE_TIME"] == previous["BEGIN_DATE_TIME"])):
      continue
    previous = event

    # filter out bad coords
    if (event["BEGIN_LON"] == "" or event["BEGIN_LAT"] == ""
      or abs(float(event["BEGIN_LON"])) > 180
      or abs(float(event["BEGIN_LAT"])) > 180):
      continue

    # limit to Florida
    # if (float(event["BEGIN_LON"]) < -88 or float(event["BEGIN_LAT"]) > 32
    #   or float(event["BEGIN_LON"]) > -70 or float(event["BEGIN_LAT"]) < 20):
    #   continue

    # limit to after 2000
    if int(event["BEGIN_YEARMONTH"]) < 201806:
      continue

    # if start and end positions present
    if (event["END_LAT"] != "" and event["END_LON"] != ""
      and abs(float(event["END_LON"])) < 180
      and abs(float(event["END_LAT"])) < 180):
      lower = [float(event["BEGIN_LON"]),
               float(event["BEGIN_LAT"])]
      upper = [float(event["END_LON"]),
               float(event["END_LAT"])]

    # if not present, get width & height and center on begin location
    elif (event["TOR_LENGTH"] != "" and float(event["TOR_LENGTH"]) != 0
      and float(event["TOR_LENGTH"]) < 50):
      length = 10 * float(event["TOR_LENGTH"])
      length_lat = length / 69.2
      length_lon = length / ( 69.2 *
        math.cos(math.radians(float(event["BEGIN_LAT"]))))

      lower = [float(event["BEGIN_LON"]) - length_lon/2,
               float(event["BEGIN_LAT"]) - length_lat/2]
      upper = [float(event["BEGIN_LON"]) + length_lon/2,
               float(event["BEGIN_LAT"]) + length_lat/2]
    else:
      continue

    region = Region(lower=lower, upper=upper,
      id=event["BEGIN_YEARMONTH"]+"-"+event["EVENT_ID"]+"-"+event["CZ_NAME"])

    if region.size < 0.001:
      continue
    regionset.add(region)


  print("")
  print("Final regions: " + str(len(regionset.regions)))
  regionset.calculate_bounds()
  # with open("florida_US_50yrs.json","w") as outfile:
  with open("entire_US_2yrs.json","w") as outfile:
    regionset.to_output(outfile)
