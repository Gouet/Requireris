/**
 * Created by Victor on 09/11/16.
 */

algo = require('./algo');
Getopt = require('node-getopt');

getopt = new Getopt([
    ['', 'length=ARG'],
    ['' , 'timestart=ARG'],
    [''  , 'algohash=ARG'],
    ['' , 'secret=ARG'],
    [''  , 'timestep=ARG'],
    ['', 'counterOffSet=ARG'],
    ['', 'api'],
    ['', 'hotp'],
    ['', 'totp'],
    ['h' , 'help']
]).bindHelp();

secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'//'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
algohash = 'sha1';
timestep = 30;
length = 8;
timestart = 0;
counterOffSet = 0;

api = false;
totp = true;
hotp = false;

function parseOpt() {
    opt = getopt.parse(process.argv.slice(2));
    arguments = opt['options'];

    if (arguments['length']) {
        length = arguments['length'];
        if (length > 8 || length < 6) {
            length = 8;
        }
    }
    if (arguments['timestart']) {
        timestart = arguments['timestart'];
    }
    if (arguments['timestep']) {
        timestep = arguments['timestep'];
    }
    if (arguments['algohash']) {
        algohash = arguments['algohash'];
        if (algohash != 'sha1' && algohash != 'sha256' && algohash != 'sha512') {
            algohash = 'sha1';
        }
    }
    if (arguments['counterOffSet']) {
        counterOffSet = arguments['counterOffSet'];
    }
    if (arguments['secret']) {
        secret = arguments['secret'];
    }
    if (arguments['api']) {
        api = true;
    }
    if (arguments['hotp']) {
        hotp = true;
    }
    if (arguments['totp']) {
        totp = true;
    }
}

parseOpt();
if (api) {
    require('./server').run();
} else {
    if (hotp) {
        tab = algo.hotp(counterOffSet, secret, length, algohash);
        console.log(tab)
    } else {
        tab = algo.totp(secret, timestep, timestart, length, algohash);
        if (tab != null && tab.length == 2)
            console.log(tab[0]);
        else
            console.log("failed");
    }
}