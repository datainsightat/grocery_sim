class Qtraining(object):
    def __init__(self, model, env, **opt):
        self.model = model  # Nueral Network Model
        self.env = env  # Environment (Tour De Flags maze object)
        self.n_epoch = opt.get('n_epoch', 1000)  # Number of epochs to run
        self.max_memory = opt.get('max_memory', 4*self.env.maze.size)  # Max memory for experiences
        self.data_size = opt.get('data_size', int(0.75*self.env.maze.size))  # Data samples from experience replay
        self.agent_cells = opt.get('agent_cells', [(0,0)])  # Starting cells for the agent
        self.weights_file = opt.get('weights_file', "")  # Keras model weights file
        self.name = opt.get('name', 'model')  # Name for saving weights and json files

        self.win_count = 0
        # If you want to continue training from a previous model,
        # just supply the h5 file name to weights_file option
        if self.weights_file:
            print("loading weights from file: %s" % (self.weights_file,))
            self.model.load_weights(self.weights_file)

        if self.agent_cells == 'all':
            self.agent_cells = self.env.free_cells

        # Initialize experience replay object
        self.experience = Experience(self.model, max_memory=self.max_memory)

    def train(self):
        start_time = datetime.datetime.now()
        self.seconds = 0
        self.win_count = 0
        for epoch in range(self.n_epoch):
            self.epoch = epoch
            self.loss = 0.0
            agent = random.choice(self.agent_cells)
            self.env.reset(agent)
            game_over = False
            # get initial env_state (1d flattened canvas)
            self.env_state = self.env.observe()
            self.n_episodes = 0
            while not game_over:
                game_over = self.play()

            dt = datetime.datetime.now() - start_time
            self.seconds = dt.total_seconds()
            t = format_time(self.seconds)
            fmt = "Epoch: {:3d}/{:d} | Loss: {:.4f} | Episodes: {:4d} | Wins: {:2d} | flags: {:d} | e: {:.3f} | time: {}"
            print(fmt.format(epoch, self.n_epoch-1, self.loss, self.n_episodes, self.win_count, len(self.env.flags), self.epsilon(), t))
            if self.win_count > 2:
                if self.completion_check():
                    print("Completed training at epoch: %d" % (epoch,))
                    break

    def play(self):
        action = self.action()
        prev_env_state = self.env_state
        self.env_state, reward, game_status = self.env.act(action)
        if game_status == 'win':
            self.win_count += 1
            game_over = True
        elif game_status == 'lose':
            game_over = True
        else:
            game_over = False

        # Store episode (experience)
        episode = [prev_env_state, action, reward, self.env_state, game_over]
        self.experience.remember(episode)
        self.n_episodes += 1

        # Train model
        inputs, targets = self.experience.get_data(data_size=self.data_size)
        epochs = int(self.env.base)
        h = self.model.fit(
            inputs,
            targets,
            epochs = epochs,
            batch_size=16,
            verbose=0,
        )
        self.loss = self.model.evaluate(inputs, targets, verbose=0)
        return game_over

    def run_game(self, agent):
        self.env.reset(agent)
        env_state = self.env.observe()
        while True:
            # get next action
            q = self.model.predict(env_state)
            action = np.argmax(q[0])
            prev_env_state = env_state
            # apply action, get rewards and new state
            env_state, reward, game_status = self.env.act(action)
            if game_status == 'win':
                return True
            elif game_status == 'lose':
                return False

    def action(self):
        # Get next action
        valid_actions = self.env.valid_actions()
        if not valid_actions:
            action = None
        elif np.random.rand() < self.epsilon():
            action = random.choice(valid_actions)
        else:
            q = self.experience.predict(self.env_state)
            action = np.argmax(q)
        return action

    def epsilon(self):
        n = self.win_count
        top = 0.80
        bottom = 0.08
        if n<10:
            e = bottom + (top - bottom) / (1 + 0.1 * n**0.5)
        else:
            e = bottom
        return e
    
    def completion_check(self):
        for agent in self.agent_cells:
            if not self.run_game(agent):
                return False
        return True

    def save(self, name=""):
        # Save trained model weights and architecture, this will be used by the visualization code
        if not name:
            name = self.name
        h5file = 'model_%s.h5' % (name,)
        json_file = 'model_%s.json' % (name,)
        self.model.save_weights(h5file, overwrite=True)
        with open(json_file, "w") as outfile:
            json.dump(self.model.to_json(), outfile)
        t = format_time(self.seconds)
        print('files: %s, %s' % (h5file, json_file))
        print("n_epoch: %d, max_mem: %d, data: %d, time: %s" % (self.epoch, self.max_memory, self.data_size, t))