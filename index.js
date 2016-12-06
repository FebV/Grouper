var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var f = require('./getData');
var fs = require('fs');

const crypto = require('crypto');


function hashFunc(data) {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
}

var start = Date.parse('Dec 06 2016 17:00:00 GMT+0800');
var passbook = [];
var choiceStatus = [];
var records = [];
for(var i = 0; i < 5; i++) {
    choiceStatus[i] = 3;
}

app.use(bodyParser.urlencoded({ extended: true }));
// app.get('/', function (req, res) {
//     f.getInfo('201400301165', '5557251', function(r){
//         res.send(r);
//     });
// });

app.use(express.static('public'));
app.use(express.static('node_modules/material-design-lite'));

app.get('/list', function(req, res) {
    res.send(JSON.stringify(choiceStatus));
});


app.post('/login', function(req, res) {
    log('access.log', JSON.stringify({time: new Date().toString(), param: req.body, ip: req.ip}));
    //this log file will be removed later;

    if(Date.now() < start)
        return res.send('fail');

    if(req.body.snum == ''|| req.body.spass == '') 
        return res.send('fail');


    f.getInfo(req.body.snum, req.body.spass, function(r){
        if(r != 'fail') {
            log('login.log', JSON.stringify({time: new Date().toString(), info: r}));
            var token = hashFunc(r+new Date().toString());
            var exist = false;
            var rec = {};
            for(var i of passbook) {
                if(i.info == r) {
                    exist = true;
                    rec = i;
                    token = i.token;
                }
            }
            if(!exist)
                passbook.push({info: r, token: token});
            return res.send(JSON.stringify({info: r, token: token}));
        }
        return res.send('fail');
    });

});

app.post('/record', function(req, res) {
    var info = '';
    for(var i of passbook) {
        if(i.token == req.body.token) {
            info = i.info;
        }
    }

    console.log(req.body);

    var exist = false;
    if(info != '') {
        for(var i of records) {
            if(i.info == info) {
                exist = true;
            }
        }
        if(!exist) {
            if(choiceStatus[req.body.choice] > 0) {
                log('record.log', JSON.stringify({info: info, choice: req.body.choice}));
                records.push({info: info, choice: req.body.choice});
                choiceStatus[req.body.choice]--;
                return res.send('选好啦');
            }else{
                return res.send('已经没有位置了，换一个吧');
            }
        }else{
            return res.send('你已经选过啦');
        }

    }
    return res.send('看来我们要聊一聊');
});

function log(filename, param) {
    fs.appendFile(filename, '\n'+param, function(err) {
        if(err)
            console.log(err);
    })
}



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})
