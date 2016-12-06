var re = require('request');
var fs = require('fs');

// var username = '201400301165';
// var password = '555751';

exports.getInfo = getInfo;
function getInfo(username, password, callback) {
    re.post({
        url: 'http://202.194.15.33:21043/b/ajaxLogin',
        form: {
            j_username: username,
            j_password: password
        }
    },function(err, res, body) {
        if(body != '"success"')
            return callback('fail');
        var cookie = res.headers['set-cookie'];
        cookie += '; index=1';
        cookie += '; j_username=' + username;
        cookie += '; j_password=' + password;
        re({
            url: 'http://202.194.15.33:21043/f/common/main',
            headers: {
                Cookie: cookie
            }
        }, function(err, response, body) {
            var result = /<span class="username">(.+)\[\d*\]<\/span>/.exec(body);
            callback(result[1]);

        });
    });
}
