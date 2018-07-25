/**
 * 音乐播放工具
 * @authors Your Name (you@example.org)
 * @date    2018-07-18 10:12:52
 * @version $Id$
 */
// 闭包，隔绝内外数据，不对全局造成污染，接收window是为了该暴露给外部的就变成全局变量暴露出去
(function(window) {
    // 1.创建一个类(构造函数)，接收一个传入的数据$audio
    function Player($audio) {
        // 创建一个新的初始化对象并调用返回
        return new Player.prototype._init($audio)
    }
    // 2.原型库
    Player.prototype={
        // 2.1 构造者
        constructor:Player,
        // 2.1.1 保存接收到的json
        musicList:[],
        // 2.2 初始化
        _init:function($audio) {
            // 2.2.1 保存下接收到的数据
            this.$audio = $audio;
            // get(),从jq包装的对象取出原生对象并返回
            this.audio = $audio.get(0);
        },

        // 2.3 播放方法
        // 定义个初始下标，用来判断
        currentIndex:-1,
        playMusic:function(index,music) {
            // 判断是不是同一首歌被点击
            if (this.currentIndex === index) {
                // 同一首是播放暂停切换
                if (this.audio.paused) {
                    // this.audio.paused 暂停状态为真,调用原生播放方法
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                // 不是同一首
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },

        // 2.4处理下标的方法
        preindex:function() {
            let index = this.currentIndex - 1;
            if (index<0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextindex:function() {
            let index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        },

        // 2.5 删除后后台数据处理
        changeMusicList:function(index) {
            // 根据传入的索引，删除对应的数据
            this.musicList.splice(index,1);
            // 判断当前删除的是不是播放前面的音乐
            if (index < this.currentIndex) {
                this.currentIndex = this.currentIndex - 1;
            }
        },
        
        // 2.6 拿到audio的播放时间和总时间
        //增加方法后调用要重新打开网页
        // getMusicDuration:function () {
        //     //要原生js对象的方法,持续时间
        //     return this.audio.duration;
        // },
        // getMusicCurrentTime:function () {
        //     //要原生js对象的方法,现在时间
        //     return this.audio.currentTime;
        // },

        //2.7 底部时间播放同步
        musicFooterTimeUpdate:function (callBack) {
            let $this = this;
            //1 监控audio的播放进度，audio有个timeupdate的事件
            this.$audio.on('timeupdate',function () {
                //要拿到audio的事时间，所以要在对象里增加方法，然后调用,但是现在封装到了对象方法里所以可以直接获取
                // console.log(player.getMusicDuration(),player.getMusicCurrentTime());
                //时间格式为秒，所以定义个函数格式化处理下
                //先保存下拿到的两个时间
                let duration = $this.audio.duration;
                let current = $this.audio.currentTime;
                if (duration === current) {
                    $('.music-next').trigger('click');
                }
                let timestr = $this.formatTime(duration,current);
                //返回不能直接写return，因为return是就近返回原则，我们可以要求调用方法时传入一个回调函数来接收数据
                callBack(duration,current,timestr);
            })
        },

        //2.8 格式化时间
        formatTime:function (duration,current) {
            //处理持续时间
            let durationM = parseInt(duration / 60);
            let durationS =  parseInt(duration % 60);
            if (isNaN(durationM)){
                durationM = 0;
            }
            if (isNaN(durationS)){
                durationS = 0;
            }
            if (durationM < 10){
                durationM = '0' + durationM;
            }
            if (durationS < 10){
                durationS = '0' + durationS;
            }

            //处理播放时间
            let currentM =  parseInt(current / 60);
            let currentS =  parseInt(current % 60);
            if (currentM < 10){
                currentM = '0' + currentM;
            }
            if (currentS < 10){
                currentS = '0' + currentS;
            }

            return currentM + ":" + currentS + "/" + durationM + ":" + durationS;
        },

        //2.9 音乐播放同步进度条点击和拖拽
        musicSeekTo:function (val) {
            if(isNaN(val)) return;
            this.audio.currentTime = this.audio.duration * val;
        },

        //3.0 音量控制
        musicVoiceSeekTo:function (val) {
            if(isNaN(val) || val < 0 || val > 1) return;
            // valume 值的范围0——1，0就是没声音
            this.audio.volume = val;
        }




    };
    // 3.改变_init的原型库
    Player.prototype._init.prototype = Player.prototype;
    // 4.Player变为全局对象
    window.Player = Player;
})(window);
