/**
 * 进度条工具
 * @authors Your Name (you@example.org)
 * @date    2018-07-18 10:12:52
 * @version $Id$
 */
// 闭包，隔绝内外数据，不对全局造成污染，接收window是为了该暴露给外部的就变成全局变量暴露出去
(function(window) {
    // 1.创建一个类(构造函数)，接收一个传入的数据$audio
    function Progress($musicProgressBar,$musicProgressLine,$musicProgressDot) {
        // 创建一个新的初始化对象并调用返回
        return new Progress.prototype._init($musicProgressBar,$musicProgressLine,$musicProgressDot)
    }
    // 2.原型库
    Progress.prototype={
        // 2.1 构造者
        constructor:Progress,
        
        // 2.2 初始化
        _init:function($musicProgressBar,$musicProgressLine,$musicProgressDot) {
            // 保存下接收到的数据
            this.$progressBar = $musicProgressBar;
            this.$progressLine = $musicProgressLine;
            this.$progressDot = $musicProgressDot;
        },

        //旗帜
        isMove: false,

        // 点击方法
        ProgressClick:function(callBack) {
            let $this = this;
            // 谁调用方法，this就是谁
            // 监控进度条的点击
            this.$progressBar.click(function(event) {
                let e = event||window.event;
                // 拿到距离页面左部的距离
                let $normalLeft = $(this).offset().left;
                // 拿到鼠标点击距离页面左部的距离
                let $mouseLeft = e.pageX;
                console.log($normalLeft,$mouseLeft);
                // 改变前景的宽度
                $this.$progressLine.css('width',$mouseLeft - $normalLeft);
                $this.$progressDot.css('left',$mouseLeft - $normalLeft);

                // 计算进度条的比例
                let val = ($mouseLeft - $normalLeft) / $(this).width();
                // 通过回调函数的形参返回
                callBack(val);
            })

        },

        // 拖拽方法
        ProgressMove:function(callBack) {

            // 谁调用方法，this就是谁
            let $this = this;
            let $mouseLeft;
            let $normalLeft;

            // 1.监听鼠标按下
            this.$progressBar.mousedown(function() {
                // 拿到距离页面左部的距离
                $normalLeft = $(this).offset().left;
                $this.isMove = true;
                // 2.监听鼠标在文档内的移动
                $(document).mousemove(function(event) {
                    let e = event||window.event;
                    // 拿到鼠标距离页面左部的距离
                    $mouseLeft = e.pageX;
                    // console.log($this.$progressBar.width());
                    if($mouseLeft > ($this.$progressBar.width() + $normalLeft)){
                        $mouseLeft = $this.$progressBar.width() + $normalLeft;
                    }else if ($mouseLeft < $normalLeft) {
                        $mouseLeft = $normalLeft
                    }
                    // 改变前景的宽度
                    $this.$progressLine.css('width',$mouseLeft - $normalLeft);
                    $this.$progressDot.css('left',$mouseLeft - $normalLeft);


                });
                return false;
            });

            // 3.监听鼠标抬起
            $(document).mouseup(function() {
                if (!$this.isMove) return;
                // 计算进度条的比例
                let val = ($mouseLeft - $normalLeft) / $this.$progressBar.width();

                // 通过回调函数的形参返回
                callBack(val);
                $this.isMove = false;
                $(document).off('mousemove');
            })
        },

        //进度条同步播放时间
        ProgressUpdate:function (val) {
            //判断是否存在拖拽
            if (this.isMove) return;

            if (val <0 ||val >100) {
                return
            }else{
                this.$progressLine.css({
                    width:val + '%'
                });

                this.$progressDot.css({
                    left:val + '%'
            })
            }
        }
    };
    // 3.改变_init的原型库
    Progress.prototype._init.prototype = Progress.prototype;
    // 4.Player变为全局对象
    window.Progress = Progress;
})(window);
