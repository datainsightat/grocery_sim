function perception(obj) {

        /*
    Roate a ray from the players point of view and collect information about the map.
    Choose strategy based on information.
    */

    // Clear radars

    let clear_radar = function(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.clearRect(0,0,100,100);
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, 2 * Math.PI);
        ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(50, 50, 2, 0, 2 * Math.PI);
        // ctx.fill();
    }

    let draw_line = function(ctx,nav_x0,nav_y0,nav_dx,nav_dy,color,width) {
        if (color == 'red') {
        ctx.strokeStyle = 'rgba(255,0,0,0.4)';
        } else {
        ctx.strokeStyle = color;
        }
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(nav_x0, nav_y0);
        ctx.lineTo(nav_x0 + nav_dx, nav_y0 + nav_dy);
        ctx.stroke();
    }

    clear_radar(obj.knowledge_ctx);
    clear_radar(obj.aisle_ctx);
    clear_radar(obj.aisle_unknown_ctx);
    clear_radar(obj.group_ctx);
    clear_radar(obj.item_ctx);
    clear_radar(obj.promotion_ctx);

    // set player center

    let y0 = [obj.player.y] * 1;
    let x0 = [obj.player.x] * 1;

    obj.player.knowledge_level[y0][x0] = 3;

    let ray_length = 25;

    let nav_x0 = 50;
    let nav_y0 = 50;

    let knowledge_sum = 0;
    let unknown_aisle_sum = 0;
    let aisle_sum = 0;
    let group_sum = 0;
    let item_sum = 0;
    let promotion_sum = 0;

    let knowledge_sin = 0;
    let knowledge_cos = 0;
    let unknown_aisle_sin = 0;
    let unknown_aisle_cos = 0;
    let aisle_sin = 0;
    let aisle_cos = 0;
    let group_sin = 0;
    let group_cos = 0;
    let item_sin = 0;
    let item_cos = 0;
    let promotion_sin = 0;
    let promotion_cos = 0;

    let rays = 8

    let percive_step = {};

    for (let i = (2 * Math.PI / rays); i <= 2 * Math.PI; i += (2 * Math.PI / rays)) {

        let knowledge_score = 0;
        let unknown_aisle_score = 0;
        let aisle_score = 0;
        let group_score = 0;
        let group_score_xy = [];
        let item_score = 0;
        let item_score_xy = [];
        let promotion_score = 0;

        let view_blocked = false;

        for (let j = 1; j <= ray_length; j++) {

        let dy = Math.round(Math.sin(i) * j);
        let dx = Math.round(Math.cos(i) * j);
        let y = y0 + dy;
        let x = x0 + dx;
        let tile = document.getElementById(''.concat('y',y,'x',x));

        // if coordinates are out of Matrix, break
        if (y < 0 | y > (obj.player.knowledge_level.length-1) | x < 0 | x > (obj.player.knowledge_level[0].length-1)) {
            knowledge_score += 2*((ray_length + 1)-j);
            break;
        }

        let percive = 0;

        if (j > 2) {
            percive = 1
        } else {
            percive = 2
        }

        if (obj.player.knowledge_level[y][x] < percive & view_blocked == false) {
            obj.player.knowledge_level[y][x] = percive;
        }

        // if there is an aisle and the player has little knowledge about it and the view
        // is not blocked, increase score
        if (obj.map[y][x] == 0 & view_blocked == false) {
            aisle_score += 1;
        }

        // if there is an aisle and the player has little knowledge about it and the view
        // is not blocked, increase score
        if (obj.map[y][x] == 0 & obj.player.knowledge_level[y][x] < 2 & view_blocked == false) {
            unknown_aisle_score += 1;
        }

        // sum up everything the player knows about the direction
        // if view is blocked, the player has all information about the wall objects
        if (view_blocked == true & obj.map[y][x] == 1) {
            knowledge_score += 2;
        } else {
            knowledge_score += obj.player.knowledge_level[y][x]
        }

        // If Agent sees group
        if (obj.shelfs['x'+x+'y'+y]) {


            // Agent sees group
            if (obj.player.knowledge_level[y][x] > 0) {

                // Agent sees item
                if (obj.player.knowledge_level[y][x] > 1) {

                    let key = '';
                    
                    //Check, if item is in shoppinglist
                    for (key in Object.keys(obj.player.shoppinglist)) {

                        if (obj.shelfs['x'+x+'y'+y].item == obj.player.shoppinglist[key].item) {
                            item_score += 1;
                            item_score_xy = ['x'+x+'y'+y];
                            break;
                        } 
                    }

                    tile.innerHTML = obj.shelfs['x'+x+'y'+y].item;
                    // if item is promoted
                    if (obj.promotions[obj.shelfs['x'+x+'y'+y].item]) {
                        promotion_score += 1;
                        tile.className += ' promotion';
                    }
                } else {

                    let key = '';

                    // Check, if group is in shopping list
                    for (key in Object.keys(obj.player.shoppinglist)) {

                        if (obj.shelfs['x'+x+'y'+y].group == obj.player.shoppinglist[key].group) {
                        group_score += 1;
                        group_score_xy = ['x'+x+'y'+y];
                        break;
                        }
                    }
                    
                }

            }

        }

        // set saturation of tile

        //console.log(tile.classList);
        tile.classList.remove('see_0','see_1','see_2','see_3');
        tile.className += ' see_'.concat(obj.player.knowledge_level[y][x]);

        // If shelf hight > 1 then stop ray
        if (obj.map[y][x] > 0) {
            view_blocked = true;
        }

        }

        // #onsole.log(i,aisle_score);

        // TEST LINE

        let know_nav_dy = Math.sin(i) * knowledge_score / (ray_length+1) * 50 / 2;
        let know_nav_dx = Math.cos(i) * knowledge_score / (ray_length+1) * 50 / 2;
        let aisle_nav_dy = Math.sin(i) * (aisle_score + 1) / ray_length * 50;
        let aisle_nav_dx = Math.cos(i) * (aisle_score + 1) / ray_length * 50;
        let aisle_unknown_nav_dy = Math.sin(i) * (unknown_aisle_score + 1) / ray_length * 50;
        let aisle_unknown_nav_dx = Math.cos(i) * (unknown_aisle_score + 1) / ray_length * 50;
        let group_dy = Math.sin(i) * (group_score) / ray_length * 250;
        let group_dx = Math.cos(i) * (group_score) / ray_length * 250;
        let item_dy = Math.sin(i) * (item_score) / ray_length * 250;
        let item_dx = Math.cos(i) * (item_score) / ray_length * 250;
        let promotion_dy = Math.sin(i) * (promotion_score) / ray_length * 250;
        let promotion_dx = Math.cos(i) * (promotion_score) / ray_length * 250;

        // draw a black line
        draw_line(obj.knowledge_ctx,nav_x0,nav_y0,know_nav_dx,know_nav_dy,'black',1);
        draw_line(obj.aisle_ctx,nav_x0,nav_y0,aisle_nav_dx,aisle_nav_dy,'black',1);
        draw_line(obj.aisle_unknown_ctx,nav_x0,nav_y0,aisle_unknown_nav_dx,aisle_unknown_nav_dy,'black',1);
        draw_line(obj.group_ctx,nav_x0,nav_y0,group_dx,group_dy,'black',1);
        draw_line(obj.item_ctx,nav_x0,nav_y0,item_dx,item_dy,'black',1);
        draw_line(obj.promotion_ctx,nav_x0,nav_y0,promotion_dx,promotion_dy,'black',1);

        // Aggregate Values

        knowledge_sin += Math.sin(i) * knowledge_score;
        knowledge_cos += Math.cos(i) * knowledge_score;
        unknown_aisle_sin += Math.sin(i) * unknown_aisle_score;
        unknown_aisle_cos += Math.cos(i) * unknown_aisle_score;
        aisle_sin += Math.sin(i) * aisle_score;
        aisle_cos += Math.cos(i) * aisle_score;
        group_sin += Math.sin(i) * group_score;
        group_cos += Math.cos(i) * group_score;
        item_sin += Math.sin(i) * item_score;
        item_cos += Math.cos(i) * item_score;
        promotion_sin += Math.sin(i) * promotion_score;
        promotion_cos += Math.cos(i) * promotion_score;

        knowledge_sum += knowledge_score;
        unknown_aisle_sum += unknown_aisle_score;
        aisle_sum += aisle_score;
        group_sum += group_score;
        item_sum += item_score;
        promotion_sum += promotion_score;

        // Update perception object

        percive_step[[i]] = 
        {
        'knowledge':knowledge_score
        ,'unknown_aisle':unknown_aisle_score
        ,'aisle':aisle_score
        ,'group':group_score
        ,'group_xy':group_score_xy
        ,'item':item_score
        ,'item_xy':item_score_xy
        ,'promotion':promotion_score};

    }

    // console.log(percive_step);

    for (let i = 0; i < obj.player.memory; i++) {
        // console.log([obj.player.memory-i,obj.player.memory-i-1]);
        obj.player.perception[obj.player.memory-i] = obj.player.perception[obj.player.memory-i-1];
    }

    obj.player.perception[0] = percive_step;

    // console.log(obj.player.perception);

    // console.log(obj.player.perception);

    //https://en.wikipedia.org/wiki/Circular_mean

    let knowledge_arc = Math.atan2(knowledge_sin / knowledge_sum, knowledge_cos / knowledge_sum);
    let unknown_aisle_arc = Math.atan2(unknown_aisle_sin / unknown_aisle_sum, unknown_aisle_cos / unknown_aisle_sum);
    let aisle_arc = Math.atan2(aisle_sin / aisle_sum, aisle_cos / aisle_sum);
    let group_arc = Math.atan2(group_sin / group_sum, group_cos / group_sum);
    let item_arc = Math.atan2(item_sin / item_sum, item_cos / item_sum);
    let promotion_arc = Math.atan2(promotion_sin / promotion_sum, promotion_cos / promotion_sum);

    // console.log(aisle_avg);

    let know_nav_dy = Math.sin(knowledge_arc) * 50;
    let know_nav_dx = Math.cos(knowledge_arc) * 50;
    let aisle_nav_dy = Math.sin(aisle_arc) * 50;
    let aisle_nav_dx = Math.cos(aisle_arc) * 50;
    let aisle_unknown_nav_dy = Math.sin(unknown_aisle_arc) * 50;
    let aisle_unknown_nav_dx = Math.cos(unknown_aisle_arc) * 50;
    let group_dy = Math.sin(group_arc) * 50;
    let group_dx = Math.cos(group_arc) * 50;
    let item_dy = Math.sin(item_arc) * 50;
    let item_dx = Math.cos(item_arc) * 50;
    let promotion_dy = Math.sin(promotion_arc) * 50;
    let promotion_dx = Math.cos(promotion_arc) * 50;

    // console.log(knowledge_sum,knowledge_avg,know_nav_dx,know_nav_dy);

    draw_line(obj.knowledge_ctx,nav_x0,nav_y0,know_nav_dx,know_nav_dy,'red',3);
    draw_line(obj.aisle_ctx,nav_x0,nav_y0,aisle_nav_dx,aisle_nav_dy,'red',3);
    draw_line(obj.aisle_unknown_ctx,nav_x0,nav_y0,aisle_unknown_nav_dx,aisle_unknown_nav_dy,'red',3);
    draw_line(obj.group_ctx,nav_x0,nav_y0,group_dx,group_dy,'red',3);
    draw_line(obj.item_ctx,nav_x0,nav_y0,item_dx,item_dy,'red',3);
    draw_line(obj.promotion_ctx,nav_x0,nav_y0,promotion_dx,promotion_dy,'red',3);

}

export {perception};