/* -----------------------------------------------------------------------------------
   Map Quiz JS
   Develolped by the Applications Prototype Lab
   (c) 2014 Esri | http://www.esri.com/legal/software-license  
----------------------------------------------------------------------------------- */

require([
    'esri/map',
    'esri/graphic',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/geometry/Point',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/tasks/StatisticDefinition',
    'esri/urlUtils',
    'dojo/parser',
    'dojo/domReady!'
],
function (
    Map,
    Graphic,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    Point,
    Query,
    QueryTask,
    StatisticDefinition,
    urlUtils,
    parser
    ) {
    $(document).ready(function () {
        'use strict';

        // Load widgets
        parser.parse();

        var debug = true;


        //hello js social login code TEST

        var debug = true;

        hello.on('auth.login', function (auth) {

            // call user information, for the given network
            hello(auth.network).api('/me').then(function (r) {

                if (debug) console.log('auth:: ', auth);
                if (debug) console.log('profile:: ', r);
                //change User after login
                randomiseMap();
                changeUser(auth, r);
            });
        });

        //add error for auth
        hello.on('auth.failed', function(r){
         if(debug)console.log('social auth error:', r);
        });

        hello.init({
            facebook: '401573586656563', ///,prod one '401573586656563',////dev one '632149183560112',
            google: '603968519862-76vtig4dk577j4nn9e1o8rt378k4kk3d.apps.googleusercontent.com',
            twitter: '1168204784'
            // windows  : 'tocome',
            ///linkedin : 'tocome'
        }, {
            oauth_proxy: 'https://auth-server.herokuapp.com/proxy',
            redirect_uri: 'http://canterburymaps.govt.nz/webapps/mapquiz/'
            ///redirect_uri: 'http://localhost:9000/index.html'
        });


        //function to post to facebook status upadate
        function FaceBookPost(network) {
            hello.login(network, {
                scope: 'publish'
            }, function () {
                // Post the contents of the form
                hello.api(network + ':/me/share', 'post', document.getElementById('activity_form'), function (r) {
                    if (!r || r.error) {
                        alert("Whoops! " + r.error.message);
                    } else {
                        // alert("Your message has been published to "+ network);
                    }
                });
            })
        };


        // Constants
        //var QUIZ = 'http://arcgisdev01/arcgis/rest/services/External/MapQuiz_Scoring_NZTM/FeatureServer/1';
        var QUIZ = 'http://arcgisprod03/arcgis/rest/services/Internal/MapQuiz_Scoring_NZTM/FeatureServer/1';
        //var SCORES = 'http://arcgisdev01/arcgis/rest/services/External/MapQuiz_Scoring_NZTM/FeatureServer/0';
        var SCORES = 'http://arcgisprod03/arcgis/rest/services/Internal/MapQuiz_Scoring_NZTM/FeatureServer/0';

        var introMaps = [
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN152_Christchurch_19411014/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|15',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer| 1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|6|18',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN2634_Christchurch_19730926/MapServer|1566808.0483418903|5179712.738343977 | 1580672.2427369456|5185163.800912769|12|15',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
        'http://gis.ecan.govt.nz/arcgis/rest/services/SimpleBasemap/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|8|12',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/Contours/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|6|8',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/NZAM_11010_Christchurch_20110224/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN1786_Christchurch_19651029/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN393_Christchurch_19460528/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN8389_Christchurch_19840928/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN872_Christchurch_19550510/MapServer|1551912.35 | 5173578.41 | 1568382.70 | 5164317.97|13|15',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/SN9381_Christchurch_19941126/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
        'http://gis.ecan.govt.nz/arcgis/rest/services/Imagery/Canterbury_Imagery_1995_1999/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|15'
        ];

        /**
 		* Returns a random number between min (inclusive) and max (exclusive)
 		*/
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        /**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var PROXY = 'proxy.ashx';
        var WIKI = 'http://en.wikipedia.org/w/api.php';


        var introMap;

        //randomise start map
        function getIntroMap() {
            introMap = introMaps[getRandomInt(1, introMaps.length - 1)];
        };

        getIntroMap();

        if (debug) console.log('introMap', introMap);

        function introMapminX()
        { return Number(introMap.split('|')[1]) };
        function introMapminY()
        { return Number(introMap.split('|')[2]) };
        function introMapmaxX()
        { return Number(introMap.split('|')[3]) };
        function introMapmaxY()
        { return Number(introMap.split('|')[4]) };

        function xpt_rand() {
            return getRandomInt(introMapminX(), introMapmaxX());
        };
        function ypt_rand() {
            return getRandomInt(introMapminY(), introMapmaxY());
        };

        function introMapStart() {
            return new Point({
                'x': xpt_rand(),
                'y': ypt_rand(),
                'spatialReference': {
                    'wkid': 2193
                }
            });
            //var defer = new $.Deferred();          
            //var _pt  = new Point({
            //    'x': xpt_rand(),
            //    'y': ypt_rand(),
            //    'spatialReference': {
            //        'wkid': 2193
            //    }
            //});
            //defer.resolve(_pt);
            ///return defer.promise();
        };

        if (debug) console.log('introMapStart', introMapStart());

        var NUMBER_OF_QUESTIONS = 20;
        var TIME_LIMIT = 10;

        var MapServerURLs = []; // for map server urls

        //load map servers urls
        //not needed now...
        //getMapServerURLs();

        var quizMapLayer = null;

        // Inidicate usage of proxy for the following hosted map services
        $.each([QUIZ, SCORES], function () {
            urlUtils.addProxyRule({
                urlPrefix: this,
                proxyUrl: PROXY
            });
        });

        // Facebook Profile
        //now is all netowrks ... not just facebook
        var _fb = null;
        var _servicetype = null;
        var _timer = null;
        var _isHome = true;
        var _games = [];
        var _gameIndex = 0;
        var _currentUsersocialthumbnailURL = null;
        var _profileName = null;

        // Resize logic
        $(window).resize(function () {
            if (map || _isHome) {
                maximizeForRotation(map);
            }
        });

        // Initialize UI
        $('#button-play').attr('disabled', 'disabled');
        $('#map').animo({
            animation: 'spinner',
            iterate: 'infinite',
            timing: 'linear',
            duration: 90
        });
        $('#banner-welcome').slideDown();
        $('#button-group-disconnected').show();
        $('.registerBusy').show();

        // Connect to FaceBook
        // $.ajaxSetup({ cache: true });
        // $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
        //     FB.init({
        //         appId: 632132856895078,//prod one '632132856895078', // dev one '632149183560112', // '533790430081552',
        //        // cookie: true,   // enable cookies to allow the server to access the session
        //         xfbml: true,   // parse social plugins on this page
        //         version: 'v2.2' // use version 2.0
        //     });
        //     FB.getLoginStatus(facebookStatusChanged);
        // });

        // Expand map so that it can rotate
        function maximizeForRotation(map) {
            var c = Math.sqrt(
                Math.pow($(window).height(), 2) +
                Math.pow($(window).width(), 2)
            );
            var h = (c - $(window).height()) / -2;
            var w = (c - $(window).width()) / -2;
            $('#' + map.id).css({
                'marginBottom': h.toString() + 'px',
                'marginTop': h.toString() + 'px',
                'marginLeft': w.toString() + 'px',
                'marginRight': w.toString() + 'px'
            });
            map.resize();
            map.reposition();
        };

        // Create map
        var map = new Map('map', {
            logo: false,
            showAttribution: false,
            slider: false,
            center: introMapStart(),
            zoom: getRandomInt(Number(introMap.split('|')[5]), Number(introMap.split('|')[6])).toString()  ///17
        });

        var baseLayer = new ArcGISTiledMapServiceLayer(introMap.split('|')[0], {
            id: 'intromap'
        });

        baseLayer.on('update-end', function () {
            //show progress 
            $('.registerBusy').hide();
            if (debug) console.log('update-end baselayer');
        });

        baseLayer.on('update-start', function () {
            //show progress 
            $('.registerBusy').show();
            if (debug) console.log('update-stART baselayer' , baseLayer.url , '::zoomlevel' , map.getZoom() , 'extent ::' , map.extent);
        });

        
        map.addLayers([baseLayer]);

        map.on('load', function () {


            // Download ids and games as soon as the map has initialized
            getQuizIds().done(function (ids) {
                var gameIds = getGameIds(ids);
                getGames(gameIds).done(function (games) {
                    _games = games;
                    $('#button-play').removeAttr('disabled');
                });
            });
        });
        maximizeForRotation(map);

        // Button events
        $('#button-login').click(function () {
            FB.login(facebookStatusChanged);
            randomiseMap();
        });
        $('#button-play').click(function () {
            _isHome = false;
            $('#banner-welcome').hide();
            $('#banner-top-high-score').html('0pt');
            playQuiz();
        });
        $('#button-highscores1, #button-highscores2').click(function () {
            _isHome = true;
            $('#banner-welcome').hide();
            $('#banner-highscore').slideDown();
            loadScores();
            randomiseMap();
        });
        $('#button-highscore-tohome').click(function () {
            _isHome = true;
            $('#banner-welcome').slideDown();
            $('#banner-highscore').hide();
            randomiseMap();
        });
        $('#button-logout').click(function () {
            //FB.logout(facebookStatusChanged);
            hello(_servicetype).logout().then(function () {

                $('#button-group-disconnected').show();
                $('#sociallogon').show();
                $('#button-group-connected').hide();
                $('#banner-top').slideUp('fast', 'swing');
                $('#banner-top-high').html('');
                $('#banner-top-rank').html('');
                $('#banner-top-life').html('');
                _servicetype = null;

            }, function (e) {
                alert("Signed out error:" + e.error.message);
            });

            randomiseMap();
        });
        $('#button-next').click(function () {
            $('#banner-welcome').hide();
            $('#banner-bottom').hide();
            $('#banner-answer').hide();
            playQuiz();
        });
        $('#button-home').click(function () {
            _isHome = true;
            $('#banner-answer').hide();
            $('#banner-bottom').hide();
            $('#banner-welcome').slideDown();

            randomiseMap();
            //maximizeForRotation(map);

            //$('#map').animo({
            //    animation: 'spinner',
            //    iterate: 'infinite',
            //    timing: 'linear',
            //    duration: 90
            //});
        });
        $('#button-newgame').click(function () {
            $('#banner-bottom').hide();
            $('#banner-answer').hide();
            $('#banner-top-high-score').html('0pt');
            playQuiz();
        });
        $('#answers > button').click(function () {
            // Stop timer
            if (_timer) {
                window.clearTimeout(_timer);
                _timer = null;
            }
            // Get duration
            _games[_gameIndex].timeEnd = Date.now();

            // Update Score
            if ($(this).html() === _games[_gameIndex].quiz.answer) {
                _games[_gameIndex].correct = true;
            } else {
                _games[_gameIndex].correct = false;
                $(this).removeClass('btn-default');
                $(this).addClass('btn-danger');
            }

            //
            showGameScore();
        });
        $('input[name="when"]').change(function () {
            loadScores();
        });
        $('input[name="who"]').change(function () {
            loadScores();
        });

        // Reset map margins
        function restoreMargins(map) {
            $('#' + map.id).css({
                'marginBottom': '0px',
                'marginTop': '0px',
                'marginLeft': '0px',
                'marginRight': '0px'
            });
            map.resize();
            map.reposition();
        };

        function randomiseMap() {

            //randomised map
            getIntroMap();
            changeBaseMap(introMap.split('|')[0], true);
            map.centerAndZoom(introMapStart(), getRandomInt(Number(introMap.split('|')[5]), Number(introMap.split('|')[6])).toString()); //was 17

            maximizeForRotation(map);

            $('#map').animo({
                animation: 'spinner',
                iterate: 'infinite',
                timing: 'linear',
                duration: 90
            });
        };

        //function facebookStatusChanged(response) {
        function changeUser(auth, r) {

            //if (response.status === 'connected') {
            if (r) {
                $('#button-group-disconnected').hide();
                $('#sociallogon').hide();
                $('#button-group-connected').show();
                $('#banner-top').slideDown('fast', 'swing');

                //set thumbnail url
                _currentUsersocialthumbnailURL = r.thumbnail;

                //facebook block & google block
                if (auth.network == 'facebook' || auth.network == 'google') {

                    //set netwwor service type
                    _servicetype = auth.network;

                    //getFacebookProfile('me').done(function (r) {
                    // first name/gender/id/last_name/link/locale/name/updated_time
                    _fb = r;
                    $('#fb-name').html(_fb.name);
                    _profileName = _fb.name;

                    // Download user statistics
                    updateStatistics();
                    //});
                    ///getFacebookPicture('me', 200).done(function (url) {
                    $('#fb-picture').css(
                        'background-image',
                        'url(\'{0}\')'.format(_fb.thumbnail)
                    );
                }

                //just facebook
                if (auth.network == 'facebook') {
                    $('#facebook-share').show();
                    $('#facebook-share').click(function () {
                        FaceBookPost('facebook');
                    });
                }

                //just google +
                if (auth.network == 'google') {
                    $('#facebook-share').hide();
                    $('#button-share').click(function () {
                        //GooglePlus();
                    });
                }

                //twitter block

                //google plus block


            } else {
                $('#button-group-disconnected').show();
                $('#button-group-connected').hide();
                $('#banner-top').slideUp('fast', 'swing');
                $('#banner-top-high').html('');
                $('#banner-top-rank').html('');
                $('#banner-top-life').html('');
            }
        };

        function getFacebookProfile(id) {
            return "";
        };

        //need to sort out a solution for these....
        function getFacebookPicture(id, size) {
            var defer = new $.Deferred();
            var url = 'http://graph.facebook.com/app_scoped_user_id/{0}/'.format(id);
            defer.resolve(url);
            return defer.promise();
        };

        function getQuizIds() {
            var defer = new $.Deferred();
            var query = new Query();
            query.where = '1=1';
            var queryTask = new QueryTask(QUIZ);
            queryTask.executeForIds(
                query,
                function (results) {
                    defer.resolve(results);
                },
                function (error) {
                    defer.reject(error);
                }
            );
            return defer.promise();
        };
        
        /**
        * Randomize array element order in-place.
        * Using Durstenfeld shuffle algorithm.
        */
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        function getGameIds(ids) {
            // Randomize
            // ids.sort(function () {
            //     return Math.round(Math.random()) - 0.5;
            // });
            ids = shuffleArray(ids);
            return ids.slice(0, NUMBER_OF_QUESTIONS);
        }

        function getGames(ids) {
            var defer = new $.Deferred();
            var query = new Query();
            query.objectIds = ids;
            query.outFields = [
                'question',
                'answer',
                'fake1',
                'fake2',
                'fake3',
                'AnswerComment',
                'wiki',
                'MapServiceURL'
            ];
            query.outSpatialReference = map.spatialReference;
            query.returnGeometry = true;
            var queryTask = new QueryTask(QUIZ);
            queryTask.execute(
                query,
                function (results) {
                    if (debug) console.log('quiz results', results);

                    var games = [];
                    $.each(results.features, function () {
                        var game = {
                            quiz: {
                                location: this.geometry,
                                question: this.attributes['question'],
                                answer: this.attributes['answer'],
                                fake1: this.attributes['fake1'],
                                fake2: this.attributes['fake2'],
                                fake3: this.attributes['fake3'],
                                AnswerComment: this.attributes['AnswerComment'],
                                wiki: this.attributes['wiki'],
                                MapServiceURL: this.attributes['MapServiceURL']
                            },
                            correct: false,
                            timeStart: null,
                            timeEnd: null,
                            score: 0
                        };
                        if (game.quiz.question &&
                            game.quiz.answer &&
                            game.quiz.fake1 &&
                            game.quiz.fake2 &&
                            game.quiz.fake3 &&
                            game.quiz.MapServiceURL &&
                            (game.quiz.wiki || game.quiz.AnswerComment)
                            ) {
                            games.push(game);
                        }
                    });
                    if (debug) console.log('games', games);
                    defer.resolve(games);
                },
                function () { }
            );
            return defer.promise();
        };

        function playQuiz() {
            var defer = new $.Deferred();

            // Clease map rotation
            $('#map').animo('cleanse');
            restoreMargins(map);

            // Restore button classes
            $('#answers > button')
                .removeClass('btn-success')
                .removeClass('btn-danger')
                .addClass('btn-default');

            // Start timer only after map has loaded
            var playing = true;
            map.on('update-end', function () {

                if (!playing) { return; }
                playing = false;

                if (debug) console.log('games', _games);

                var answers = [
                    _games[_gameIndex].quiz.answer,
                    _games[_gameIndex].quiz.fake1,
                    _games[_gameIndex].quiz.fake2,
                    _games[_gameIndex].quiz.fake3
                ];
                answers.sort(function () {
                    return Math.round(Math.random()) - 0.5;
                });

                $('#banner-bottom').slideDown('fast', 'swing');
                $('#timer').show();

                $('#question').html(_games[_gameIndex].quiz.question);
                $('#button-answer1').html(answers[0]);
                $('#button-answer2').html(answers[1]);
                $('#button-answer3').html(answers[2]);
                $('#button-answer4').html(answers[3]);
                $('#answers > button').removeAttr('disabled');

                if (_timer) {
                    clearTimeout(_timer);
                    _timer = null;
                }
                _timer = setTimeout(function () {
                    _games[_gameIndex].timeEnd = _games[_gameIndex].timeStart + TIME_LIMIT * 1000;
                    _games[_gameIndex].correct = false;
                    //_quizWrong++;
                    showGameScore();
                }, TIME_LIMIT * 1000);
                _games[_gameIndex].timeStart = Date.now();

                $('#timer-sand').animo({
                    animation: 'shift-right',
                    duration: TIME_LIMIT,
                    iterate: 1,
                    timing: 'linear'
                });
                $('#map').animo({
                    animation: 'grow',
                    duration: TIME_LIMIT,
                    iterate: 1,
                    timing: 'linear'
                });

                // Download wikipedia snippet
                $('#banner-answer-right-value').html('');

                var url = '{0}?{1}'.format(PROXY, WIKI);
                url += '?action=query';
                url += '&prop=extracts';
                url += '&format=json';
                url += '&exintro';
                url += '&rawcontinue';
                url += '&explaintext';
                url += '&titles={0}'.format(
                    _games[_gameIndex].quiz.wiki
                );

                // Display wikipedia snippet
                $.get(url, function (data) {
                    var p = data.query.pages;
                    var e = null;
                    for (var i in p) {
                        e = p[i].extract;
                        break;
                    }
                    $('#banner-answer-right-value').html(e);
                });

                defer.resolve();
            });

            // Zoom to quiz

            var _extent = _games[_gameIndex].quiz.location.getExtent();
            //_extent * .8;
            map.setExtent(_extent)

            if (debug) console.log('basemap map:', map.getLayer("intromap"));

            //change base map if not the same
            if (baseLayer.url != _games[_gameIndex].quiz.MapServiceURL) {
                changeBaseMap(_games[_gameIndex].quiz.MapServiceURL, false);
            }
            return defer.promise();
        };

        function changeBaseMap(url, changeZoom) {
            map.removeLayer(baseLayer);
            baseLayer = new ArcGISTiledMapServiceLayer(url, {
                id: 'intromap'
            });
            baseLayer.on('update-end', function () {
                //show progress 
                $('.registerBusy').hide();
                if (debug) console.log('update-end baselayer');
            });

            baseLayer.on('update-start', function () {
                //show progress 
                $('.registerBusy').show();
                if (debug) console.log('update-stART baselayer', baseLayer.url, '::zoomlevel', map.getZoom(), 'extent ::', map.extent);
            });
            map.addLayer(baseLayer);

            if (changeZoom)
                map.setZoom(getRandomInt(Number(introMap.split('|')[5]), Number(introMap.split('|')[6])).toString());  ///17

        };

        function showGameScore() {
            // Disable answer buttons
            $('#answers > button').attr('disabled', 'disabled');

            // Stop animation
            $('#timer-sand').animo('pause');
            $('#map').animo('pause');

            // Show correct answer
            $('#answers > button').each(function () {
                if ($(this).html() === _games[_gameIndex].quiz.answer) {
                    $(this).removeClass('btn-default');
                    $(this).addClass('btn-success');
                    return false;
                }
            });

            // Score dialog
            $('#banner-answer-left-answer-value').html('');
            $('#banner-answer-left-bonus-value').html('');
            $('#banner-answer-left-total-value').html('');
            $('#banner-answer').slideDown();

            // Game count
            var games = _gameIndex + 1;
            $('#banner-answer-left-question-value').html('{0}/{1}'.format(
                games.toString(),
                NUMBER_OF_QUESTIONS.toString()
            ));

            // Points for correct answer
            var award = _games[_gameIndex].correct ? 10 : 0;

            // Points for time bonus
            var bonus = 0;
            if (_games[_gameIndex].correct) {
                var e = _games[_gameIndex].timeEnd.valueOf();
                var s = _games[_gameIndex].timeStart.valueOf();
                var d = 1 - (e - s) / (TIME_LIMIT * 1000);
                bonus = Math.round(d * 10); // Ten points
            }

            // Sum of award and time bonus
            var total = award + bonus;

            // Get old and new total score
            var oldTotalScore = 0;
            var newTotalScore = 0;
            $.each(_games, function () {
                oldTotalScore += this.score;
            });
            _games[_gameIndex].score = total;
            $.each(_games, function () {
                newTotalScore += this.score;
            });

            animateLabel($('#banner-answer-left-answer-value'), 0, award).done(function () {
                animateLabel($('#banner-answer-left-bonus-value'), 0, bonus).done(function () {
                    animateLabel($('#banner-answer-left-total-value'), 0, total).done(function () {
                        animateLabel($('#banner-top-high-score'), oldTotalScore, newTotalScore).done(function () {
                            //
                        });
                    });
                });
            });

            // The "about" title
            $('#banner-answer-right-title').html('About {0}'.format(_games[_gameIndex].quiz.answer));

            // Credit link
            $('#banner-answer-right-wiki').prop(
                'href',
                'http://en.wikipedia.org/wiki/{0}'.format(_games[_gameIndex].quiz.wiki)
            );

            // Increment game index
            _gameIndex++;

            var finished = _gameIndex == _games.length;
            if (finished) {
                // Show 'home' and 'new game' buttons
                $('#banner-answer-next').hide();
                $('#banner-answer-home').show();

                // Disable 'play' and 'new game' buttons while downloading new quizes
                $('#button-play').attr('disabled', 'disabled');
                $('#button-newgame').attr('disabled', 'disabled');

                // Immediately request new game data
                getQuizIds().done(function (ids) {
                    var gameIds = getGameIds(ids);
                    getGames(gameIds).done(function (games) {
                        _games = games;
                        _gameIndex = 0;
                        $('#button-play').removeAttr('disabled');
                        $('#button-newgame').removeAttr('disabled');
                    });
                });

                var correct = 0;
                var wrong = 0;
                $.each(_games, function () {
                    if (this.correct) {
                        correct++;
                    } else {
                        wrong++;
                    }
                });

                var g = new Graphic(
                    new Point({
                        'x': 0,
                        'y': 0,
                        'spatialReference': {
                            'wkid': 102100
                        }
                    }),
                    null,
                    {
                        'fbid': _fb.id,
                        'score': newTotalScore,
                        'date': Date.now(),
                        'correct': correct,
                        'wrong': wrong,
                        'ServiceType': _servicetype,
                        'profilename': _fb.name,
                        'ThumbnailUrl': _currentUsersocialthumbnailURL
                    }
                );
                var fl = new FeatureLayer(SCORES);

                fl.applyEdits([g]).then(function () {
                    updateStatistics();
                });
            } else {
                $('#banner-answer-next').show();
                $('#banner-answer-home').hide();
            }
        };

        function animateLabel(div, from, to) {
            var defer = new $.Deferred();
            var INTERVAL = 75;
            var duration = (to - from) * INTERVAL / 1000;
            var timer = window.setInterval(
                function () {
                    div.html('{0}pt'.format(from.toString()));
                    if (from === to) {
                        window.clearInterval(timer);
                        defer.resolve();
                    }
                    from++;
                },
                INTERVAL
            );
            div.animo({
                animation: 'glow-red',
                duration: Math.max(duration, 0.5),
                iterate: 1,
                timing: 'linear'
            });
            return defer.promise();
        };

        function updateStatistics() {
            var s1 = new StatisticDefinition();
            var s2 = new StatisticDefinition();
            var s3 = new StatisticDefinition();
            s1.statisticType = 'count';
            s1.onStatisticField = 'fbid';
            s1.outStatisticFieldName = 'count_';
            s2.statisticType = 'sum';
            s2.onStatisticField = 'score';
            s2.outStatisticFieldName = 'sum_';
            s3.statisticType = 'max';
            s3.onStatisticField = 'score';
            s3.outStatisticFieldName = 'max_';

            var query = new Query();
            query.where = '1=1';
            query.returnGeometry = false;
            query.orderByFields = ['max_ DESC'];
            query.groupByFieldsForStatistics = ['fbid'];
            query.outStatistics = [s1, s2, s3];

            var queryTask = new QueryTask(SCORES);
            queryTask.execute(
                query,
                function (results) {
                    // Exit if nothing returned
                    if (!results || !results.features || results.features.length == 0) {
                        return;
                    }
                    var stats = [];
                    $.each(results.features, function () {
                        stats.push({
                            fbid: this.attributes.fbid,
                            socialthumbnailURL: this.attributes.ThumbnailUrl, //NOT REALLY NEEDED HERE?
                            max: this.attributes.max_,
                            sum: this.attributes.sum_,
                            count: this.attributes.count_
                        });
                    });

                    // Number of players:
                    var players = stats.length;

                    // Find index of current user
                    var place = 1;
                    var personalBest = 0;
                    var lifetime = 0;
                    $.each(stats, function (index) {
                        if (this.fbid == _fb.id) {
                            place = index + 1;
                            personalBest = this.max;
                            lifetime = this.sum;
                            return false;
                        }
                    });

                    // Update top banner
                    $('#banner-top-high').html('{0}pt'.format(personalBest));
                    $('#banner-top-rank').html('{0}/{1}'.format(place, players));
                    $('#banner-top-life').html('{0}pt'.format(lifetime));
                },
                function () { }
            );
        };



        function getMapServerURLs() {
            var query = new Query();
            query.where = '1=1';
            query.returnGeometry = false;
            query.returnDistinctValues = true;

            var queryTask = new QueryTask(QUIZ);
            queryTask.execute(
                query,
                function (results) {
                    // Exit if nothing returned
                    if (!results || !results.features || results.features.length == 0) {
                        return;
                    }
                    MapServerURLs = [];
                    $.each(results.features, function () {
                        MapServerURLs.push({
                            MapServerURL: this.attributes.MapServiceURL
                        });
                    });

                },
                function () { }
            );
        };

        function loadScores() {
            // Clear old scores
            $('#banner-highscore-right').empty();

            // Load new scores
            showScores().done(function (scores) {
                $.each(scores, function () {
                    var div = $(document.createElement('div'))
                        .css('display', 'inline-block')
                        .css('background', 'rgba(0, 0, 0, 0.6)')
                        .css('width', '250px')
                        .css('height', '100px')
                        .css('margin', '1em 0em 0em 1em');

                    var bas = $(document.createElement('div'))
                        .css('position', 'relative')
                        .css('top', '0px')
                        .css('left', '0px');

                    var img = $(document.createElement('div'))
                        .css('position', 'absolute')
                        .css('top', '0px')
                        .css('left', '0px')
                        .css('width', '100px')
                        .css('height', '100px')
                        .css('background-repeat', 'no-repeat');

                    var txt = $(document.createElement('div'))
                        .css('position', 'absolute')
                        .css('top', '0px')
                        .css('left', '110px');

                    var sco = $(document.createElement('div'))
                        .css('display', 'block')
                        .css('color', 'white')
                        .css('font-family', 'AvenirNextLTW01-Heavy')
                        .css('font-size', '2em')
                        .css('pointer-events', 'none')
                        .css('text-align', 'left')
                        .html(this.score + 'pt');

                    var nam = $(document.createElement('div'))
                        .css('display', 'block')
                        .css('font-weight', 'bold')
                        .css('color', 'white')
                        .css('font-size', '1em')
                        .css('pointer-events', 'none');

                    var cor = $(document.createElement('div'))
                        .css('display', 'block')
                        .css('color', 'white')
                        .css('font-size', '1em')
                        .css('pointer-events', 'none')
                        .html('{0}/{1}'.format(
                            this.correct,
                            this.correct + this.wrong
                        )
                    );

                    var dat = $(document.createElement('div'))
                        .css('display', 'block')
                        .css('color', 'white')
                        .css('font-size', '1em')
                        .css('pointer-events', 'none')
                        .html(formatDate(this.date));
                    //

                    //TODO!!! - START

                    //for name
                    var _profilename = $(document.createElement('div'))
                        .css('position', 'absolute')
                        .css('color', 'whitesmoke')
                        .css('font-size', ' 1em')
                        .css('pointer-events', 'none')
                        .css('bottom', '5px')
                        .css('left', '5px')
                        .css('overflow', 'hidden');
                    //add _profilename

                    var textnode = $(document.createTextNode(this.profilename));
                    $(_profilename).append(textnode);

                    //for name
                    $(img).append(_profilename);

                    //TODO - END !!

                    sco.appendTo(txt);
                    nam.appendTo(txt);
                    cor.appendTo(txt);
                    dat.appendTo(txt);

                    img.appendTo(bas);
                    txt.appendTo(bas);
                    bas.appendTo(div);
                    div.appendTo('#banner-highscore-right');


                    // Get Profile
                    //hello( r.network ).api( '/me' ).then( function(p){
                    //    nam.html(p.name);
                    //    img.css({
                    //        background: 'url({0})'.format(p.thumbnail)
                    //    });
                    //});

                    //update image ...
                    if (this.ThumbnailUrl) {
                        img.css({
                            background: 'url({0})'.format(this.ThumbnailUrl) + ' no-repeat'
                        });
                    }
                    //test for facebook // not needed now?
                    if (this.ServiceType == 'facebook') {

                        var _url = 'http://graph.facebook.com/' + this.fbid + '/picture';
                        img.css({
                            background: 'url({0})'.format(_url) + ' no-repeat'
                        });
                    }
                }); //end of each?
            });
        };

        function showScores() {
            var defer = new $.Deferred();
            var query = new Query();
            var where = '';

            // Hide zero scores
            where += 'score > 0';

            // Filter by time
            var d = new Date();
            if ($('#button-when-today').prop('checked')) {
                where += " AND date >= '{0}/{1}/{2}'".format(
                    d.getMonth() + 1,
                    d.getDate(),
                    d.getFullYear()
                );
            } else if ($('#button-when-month').prop('checked')) {
                where += " AND date >= '{0}/{1}/{2}'".format(
                    d.getMonth() + 1,
                    '1',
                    d.getFullYear()
                );
            } else if ($('#button-when-year').prop('checked')) {
                where += " AND date >= '{0}/{1}/{2}'".format(
                    '1',
                    '1',
                    d.getFullYear()
                );
            }

            // Filter by user
            if (_fb == null) {
                //check if exist?
                if ($('#button-who-me').prop('checked')) {
                    where += " AND fbid = '0'";
                }
            } else {
                if ($('#button-who-me').prop('checked')) {
                    where += " AND fbid = '{0}'".format(_fb.id);
                }
            }

            query.where = where;
            query.outFields = [
                'fbid',
                'score',
                'date',
                'correct',
                'wrong',
                'ServiceType',
                'ThumbnailUrl',
                'profilename'
            ];
            query.orderByFields = ['score DESC', 'correct DESC'];
            query.returnGeometry = false;
            var queryTask = new QueryTask(SCORES);
            queryTask.execute(
                query,
                function (results) {
                    var scores = [];
                    $.each(results.features, function () {
                        var score = {
                            fbid: this.attributes['fbid'],
                            score: this.attributes['score'],
                            date: this.attributes['date'],
                            correct: this.attributes['correct'],
                            wrong: this.attributes['wrong'],
                            ServiceType: this.attributes['ServiceType'],
                            ThumbnailUrl: this.attributes['ThumbnailUrl'],
                            profilename : this.attributes['profilename']
                        };
                        if (score.fbid != null &&
                            score.score != null &&
                            score.date != null &&
                            score.correct != null &&
                            score.wrong != null &&
                            score.ServiceType != null &&
                            score.ThumbnailUrl != null &&
                            score.profilename != null
                            ) {
                            scores.push(score);
                        }
                    });
                    if ($('#button-who-me').prop('checked')) {
                        defer.resolve(scores);
                    } else {
                        var userScores = {
                            fbids: [],
                            ServiceType: [],
                            ThumbnailUrl: [],
                            scores: [],
                            profilename: []
                        };
                        $.each(scores, function () {
                            var index = userScores.fbids.indexOf(this.fbid);
                            if (index == -1) {
                                userScores.fbids.push(this.fbid);
                                userScores.ServiceType.push(this.ServiceType);
                                userScores.ThumbnailUrl.push(this.ThumbnailUrl);
                                userScores.profilename.push(this.profilename);
                                userScores.scores.push(this);

                            }
                        });
                        defer.resolve(userScores.scores);
                    }
                },
                function () { }
            );
            return defer.promise();
        };
    });
});

String.prototype.format = function () {
    var s = this;
    var i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function formatDate(ticks) {
    var d = new Date(ticks);
    return '{0}/{1}/{2}'.format(
        pad((d.getMonth() + 1), 2),
        pad(d.getDate(), 2),
        d.getFullYear()
    );
};

function pad(num, size) {
    var s = num + '';
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};
