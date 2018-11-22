// 定义常量或全局变量
var _path = chrome.extension.getURL("");
// 工具类方法
function sendBack(obj){
	chrome.runtime.sendMessage(obj, function (res) {
		obj['k'] == res['k'] && obj.fun && obj.fun(res.d);
	})
}
function insert(jsPath) {
    jsPath = jsPath || 'js/auto.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

function autoEl(cb){
	var str = '<div class="_aup"><div class="_aup_box"><input type="text" id="_api" placeholder="Please enter your API to receive data"/><textarea id="_json" placeholder="Only strict json data is supported, interface data is also json, submitted in POST mode"></textarea><input type="button" id="_send" value="collection" /></div></div>';
	$('body').append(str);
	$('._aup').off('click').on('click', function(e){
		if(e.target.className == '_aup'){
			$(this).fadeOut(300, function(){
				$('._aup').remove()
			})
		}
	})
	$('#_send').off('click').on("click", function(){
		var xs = {ur: "", data: {}};
		xs.ur = $.trim($('#_api').val());
		if(!/^(http|https):\/\//i.test(xs.ur)){
			alert('Data collection api format error!')
			$('#_api').val('').focus()
			return
		}
		try{
			xs.data = JSON.parse($.trim($('#_json').val()));
			for(var k in xs.data){
				if(typeof xs.data[k] == 'object'){
					var u = xs.data[k];
					var m = [];
					xs.data[k] = [];
					for(var v in u){
						if(typeof u[v] == 'object'){
							alert('Currently only supports 2D data, expecting to update!')
						} else {
							var o = {};
							o.el = u[v];
							o.l = $(u[v]).length;
							o.k = v;
							m.push(o);
						}
					}
					var _a = 0, _b = 1;
					for(_a = 0; _a < _b; _a++){
						var mm = {};
						for(var i = 0; i < m.length; i++){
							if(m[i].l >= _b){
								_b = m[i].l
								mm[m[i].k] = $.trim($(m[i].el).eq(_a).text());
							} else {
								mm[m[i].k] = '';
							}
						}
						xs.data[k].push(mm)
					}
				}
			}
			cb && cb(xs)
		}catch(e){
			//TODO handle the exception
			alert('Only strict json data is supported, please check!');
			$('#_json').focus();
			return
		}
	})
	$(document).off('keyup').on('keyup', function(event){
	  if(event.keyCode == 13){
	    $("#_send").trigger("click");
	  }
	});
}

$(function(){
	// 收到点击事件
	chrome.extension.onRequest.addListener(function(req, tabId, cb) {
		if(req.event == 'open') {
			if(!$('body').find('._aup').length){
				autoEl(cb)
				$('body').find('._aup').fadeIn(300)
			} else {
				$('body').find('._aup').trigger("click")
			}
		} else if(req.event == 'success') {
			alert(req.data)
			$('body').find('._aup').trigger("click");
		} else if(req.event == 'err') {
			alert('Api request exception, please check!')
			$('body').find('._aup').trigger("click");
		}
	})
})
