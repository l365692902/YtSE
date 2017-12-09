# YtSE
YouTube subscribe extension
* highlight most interesting content, in your subscribe

* user can add keywords to filter content

* length of video to filter

* dim the uninteresting content or make it 50% transpatent

  ​

## 2017Dec09

*21:32:08 GMT+0100 (CET)*

以实现: 给定关键词后, 返回关键词搜索页面.

现在已经可以得到页面. 但是页面内容对不对还没有进行检查.



返回的页面储存在`list_SearchResults`变量里. 

`list_SearchResults`长度为1, 只含有对`阅后即瞎`的搜索结果.

搜索页面`list_SearchResults[0]`长度是1452678



## 2017Dec09

### youtube搜索命名规则 

- 网址以https://www.youtube.com/results?作为开始

- search_query=搜索内容, 该选项必须出现

- 多个选项用&链接

- sp=过滤条件

  |   种类    | 过滤条件     | string               |
  | :-----: | -------- | -------------------- |
  |    空    |          |                      |
  |  上传日期   | 过去1小小时   | EgIIAQ%253D%253D     |
  |         | 今天       | EgIIAg%253D%253D     |
  |         | 本周       | EgIIAw%253D%253D     |
  |         | 本月       | EgIIBA%253D%253D     |
  |         | 今年       | EgIIBQ%253D%253D     |
  |   类型    | 视频       | EgIQAQ%253D%253D     |
  |         | 频道       | EgIQAg%253D%253D     |
  |         | 播放列表     | EgIQAw%253D%253D     |
  |         | 电影       | EgIQBA%253D%253D     |
  |         | 节目       | EgIQBQ%253D%253D     |
  |   时长    | < 4min   | EgIYAQ%253D%253D     |
  |         | > 20 min |                      |
  |   排序    | 相关程度(默认) | CAA%253D 或 空         |
  |         | 上传日期     | CAISA8gBAQ%253D%253D |
  |         | 观看次数     | CAM%253D             |
  |         | 评分       | CAE%253D             |
  | 上传日期+类型 | 过去1小时+视频 | EgQIARAB             |
  |         | 过去1小时+电影 | EgQIARAE             |
  |         | 今天+视频    | EgQIAhAB             |
  |         | 今天+电影    | EgQIAhAE             |
  |         | 本周+视频    | EgQIAxAB             |
  |         | 本周+电影    | EgQIAxAE             |
  |         | 本月+视频    | EgQIBBAB             |
  |         | 本月+电影    | EgQIBBAE             |

太多组合方式了....不干了,到时候用到哪个再现查吧

例子 : 如果我想要搜索"阅后即瞎"的channel

https://www.youtube.com/results?search_query=阅后即瞎&sp=EgIQAg%253D%253D



### 搜索页面储存格式

``` html
<ol id="item-section-228858" class="item-section">
  <li>  
    <!--视频的储存格式-->
    <deiv class="yt-lockup yt-lockup-tile yt-lockup-video clearfix" data-context-item-id="视频编号" data-visibility-tracking="...">
    ::before
      <div class="yt-lockup-dismissable yt-uix-tile">
        <div class="yt-lockup-thumbnail contains-addto">
          <!--视频截图,视频时长-->
        </div>
        <div class="yt-lockup-content">
          <!--标题,上传时间,观看次数,频道,简介-->
          
          <h3 class="yt-lockup-title ">
            <a class="yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2 yt-uix-sessionlink      spf-link " href="/watch?v=视频编号" data-sessionlink="..." title="标题"  ...>
              ::before
              标题
              ::after
            </a>
            <span id="description-id-469716" class="accessible-description" >
             - 时长：14:03。
            </span>
          </h3>
          <div class="yt-lockup-byline">
            <a class="yt-uix-sessionlink       spf-link " href="/user/用户名" ...>
            用户名
            </a>
          </div>
          <!--...-->
        </div>
      </div>
    ::after
    </deiv>
  </li>
  <!--频道储存格式-->
  <li>...</li>
  <!--列表储存格式-->
  <li>...</li>
  <li>...</li>
</ol>
```







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
    ```

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
