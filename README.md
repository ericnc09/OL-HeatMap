# overlappingRect_Viz

Overlapping Rectangle Visualization is a dashboard(in-progress) for visualizing overlapping geometric shapes. The visualization is made out of D3.js (had to be), and the algortihms that we used are made out of different technologies, thus providing optimum performance which made our work easier. 


As this is a private project, I am gonna write some more stuff here. Mostly to have a clear idea on what means what inside the code. This, i think will make my life easier. 

## Implementation Details

This has two parts, they are disconnected and often connected at the same time. First part is Algorithms used and from where. Second part is about the visualization operations done on them.

### Algorithms and Libraries
This part has two libraries used so far. It uses Tilemachos's [his github link] for the SLOT algorithm which creates the data of the visualization that we have. 

**Functions used:** Still not done yet as the code is still under reconstruction.

The second library is called rbush. This is an implementation of the rtree algorithm which we used to create the intersection test for our naive approach on grids. We used the functions `tree.search()` to find the intersections of these rectangles with the grid rectangles. Grid has been described below. The output is stored into data format for d3 processing afterwards.

### D3 Visualization

We have extensively used D3 to make visualization of the values we receive from both of the previous methods. The methods we have used here is, `d3.JSON()`, to put the data inside the d3 format. `load_graphics` is our main visualization function right now. None of the others work, they are incomplete in most cases, in some cases I have not clearly figured everything out. They will be removed as our main code progresses. 

`load_graphics` creates rectangles based on the dataset it receives from the function. The test files, right now contains not too many work, it only has data generated on test purposes. For which it works pretty well. It creates rectangle object, takes in defferent schema, essentially draws on polygon at a time with same opacity. Colour changes due to presence of shades in link with z-index.

### JSON Parser

The best part is the parser.


### Components to be added

This part contains a list of functions which will be added inside the visualization for interactvity purposes. 

- Zoom/ Pan
- Details on Demand (Retriving Z index upon hovering)
- Colour Scale initialization using Chroma.js
- Testing of Real Data-sets
- Testing Methodology
