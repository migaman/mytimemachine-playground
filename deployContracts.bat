REM call truffle.cmd console

REM  migrate --reset
REM  VideoContract.deployed().then(function(instance){return instance.getBlockNumber();});
REM  VideoContract.deployed().then(function(instance){return instance.addVideo(10, "test", 7);});

REM  VideoContract.deployed().then(function(instance){return instance.getVideoId();});

call truffle.cmd migrate --reset
pause