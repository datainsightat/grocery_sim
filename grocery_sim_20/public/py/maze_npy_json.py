import numpy as np
import json

maze = np.load('public/data/store.npy').astype(int).tolist()
maze_json = json.dumps(maze) 

with open('public/data/store.json', 'w') as outfile:
    outfile.write(maze_json)