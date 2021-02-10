# OL-HeatMap

OL-HeatMap [Overlapping HeatMap] Visualization is a dashboard for visualizing overlapping geometric shapes. The visualization is made out of D3.js, and the algortihms that we used are made out of different technologies.



### D3 Visualization

The front-end is responsible for the actual heat-map visualization and all in-teraction with the user. It is implemented in HTML, CSS and JavaScript, makinguse of the Data Driven Documents (D3) and JQuery JavaScript libraries for visual-ization and for communication with the back-end, plus other general functionality,respectively. The interface allows the user to generate and store synthetic data-setsby specifying parameter values for the random data generator using form fields, oralternatively loading their own input data. The UI provides a preview of this inputdata, as well as the OL-HEATMAP and grid-based heat-map visualization of over-laps in said data. The grid granularity valueg, as well as the color scale used forthe visualization can also be modified through form fields, while the visualization contains several useful features such as pan/zoom capability and details for eachdata point on hover. Finally, an evaluation of the grid-based approach’s accuracy isdisplayed, including both ACgrid and ASgrid. 

### BackEnd

The dashboard demo is structured as a lightweight WebApp-style application,with a Python Flask-based back-end. The back-end contains the implementation ofthe data generator, as well as theOL-HEATMAP and grid-based algorithms. Forthe grid-based algorithm, a grid is constructed over the input data-set according tothe specified granularity valueg, and each cell’s overlap value is determined usingan r-tree based index, with the help of Python’s Rtree library. Likewise, the overlaprectangles for the OL-HEATMAP method are calculated using the SLIG library.Finally, the results from the two methods are compared to produce the accuracyevaluation score for the grid-based approach, as theOL-HEATMAP method bydefinition produces exact results


### Components 

This part contains a list of functions.

- Zoom/ Pan
- Details on Demand (Retriving Z index upon hovering)
- Colour Scale initialization using Chroma.js
- Testing of Real Data-sets

