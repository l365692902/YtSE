# YtSE
YouTube subscribe extension
* highlight most interesting content, in your subscribe
* user can add keywords to filter content
* length of video to filter
* dim the uninteresting content or make it 50% transpatent

## 2017Dec09
关于怎么用关键词在youtube里搜索的问题
* 从url中观察到的不同频道
    * https://www.youtube.com/channel/UCHCb7_nHscX38PI0L182GGA 这是“阅后即瞎 - 官方频道”的主页地址，里面有个“channel”
    * https://www.youtube.com/user/imgotv/featured 这是“湖南卫视芒果TV官方频道 China HunanTV Official Channel”的主页地址，里面有个“user”
* 从普通的搜索结果看视频的所属频道
    * ![](readme/阅后即瞎2.png)
    * ![](readme/阅后即瞎1.png)
    * 两个紧挨的链接中可以看到标题和作者
* 高级搜索
    * https://www.youtube.com/results?search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86 这是一般的搜索
    * https://www.youtube.com/results?search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86&sp=EgIQAQ%253D%253D 这是搜索视频的链接
    * https://www.youtube.com/results?search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86&sp=EgIQAg%253D%253D 这是搜索频道的链接
    * https://www.youtube.com/results?sp=EgIQAw%253D%253D&search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86 搜索播放列表
    * https://www.youtube.com/results?search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86&sp=EgIQBA%253D%253D 电影
    * https://www.youtube.com/results?sp=EgIQBQ%253D%253D&search_query=%E6%B9%96%E5%8D%97%E5%8D%AB%E8%A7%86 节目
            


## 2017Dec08
今天心情十分沉重。。。fgo两发十连不出货。。。
* 惊奇地发现，js居然支持😭😭这样的字符，可以搜索出东西，厉害厉害
* 今天的更新，先加载插件，然后打开某个youtube网页，然后按f12打开控制台应该能看到输出的内容。
功能是搜索在所有的链接里搜索关键词“完整版”，它会把找到的所有结果都打印到控制台。可以到content_scripts/content.js里修改要搜索的关键词，目前测试过的中英文字符和😭都支持。
* 务必保持所有的代码文件编码格式是utf-8
* 观察发现，content_script.js会在页面加载完后执行，刷新页面会重新执行，但是点击页面上链接进入下一个页面并不触发。

## 2017Dec07
* borderify example seems not working with youtube, make me concerned about how much could we change the youtube web page
* ```js
        <a id="video-title" class="yt-simple-endpoint style-scope ytd-grid-video-renderer" aria-label="《爸爸的旅程回忆录》甜！齁！泡芙嗯哼偶像剧全集！我爱你我喜欢你可以吗？他们的友谊就开在这些片段中呀！【湖南卫视官方频道】 来自湖南卫视芒果TV官方频道 China HunanTV Official Channel 1 小时前 13分钟 1,272次观看" title="《爸爸的旅程回忆录》甜！齁！泡芙嗯哼偶像剧全集！我爱你我喜欢你可以吗？他们的友谊就开在这些片段中呀！【湖南卫视官方频道】" href="/watch?v=ccpd6ClCcFM">《爸爸的旅程回忆录》甜！齁！泡芙嗯哼偶像剧全集！我爱你我喜欢你可以吗？他们的友谊就开在这些片段中呀！【湖南卫视官方频道】</a>

* id="video-title" class="yt-simple-endpoint style-scope ytd-grid-video-render" title="blabla..."

## 2017Dec06
今天被整了。。。permisions。。。不加权限就啥都不干。。。报错也不好好报。。。直接告诉我没权限不行么。。。还不能用optional_permission

## 2017Dec05
* 查找元素，id、标签、类
* navigator.cookieEnabled
* ```js
        var child=document.getElementById("p1");
        child.parentNode.removeChild(child);//傻X吗，打儿子还非得叫上爸爸
  ```
* js单线程运行，setTimeout()会开新进程放到等待队列，然后父线程继续执行到结束，所以不会无限嵌套下去  

看了几个例子，发现光看还不行，明天先把几个例子操练一遍

* bookmark-it 有background script监控网页情况改变图标
* notify-link-clicks-i18n 响应按钮点击

## 2017Dec04
Walked through first two example of firefox webextension. No code uploaded.  

* ```js
        //我发现这段代码的x没有用var声明，虽然在函数内部
        //soga, 向未声明的变量赋值，变量自动作为全局变量，页面关闭时释放
        x=document.getElementById("demo")
        x.innerHTML="Hello JavaScript";//check out what is this
  ```
* case sensitive, what language isn't?  
* 目前感觉基本兼容c/c++语法  
* 字符串的部分像python
* label used in switch...case... can be used in other place
