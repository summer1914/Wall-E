(function () {
	var WallE = {
		me: true,//棋手标记 true为玩家下棋，false为电脑下棋
		over: false,   //判断对弈是否结束，true表示结束，false表示未结束，默认false
		count: (function () { //初始化棋盘落子计数 count 用来计算棋盘上那些点位有落子
			var count = [];
			for (var i = 0; i < 15; i++) {
				count[i] = [];
				for (var j = 0; j < 15; j++) {
					count[i][j] = 0;
				}
			}
			return count;
		}()),
		wins: [],    //赢法数组，记录所有的可以赢的情况
		winCount: 0, //赢法统计，用于统计一共有多少种赢法
		myWin: [],   //挑战者的赢法统计
		wallEWin: [],  //瓦力的赢法统计
		drawChessBoard: function () {
			for (var i = 0; i < 15; i++) {
				//横
				this.ctx.beginPath();
				this.ctx.moveTo(15, 15 + i * 30);
				this.ctx.lineTo(435, 15 + i * 30);
				this.ctx.stroke();
				//竖
				this.ctx.beginPath();
				this.ctx.moveTo(15 + i * 30, 15);
				this.ctx.lineTo(15 + i * 30, 435);
				this.ctx.stroke();
			}
		},
		oneStep: function (i, j, black) {
			//阴影，让棋子看起来更加逼真（可以去掉查看对比效果）
			this.ctx.shadowOffsetX = 1.5;
			this.ctx.shadowOffsetY = 2;
			this.ctx.shadowBlur = 3;
			this.ctx.shadowColor = '#333';
			//圆
			this.ctx.beginPath();
			this.ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
			this.ctx.closePath();
			//径向渐变
			var gradient = this.ctx.createRadialGradient(
				15 + i * 30 + 2,
				15 + j * 30 - 2,
				13,
				15 + i * 30 + 2,
				15 + j * 30 - 2,
				0);
			//判断绘制什么颜色的棋子
			if (black) {
				gradient.addColorStop(0, '#0a0a0a');
				gradient.addColorStop(1, '#636766');
			} else {
				gradient.addColorStop(0, '#d1d1d1');
				gradient.addColorStop(1, '#f9f9f9');
			}
			this.ctx.fillStyle = gradient;
			this.ctx.fill();
		},
		analysis: function () {
			//赢法数组 wins
			for (var i = 0; i < 15; i++) {
				this.wins[i] = [];
				for (var j = 0; j < 15; j++) {
					this.wins[i][j] = [];
				}
			}

			//赢法总类统计 winCount 统计各类赢法总数 共计572种

			for (var i = 0; i < 15; i++) {//横
				for (var j = 0; j < 11; j++) {
					for (var k = 0; k < 5; k++) {
						this.wins[i][j + k][this.winCount] = true;
					}
					this.winCount++;
				}
			}
			for (var i = 0; i < 15; i++) {//竖
				for (var j = 0; j < 11; j++) {
					for (var k = 0; k < 5; k++) {
						this.wins[j + k][i][this.winCount] = true;
					}
					this.winCount++;
				}
			}
			for (var i = 0; i < 11; i++) {//斜
				for (var j = 0; j < 11; j++) {
					for (var k = 0; k < 5; k++) {
						this.wins[i + k][j + k][this.winCount] = true;
					}
					this.winCount++;
				}
			}
			for (var i = 0; i < 11; i++) {//反斜
				for (var j = 14; j > 3; j--) {
					for (var k = 0; k < 5; k++) {
						this.wins[i + k][j - k][this.winCount] = true;
					}
					this.winCount++;
				}
			}

			//赢法计数 myWin wallEWin 分别计算选手获胜的可能
			for (var i = 0; i < this.winCount; i++) {
				this.myWin[i] = 0;
				this.wallEWin[i] = 0;
			}
		},
		wallEAI: function () {   //瓦力的大脑
			var _this = this;

			//定义变量，分数统计数组和坐标存储变量
			var myScore = [],
				computerScore = [],
				max = 0,
				u = 0,
				v = 0;

			//分数统计初始化
			for (var i = 0; i < 15; i++) {
				myScore[i] = [];
				computerScore[i] = [];
				for (var j = 0; j < 15; j++) {
					myScore[i][j] = 0;
					computerScore[i][j] = 0;
				}
			}

			//分数（权重）统计&计算，获取最佳的落子坐标
			for (var i = 0; i < 15; i++) {
				for (var j = 0; j < 15; j++) {
					//判断当前位置是否没有落子
					if (_this.count[i][j] == 0) {
						//计算分数
						for (var k = 0; k < _this.winCount; k++) {
							if (_this.wins[i][j][k]) {
								switch (_this.myWin[k]) {
									case 1:
										myScore[i][j] += 200;
										break;
									case 2:
										myScore[i][j] += 400;
										break;
									case 3:
										myScore[i][j] += 2000;
										break;
									case 4:
										myScore[i][j] += 10000;
										break;
								}

								switch (_this.wallEWin[k]) {
									case 1:
										computerScore[i][j] += 220;
										break;
									case 2:
										computerScore[i][j] += 420;
										break;
									case 3:
										computerScore[i][j] += 2100;
										break;
									case 4:
										computerScore[i][j] += 20000;
										break;
								}
							}
						}
						//通过判断获取最优的落子点
						if (myScore[i][j] > max) {
							max = myScore[i][j];
							u = i;
							v = j;
						}

						if (computerScore[i][j] > max) {
							max = computerScore[i][j];
							u = i;
							v = j;
						}
					}
				}
			}
			_this.oneStep(u, v, _this.me);
			_this.count[u][v] = 2;

			//判断当前落点是否已有棋子，如果没有则落子成功，如果有则后台提示
			for (var k = 0; k < _this.winCount; k++) {
				if (_this.wins[u][v][k]) {
					_this.wallEWin[k]++;
					_this.myWin[k] = 999;
					if (_this.wallEWin[k] == 5) {
						alert('瓦力赢了');
						_this.over = true;
					}
				}
			}
			if (_this.over == false) {
				_this.me = !_this.me;
			}

		},
		checkIfUserWin: function (x, y) {
			for(var k = 0; k < this.winCount; k++){
				if(this.wins[x][y][k]){
					this.myWin[k]++;
					this.wallEWin[k] = 999;
					if(this.myWin[k] == 5){
						alert('你赢了');
						this.over = true;
					}
				}
			}
		},
		init: function (selectorId) {
			this.chess = document.getElementById(selectorId);//获取画布
			this.ctx = this.chess.getContext('2d');//设置画布渲染

			var _this = this;

			//绘制背景
			var bg = new Image();
			bg.src = "img/timg.jpg";
			bg.onload = function () {
				_this.ctx.drawImage(bg, 0, 0, 450, 450);
				_this.drawChessBoard();

				for (var i = 0; i < 11; i++) {//反斜
					for (var j = 14; j > 3; j--) {
						for (var k = 0; k < 5; k++) {
							_this.oneStep(i + k, j - k, _this.me);
						}
					}
				}
			}

			_this.analysis();     //分析赢法数组和赢法统计

			//落子事件绑定
			_this.chess.onclick = function (e) {
				//判断对局是否完成或是否是轮到挑战者下棋，对局完成和不是挑战者下棋就会跳出循环
				if(_this.over || this.me == false) return;

				//获取鼠标点击位置坐标，并转换为落点坐标
				var x = e.offsetX,
					y = e.offsetY;

				x = Math.floor(x / 30);
				y = Math.floor(y / 30);

				//判断当前落点是否已有棋子，如果没有则落子成功
				if (_this.count[x][y] === 0) {
					_this.oneStep(x, y, _this.me);
					_this.count[x][y] = 1;

					_this.checkIfUserWin(x, y);  //分析挑战者是否赢了

					//判断对弈是否结束，如果没结束换成瓦力下棋
					if (_this.over === false) {
						_this.me = !_this.me;
						_this.wallEAI();
					}
				}
			};
		}
	}

	//启动瓦力
	var robot = Object.create(WallE);
	robot.init('chess');
}());
