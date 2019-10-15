# Project 3

**Group:** John Goodale, Julia Smith, Julia Sweet, Kyle Younghans, Matt Garcia and Ricardo Bonner

**Topic:** 10 Year NFL Home and Away Performance

**Question:** Do teams playing in their homes stadiums perform better then teams playing away?

**Objective:**<br> 
- Develop a map showing all NFL stadiums by location. Popups on the mapp will display general stats relative to that particular stadium.<br> 
- Design an app to display a dashboard that will allow users to explor and visualize the data.<br> 
- Dashboard will visualize 10 years of game data and include EPA and point comparisons for every team in the league as well as agragated by year.<br>

**Scope of data:**<br> 
- We are utilizing ten years of game results and play-by-play data from the 2009 to 2018 NFL seasons.<br> 

**Metrics:** <br> 
- *Expected Points Added(EPA)*:  This is a complicated metric popularized by Brian Burke at (AdvancedNFLStats.com). At its core Expected Points (EP) is a measure of the value of the current state of the game (down, distance, field position, time remaining) to each team. Higher EP values indicate a situation favoring the offense while lower EP values favor defense. This is given at the start of each play before the ball is snapped.  Expected Points Added(EPA) is the difference between EP of the previous play and the EP of next one. EPA measures the value of the outcome of play. Because its calculation includes so many factors of a football game, EPA it is a good way to assign objective values to an event chosen through subjective and situational decision making.  We decided to use EPA as a measure of teams' success in home or away situations.<br> 
- *Game points*: We've also decided to use a more straight forward metric of game points to provide another perspective of teams' performances home and away. 

**API used:** <br>
(https://sportsreference.readthedocs.io/en/stable/nfl.html#player)<br>
(https://api.nfl.com/docs/getting-started/index.html)
