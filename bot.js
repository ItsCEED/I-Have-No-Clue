// Modules
const Colors = require('colors')
const module_exists = require('module-exists');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');


// SUCCESS and ERROR TAGS

var ok = '[SUCCESS]'.green;
var nok = '[ERROR]'.red;

//Modules Check Before Server Auth and Login

console.log("Loading modules...".cyan);
console.log("");

if (module_exists('colors')) {
    console.log("Loading colors: " + ok);
} else {
    console.log("Loading colors: " + nok);
};
if (module_exists('module-exists')) {
    console.log("Loading module-exists: " + ok);
} else {
    console.log("Loading module-exists: " + nok);
};
if (module_exists('steam-user')) {
    console.log("Loading steam-user: " + ok);
} else {
    console.log("Loading steam-user: " + nok);
};
if (module_exists('steam-totp')) {
    console.log("Loading steam-totp: " + ok);
} else {
    console.log("Loading steam-totp: " + nok);
};
if (module_exists('steamcommunity')) {
    console.log("Loading steamcommunity " + ok);
} else {
    console.log("Loading steamcommunity: " + nok);
};
if (module_exists('steam-tradeoffer-manager')) {
    console.log("Loading steam-tradeoffer-manager: " + ok);
} else {
    console.log("Loading steam-tradeoffer-manager: " + nok);
};
if (module_exists('sleep')) {
    console.log("Loading sleep: " + ok);
} else {
    console.log("Loading sleep: " + nok);
};


//Server connection?
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
});

//Bot Account

const logOnOptions = {
    accountName: 'YourAccountName',
    password: 'YourAccountPassword',
    twoFactorCode: SteamTotp.generateAuthCode('YourAuthCode')
};

//Trusted ID's
var id = ['', '', ''];

console.log("")
console.log("Trusted SteamID's: ".cyan)
console.log("")
id.forEach(function(element) {
    console.log(element.red);
});
console.log("")
//LogIn
client.logOn(logOnOptions);

//If logged
client.on('loggedOn', () => {
    console.log('Logged into Steam'.green);

    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    //client.gamesPlayed(440);
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(10000, 'YourConfirmationCode');
});

Array.prototype.contains = function(k) {
    for (p in this)
        if (this[p] === k)
            return true;
    return false;
}
//Trade Request Handling
manager.on('newOffer', (offer) => {
    var tradeid = offer.partner.getSteamID64();
    if (id.contains(tradeid) === true) {
        offer.accept((err, status) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Trade accepted. (".yellow + tradeid.red + ")".yellow);
            }
        });
    } else {
        offer.decline((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Canceled offer from unidentified person. ('.yellow + tradeid.red + ")".yellow);
            }
        });
    }
});

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
        client.addFriend(steamid);
        client.chatMessage(steamid, 'Whats up? You just added me! Send me a trade if your ID is trusted and I will accept it');
    }
});