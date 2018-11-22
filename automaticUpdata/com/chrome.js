chrome.browserAction.onClicked.addListener(function (a) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, {event: "open"}, function (res) {
        	console.log(res)
        	res && res.ur && $.ajax({
		    	type: "post",
		    	url: res.ur,
		    	async: true,
		    	data: JSON.stringify(res.data),
		    	contentType: 'application/json',
		    	success: function(res){
		    		if(typeof res == 'string') {
		    			chrome.tabs.sendRequest(tab.id, {event: 'success', data: res}, function() {})
		    		} else {
		    			chrome.tabs.sendRequest(tab.id, {event: 'success', data: 'success'}, function() {})
		    		}
	    		},
	    		error: function(e){
	    			console.log(e)
	    			chrome.tabs.sendRequest(tab.id, {event: 'err', data: ''}, function() {})
	    		}
		    })
        });
    });
});