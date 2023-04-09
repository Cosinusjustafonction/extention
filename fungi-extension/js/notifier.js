


const DISCORD_URI_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
const CLIENT_ID = encodeURIComponent('998698982576496771');
const RESPONSE_TYPE = encodeURIComponent('token');
const REDIRECT_URI = encodeURIComponent(`https://${chrome.runtime.id}.chromiumapp.org/`);
const SCOPE = encodeURIComponent('identify email');
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));

let user_signed_in = false;

function create_auth_endpoint() {
    let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

    let endpoint_url =`${DISCORD_URI_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&nonce=${nonce}`;

    return endpoint_url;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        chrome.identity.launchWebAuthFlow({
            url: create_auth_endpoint(),
            interactive: true
        }, function (redirect_uri) {
            console.log(redirect_uri);
            if (chrome.runtime.lastError || redirect_uri.includes('access_denied')) {
                console.log("Could not authenticate.");
                sendResponse('fail');
            } else {
                user_signed_in = true;
                sendResponse('success');
            }
        });

        return true;
    } else if (request.message === 'logout') {
        user_signed_in = false;

        sendResponse('success');
    }
});



async function notify_loop() {
	
	console.log("new loop");
	
	chrome.storage.sync.get({['alerts']:[]}, function (items) {
		console.log(items);
		chrome.storage.sync.set({'alerts':[]});	
		items.alerts.forEach(item => {

			url = `https://api-mainnet.magiceden.dev/v2/collections/${item.symbol}`;
			fetch(url)
				.then(
					response => response.json()
				)

				.then(response => {
					if ((response.floorPrice * 0.000000001 <= item.limit && item.type == 'under') || (response.floorPrice * 0.000000001 >= item.limit && item.type == 'over')) {
						chrome.notifications.create(`NOTFICATION_ID ${item.symbol}${item.limit}`, {
							type: 'basic',
							iconUrl: response.image,
							title: 'Price alert',
							message: `${item.symbol} collection is ${item.type}: ${item.limit}`,
							priority: 2
						})

					}
					else {
						chrome.storage.sync.get(['alerts'],function(elements){
							chrome.storage.sync.set({'alerts':[]});	
							elements['alerts'].push(item);
							chrome.storage.sync.set(elements);
						})
					}
				})
		});
	})
}



chrome.alarms.create("AlertCheck", {delayInMinutes: 0, periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function(alarm) {
	console.log("beep boop");
	notify_loop();
});