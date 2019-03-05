﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="MapQuiz.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>MapQuiz Powered by Canterbury Maps</title>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width,initial-scale=1, maximum-scale=1,user-scalable=no' />
    <meta name='author' content='Canterbury Maps' />
    <meta name='Keywords' content='Canterbury Maps, Canterbury Regional Council, Christchurch City Council, Kaikoura District Council, Hurunui District Council, Waimakariri District Council, Christchurch City Council, Selwyn District Council, Ashburton District Council, Waimate District Council, Mackenzie District Council, Timaru District Council, Waitaki District Council, Historical Maps, Geographic Information Systems, GIS, GIS Software, Mapping Software, GIS Mapping, GIS Maps, Map Software, Interactive Maps, Story Maps' />
    <meta name='Description' content='Canterbury Maps - As the name suggests, this website is all about maps and applications from the local govt councils in the Canterbury region' />
    <link type='image/ico' rel='shortcut icon' href='content/favicon.ico' />
    <link type='image/ico' rel='icon' href='content/favicon.ico' />
    <link rel="apple-touch-icon" href="//canterburymaps.govt.nz/Content/images/ios/57x57iOS.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="img/ios/72x72iOS.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="img/ios/114x114iOS.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="img/ios/144x144iOS.png" />

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous" />

    <link type='text/css' rel='stylesheet' href='css/animate-animo.css' />
    <link type='text/css' rel='stylesheet' href='//fast.fonts.com/cssapi/23855eec-5fdf-4594-9898-0113a04bfef0.css' />
    <link type='text/css' rel='stylesheet' href='//js.arcgis.com/3.27/esri/css/esri.css' />

    <link type='text/css' rel='stylesheet' href='css/index.css?20190228' />
    <link type='text/css' rel='stylesheet' href='css/index.responsive.css' />
</head>
<body>
    <div id="fb-root"></div>
    <div id='map' class='rc-full rc-disable'></div>
    <div id='banner-welcome'>
        <div id="title">
            <h1 class="display-4">mahere pātaitai</h1>
            <p class="h5">Map Quiz</p>
        </div>

        <div id="description">Test your geographic literacy for the Canterbury region</div>

        <div class="power-block">
            <a href="https://canterburymaps.govt.nz" title="Canterbury Maps" style="pointer-events: auto;">
                <p>
                    powered by 
                    <span class="block-logo"></span>
                </p>
            </a>
        </div>

        <div id='button-group-disconnected' class="btn-group pb-2">
            <i class="registerBusy glyphicon glyphicon-busy"></i>
            <button id='button-play' type='button' class='btn btn-primary btn-lg fw'>Play</button>
            <button id='button-highscores1' type='button' class='btn btn-primary btn-lg fw'>High Scores</button>
        </div>
        <div id='button-group-connected' class="btn-group">
            <i class="registerBusy glyphicon glyphicon-busy"></i>
            <button id='button-highscores2' type='button' class='btn btn-primary fw'>High Scores</button>
        </div>
    </div>

    <div id="banner-top" style="z-index: 999;">
        <a href="https://canterburymaps.govt.nz/" title="Canterbury Maps" style="z-index: 99999; pointer-events: auto;">
            <img src="img/canterbury-maps-logo-no-label-small.png" style="vertical-align: top;">
        </a>
        <div class='rc-banner-container'>
            <div class='rc-banner-label'>Your Score</div>
            <div class='rc-banner-value' id='banner-top-high-score'>0pt</div>
        </div>
        <div class='rc-banner-container'>
            <div class='rc-banner-label'>High Score</div>
            <div class='rc-banner-value' id='banner-top-high'></div>
        </div>
        <div class='rc-banner-container'>
            <div class='rc-banner-label'>Ranking</div>
            <div class='rc-banner-value' id='banner-top-rank'></div>
        </div>
        <div class='rc-banner-container d-none d-sm-inline-block'>
            <div class='rc-banner-label'>Lifetime</div>
            <div class='rc-banner-value' id='banner-top-life'></div>
        </div>
    </div>
    <div id='banner-bottom' class="container-fluid">
        <div id='timer-background'></div>
        <div id='timer-sand'></div>
        <div id='question'></div>
        <div id='answers' class="row">
            <div class="col col-6 col-md-3 py-2">
                <button id='button-answer1' type='button' class='btn btn-primary btn-block btn-answer'></button>
            </div>
            <div class="col col-6 col-md-3 py-2">
                <button id='button-answer2' type='button' class='btn btn-primary btn-block btn-answer'></button>
            </div>
            <div class="col col-6 col-md-3 py-2">
                <button id='button-answer3' type='button' class='btn btn-primary btn-block btn-answer'></button>
            </div>
            <div class="col col-6 col-md-3 py-2">
                <button id='button-answer4' type='button' class='btn btn-primary btn-block btn-answer'></button>
            </div>
        </div>
    </div>

    <div id='banner-answer'>
        <div id='banner-answer-left'>
            <div id='banner-answer-left-title'>Score</div>
            <div id='banner-answer-left-question'>
                <div id='banner-answer-left-question-label'>Progress</div>
                <div id='banner-answer-left-question-value'></div>
            </div>
            <div id='banner-answer-left-answer'>
                <div id='banner-answer-left-answer-label'>Award</div>
                <div id='banner-answer-left-answer-value'></div>
            </div>
            <div id='banner-answer-left-bonus'>
                <div id='banner-answer-left-bonus-label'>Time Bonus</div>
                <div id='banner-answer-left-bonus-value'></div>
            </div>
            <div id='banner-answer-left-total'>
                <div id='banner-answer-left-total-label'>Total</div>
                <div id='banner-answer-left-total-value'></div>
            </div>
        </div>
        <div id='banner-answer-right' class="d-none d-sm-block">
            <div id='banner-answer-right-title'></div>
            <div id='banner-answer-right-value'></div>
            <div id='banner-answer-right-credit'>
                <a id='banner-answer-right-wiki' href='http://www.wikipedia.org' target='_blank'>wikipedia</a>
            </div>
        </div>
        <div id='banner-answer-next'>
            <button id='button-next' type='button' class='btn btn-primary'>Next</button>
        </div>
        <div id='banner-answer-home'>
            <button id='button-home' type='button' class='btn btn-primary'>Home</button>
            <button id='button-newgame' type='button' class='btn btn-primary'>New Game</button>
        </div>
    </div>

    <div id='banner-highscore'>
        <div id='banner-highscore-left'>
            <div id='banner-highscore-left-title'>High Scores</div>
            <button id='button-highscore-tohome' type='button' class='btn btn-primary'>
                &lt; Back
            </button>

            <% if (ConfigurationManager.AppSettings["ui:showScoreOptions"] == "true")
                {%>

            <div id='banner-highscore-left-when'>When</div>
            <div id='banner-highscore-left-when-toggles' data-toggle='buttons'>
                <label class='btn btn-primary'>
                    <input type='radio' name='when' id='button-when-today'>
                    Today
                </label>
                <label class='btn btn-primary'>
                    <input type='radio' name='when' id='button-when-month'>
                    This Month
                </label>
                <label class='btn btn-primary'>
                    <input type='radio' name='when' id='button-when-year'>
                    This Year
                </label>
                <label class='btn btn-primary active'>
                    <input type='radio' name='when' id='button-when-all' checked>
                    All Time
                </label>
            </div>
            <div id='banner-highscore-left-who'>Who</div>
            <div id='banner-highscore-left-who-toggles' data-toggle='buttons'>
                <!--<label class='btn btn-primary'>
                    <input type='radio' name='who' id='button-who-me'> Just Me
                </label>-->
                <label class='btn btn-primary active'>
                    <input type='radio' name='who' id='button-who-everyone' checked>
                    Everyone
                </label>
            </div>
            <% } %>


            <i class="registerBusy glyphicon glyphicon-busy"></i>
        </div>
        <div id='banner-highscore-right'></div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="startGameModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Enter Your Details</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="needs-validation" id="form-details" novalidate>
                        <div class="container">
                            <div class="form-group row">
                                <div class="input-group md-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Name</span>
                                    </div>
                                    <input type="text" aria-label="Name" class="form-control" id="inputName" placeholder="Enter your name for score board" required autocomplete="off">
                                    <div class="invalid-feedback">
                                        Please enter your name.
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="input-group md-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Email Address</span>
                                    </div>
                                    <input type="email" aria-label="Email Address" class="form-control" id="inputEmail" placeholder="Enter email" required autocomplete="off">
                                    <div class="invalid-feedback">
                                        Please enter email address.
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">
                                            <input type="checkbox" aria-label="Subscribe to Canterbury Maps Newsletters" id="inputSubscribe" checked>
                                        </div>
                                    </div>
                                    <label class="form-control input-exp" for="inputSubscribe">I would like to subscribe to the Canterbury Maps newsletter</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="button-details-start">Start Game</button>
                </div>
            </div>
        </div>
    </div>

    <script defer type='text/javascript' src='//js.arcgis.com/3.27/'></script>

    <!-- check browser version browser-update.org -->
    <script> 
        var $buoop = { required: { e: -4, f: -3, o: -3, s: -1, c: -3 }, insecure: true, api: 2019.03 };
        function $buo_f() {
            var e = document.createElement("script");
            e.src = "//browser-update.org/update.min.js";
            document.body.appendChild(e);
        };
        try { document.addEventListener("DOMContentLoaded", $buo_f, false) }
        catch (e) { window.attachEvent("onload", $buo_f) }
    </script>


    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="//code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="//stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

    <script type='text/javascript' src='js/animo.js'></script>

    <!-- App settings and main functions -->
    <script defer type='text/javascript' src='index.js?20190217'></script>

    <!--<script src="https://apis.google.com/js/platform.js" async defer></script>-->
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!--<script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-3089899-26']);
        _gaq.push(['_trackPageview']);
        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    </script>-->
</body>
</html>