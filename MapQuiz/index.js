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

        var _games = [];
        var _gameIndex = 0;
        var _isHome = true;
        var _timer = null;
        var _fb = null;

        // Constants
        var QUIZ = 'https://ecanmapstest.ecan.govt.nz/server/rest/services/Hosted/MapQuiz/FeatureServer/0';
        var SCORES = 'https://ecanmapstest.ecan.govt.nz/server/rest/services/Hosted/MapQuiz/FeatureServer/1';

        var introMaps = [
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN152_Christchurch_19411014/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1343132.8424653546|5053301.037649063|1458491.406515816|5126326.183699355|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1382820.4218405131|5095634.4556492325|1479128.9477908984|5177126.285299559|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1438383.0329657355|5132147.028674379|1530987.384841106|5215226.361499711|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1486008.128215926|5144847.05407443|1576495.809191288|5246447.257274836|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1582316.6541663113|5141672.047724417|1606129.2017914066|5170247.104874532|6|18',
            '//gis.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1541570.7393411482|5232159.728699779|1607716.7049664129|5299364.029775048|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1631529.252591508|5302009.868400059|1660104.3097416223|5322118.241950139|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1651637.6261415887|5324764.0805751495|1674921.0060416816|5346459.957300236|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1610362.5435914234|5262322.2890249|1635233.4266665229|5293014.017075023|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1564854.1192412414|5300951.532950054|1585491.660516324|5322647.409675141|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1393403.7763405556|5008850.948748886|1454787.232440801|5045892.689499034|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/MapServer|1400812.1244905852|4959109.182598687|1434149.6911657185|4998796.761973846|6|18',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN2634_Christchurch_19730926/MapServer|1566808.0483418903|5179712.738343977 | 1580672.2427369456|5185163.800912769|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Topoimagery/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|12|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/SimpleBasemap/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|8|12',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/Contours/MapServer|1511924.435624478 | 5153780.60467797 | 1591299.5943747954 |5231435.968322029|6|8',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN1786_Christchurch_19651029/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN393_Christchurch_19460528/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN8389_Christchurch_19840928/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN872_Christchurch_19550510/MapServer|1551912.35 | 5173578.41 | 1568382.70 | 5164317.97|13|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/SN9381_Christchurch_19941126/MapServer|1561912.35 | 5183578.41 | 1578382.70 | 5174317.97|13|16',

            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1438383.0329657355|5132147.028674379|1530987.384841106|5215226.361499711|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1486008.128215926|5144847.05407443|1576495.809191288|5246447.257274836|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1582316.6541663113|5141672.047724417|1606129.2017914066|5170247.104874532|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1541570.7393411482|5232159.728699779|1607716.7049664129|5299364.029775048|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1631529.252591508|5302009.868400059|1660104.3097416223|5322118.241950139|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1651637.6261415887|5324764.0805751495|1674921.0060416816|5346459.957300236|6|15',
            '//gisbasmap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1610362.5435914234|5262322.2890249|1635233.4266665229|5293014.017075023|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1564854.1192412414|5300951.532950054|1585491.660516324|5322647.409675141|6|15',
            '//gisbasemap.ecan.govt.nz/arcgis/rest/services/Imagery/TL_Ortho75_Canterbury/MapServer|1393403.7763405556|5008850.948748886|1454787.232440801|5045892.689499034|6|15'
        ];


        /**
 		* Returns a random number between min (inclusive) and max (exclusive)
        * @param {int} min - Minimum number the value can take
        * @param {int} max - Maximum number the value can take
        * @returns {int} - random number
 		*/
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        /**
        * Returns a random integer between min (inclusive) and max (inclusive)
        * Using Math.round() will give you a non-uniform distribution!
        * @param {int} min - Minimum number the value can take
        * @param {int} max - Maximum number the value can take
        * @returns {int} - random number
        */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var PROXY = 'proxy.ashx';
        var WIKI = 'https://en.wikipedia.org/w/api.php';

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
        };

        if (debug) console.log('introMapStart', introMapStart());

        var NUMBER_OF_QUESTIONS = 6;
        var TIME_LIMIT = 10;

        var MapServerURLs = []; // for map server urls

        var quizMapLayer = null;

        // Inidicate usage of proxy for the following hosted map services
        $.each([QUIZ, SCORES], function () {
            urlUtils.addProxyRule({
                urlPrefix: this,
                proxyUrl: PROXY
            });
        });

        // Resize logic
        $(window).resize(function () {
            if (map || _isHome) {
                maximizeForRotation(map);
            }
        });

        // Initialize UI
        //$('#button-play').attr('disabled', 'disabled');
        $('#map').animo({
            animation: 'spinner',
            iterate: 'infinite',
            timing: 'linear',
            duration: 90
        });
        $('#banner-welcome').slideDown();
        $('#button-group-disconnected').show();
        $('.registerBusy').show();

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
        $('#button-play').click(function () {
            //showlogin
            $('#startGameModal').modal({
                keyboard: false
            });
        });

        $('#button-details-start').click(function () {
            $('#startGameModal').modal('hide');

            _isHome = false;
            $('#banner-welcome').hide();
            $('#banner-top-high-score').html('0pt');

            _fb = {
                id: $('#inputEmail').val().toLowerCase().hashCode(),
                name: $('#inputName').val(),
                email: $('#inputEmail').val(),
                subscribe: $('#inputSubscribe').attr("checked")
            };

            changeUser(true);

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

            changeUser(false);

            randomiseMap();
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
            console.log('randomise map: ', introMap);
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

        function changeUser(r) {

            if (r) {
                $('#button-group-disconnected').hide();
                $('#sociallogon').hide();
                $('#button-group-connected').show();
                $('#banner-top').slideDown('fast', 'swing');
                // Download user statistics
                updateStatistics();
            } else {
                _fb = null;
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

        function getGameIds(ids) {
            // Randomize
            ids.sort(function () {
                return Math.round(Math.random()) - 0.5;
            });
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
                'answercomment',
                'wiki',
                'mapserviceurl'
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
                                AnswerComment: this.attributes['answercomment'],
                                wiki: this.attributes['wiki'],
                                MapServiceURL: this.attributes['mapserviceurl'].replace('https:', '').replace('http:','')
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
            var mapUpdate = map.on('update-end', function () {
                mapUpdate.remove();
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
            }
                , function (error) {
                    if (debug) console.log('map update:', error);
                }
            );

            // Zoom to quiz

            var _extent = _games[_gameIndex].quiz.location.getExtent();
            map.setExtent(_extent);

            if (debug) console.log('basemap map:', map.getLayer("intromap"));
            
            //change base map if not the same
            if (baseLayer.url.replace('https:','').replace('http','') !== _games[_gameIndex].quiz.MapServiceURL) {
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

            var finished = _gameIndex === _games.length;
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
                    null,
                    null,
                    {
                        'fbid': _fb.id,
                        'score': newTotalScore,
                        'date': Date.now(),
                        'correct': correct,
                        'wrong': wrong,
                        'servicetype': null,
                        'profilename': _fb.name,
                        'thumbnailurl': null,
                        'subscribetonewsletter ': _fb.subscribe,
                        'contactaddress': _fb.email
                    }
                );
                var fl = new FeatureLayer(SCORES);

                fl.applyEdits([g]).then(
                    function () {
                        updateStatistics();
                    },
                    function (error) {
                        if (debug) console.log('score apply edits:',error);
                    }
                );
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
            //query.orderByFields = ['max_ DESC'];
            query.groupByFieldsForStatistics = ['fbid'];
            query.outStatistics = [s1, s2, s3];

            var queryTask = new QueryTask(SCORES);
            queryTask.execute(
                query,
                function (results) {
                    // Exit if nothing returned
                    if (!results || !results.features || results.features.length === 0) {
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
                        if (this.fbid === _fb.id) {
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
            query.outFields = ['mapserviceurl'];

            var queryTask = new QueryTask(QUIZ);
            queryTask.execute(
                query,
                function (results) {
                    // Exit if nothing returned
                    if (!results || !results.features || results.features.length === 0) {
                        return;
                    }
                    MapServerURLs = [];
                    $.each(results.features, function () {
                        MapServerURLs.push({
                            MapServerURL: this.attributes.mapserviceurl
                        });
                    });

                },
                function (error) {
                    if (debug) console.log('get map server urls:',error);
                }
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

                    //update image ...
                    //if (this.ThumbnailUrl) {
                    //    img.css({
                    //        background: 'url({0})'.format(this.ThumbnailUrl) + ' no-repeat'
                    //    });
                    //}
                    img.css({
                           background: 'url({0})'.format('img/avatar-1577909_100.png') + ' no-repeat'
                    });


                    //test for facebook // not needed now?
                    if (this.ServiceType === 'facebook') {

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
            if (_fb === null) {
                //check if exist?
                //if ($('#button-who-me').prop('checked')) {
                //    where += " AND fbid = '0'";
                //}
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
                'servicetype',
                'thumbnailurl',
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
                            ServiceType: this.attributes['servicetype'],
                            ThumbnailUrl: this.attributes['thumbnailurl'],
                            profilename : this.attributes['profilename']
                        };
                        if (score.fbid !== null &&
                            score.score !== null &&
                            score.date !== null &&
                            score.correct !== null &&
                            score.wrong !== null &&
                            //score.ServiceType !== null &&
                            //score.ThumbnailUrl !== null &&
                            score.profilename !== null
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
                            if (index === -1) {
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

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function formatDate(ticks) {
    var d = new Date(ticks);
    return '{1}/{0}/{2}'.format(
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
