# maze is a 2d Numpy array of floats between 0.0 to 1.0
# 1.0 corresponds to a free cell, and 0.0 an occupied cell
# rat = (row, col) initial rat position (defaults to (0,0))

class Tmaze(object):
    """
    Tour De Flags maze object
    maze: a 2d Numpy array of 0's and 1's
        1.00 - a free cell
        0.65 - flag cell
        0.50 - agent cell
        0.00 - an occupied cell
    agent: (row, col) initial agent position (defaults to (0,0))
    flags: list of cells occupied by flags
    """
    def __init__(self, maze, flags, agent=(0,0), target=None):
        self._maze = np.array(maze)
        self._flags = set(flags)
        nrows, ncols = self._maze.shape
        if target is None:
            self.target = (nrows-1, ncols-1)   # default target cell where the agent to deliver the "flags"
        self.free_cells = set((r,c) for r in range(nrows) for c in range(ncols) if self._maze[r,c] == 1.0)
        self.free_cells.discard(self.target)
        self.free_cells -= self._flags
        if self._maze[self.target] == 0.0:
            raise Exception("Invalid maze: target cell cannot be blocked!")
        if not agent in self.free_cells:
            raise Exception("Invalid agent Location: must sit on a free cell")
        self.reset(agent)

    def reset(self, agent=(0,0)):
        self.agent = agent
        self.maze = np.copy(self._maze)
        self.flags = set(self._flags)
        nrows, ncols = self.maze.shape
        row, col = agent
        self.maze[row, col] = agent_mark
        self.state = ((row, col), 'start')
        self.base = np.sqrt(self.maze.size)
        self.visited = dict(((r,c),0) for r in range(nrows) for c in range(ncols) if self._maze[r,c] == 1.0)
        self.total_reward = 0
        self.min_reward = -0.5 * self.maze.size
        self.reward = {
            'blocked':  self.min_reward,
            'flag':     1.0/len(self._flags),
            'invalid': -4.0/self.base,
            'valid':   -1.0/self.maze.size
        }

    def act(self, action):
        self.update_state(action)
        reward = self.get_reward()
        self.total_reward += reward
        status = self.game_status()
        env_state = self.observe()
        return env_state, reward, status

    def get_reward(self):
        agent, mode = self.state
        if agent == self.target:
            return 1.0 - len(self.flags) / len(self._flags)
        if mode == 'blocked':
            return self.reward['blocked']
        elif agent in self.flags:
            return self.reward['flag']
        elif mode == 'invalid':
            return self.reward['invalid']
        elif mode == 'valid':
            return self.reward['valid'] #* (1 + 0.1*self.visited[agent] ** 2)

    def update_state(self, action):
        nrows, ncols = self.maze.shape
        (nrow, ncol), nmode = agent, mode = self.state

        if self.maze[agent] > 0.0:
            self.visited[agent] += 1  # mark visited cell
        if agent in self.flags:
            self.flags.remove(agent)

        valid_actions = self.valid_actions()

        if not valid_actions:
            nmode = 'blocked'
        elif action in valid_actions:
            nmode = 'valid'
            if action == 0:    # move left
                ncol -= 1
            elif action == 1:  # move up
                nrow -= 1
            elif action == 2:    # move right
                ncol += 1
            elif action == 3:  # move down
                nrow += 1
        else:                  # invalid action, no change in agent position
            nmode = 'invalid'

        # new state
        agent = (nrow, ncol)
        self.state = (agent, nmode)

    def game_status(self):
        if self.total_reward < self.min_reward:
            return 'lose'
        agent, mode = self.state
        if agent == self.target:
            if len(self.flags) == 0:
                return 'win'
            else:
                return 'lose'

        return 'ongoing'

    def observe(self):
        canvas = self.draw_env()
        env_state = canvas.reshape((1, -1))
        return env_state

    def draw_env(self):
        canvas = np.copy(self.maze)
        nrows, ncols = self.maze.shape
        # clear all visual marks
        for r in range(nrows):
            for c in range(ncols):
                if canvas[r,c] > 0.0:
                    canvas[r,c] = 1.0
        # draw the flags
        for r,c in self.flags:
            canvas[r,c] = flag_mark
        # draw the agent
        agent, mode = self.state
        canvas[agent] = agent_mark
        return canvas

    def valid_actions(self, cell=None):
        if cell is None:
            (row, col), mode = self.state
        else:
            row, col = cell
        actions = [0, 1, 2, 3]
        nrows, ncols = self.maze.shape
        if row == 0:
            actions.remove(1)
        elif row == nrows-1:
            actions.remove(3)

        if col == 0:
            actions.remove(0)
        elif col == ncols-1:
            actions.remove(2)

        if row>0 and self.maze[row-1,col] == 0.0:
            actions.remove(1)
        if row<nrows-1 and self.maze[row+1,col] == 0.0:
            actions.remove(3)

        if col>0 and self.maze[row,col-1] == 0.0:
            actions.remove(0)
        if col<ncols-1 and self.maze[row,col+1] == 0.0:
            actions.remove(2)

        return actions