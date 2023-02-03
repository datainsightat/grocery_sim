from matplotlib import pyplot as plt

from abmarl.examples import MazeNavigationAgent, MazeNaviationSim
from abmarl.sim.gridworld.agent import GridWorldAgent
from abmarl.managers import AllStepManager
from abmarl.external import MultiAgentWrapper

object_registry = {
    'N': lambda n: MazeNavigationAgent(
        id=f'navigator',
        encoding=1,
        view_range=2, # Observation parameter that we can adjust as desired
        render_color='blue',
    ),
    'T': lambda n: GridWorldAgent(
        id=f'target',
        encoding=3,
        render_color='green'
    ),
    'W': lambda n: GridWorldAgent(
        id=f'wall{n}',
        encoding=2,
        blocking=True,
        render_shape='s'
    )
}

file_name = 'maze.txt'

sim = MazeNaviationSim.build_sim_from_file(
    file_name,
    object_registry,
    overlapping={1: [3], 3: [1]}
)

sim.reset()
fig = plt.figure()
sim.render(fig=fig)

for i in range(100):
    action = {'navigator': sim.navigator.action_space.sample()}
    sim.step(action)
    sim.render(fig=fig)
    done = sim.get_all_done()
    if done:
        plt.pause(1)
        break