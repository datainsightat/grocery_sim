from matplotlib import pyplot as plt
from matplotlib.animation import FuncAnimation

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

#for i in range(100):
def animate(i):
    action = {'navigator': sim.navigator.action_space.sample()}
    sim.step(action)
    sim.render(fig=fig)
    done = sim.get_all_done()
    if done:
       plt.pause(1)
       break


# anim = FuncAnimation(fig, animate, init_func = init, frames = 200, interval = 20, blit = True)

# anim.save('grocery.mp4',writer = 'ffmpeg', fps = 30)

# params = {
#     'experiment': {
#         'title': f'{sim_name}',
#         'sim_creator': lambda config=None: sim,
#     },
#     'ray_tune': {
#         'run_or_experiment': 'PG',
#         'checkpoint_freq': 50,
#         'checkpoint_at_end': True,
#         'stop': {
#             'episodes_total': 2000,
#         },
#         'verbose': 2,
#         'local_dir': '',#'output_dir',
#         'config': {
#             # --- Simulation ---
#             'disable_env_checking': False,
#             'env': sim_name,
#             'horizon': 200,
#             'env_config': {},
#             # --- Multiagent ---
#             # 'multiagent': {
#             #     'policies': policies,
#             #     'policy_mapping_fn': policy_mapping_fn,
#             # },
#             # "lr": 0.0001,
#             # --- Parallelism ---
#             # Number of workers per experiment: int
#             "num_workers": 1,#7,
#             # Number of simulations that each worker starts: int
#             "num_envs_per_worker": 1, # This must be 1 because we are not "threadsafe"
#         },
#     }
# }