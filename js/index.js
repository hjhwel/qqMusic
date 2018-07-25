/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-07-16 16:51:26
 * @version $Id$
 */

$(function() {
    // 0. 自定义滚动条框架引入
    // 0.1 初始化，要自定义谁的滚动条就把谁初始化，然后初始化HTML
    let $contentList = $('.content-list');
    $contentList.mCustomScrollbar();
    //1.歌曲播放
    // 1.1 拿到播放,并且将audio传给播放函数
    let $audio = $('audio');
    // 1.2 创建一个新的对象
    let player = new Player($audio);
    // 1.3 播放的数据要拿到，在ajax里
    
    // 2.加载歌曲
    getMusicList();

    //3.初始化事件监听
    initEvents();
   
    //4. 进度条处理
    //音乐播放进度条
    // 4.1 拿到所需要的标签
    let $musicProgressBar = $('.music-progress-bar');
    let $musicProgressLine = $('.music-progress-line');
    let $musicProgressDot = $('.music-progress-dot');
    // 4.2 实例化一个新的对象
    let progress = new Progress($musicProgressBar,$musicProgressLine,$musicProgressDot);

    // 4.3 调用点击方法
    progress.ProgressClick(function (val) {
        //点击音乐跳转
        player.musicSeekTo(val);
    });

    // 4.4 调用拖拽方法
    progress.ProgressMove(function (val) {
        //拖拽音乐跳转
        player.musicSeekTo(val);
    });

    //声音进度条
    let $musicVoiceBar = $('.music-voice-bar');
    let $musicVoiceLine = $('.music-voice-line');
    let $musicVoiceDot = $('.music-voice-dot');
    // 4.2 实例化一个新的对象
    let voiceProgress = new Progress($musicVoiceBar,$musicVoiceLine,$musicVoiceDot);

    // 4.3 调用点击方法
    voiceProgress.ProgressClick(function (val) {
        //点击声音跳转
        player.musicVoiceSeekTo(val);
    });

    // 4.4 调用拖拽方法
    voiceProgress.ProgressMove(function (val) {
        //拖拽声音跳转
        player.musicVoiceSeekTo(val);
    });








    // 利用ajax进行本地加载
    function getMusicList() {
        // 3.1 调用ajax方法
        //接收一个对象
        $.ajax({
            // 1.键值对 url 加载文件的地址
            url:'./source/musiclist.json',
            // 2.键值对 dataType 加载文件的类型
            dataType:'json',
            // 3.键值对 success 加载文件成功后调用函数，接收数据
            success:function(data) {
                //3.1 遍历获取到的数据
                let $ml = $('.content-list ul');
                $.each(data,function(index,val) {
                    // 3.1.1 根据每条数据创建歌曲列表
                    let $item = createMusicList(index,val);
                    // 3.1.2 添加到ul里
                    $ml.append($item);
                    // 1.3数据传给播放方法
                    player.musicList = data;
                });
                // 3.2 初始化歌曲信息,加载完成后默认初始化第一首
                initMusicInfo(data[0]);

                //3.3 初始化歌词
                initMusicLyric(data[0]);
                window.$listMusic = $('.list-music');
            },
            // 4.键值对 error 加载文件失败后调用函数,接收失败原因
            error:function() {
                console.log('谷歌不支持');
            }
        })
    }


    // 定义一个创建歌曲的函数方法
    function createMusicList(index,music) {
        let $item = $('<li class="list-music"><div class="list-check"><i></i></div><div class="list-number">'+(index +1)+'</div><div class="list-name">'+ music.name+'<div class="list-menu"><a href="javascript:;" title="播放" class="list-menu-play"></a><a href="javascript:;" title="添加"></a><a href="javascript:;" title="下载"></a><a href="javascript:;" title="分享"></a></div></div><div class="list-singer">'+ music.singer+'</div><div class="list-time"><span>'+ music.time+'</span><a href="javascript:;" title="删除" class="list-music-del"></a></div></li>');
        // 将传进来的索引和数据绑定到创建的li上，方便播放的时候调用
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }


    // 初始化事件监听方法
    function initEvents() {
        //1.监听歌曲的移入移出
        //动态创建的必须事件委托
        $contentList.delegate('.list-music','mouseenter',function() {
             //1.1 显示子菜单
            //find(),找所有后代元素 ，用的最多
            $(this).find('.list-menu').stop().fadeIn(100);
            $(this).find('.list-time a').stop().fadeIn(100);
            //1.2 隐藏时长
            $(this).find('.list-time span').stop().fadeOut(0);
        });
        $contentList.delegate('.list-music','mouseleave',function() {
             //1.1 隐藏子菜单
             $(this).find('.list-menu').stop().fadeOut(100);
             $(this).find('.list-time a').stop().fadeOut(0);
            //1.2 显示时长
            $(this).find('.list-time span').stop().fadeIn(0);
        });
        
        
        //2.选择歌曲
        // 监控复选框的点击
        $contentList.delegate('.list-music .list-check','click',function() {
            // 切换Class，有就添加，没有就删除
            $(this).toggleClass('list-checked');
            if ($(this).attr('class').indexOf('list-checked') !== -1){
                $(this).parents('.list-music').find('div').css('color','#fff');
            }else{
                $(this).parents('.list-music').find('div').css('color','rgba(255,255,255,0.5)');
            }
        });
        // 2.1全选
        $('.list-title>.list-check').click(function() {
            $(this).toggleClass('list-checked');
            
            if ($(this).attr('class').indexOf('list-checked') !== -1){
                $('.list-music .list-check').addClass('list-checked');
                $('.list-music').find('div').css('color','#fff');
            }else{
                $('.list-music .list-check').removeClass('list-checked');
                $('.list-music').find('div').css('color','rgba(255,255,255,0.5)');
            }
        });


        //3.图标切换
        //3.1播放图标
        let $fmp = $('.music-play');

        $contentList.delegate('.list-menu-play','click',function() {
            //切换图标
            $(this).toggleClass('list-menu-play2');
            let $item = $(this).parents('.list-music');


            // 还原别的图标
            $item.siblings().find('.list-menu-play').removeClass('list-menu-play2');
            //同步底部播放
            if ($(this).attr('class').indexOf('list-menu-play2') !== -1) {
                //播放状态
                $fmp.addClass('music-play2');
                //文字高亮
                $item.find('div').css('color','#fff');
                //文字高亮排他
                $item.siblings().find('div').css('color','rgba(255,255,255,0.5)');
                //播放动画
                $item.find('.list-number').addClass('list-number2');
                $item.siblings().find('.list-number').removeClass('list-number2');
            }else{
                // 不是播放状态
                $fmp.removeClass('music-play2');
                //文字不高亮
                $item.find('div').css('color','rgba(255,255,255,0.5)');
                 //不播放动画
                $item.find('.list-number').removeClass('list-number2');
            }
            
            // 播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);

            // 切换歌曲信息
            initMusicInfo($item.get(0).music);
            //切换歌词
            initMusicLyric($item.get(0).music);
        });

        // 4.底部控制
        // 4.1监控播放按钮的点击
        $fmp.click(function() {
            //判断是不是从未播放过
            if(player.currentIndex === -1){
                //从没有播放过
                $listMusic.eq(0).find('.list-menu-play').trigger('click');
            }else{
                //播放过
                $listMusic.eq(player.currentIndex).find('.list-menu-play').trigger('click');
            }
        });

        // 5.监控上一按钮的点击
        $('.music-pre').click(function() {

            $listMusic.eq(player.preindex()).find('.list-menu-play').trigger('click');
        
        });

        // 6.监控上一按钮的点击
        $('.music-next').click(function() {

            $listMusic.eq(player.nextindex()).find('.list-menu-play').trigger('click');

        });

        // 7.删除歌曲
        // 7.1 动态创建，事件委托
        $contentList.delegate('.list-music-del','click',function() {
            // 7.2 拿到点击的歌曲Li并删除
            let $listM = $(this).parents('.list-music');
            // 7.3 判断删除恶是不是正在播放的歌曲
            if ($listM.get(0).index === player.currentIndex) {
                //是同一首就播放下一首
                $('.music-next').trigger('click');
            }
            $listM.remove();
            // 后台数据同步删除
            player.changeMusicList($listM.get(0).index);
            // 序号重排
            $listMusic.each(function(index,ele) {
                ele.index = index;
                $(ele).find('.list-number').text(index + 1);
            })
        });

        // 8.底部时间播放同步
        player.musicFooterTimeUpdate(function (duration,current,timestr) {
            // 播放时间同步
            $('.music-progress-time').text(timestr);
            // 进度条同步
            // 计算出播放比
            let val = (current / duration) * 100;
            if(val < 0){
                val = 0
            }else if(val >100){
                val = 100
            }
            // 调用方法
            progress.ProgressUpdate(val);

            //实现歌词的同步
            let index = lyric.currentIndex(current);
            let $item = $(".song-lyric li");

            $item.eq(index).addClass('cur');
            $item.eq(index).siblings().removeClass('cur');
            //歌词滚动
            // if (index <= 2)return;

            $(".song-lyric").css({
                marginTop:(-index + 2) * 30
            })

        });

        // 9. 声音控制
        //监听声音图标的点击
        $('.music-voice-icon').click(function () {
            console.log(this);
            //图标切换
            $(this).toggleClass('music-voice-icon2');
            //声音切换
            if ($(this).attr('class').indexOf('music-voice-icon2') !== -1) {
                //  无声
                player.musicVoiceSeekTo(0);
            }else{
                //有声
                player.musicVoiceSeekTo(1);
            }
            return false;
        })
    }


    // 初始化歌曲信息方法
    function initMusicInfo (music) {
        // 获取对应的元素
        let $musicImage = $(".song-info-pic img");
        let $musicName = $(".song-info-name a");
        let $musicSinger = $(".song-info-singer a");
        let $musicAblum = $(".song-info-ablum a");
        let $musicProgressName = $(".music-progress-name");
        // let $musicProgressTime = $(".music-progress-time");
        let $musicBg = $(".mask-bg");

        // 给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name +" / "+ music.singer);
        // $musicProgressTime.text("00:00 / "+ music.time);
        $musicBg.css("background", "url('"+music.cover+"')");
    }
    // 提取歌词对象
    let lyric;
    // 初始化歌词方法
    function initMusicLyric(music) {
        //创建歌词对象
        lyric = new Lyric(music.link_lrc);
        let $lyricContainer = $('.song-lyric');
        //加载歌词前清空上一首创建的歌词
        $lyricContainer.html('');
        // 加载歌词
        lyric.loadLyric(function () {
        //    创建歌词列表
            $.each(lyric.lyrics,function (index,val) {
                let $item = $('<li>'+val+'</li>');
                $lyricContainer.append($item);
            })
        });
    }
});