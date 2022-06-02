// 蛇的速度，即计时器的间隔时间
var SnakeTime = 200;
// 蛇的身体
var map = document.getElementById('map');
// 使用构造方法创建蛇，
function Snake() {
    // 设置蛇的宽、高、默认走的方向
    this.width = 10;
    this.height = 10;
    this.direction = 'right';

    // 记住蛇的状态，当吃完食物的时候，就要加一个，初始为3个小点为一个蛇，
    this.body = [
        { x: 2, y: 0 },   // 蛇头，第一个点
        { x: 1, y: 0 },   // 蛇脖子，第二个点
        { x: 0, y: 0 }    // 蛇尾，第三个点
    ];

    // 显示蛇
    this.display = function () {
        // 创建蛇
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].x != null) {   
                // 当吃到食物时，x==null，不能新建，不然会在0，0处新建一个
                var s = document.createElement('div');
                // 将节点保存到状态中，以便于后面删除
                this.body[i].flag = s;
                // 设置宽高
                s.style.width = this.width + 'px';
                s.style.height = this.height + 'px';
                //设置颜色
                s.style.backgroundColor = 'yellow';
                // 设置位置
                s.style.position = 'absolute';
                s.style.left = this.body[i].x * this.width + 'px';
                s.style.top = this.body[i].y * this.height + 'px';
                // 添加进去
                map.appendChild(s);
            }
        }
        //设置蛇头的颜色
        this.body[0].flag.style.backgroundColor = 'orange';
    };

    // 让蛇跑起来,后一个元素到前一个元素的位置
    // 蛇头根据方向处理，所以i不能等于0
    this.run = function () {
        // 后一个元素到前一个元素的位置
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 根据方向处理蛇头
        switch (this.direction) {
            case "left":
                this.body[0].x -= 1;
                break;
            case "right":
                this.body[0].x += 1;
                break;
            case "up":
                this.body[0].y -= 1;
                break;
            case "down":
                this.body[0].y += 1;
                break;
        }

        // 判断是否出界,根据蛇头判断
        if (this.body[0].x < 0 || this.body[0].x > 150 || this.body[0].y < 0 || this.body[0].y > 60) {
            clearInterval(timer);  
            // 清除定时器
            alert("出界啦，游戏结束！");
            document.getElementById('beginBox').style.display = 'block';
            // 删除旧的
            for (var i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) {   
                    // 如果刚吃完就死掉，会加一个值为null的
                    map.removeChild(this.body[i].flag);
                }
            }
            this.body = [   // 回到初始状态，
                { x: 2, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 0 }
            ];
            this.direction = 'right';
            this.display();   // 显示初始状态
            return false;   // 结束
        }

        // 判断蛇头吃到食物，xy坐标重合，
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            // 蛇加一节，因为根据最后节点定，下面display时，会自动赋值的
            this.body.push({ x: null, y: null, flag: null });
            // 获取蛇的长度
            var len = this.body.length;
            // 根据蛇的长度，设置定时器频率SnakeTime
            SnakeTime = SnakeTime - (len - 3) * 5;
            // SnakeTime最低不能小于40
            if (SnakeTime < 40) {
                SnakeTime = 40;
            }
            refresh();
            // 清除食物,重新生成食物
            map.removeChild(food.flag);
            food.display();
        }

        // 吃到自己死亡，从第五个开始与头判断，因为前四个永远撞不到
        for (var i = 4; i < this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                clearInterval(timer);   // 清除定时器，
                alert("你咬到了自己，游戏结束！");
                // 显示id为beginBox的毛玻璃遮罩盒子
                document.getElementById('beginBox').style.display = 'block';
                // 删除旧的
                for (var i = 0; i < this.body.length; i++) {
                    if (this.body[i].flag != null) {   // 如果刚吃完就死掉，会加一个值为null的
                        map.removeChild(this.body[i].flag);
                    }
                }
                this.body = [   // 回到初始状态，
                    { x: 2, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: 0 }
                ];
                this.direction = 'right';
                this.display();   // 显示初始状态
                return false;   // 结束
            }
        }

        // 先删掉初始的蛇，在显示新蛇
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].flag != null) {   // 当吃到食物时，flag是等于null，且不能删除
                map.removeChild(this.body[i].flag);
            }
        }

        // 重新显示蛇
        this.display();

    }
}

// 构造食物
function Food() {
    this.width = 10;
    this.height = 10;

    this.display = function () {
        // 创建一个div(一节蛇身)
        var f = document.createElement('div');
        this.flag = f;
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'red';
        f.style.position = 'absolute';
        this.x = Math.floor(Math.random() * 80);
        this.y = Math.floor(Math.random() * 40);
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        map.appendChild(f);
    }
}

var snake = new Snake();
var food = new Food();
// 初始化显示
snake.display();   
food.display();

// 给body加按键事件，上下左右
document.body.onkeydown = function (e) {
    // 有事件对象就用事件对象，没有就自己创建一个，兼容低版本浏览器
    var ev = e || window.event;

    switch (ev.keyCode) {
        case 38:
            if (snake.direction != 'down') {   // 不允许返回，向上的时候不能向下
                snake.direction = "up";
            }
            break;
        case 40:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
        case 37:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
        case 39:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
        // 兼容WASD键    
        case 87:
            if (snake.direction != "down") {
                snake.direction = "up";
            }
            break;
        case 83:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
        case 65:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
        case 68:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
    }
    
};
// 获取开始按钮
var btn = document.getElementById('begin');
// 点击开始游戏事件
btn.onclick = function () {
    // 开始按钮毛玻璃幕布
    var parent = this.parentNode;
    // 隐藏开始按钮
    parent.style.display = 'none';
    // 获取定时器时间
    let time = SnakeTime;

    timer = setInterval(function () {
        snake.run();
    }, time);
}
// 定义刷新定时器方法
function refresh() {
    // 停止定时器
    clearInterval(timer);
    // 刷新定时器
    timer = setInterval(function () {
        snake.run();
        console.log(SnakeTime);
    }, SnakeTime);
}