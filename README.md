# YtSE
YouTube subscribe extension
* highlight most interesting content, in your subscribe

* user can add keywords to filter content

* length of video to filter

* dim the uninteresting content or make it 50% transpatent

## 2018Feb03-L
* 修改过.js后如果不reload插件, 可能会出现TypeError:can't access dead object
* 产生原因是firefox的防内存泄漏机制，firefox推荐使用weak references存储DOM，Components.utils.getWeakReference
* 不知道会不会成为隐患
* 测试的时候如果点delete点超级快。。。然后马上刷新。。可能会出现最后一两项没删掉的情况。。。待测试


## 2018Feb02-L
* git 的.gitignore文件会被同步到远端
* 而同样功能，同样语法的./git/info/exclude 不会同步到远端
* 只在本地忽略某些文件的话使用excule，比如我在本地忽略了YtSE_settings.json

## 2018Jan29-BS

目前发现的bug
* on/off开关失效,总是处于打开状态
* 存在时间排序错乱问题

## 2018Jan29-L
* 哇。。。这个星期又差点划水划过去了
* 基本写好，求bug

## 2018Jan23-L
* 今天游戏又要开新章了欸
* 话说所有链接都是直接/watch?v=cqsLR7d8sr4，这种没有主域名的
* 在popup页面中要注意加上当前的主域名https://www.youtube.com
* 话说这个主域名会变吗？

## 2018Jan20-BS

**UI bug report**

- 如果只添加一个关键字, initialURL函数会返回错误报告. 这个bug, 应该在initialURL最后添加else if(keyword.self != 空)的判断. 已修正
- on/off : 取消关键词再开启, 在终端会显示"没有找到Url". 排查错误后, 发现可能是由于关键词已经存在url导致不进行再次查找. 已修正.



## 2018Jan21-L

* 又要跳票了
* save机制改完
* 优化initialURL改完
* 添加了一个initialAllURL函数，并在其中加入on/off判断
* 现在的流程是，启动后(也就是background第一次运行)，将存储的list取出initialURL再存回
* 当设置页中出现修改会发消息到background，用initialURL更新特定的某个keyword再存回
* 等bug report
* 还剩import playlist

## 2018Jan20-L
* focusout 在其子元素失去焦点时也会触发
* blur 仅在自己失去焦点时触发
* splice 原处修改，slice返回新数组

## 2018Jan18-L
* 修改过程中疑似发现一个bug，如果list_KeyWord中有一个全空的Keyword，将不能获取到视频信息
* 取消background.js中r529-r540的注释可以重现bug

## 2018Jan17-BS

修改keyWord里self变量类型.

从单个字符串,改成数组字符串. 矩阵元为用户输入的单个关键词.



需要修改的地方有:

### core.js

#### class keyWord DONE

> 12 : this.self = keyWord

self的声明和初始化.

####class keyWord :  show() NO NEED

> 22 : console.log("keyword : " + this.self);

输出关键字.该函数主要是为了调试.

#### class keyWord :  clone(target) NO NEED

> 32 : target.self = this.self;

类的复制函数. 但是这个函数在代码里没用上.

#### function satisfyKeyWord(keyWord, vInfo) MODIFIED

> 432 : if (keyWord.self.length > 0) {

判断有没有关键词

> 434 : list_world = keyWord.self.split(',');

用","分割关键词, 储存在数组里.



### backound.js

#### function searchListOnline(list) DONE if error here, might mean .self is not a array

> 79 :  if (list[i].self != "") {

判断关键字是否为空. 如果是空,说明是要查找播放列表或者channel.

> 84 : url = "https://www.youtube.com/" + list[i].channelUrl + "/search?sp=CAISAhAB&query=" + removeNChar(list[i].self).split(',').join(' ');

关键词按照","分割, 用" "拼接, 作为Youtube的搜索词

> 92 : url = "https://www.youtube.com/results?sp=CAI%253D&search_query=" + removeNChar(list[i].self).split(',').join(' ');

不指定channel. 关键词按照","分割, 用" "拼接, 作为Youtube的搜索词.  

#### function searchPlayListOnline(list) DONE

> 123 : if (list[i].self != "") {

判断关键字是否为空. 如果是空,说明是要查找播放列表或者channel.



#### function initialUrl(key_word) DONE

> 360 : let key_word_local = new keyWord(key_word.self, key_word.channel, key_word.playList);

复制一个key_word变量. 这里不能直接用=连接进行复制. 

> 365 : key_word_local.self = "";

讲key_word_local的关键词抹掉. 在随后的搜索中,会只搜索频道或playlist. 不抹掉searchListOnline函数无法搜索playlist或者频道的主页.

> 411 : reject("error when initializing " + key_word.self)

初始化频道url或playlist失败,返回错误信息.这里可以不用key_word.self.





## 2018Jan07-BS

关于监测https://www.youtube.com/feed/subscriptions页面
通过点击youtube的slidebar上subscriptions按钮,不会触发content脚本, 导致无法插入视频.
针对这个问题, 
- 发现当页面刷新会执行插入视频脚本
- browser.tabs.onUpdated.addListener可以监测tab的变化
  基于上面两点,之前的解决办法是
  当tab发生变化,检查是否含有subscriptions页面,有的话就刷新页面,激活插入视频脚本.
  存在问题,
  刷新页面会导致激活browser.tabs.onUpdated.addListener函数,会导致刷新页面...陷入死循环
  所以加了一个30秒的延时,来等待刷新页面动作结束. 但是这样导致,

- 30秒之内, 如果重新返回订阅页面,无法触发插入视频脚本.

现在通过后台向前台传递消息的机制来实现.主要基于,
**打开subscriptions虽然无法触发插入视频脚本,但是监听后台消息函数使用有效**.
所以后台检查是否打开subscriptions tab,打开就向该tab发送消息.
tab接到消息就执行插入视频脚本. 为避免重复插入,会在插入视频后,在页面留下`<div id="insertYtse"></div>`元素.


## 2018Jan17-L
* 给帮助预留的弹窗
* 对于显示不完全的keyword添加了主动的悬浮提示
* 但是发现浏览器其实默认也有个悬浮提示，只是延迟很高。用哪个好？添加的还是默认的？

## 2018Jan12-L
* svg很好玩

## 2018Jan11-L
* 父元素用flex，和justify-content:space-between可以很好地拉开首尾子元素
* span用来包裹inline，div包裹block
* ul的list-style:none 并且左边padding为0，可以消除li缩进
* 如果Roboto的加载速度不够，备用几个看起来像的web safe font
  * Tahoma, Geneva, sans-serif
  * "Lucida Sans Unicode", "Lucida Grande", sans-serif
  * Verdana, Geneva, sans-serif
  * Arial, Helvetica, sans-serif

## 2018Jan05-L
* 设置页的li label中的文字如果超长会改变排版，暂时靠拉长来避免，恐怕之后要改个V6出来
* 设置页完成，关键词列表存储在local(list_KeyWord)中，只等整合
* 在core中的keyWord类中加了一项属性onOff，具体功能需要搜索部分提供支援
* 之前用;分割关键词的规则被我改成用,分割多个关键词，同时用;分割关键词与频道（分隔符为英文半角）

## 2018Jan04-L
* maybe make box resizeable latter

## 2018Jan02-L
* radio button 点击后checked状态已经改成true，所以无法得知点击之前的真正状态，必须创建一个变量保存之前状态，可以在radio里加一个属性作为保存，也可以另设全局变量
* 在jquery的callback里用()=>{}会继承window作为this，必须用function(){}才能正确继承

## 2017Dec29-L
* trello似乎也用了和youtube一样的刷新机制，以下是一些可能的解决方案，基本还是靠手动注入脚本
  * https://stackoverflow.com/questions/34077641/how-to-detect-page-navigation-on-youtube-and-modify-html-before-page-is-rendered
  * https://stackoverflow.com/questions/20865581/chrome-extension-content-script-not-loaded-until-page-is-refreshed/21071357#21071357
  * https://stackoverflow.com/questions/11473105/is-it-possible-to-run-the-injected-script-without-reload
  * https://www.w3schools.com/jsref/event_onhashchange.asp

### 2017Dec29-BS

现在已经基本完成了插件预想的效果.

​								\*★,°\*:.☆\\(￣▽￣)/$:\*.°★\* 

**已知Bug**

1. Youtube subscribe页面的刷新机制导致的一系列bug
   - 第一次打开subscribe页面会自动插入视频. 但是由于现在设置刷新间隔为30秒, 所以在30秒之内, 通过点击左侧suscribe按钮,会使得插入视频消失.
   - Youtube并不会一次在subscribe页面将所有的订阅视频更新出来,会在页面滚动到底端,插入新的视频信息. 但是因为页面本身没有刷新,不会触发脚本, 从而搜索的视频也不会插入到订阅列表中.
2. 现在搜索视频没有检查是否重复.
   - 添加的不同关键词可能会得到相同的搜索结果.
   - 在插入到订阅页面时,可能会有和订阅页面重复的视频.

### 2017Dec27-BS

悲剧了

- Youtube现在有新的界面,和老版格式不太相同. 

  插入视频后youtube会自己刷新一下,手动插入的部分无法显示出来

  通过访问youtube.com/new可以切换到新版. 通过右上角头像可以切换回旧版.

- 老版Youtube手动插入可以正常加载. 但是发现搜索抓出来的html格式和订阅页面有所不同,所以也不能加载出来. 需要一个转化函数,还需要一个针对订阅页面筛选视频信息的函数

### 2017Dec25-BS

发现youtube搜索对一些字符不支持

一些中文字符,符号字符

目前发现的:

**部分emoji** 

隶属字符集 : Miscellaneous Symbols and Pictographs 范围 : 1F300—1F5FF

无效 : 🎁

有效 : 💄

**部分中文字符** 

隶属字符集 : CJK Symbols and Punctuation 范围 :3000—303F

无效 : 《 》

有效 : 【

目前只是在程序里处理了《 》,其他字符没关,因为没有发现什么规律. 

所以建议用户添加关键词的时候确认关键词好用.

### 2017Dec24-BS

迎来一次重大更新

- 实现根据channel或playlist自己添加url

- 实现对list的检索与过滤

- 实现对youtube返回视频更新时间的格式转化 

  如 2天前 -> 时间数字

### 2017Dec24-BS

关于变量的生存周期.

在第一次加载插件的时候,脚本从头运行,声明所有变量.

全局变量将会被一直保留,

再运行插件的时候是从点击按钮开始.

### 2017Dec23-BS

添加了网页对关键字过滤功能,并将符合条件的视频信息储存在数组里.
目前完成了对youtube全局搜索和对频道进行搜索. 对列表的处理还没有添加.

### 2017Dec17-BS

添加搜索youtuber页面功能,将结果也储存在list_SearchResults里

对于主页搜索和之前完成的全局搜索基本差不多

地址格式为 www.youtube.com/"channelurl"/?search_query="要搜索的内容"

channelurl有两种

- channel开头 

  比如阅后即瞎官方主页 https://www.youtube.com/channel/UCHCb7_nHscX38PI0L182GGA

- user开头

  比如爸爸去哪主页 https://www.youtube.com/user/imgotv

## 2017Dec25-L
* 稍微调整了下设置页，效果应该更好了
  * 拖动元素时会把内容写到输入框，方便修改
  * 鼠标悬浮在“add keyword”上会显示提示信息
  * 调整了几处字体，位置

## 2017Dec22-L
* 设置页基本成型
* 发现有storage.sync和storage.local两种可选，目前测试使用的后者，而前者可以实现账号下同步
* storage.local.get()即使没有获取到想要的对象也会获取成功，只是返回一个空对象而已

## 2017Dec21-L
* jQuery被CSP墙，要让它能用，以下几种方法
  * 在about:config里关掉CSP
  * 或，远程引用jQuery
    * 先从https://code.jquery.com/中拷贝jQuery CDN 代码到你的html中，
    * 并开启权限 "content_security_policy": "script-src 'self' https://code.jquery.com
    * 然后将调用jQuery的inline js代码，粘贴到https://report-uri.com/home/hash 里计算sha256值
    * 并开权限"content_security_policy":"script-src 'self' 'sha256-/nLaDjLjCQs9I0v3MGE2bIX/U6rHqCAVc4r/uI3I34o='
    * 惊了！复杂到哭![](readme/emoji/ac27惊.png)
  * 或，也可以本地引用
    * 上个方法第一步中的https://code.jquery.com/中还可以直接下载到js文件
    * 还是用CDN码，只用把copy到的代码里把src改成本地的地址即可
    * 俺老孙服了![](readme/emoji/2044认真.png)
* 欸。。。奇怪。。今天测试。。。引用jquery这一步随便引一下都可以了。。没有报csp的错。。。昨天见鬼了吗。。。还是今天见鬼了
* 进一步发现，把js的代码移出到单独的js文件，就能绕开inline script的使用
* 然后就不用打开任何权限了，啥！
## 2017Dec20-L
* jquery 的sortable在setting page 里失效了
  * 想办法让它生效
  * 搞清楚怎么用https://lukasoppermann.github.io/html5sortable/index.html
* 我打算实现网页里的拖放排序，经过简单调查（也就是StackOverflow），暂时决定使用jQuery而不使用html5原生的浏览器支持，原因如下
  * html5的拖放很渣
  * html5各个浏览器的支持可能不同，包括移动端的支持。而jQuery已经处理好大部分兼容
  * jQuery是js层的lib，跑得慢，但是我们需要的功能能也很少，我觉得可以接受

## 2017Dec18-L
* ```js
        if(typeof(Worker)!=="undefined")
        {
        if(typeof(w)=="undefined")
        {
        w=new Worker("/example/html5/demo_workers.js");
        }
    ```

* HTML 链接 Target 属性，你可以定义被链接的文档在何处显示，例如新窗口

## 2017Dec17-L

* 这将是里程碑式的一次提交

## 2017Dec16-L
* 我觉得发现一个firefox的bug，notification弹窗写在promise里位置会飞

## 2017Dec15-BS

通过添加setRequestHeader对youtube进行反-反爬虫.

- [函数介绍](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader)

  调用方式 `xmlHttp.setRequestHeader ('value', 'name');`

- hearder里每个变量是以 `"name":"value"`形式进行储存的name和value的取值参看:

  | Header              | 解释                                       | 示例                                       |
  | ------------------- | ---------------------------------------- | ---------------------------------------- |
  | Accept              | 指定客户端能够接收的内容类型                           | Accept: text/plain, text/html            |
  | Accept-Charset      | 浏览器可以接受的字符编码集。                           | Accept-Charset: iso-8859-5               |
  | Accept-Encoding     | 指定浏览器可以支持的web服务器返回内容压缩编码类型。              | Accept-Encoding: compress, gzip          |
  | Accept-Language     | 浏览器可接受的语言                                | Accept-Language: en,zh                   |
  | Accept-Ranges       | 可以请求网页实体的一个或者多个子范围字段                     | Accept-Ranges: bytes                     |
  | Authorization       | HTTP授权的授权证书                              | Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ== |
  | Cache-Control       | 指定请求和响应遵循的缓存机制                           | Cache-Control: no-cache                  |
  | Connection          | 表示是否需要持久连接。（HTTP 1.1默认进行持久连接）            | Connection: close                        |
  | Cookie              | HTTP请求发送时，会把保存在该请求域名下的所有cookie值一起发送给web服务器。 | Cookie: $Version=1; Skin=new;            |
  | Content-Length      | 请求的内容长度                                  | Content-Length: 348                      |
  | Content-Type        | 请求的与实体对应的MIME信息                          | Content-Type: application/x-www-form-urlencoded |
  | Date                | 请求发送的日期和时间                               | Date: Tue, 15 Nov2010 08:12:31 GMT       |
  | Expect              | 请求的特定的服务器行为                              | Expect: 100-continue                     |
  | From                | 发出请求的用户的Email                            | From: user@email.com                     |
  | Host                | 指定请求的服务器的域名和端口号                          | Host: www.zcmhi.com                      |
  | If-Match            | 只有请求内容与实体相匹配才有效                          | If-Match: “737060cd8c284d8af7ad3082f209582d” |
  | If-Modified-Since   | 如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码      | If-Modified-Since: Sat, 29 Oct 2010 19:43:31 GMT |
  | If-None-Match       | 如果内容未改变返回304代码，参数为服务器先前发送的Etag，与服务器回应的Etag比较判断是否改变 | If-None-Match: “737060cd8c284d8af7ad3082f209582d” |
  | If-Range            | 如果实体未改变，服务器发送客户端丢失的部分，否则发送整个实体。参数也为Etag  | If-Range: “737060cd8c284d8af7ad3082f209582d” |
  | If-Unmodified-Since | 只在实体在指定时间之后未被修改才请求成功                     | If-Unmodified-Since: Sat, 29 Oct 2010 19:43:31 GMT |
  | Max-Forwards        | 限制信息通过代理和网关传送的时间                         | Max-Forwards: 10                         |
  | Pragma              | 用来包含实现特定的指令                              | Pragma: no-cache                         |
  | Proxy-Authorization | 连接到代理的授权证书                               | Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ== |
  | Range               | 只请求实体的一部分，指定范围                           | Range: bytes=500-999                     |
  | Referer             | 先前网页的地址，当前请求网页紧随其后,即来路                   | Referer: http://www.zcmhi.com/archives/71.html |
  | TE                  | 客户端愿意接受的传输编码，并通知服务器接受接受尾加头信息             | TE: trailers,deflate;q=0.5               |
  | Upgrade             | 向服务器指定某种传输协议以便服务器进行转换（如果支持）              | Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11 |
  | User-Agent          | User-Agent的内容包含发出请求的用户信息                 | User-Agent: Mozilla/5.0 (Linux; X11)     |
  | Via                 | 通知中间网关或代理服务器地址，通信协议                      | Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1) |
  | Warning             | 关于消息实体的警告信息                              | Warn: 199 Miscellaneous warning          |

  ​



## 2017Dec15-L

* 新发现，firefox提供添加搜索引擎的功能，实际上是一种叫opensearch的技术还是标准还是约定？，youtube似乎也有官方支持
* https://www.youtube.com/opensearch
* 在reference 文件夹里是youtube和google两个搜索引擎的安装文件，就只是很短几行xml而已。
* github上有个javascript的opensearch项目，叫OpenSearchlight，但是要调用node
* captcha 验证码，What Google considers automated traffic:
  * Sending searches from a robot, computer program, automated service, or search scraper
  * Using software that sends searches to Google to see how a website or webpage ranks on Google  
    This traffic may have been sent by malicious software, a browser plug-in, or a script that sends automated requests. If you share your network connection, ask your administrator for help — a different computer using the same IP address may be responsible.
    Sometimes you may be asked to solve the CAPTCHA if you are using advanced terms that robots are known to use, or sending requests very quickly.
* https://www.webnots.com/fix-im-not-a-robot-captcha-issue-in-google-search/ 有关captcha的一些说明

## 2017Dec14-L
* 搜这么多，我隐约觉得https://www.youtube.com/results?search_query=阅后即瞎 的方法基本不可能了
* 替代方案1，google，如果能解决机器人验证的问题，不行就用bing大概也行
* 替代方案2，youtube api，如果舍得贡献一个google账号
* 替代方案3，让用户本地运行node，然后与webextension通讯
* 个人首选替代方案1，二三并列，

## 2017Dec13-L
* https://noembed.com/embed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ 第三方网站解析视频信息，需要视频地址
* https://stackoverflow.com/questions/42052944/is-it-possible-to-retrieve-the-description-of-a-youtube-video-without-authentica 不用api得到youtube视频描述，需要视频的地址
* 无fuck说，百度的搜索结果页面就能显示出来呢
* 有意思，google的搜索页面会返回机器人验证。。。厉害厉害
* 我觉得问题变成了怎么去针对youtube。。。
* https://www.channelcrawler.com/ 一个网页版的youtube crawler，既然做成了网站，背后应该跑着node
* https://github.com/96AA48/node-youtube-crawler/blob/master/index.js github上一个项目
* node底层不像jquery是用js写的，所以jQuery可以用在webextension里，node用不了
* web_scrapbook/core/background.js 最后一个函数，有关于给请求加head的描述，也许可以骗开google的机器人验证
* web_scrapbook/core/common.js line.1359 有个resolve(xhr)函数，也许可以参考怎么解析xhr结果

## 2017Dec12-L
越来越冷。。。
* 我现在怀疑问题出在，搜索结果并不是以html形式存在服务器上，如果是要获取一个.html文件大概xmlhttprequest已经可以工作了（这个还没测试）。所以别的爬虫是怎么处理这个搜索结果页面的呢？
* 发现一个重大问题![](readme/emoji/ac27惊.png)，从xmlhttprequest返回的response里并不能还原渲染成网页，甚至提取不到我们要的链接，因为里面很多地方看起来是变量名，不是字符串，例如
  * <a id="video-title" class="yt-simple-endpoint style-scope ytd-video-renderer" aria-label$="[[data.title.accessibility.accessibilityData.label]]" href$="[[computeHref_(data.navigationEndpoint)]]" title$="[[getSimpleString(data.title)]]" data="[[data.navigationEndpoint]]">
           [[getSimpleString(data.title)]]
         </a>
* 按照以往的经验，这里的href应该指向youtube.com/watch?v=的地址
* background script 要操纵tab内容似乎得通过content与background之间互相送消息。
* xml
    * XML 被设计为传输和存储数据，其焦点是数据的内容。
    * HTML 被设计用来显示数据，其焦点是数据的外观。
    * HTML 旨在显示信息，而 XML 旨在传输信息。
* 要不先研究存储，把获取到的网页存成html再给浏览器打开？
* https://chrome.google.com/webstore/detail/agenty-advanced-web-scrap/gpolcofcjjiooogejfbaamdgmgfehgff 这是chrome的一个爬虫插件，可以解开看看
* https://chrome-extension-downloader.com/ chrome extension downloader
* 解包这个插件发现他们调用了jquery，包含了一个jquery.min.js里面是超长一行代码，变量名都是I,G,J这种。


## 2017Dec11-L
今天白天没干啥正事。。
* https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Example.3a_Asynchronous_request 重要链接，介绍正统怎么分析xmlhttprequest返回结果的方法。
* 自己乱试的方法，覆写到background.html上，地址是moz-extension://5e3adf10-b4c4-4c14-8df4-1c801cbe68d7/_generated_background_page.html，中间一段时浏览器分配的uuid。结果是会被安全策略墙，控制台会弹无数的红字。尝试只写些一般的内容，也不成功。回去研究正道吧![](readme/emoji/ac10呆.png)

## 2017Dec10-L
今天肚子疼。。。
* arrow function & callback
    * regular functions would have their this value set to the global object if they were used as callbacks
    * Arrow functions do not have their own this value. The value of this inside an arrow function is always inherited from the enclosing scope.
        * Use non-arrow functions for methods that will be called using the object.method() syntax. Those are the functions that will receive a meaningful this value from their caller.
        * Use arrow functions for everything else.
* background script的console输出需要点debug才能看到，content script的console输出可以在web console看到
* OK今天又遇到了permission坑，backgroundscript需要在permission里加入网址才能请求xmlhttprequest。否则status会返回0，意思是网络错误，奇奇怪怪的错都往permission上想就对了

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
* 还有一个问题是，搜索页面里并不显示所有的搜索结果，当页面滑到最底下的时候才会加载出来，需要研究下这里的动作


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
