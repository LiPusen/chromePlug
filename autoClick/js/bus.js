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
// 收到点击事件
chrome.extension.onRequest.addListener(function(req, tabId, cb) {
	if(req.event == 'open') {
		$('._oc').fadeIn(300)
	}
})

function Autoclick() {
	this.init();
	this.data = [];
}

Autoclick.prototype.init = function() {
	var str = '<div class="_oc" hidden><div class="_oc_close">×</div><div class="_oc_list"><span id="_oc_common">添加任务</span></div><div class="_oc_task" hidden><table border="0" cellspacing="0" cellpadding="0"></table></div><div class="_oc_do" hidden>执行任务</div></div>';
	!!$('._oc').length && $('._oc').remove();
	$('body').append(str);
	$('._oc').append(this.help());
	$('._oc').append(this.mask());
	this.even();
	this.data = [];
}

Autoclick.prototype.list = function() {
	let str = '<tr><th>选择目标</th><th>开始时分</th><th>执行次数</th></tr>';
	if(this.data.length >= 5) {
		alert('最多支持五组任务!')
	} else {
		this.data.push({el: '', t: '0', s: '1', y: false, c: ''});
		for(let i = 0; i < this.data.length; i++) {
			str += '<tr><td class="_oc_click">'+ (this.data[i].el ? '已选择' : '点击选择') +'</td><td><input type="text" value="'+ this.data[i].t +'" class="_oc_t" /></td><td><input type="text" value="'+ this.data[i].s +'" class="_oc_s" /></td></tr>';
		}
		$('._oc_task').find('table').html(str);
		this.sub();
	}
	return this;
}

Autoclick.prototype.help = function() {
	let str = '<div class="_oc-info" hidden><p><img alt="note" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEUAAABQUFBQUFBQUFBPT09QUFBRUVFQUFBQUFBPT09QUFBQUFBVVVVQUFBRUVFQUFBOTk5OTk5RUVFRUVFaHMdwAAAAE3RSTlMAN4ZqVI4fd0Muo34M7MNLKBOtaEUwDgAAAGxJREFUGNN1j0sSgDAIQwMFav1/7n9XJ2q1G7PIhPQxQ/EjSUmacXALhGudlY8BlKfJRp8ysA6g9su7IDsyEdhSj5pTYexneuS3mPQuKlaOhcVidCd22MhFGrIAMgthbQ7jnn+nr9jM9f9zrU4qIAI96QZYRQAAAABJRU5ErkJggg=="/>点击选择目标，选择成功后按钮变成已选择，更换目标可以再次点击选择；开始时分可以是延迟执行的毫秒数，也可以是时间格式:小时-分钟；同时最多运行五组任务!</p></div>';
	return str;
}

Autoclick.prototype.mask = function() {
	let str = '<div class="_oc_mask" hidden></div>';
	return str;
}

Autoclick.prototype.even = function() {
	const that = this;
	$(document).off('click');
	$('._oc').on('click', e => false );
	$('._oc_close').on('click', () => this.init());
	$('#_oc_common').on('click', () => {
		that.list();
		$('._oc_task').slideDown(300);
		$('._oc_do').slideDown(350);
		$('._oc-info').slideDown(500);
	})
	$('._oc_do').on('click', () => {
		$(document).off('click');
		const a = that.data.filter(it => !!it.el);
		const b = that.data.filter(t => !!t.y);
		if(!!b.length) {
			alert('当前有任务正在执行，不可重复点击!')
		} else if(!a.length) {
			alert('请选择至少一个执行对象!')
		} else {
			$('._oc_do').addClass('_oc_doing').text('执行中...');
			$('._oc_mask').show();
			that.data.forEach((item, i) => {
				item.y = true;
				clearTimeout(item.c);
				item.c = setTimeout(function(){
					let m = item.s;
					let v = setInterval(function() {
						item.el && $(item.el).trigger("click");
						m--;
						if(m <= 0) { item.y = false; item.el = ''; clearInterval(v); $('._oc_click').eq(i).text('点击选择'); }
					}, 10);
				}, that.times(item.t))
			})
			that.watch();
		}
	})
}

Autoclick.prototype.sub = function() {
	const that = this;
	$('._oc_t').off('change').on('change', function() {
		that.data[$('._oc_t').index($(this))]['t'] = $(this).val();
	});
	$('._oc_s').off('change').on('change', function() {
		that.data[$('._oc_s').index($(this))]['s'] = ~~$(this).val();
	});
	$('._oc_click').off('click').on('click', function() {
		const el = this;
		if(that.data[$('._oc_click').index($(el))]['y']) {
			alert('目标正在执行中，不能更换!')
		} else {
			$(document).off('click').on('click', function(e) {
				try{
					that.data[$('._oc_click').index($(el))]['el'] = e.target;
					$(el).text('已选择');
				}catch(e){
					//TODO handle the exception
					alert('不能选择重复的目标!')
				}
				return false;
			})
		}
	})
}

Autoclick.prototype.watch = function() {
	const that = this;
	let g = setInterval(function() {
		let u = false;
		for(let i = 0; i < that.data.length; i++) {
			if(that.data[i].y) {
				u = true;
				return false;
			}
		}
		if(!u) {
			$('._oc_do').removeClass('_oc_doing').text('执行任务');
			$('._oc_mask').hide()
			clearInterval(g);
		}
	}, 10);
}

Autoclick.prototype.times = function(s) {
	const a = s ? String(s).split('-') : [0];
	if(a.length == 1) {
		return ~~(a[0])
	} else if(a.length == 2) {
		const h = ~~a[0];
		const m = ~~a[1];
		const n = new Date();
		if(n.getHours() > h) {
			return 0
		} else if(n.getHours() == h && n.getMinutes() > m) {
			return 0
		} else if(h >= 24 || h < 0 || m > 59 || m < 0){
			return 0
		} else {
			const v = (n.getSeconds()*1000) + n.getMilliseconds();
			return (((h-n.getHours())*3600*1000) + ((m-n.getMinutes())*60*1000) - v)
		}
	} else {
		return 0
	}
}

$(function() {
	new Autoclick();
})
