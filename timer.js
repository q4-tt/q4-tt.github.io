window.onload = function() {
    initScreen();
};

var items = {
    'mega': {
        'time': 35,
        'img': 'mega.png',
        'name': 'Mega Health',
        'selected': false,
    },
    'heavy': {
        'time': 25,
        'img': 'heavy.png',
        'name': 'Armor',
        'selected': true,
    }
};

var currentIdx = 0;
var maxIdx = 999;
var result = [];
var runningScore = 0;
var selectedItems = [];

function initScreen() {
    currentIdx = 0;
    maxIdx = 999;
    result = [];
    runningScore = 0;
    selectedItems = [];

    var form = document.createElement('form');

    var html = '';
    html +=  '<div >How many item times?</div>';
    html +=  '<div><input id="questionAmount" type="number" min="1" max="100" value="10" /></div>';
    html +=  '<div id="which">Which items?';
    for (var item in items) {
        if (items.hasOwnProperty(item)) {
            var sel = '';
            if (items[item]['selected']) sel = ' checked ';
            html += '<div><label><input type="checkbox" class="itemcb" value="'+item+'" '+sel+' /> '+items[item]['name']+' ('+items[item]['time']+'s)</label></div>';
        }
    }
    html +=  '</div>';
    html +=  '<div id="sub"><button type="submit" id="startButton">Start</button></div>';

    form.innerHTML = html;

    document.getElementById('cont').innerHTML = '';
    document.getElementById('cont').appendChild(form);

    document.getElementById('questionAmount').focus();

    form.addEventListener('submit', function(e) {
        var val = document.getElementById('questionAmount').value;

        var cbs = document.getElementsByClassName('itemcb');
        for(var i=0; i<cbs.length; i++) {
            if(cbs[i].type == 'checkbox' && cbs[i].checked == true) selectedItems.push(cbs[i].value);
        }

        if (selectedItems.length == 0) return false;
        
        console.log(selectedItems);
        startSession(val);

        e.preventDefault();
    });
}

function startSession(amount) {
    maxIdx = amount;
    timeForm();
}

function finishSession() {
    var totalTime = 0;
    var totalScore = 0;
    var countSuccess = 0;
    var countFail = 0;

    var html = '';
    html += '<table class="res">';
    html += '<tr>';
    html +=  '<th>Item</th>';
    html +=  '<th>Taken</th>';
    html +=  '<th>Respawn</th>';
    html +=  '<th>Input</th>';
    html +=  '<th>Result</th>';
    html +=  '<th>Time</th>';
    html +=  '<th>Score</th>';
    html += '</tr>';
    result.forEach(function(r) {
        var time = r['time'] / 1000;
        html += '<tr>';
        html +=  '<td>'+r['item']+'</td>';
        html +=  '<td>'+r['taken']+'</td>';
        html +=  '<td>'+r['respawn']+'</td>';
        html +=  '<td>'+r['input']+'</td>';
        if (r['res']) {
            html += '<td><div class="yay">SUCCESS</div></td>';
            countSuccess++;
        } else {
            html += '<td><div class="nay">FAIL</div></td>';
            countFail++;
        }
        html +=  '<td>'+time.toFixed(2)+'s</td>';
        html +=  '<td>'+r['score']+'</td>';
        html += '</tr>';
        totalTime += r['time'];
        totalScore += r['score'];
    });
    var time = totalTime / 1000;
    html +=  '<tr class="summary">';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td>'+countSuccess+'/'+result.length+'</td>';
    html +=   '<td>total '+time.toFixed(2)+'s</td>';
    html +=   '<td>total '+totalScore+'</td>';
    html +=  '</tr>';
    html +=  '<tr class="summary">';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td></td>';
    html +=   '<td>avg '+((totalTime / result.length) / 1000).toFixed(2)+'s</td>';
    html +=   '<td></td>';
    html +=  '</tr>';
    html += '</table>';

    html += '<div class="endscore">Final Score: '+totalScore+'</div>';

    html += '<button id="restartButton">Restart</button>';

    document.getElementById('cont').innerHTML = html;
    document.getElementById('restartButton').focus();
    document.getElementById('restartButton').addEventListener('click',function() {
        initScreen();
    });
}

function timeForm() {
    var itemName = selectedItems[Math.floor(Math.random() * selectedItems.length)];
    var item = items[itemName];

    var timeTaken = Math.floor(Math.random() * 59);
    var timeRespawn = timeTaken + item['time'];
    if (timeRespawn > 59) timeRespawn = timeRespawn - 60;

    var form = document.createElement('form');
    
    var htmlTaken = timeTaken;
    if (htmlTaken < 10) htmlTaken = '0'+htmlTaken;

    var html = '';

    html +=  '<div id="runningscore">Score: '+runningScore+'</div>';
    html +=  '<div class="questionRow">';
    html +=   '<div><img width="75" src="'+item['img']+'"></div>';
    html +=   '<div class="time">'+htmlTaken+'</div>';
    html +=   '<div><input id="timeAnswer" type="number" min="0" max="60" /></div>';
    html +=   '<div><button type="submit" id="submitAnswer">Go</button></div>';
    html +=  '</div>';
    html +=  '<div id="timeres"></div>';
    html +=  '<div id="timetime"></div>';


    form.innerHTML = html;

    document.getElementById('cont').innerHTML = '';
    document.getElementById('cont').appendChild(form);

    document.getElementById('timeAnswer').focus();

    var sent = false;
    
    var startTime = new Date();
    form.addEventListener('submit', function(e) {
        if (sent) return false; 
        sent = true;

        var endTime = new Date();
        var diffTime = endTime - startTime;
        var val = document.getElementById('timeAnswer').value;
        
        var res = true
        if (val != timeRespawn) res = false;

        var score = getScore(res,diffTime);
        runningScore += score;

        result.push({
            'item': item['name'],
            'taken': timeTaken,
            'respawn': timeRespawn,
            'input': val,
            'res': res,
            'time': diffTime,
            'score': score,
        });
        
        document.getElementById('runningscore').innerHTML = 'Score: '+runningScore;
        document.getElementById('submitAnswer').remove();

        if (res) {
            document.getElementById('timeres').innerHTML = '<div class="yay">SUCCESS</div>';
        } else {
            document.getElementById('timeres').innerHTML = '<div class="nay">FAIL</div>';
        }

        document.getElementById('timetime').innerHTML = (diffTime / 1000).toFixed(2)+'s';
        
        currentIdx++;

        setTimeout(function() {
            if (currentIdx >= maxIdx) {
                finishSession();
            } else {
                timeForm();
            }
        },750);
            
        e.preventDefault();
    });
}

function getScore(res,time) {
    if (res) {
        // time = 1s --> score = 10
        // time = 3s --> score = 3
        // .... linear
        return Math.floor(-3.5*(time / 1000)+13.5);
       // return (int)(-3.5*((double)inputTime()/1000.0)+ 13.5);
    } else {
        return Math.floor(-3.0*(time / 1000));
        //return (int)(-3.0*((double)inputTime()/1000.0));
    }
}
