(function () {
	var WallE = {
		me: true,//棋手标记 true为玩家下棋，false为电脑下棋
		count: (function () {
			//初始化棋盘落子计数 count 用来计算棋盘上那些点位有落子
			var count = [];
			for (var i = 0; i < 15; i++) {
				count[i] = [];
				for (var j = 0; j < 15; j++) {
					count[i][j] = 0;
				}
			}
			return count;
		}()),
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
			}

			//落子事件绑定
			_this.chess.onclick = function (e) {
				//获取鼠标点击位置坐标，并转换为落点坐标
				var x = e.offsetX,
					y = e.offsetY;

				x = Math.floor(x / 30);
				y = Math.floor(y / 30);

				//判断当前落点是否已有棋子，如果没有则落子成功
				if (_this.count[x][y] === 0) {
					_this.oneStep(x, y, _this.me);
					_this.count[x][y] = 1;
					_this.me = !_this.me;
				}
			};
		}
	}

	//启动瓦力
	var robot = Object.create(WallE);
	robot.init('chess');
}());
