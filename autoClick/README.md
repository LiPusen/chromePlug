# 谷歌插件开发
插件开发纪要：
1. 插件会给每一个tab页分配一个tab.id，每一次页面的刷新都会重新执行一遍插件逻辑，并且不会影响其他的tab状态。
2. 通过manifest.json可以指定运行在插件后台的脚本或者运行在客户端前端的脚本，前后端依靠事件效应进行数据传递。
3. 当在配置文件中设置browser_action的prop页面时，点击插件图标将不响应点击事件，直接打开prop页面。
4. 点击右上角插件图标调用chrome.browserAction.onClicked.addListener(callback),监听用户的点击事件。
5. 设置插件图标调用chrome.browserAction.setIcon({path, tabId}),需要图标地址和当前需要替换图片的页面id，图片必须是正方形，png格式。
6. 设置插件图标的角标调用chrome.browserAction.setBadgeText({text})和chrome.browserAction.setBadgeBackgroundColor({color}),设置文本和背景色，可以动态改变。
7. 后台向客户端发送数据调用chrome.tabs.sendRequest(tabId, reqData, callback),需要发送当前页面的Id，和需要发送的数据，回调客户端的响应。
8. 客户端接收发送的数据调用chrome.extension.onRequest.addListener((reqData, tabId, callback) => {}),参数顺序和参数结构稍有变化，需要注意，最终的回调函数会再次将处理过的数据带回到后台。
9. 客户端实时进行数据对后台的发送调用chrome.runtime.sendMessage(data, callback),可发送任何数据结构，回调函数接收结果.此方法可以接收所有的返回结果，需要进行标识判断才能进行下一步业务。
10. 后台接收客户端发送的数据调用chrome.runtime.onMessage.addListener(data, tabInfo, callback),后台可以缓存所有的发送数据，并对整个tab页进行管理，接收到前端数据、tab页详情数据、回调数据结果到后台。
11. 通过chrome.tabs.query({active: true, currentWindow: true}, callback)方法，获得当前活动的tab窗口ID，然后可以针对当前tab页面注入代码，或者改变其他状态。
12. 通过chrome.windows.remove(tabId)可以关闭指定tab页，chrome.windows.update(tabId, {state: 'minimized'});//state: 可选 'minimized', 'maximized' and 'fullscreen' 也可自定义窗口尺寸
13. 通过chrome.notifications.create(null, {})从后台调用谷歌通知api。
14. 通过chrome.tabs.create({url})可以打开新的tab页。
