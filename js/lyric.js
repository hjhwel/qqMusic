/**
 * 进度条工具
 * @authors Your Name (you@example.org)
 * @date    2018-07-18 10:12:52
 * @version $Id$
 */
// 闭包，隔绝内外数据，不对全局造成污染，接收window是为了该暴露给外部的就变成全局变量暴露出去
(function(window) {
    // 1.创建一个类(构造函数)，接收一个传入的数据$audio
    function Lyric(path) {
        // 创建一个新的初始化对象并调用返回
        return new Lyric.prototype._init(path)
    }
    // 2.原型库
    Lyric.prototype={
        // 2.1 构造者
        constructor:Lyric,

        // 2.2 初始化
        _init:function(path) {
            // 保存下接收到的数据
            this.path = path;
        },
        // 数组存放
        times:[],
        lyrics:[],
        index:-1,
        // 2.3 加载歌词的方法
        loadLyric:function (callBack) {
            let $this = this;
            //利用ajax 加载本地文件
            $.ajax({
                url: $this.path,
                dataType:'text',
                success:function (data) {
                    //拿到歌词是一个整体，所以通过换行符进行切割，调用方法，在面向对象中，一个方法就干一个事，保持方法的单一性
                    $this.parseLyric(data);
                    // 通过回调函数，返回解析完的歌词
                    callBack();
                },
                error:function (e) {
                    console.log(e)
                }
            })
        },
        
        
        //2.4 处理解析歌词
        parseLyric:function (data) {
            let $this = this;

            // 每次都清空保存的时间和歌词，方便切换歌词
            $this.times = [];
            $this.lyrics = [];
        //    利用换行符将数据拆分成数组
            let array = data.split('\n');
        //    遍历数组，取出每条歌词
            let timeReg = /\[(\d*:\d*\.\d*)\]/;
            //  \d 匹配数字  ：匹配冒号  .在正则里有特殊含义，所有要转义；*匹配多个，直到不匹配为止  （）将括起来的内单独返回
            $.each(array,function (index,val) {
                //处理歌词
                let lrc = val.split(']')[1];
                //排除空的字符串，也就是没有歌词的
                if (lrc.length === 1) return true;
                $this.lyrics.push(lrc);
            //    利用正则表达式匹配并取出时间
                let res = timeReg.exec(val);
                // console.log(res);
                if (res == null) {
                    return true;
                    // 相当于continue;
                }
            //    取出时间
                let timeStr = res[1];
            // 转成秒
                let res2 = timeStr.split(':');
                let min = parseInt(res2[0]) * 60;
                let sec = parseFloat(res2[1]);
                let time = parseFloat(Number(min + sec).toFixed(2));
            //    保留两位小数存到数组中
                $this.times.push(time);

            });
            // console.log($this.times,$this.lyrics)
        },

        //2.5 歌词播放同步
        currentIndex:function (current) {
            console.log(current);

            //处理索引
            if (current >= this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index;
        }

    };
    // 3.改变_init的原型库
    Lyric.prototype._init.prototype = Lyric.prototype;
    // 4.Player变为全局对象
    window.Lyric = Lyric;
})(window);
