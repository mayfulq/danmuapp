$(function() {
        //通过 wilddog.initializeApp() 初始化 SDK
        var config = {
            authDomain: "mayfcc.wilddog.com",
            syncURL: "https://mayfcc.wilddogio.com"
        };
        var defApp = wilddog.initializeApp(config);
        var ref = wilddog.sync().ref("danmu");


        var arr = [];
        //提交数据到云端
        $(".s-send").click(function() {
            var text = $(".s-txt").val();
            ref.push(text);
            $(".s-txt").val("");
        });
        //回车提交
        $(".s-txt").keypress(function(event) {
            if (event.keyCode == "13") {
                $(".s-send").trigger('click');
            }
        });
        //清除
        $(".s-clear").click(function() {
            ref.remove();
            arr = [];
            $(".dm-show").empty();
        });
        //监听云端数据变化，野狗云api,读取数据
        ref.on("child_added", function(snapshot) {
            var text = snapshot.val();
            arr.push(text);
            var textObj = $("<div class='dm-message'></div>");
            $(".dm-show").append(textObj);
            moveObj(textObj);
        });
        //监听云端数据变化，野狗云api,清除数据
        ref.on("child_removed", function() {
            arr = [];
            $(".dm-show").empty();

        });
        //滚动及逐行显示
        var x = $('.dm-mask').offset();
        var topMin = x.top;//显示框距顶部距离
        var topMax = topMin + $(".dm-mask").height(); //显示框底部距顶部距离
        var _top = topMin;
        var moveObj = function(obj) {
            var _left = $(".dm-mask").width() - obj.width();
            _top += 100; //隔行间距100显示
            if (_top > (topMax - 100)) {
                _top = topMin;
            }
            obj.css({
                left: _left,
                top: _top,
                color: getRandomColor()
            });
            var speed = 20000 + 10000 * Math.random();
            obj.animate({
                    left: "30"
                },
                speed,'linear',
                function() {
                    obj.remove();
                });
        };




        //随机生成弹幕文字颜色
        var getRandomColor = function() {
                return '#' + (function(h) {
                    return new Array(7 - h.length).join('0') + h;
                }((Math.floor(Math.random() * 0x1000000)).toString(16)))
            }
            //每 3s 随机选取一条消息播放
        var getAndRun = function() {
            if (arr.length > 0) {
                var n = Math.floor(Math.random() * arr.length + 1) - 1;
                var textObj = $("<div>" + arr[n] + "</div>");
                $(".dm-show").append(textObj);
                moveObj(textObj);
            }
            setTimeout(getAndRun, 3000);
        };
        jQuery.fx.interval = 50;
        getAndRun();
    })
