import numpy as np
import os

maze = np.load('data/store.npy')

for line in maze:
    print(line.astype(int))

