// Randomly choose any direction, but do not crash into walls

import { movePlayer } from "../move.js";

function strategyGPT4ScanStore(obj) {

    class Agent {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.directions = [];
        }
        
        move(dx, dy, direction) {
            this.x += dx;
            this.y += dy;
            this.directions.push(direction);
        }
    }
    
    function initializePerception(maze) {
        let perception = maze.map(row => row.map(cell => (cell === 1) ? 2 : 0));
        return perception;
    }
    
    function updatePerception(agent, perception, radius1, radius2) {

        for (let i = 0; i < perception.length; i++) {

            for (let j = 0; j < perception[i].length; j++) {
                let distance = Math.sqrt((agent.x - j) ** 2 + (agent.y - i) ** 2);
                
                if (distance <= radius1) {
                    perception[i][j] = 3;
                    // obj.player.knowledge_level[i][j] = 3;
                } else if (distance <= radius2) {
                    perception[i][j] = Math.max(perception[i][j], 1);
                }
            }
        }
    }
    
    function moveAgent(agent, maze, perception) {
        const directions = [[0, -1, 'n'], [0, 1, 's'], [-1, 0, 'w'], [1, 0, 'e']];
        
        for (const [dx, dy, dir] of directions) {
            let newX = agent.x + dx;
            let newY = agent.y + dy;
            
            if (newY >= 0 && newY < maze[0].length && newX >= 0 && newX < maze[0].length && maze[newY][newX] === 0) {
                agent.move(dx, dy, dir);
                maze[agent.y][agent.x] = 3;
                updatePerception(agent, perception, 5, 15);
                
                if (isPerceptionComplete(perception)) {
                    return agent.directions;
                }
                
                let result = moveAgent(agent, maze, perception);
                if (result) {
                    return result;
                }
                
                agent.move(-dx, -dy);
                maze[agent.y][agent.x] = 0;
                agent.directions.pop();
                updatePerception(agent, perception, 5, 15);
            }
        }
        
        return null;
    }
    
    function isPerceptionComplete(perception) {
        for (const row of perception) {
            for (const cell of row) {
            if (cell === 0) {
                return false;
            }
            }
        }
        return true;
    }

    function moveStep(obj) {
        // console.log(obj.player.path);
        //move to next cell
        movePlayer(obj,obj.player.path[0]);
        //remove first item
        obj.player.path.shift();
    }
    
    if (obj.player.path.length == 0) {

        console.log("New path");

        let maze = obj.map; //[/* Your maze data here */];
        let perception = initializePerception(maze);
        let agent = new Agent(obj.player.x,obj.player.y); // Set the initial position of the agent
        
        let result = moveAgent(agent, maze, perception);
    
        if (result) {
            console.log("Directions:", result);
            obj.player.path = result;
        } else {
            console.log("No solution found.");
        }

    } else {

        console.log('one Step');

        //move to next cell
        moveStep(obj);

    }



    // movePlayer(obj,options[i]);

};

export {strategyGPT4ScanStore};