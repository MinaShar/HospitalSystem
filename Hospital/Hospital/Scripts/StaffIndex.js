(function () {

    //$('.navbar-toggle').click(function () {
    //    $('.navbar-nav').toggleClass('slide-in');
    //    $('.side-body').toggleClass('body-slide-in');
    //    $('#search').removeClass('in').addClass('collapse').slideUp(200);

    //    /// uncomment code for absolute positioning tweek see top comment in css
    //    //$('.absolute-wrapper').toggleClass('slide-in');

    //});

    //// Remove menu for searching
    //$('#search-trigger').click(function () {
    //    $('.navbar-nav').removeClass('slide-in');
    //    $('.side-body').removeClass('body-slide-in');

    //    /// uncomment code for absolute positioning tweek see top comment in css
    //    //$('.absolute-wrapper').removeClass('slide-in');

    //});

    var setup = function () {

        socket.connect();

        setup_search_frm();

        setup_socket();

        $(".SideMenuOption").off().on('click', function (event) {
            event.preventDefault();

            switch ($(this).data('sideitem')) {
                case 'createvisit':
                    //alert("now you want to create new visit");
                    CreateVisit();
                    break;
                case 'createpatient':
                    CreatePatient();
                    break;
                case 'booktime':
                    BookTime();
                    break;
                case 'manageprofile':
                    manageprofile();
                    break;
                case 'systemmail':
                    SystemMail();
                    break;
                case 'checkbookings':
                    CheckBookings();
                    break;

            }
        });
    }, BookTime = function () {

        $.ajax({
            type: "GET",
            url: "/Staff/GetPeriodsTable",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $(".container-fluid .side-body").css({
                    "width": "1390px"
                });

                $(".container-fluid .side-body").html(data);

                PeriodsTable();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    },CreatePatient = function () {

        ///////////////////////GET THE CREATE NEW PATIENT PAGE/////////////////////////
        $.ajax({
            type: "GET",
            url: "/Staff/CreateNewPatient",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $(".container-fluid .side-body").html(data);

                $('.AddNewFrm form input[name=birthdate]').datepicker({
                    autoclose:"true"
                });

                $('#create-new-patient-frm').on('submit', function (event) {
                    event.preventDefault();

                    var PatientID = $('#create-new-patient-frm input[name=id]').val();

                    var frm = $("#create-new-patient-frm")[0];
                    var formData = new FormData(frm);
                    ////////////////////////UPLOAD NEW PATIENT DATA//////////////////////
                    $.ajax({
                        type: "POST",
                        url: "/Staff/PostCreateNewPatient",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            //MapCreationConfirmMsg
                            if (data == "1") {
                                $(".MessageContainer").css('display', 'block');
                                $("#deactivateBackground").toggleClass('active');
                                $(".MessageContainer input[type=button]").off().on('click', function () {
                                    //alert('Handle the click event');
                                    $(".MessageContainer").css('display', 'none');
                                    $("#deactivateBackground").toggleClass('active');
                                    $("#LoadingImage").css('display', 'block');

                                    get_patientIDSearchResultPage(PatientID);
                                });
                            } else {
                                alert("Something error occured!");
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert('sent url= ' + this.url);
                            alert(xhr.status);
                            alert(xhr.responseText);
                            alert(thrownError);
                            document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                        }
                    });
                    /////////////////////////////////////////////////////////////////////
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });
        ///////////////////////////////////////////////////////////////////////////////

    }, setup_RecieverSocket = function () {

        socket.on('recieve message', function (data) {

            var OtherSideID = data.OtherSideID;

            if ($(".container-fluid .ChatBoxContainer").html() == "" || $('#chat_window_1 .panel-body.msg_container_base').data('anotherid') != OtherSideID) {
                OpenChatBox(OtherSideID);
                return;
            }

            $.ajax({
                type: "GET",
                url: "/Staff/GetMessageByID?id=" + data.LastMessageID,
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $(".row.chat-window .panel-body.msg_container_base").append(data);

                    ///////////////////////////BRING SCROLL DOWN/////////////////////////////
                    $('#chat_window_1 .panel-body.msg_container_base').scrollTop(jQuery("#chat_window_1 .panel-body.msg_container_base")[0].scrollHeight);
                    /////////////////////////////////////////////////////////////////////////

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });


        });

    }, setup_socket = function () {

        setup_RecieverSocket();

        $.ajax({
            type: "GET",
            url: "/Staff/CurrentSessionID",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                CurrentSessionID = data;

                alert("Curent session id Got successfully = " + CurrentSessionID);

                socket.emit('save sessionID', CurrentSessionID);

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, setup_search_frm = function () {

        $('#SearchFrm input[name=ChatSearchInput]').keyup(function () {

            if ($('#SearchFrm input[name=ChatSearchInput]').val() == '') {
                $("#ChatSearchResults").html("");
                return false;
            }

            $.ajax({
                type: "GET",
                url: "/Staff/ChatSearchResult?name=" + $('#SearchFrm input[name=ChatSearchInput]').val(),
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $("#ChatSearchResults").html(data);

                    setup_ChatSearchResult();

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        });

    }, CreateVisit = function () {
        $.ajax({
            type: "GET",
            url: "/Staff/SearchByID",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {
                $(".container-fluid .side-body").html(data);

                //////////////////////SET UP CREATE NEW PATIENT BUTTON///////////////////
                $('#search_form .CreateNewPatientLink').on('click', function (event) {
                    event.preventDefault();
                    CreatePatient();
                });
                /////////////////////////////////////////////////////////////////////////

                $('.SearchBtn').off().on('click', function () {
                    //alert("you pressed the search Btn");

                    $("#LoadingImage").css('display', 'block');

                    var PatientID = $("#PatientIDSearchInpt").val();

                    if (PatientID == "") {
                        $("#search_form .enter-valid-id-error-message").css('display', 'block');
                        return;
                    }

                    $.ajax({
                        type: "GET",
                        url: "/Staff/PatientIDSearchResult?id=" + $("#PatientIDSearchInpt").val(),
                        // data: formData ,
                        processData: false,
                        contentType: false,
                        success: function (data) {

                            $("#LoadingImage").css('display', 'none');

                            $("#SearchResultsContainer").html(data);

                            ///////////////////////SETUP THE VISITS IMAGES//////////////////////
                            set_up_VisitsImages();
                            ////////////////////////////////////////////////////////////////////

                            $("#AddNewVisitBtn").off().on('click', function () {
                                LoadCreateNewVisitPage(PatientID);
                            });
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert('sent url= ' + this.url);
                            alert(xhr.status);
                            alert(xhr.responseText);
                            alert(thrownError);
                            document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                        }
                    });

                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });
    }, LoadCreateNewVisitPage = function (PatientID) {

        $.ajax({
            type: "GET",
            url: "/Staff/CreateNewVisit",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $(".container-fluid .side-body").html(data);

                $("#AddNewVisitFrm input[name=PatientID]").val(PatientID);

                setup_createNewVisitPage();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, setup_createNewVisitPage = function () {

        $('.btn.btn-primary#create-new-visit-btn').off().on('click', function () {
            //save the new visit

            var image = document.getElementById("canvas").toDataURL("image/png");
            image = image.replace('data:image/png;base64,', '');

            var PatientID = $("#AddNewVisitFrm input[name=PatientID]").val();

            $.ajax({
                type: "POST",
                url: "/Staff/SaveVisit",
                data: jQuery.param({ PatientID: $("#AddNewVisitFrm input[name=PatientID]").val(), symptoms: $("#AddNewVisitFrm textarea[name=symptoms]").val(), prescriped: $("#AddNewVisitFrm textarea[name=prescribed]").val(), notes: $("#AddNewVisitFrm textarea[name=notes]").val(), image: image }),
                processData: false,
                // contentType: false,
                success: function (data) {
                    //MapCreationConfirmMsg
                    if (data == "1") {
                        $(".MessageContainer").css('display', 'block');
                        $("#deactivateBackground").toggleClass('active');
                        $(".MessageContainer input[type=button]").off().on('click', function () {
                            //alert('Handle the click event');
                            $(".MessageContainer").css('display', 'none');
                            $("#deactivateBackground").toggleClass('active');
                            $("#LoadingImage").css('display', 'block');

                            get_patientIDSearchResultPage(PatientID);
                        });
                    } else {
                        alert("Something error occured!");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });


        });

        var canvasDiv = document.getElementById('canvasDiv');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', '500px');
        canvas.setAttribute('height', '497px');
        canvas.setAttribute('id', 'canvas');
        $(canvas).css('position', 'fixed');
        $(canvas).css('left', '1260px');
        $(canvas).css('top', '100px');
        $(canvas).css('z-index', '0');
        $(canvasDiv).prepend(canvas);
        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");
        

        $('#canvas').off().on('mousedown', function (e) {
            canvasOffsetLeft = this.offsetLeft;
            canvasOffsetTop = this.offsetTop;
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;

            context.beginPath();
            context.moveTo(mouseX, mouseY);
            paint = true;
            //addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            redraw(mouseX, mouseY);
        });

        $('#canvas').on('mousemove', function (e) {
            if (paint) {
                //addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                var mouseX = e.pageX - canvasOffsetLeft;
                var mouseY = e.pageY - canvasOffsetTop;
                redraw(mouseX,mouseY);
            }
        });

        $('#canvas').on('mouseup' ,function (e) {
            paint = false;
        });

        $('#canvas').on('mouseleave', function (e) {
            paint = false;
        });

    }, redraw = function (X,Y) {

        //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        //context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 2;

        if (paint) {
            context.lineTo(X, Y);
            context.closePath();
            context.stroke();

            context.moveTo(X, Y);
        }
        //for (var i = 0; i < clickX.length; i++) {
        //    context.beginPath();
        //    if (clickDrag[i] && i) {
        //        context.moveTo(clickX[i - 1], clickY[i - 1]);
        //    } else {
        //        context.moveTo(clickX[i] - 1, clickY[i]);
        //    }
        //    context.lineTo(clickX[i], clickY[i]);
        //    context.closePath();
        //    context.stroke();
        //}

    }, paint = false, context, canvasOffsetLeft, canvasOffsetTop, socket = io('http://localhost:3000'), CurrentSessionID
    get_patientIDSearchResultPage = function (patientID) {
        $.ajax({
            type: "GET",
            url: "/Staff/PatientIDSearchResult?id=" + patientID,
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $("#LoadingImage").css('display', 'none');

                $(".container-fluid .side-body").html(data);

                $("#AddNewVisitBtn").off().on('click', function () {
                    LoadCreateNewVisitPage(patientID);
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });
    }, setup_ChatSearchResult = function () {

        $(".ChatSearchResultItem").off().on('click', function (event) {
            event.preventDefault();

            ////RequiredID is the id of the other side person
            var RequiredID = $(this).data('anotherid');

            $('#search.panel-collapse.collapse').toggleClass('in');

            $("#LoadingImage").css('display', 'block');

            OpenChatBox(RequiredID);

        });
    }, OpenChatBox = function (RequiredID) {


        $.ajax({
            type: "GET",
            url: "/Staff/ChatBox?id=" + RequiredID,
            // data: formData ,
            processData: false,
            async: false,
            contentType: false,
            success: function (data) {

                $("#LoadingImage").css('display', 'none');

                $(".container-fluid .ChatBoxContainer").html(data);

                $('#chat_window_1 .panel-body.msg_container_base').data('anotherid', RequiredID);

                ///////////////////////////BRING SCROLL DOWN/////////////////////////////
                $('#chat_window_1 .panel-body.msg_container_base').scrollTop(jQuery("#chat_window_1 .panel-body.msg_container_base")[0].scrollHeight);
                /////////////////////////////////////////////////////////////////////////

                $('.row.chat-window .panel.panel-default .panel-footer input[type=hidden][name=OtherSideID]').val(RequiredID);

                $('.panel-heading span.icon_minim').off().on('click', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    if (!$this.hasClass('panel-collapsed')) {
                        $this.parents('.panel').find('.panel-body').slideUp();
                        $this.addClass('panel-collapsed');
                        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
                    } else {
                        $this.parents('.panel').find('.panel-body').slideDown();
                        $this.removeClass('panel-collapsed');
                        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                    }
                });

                $('.panel-heading span.icon_close').off().on('click', function (ev) {
                    ev.preventDefault();
                    $(this).parents('.container-fluid').find('.ChatBoxContainer').html("");
                });

                $('.row.chat-window .panel.panel-default .panel-footer button#btn-chat').off().on('click', function (event) {
                    event.preventDefault();
                    ////////////////////SEND CHAT MESSAGE//////////////////
                    $.ajax({
                        type: "POST",
                        url: "/Staff/SendMessage",
                        data: jQuery.param({ OtherID: RequiredID, Message: $('.row.chat-window .panel.panel-default .panel-footer input[type=text][id=btn-input-chat]').val() }),
                        processData: false,
                        // contentType: false,
                        success: function (data) {
                            $(".row.chat-window .panel-body.msg_container_base").append(data);

                            ///////////////////////////BRING SCROLL DOWN/////////////////////////////
                            $('#chat_window_1 .panel-body.msg_container_base').scrollTop(jQuery("#chat_window_1 .panel-body.msg_container_base")[0].scrollHeight);
                            /////////////////////////////////////////////////////////////////////////

                            ///////////////////////////////GET ID OF LAST MESSAGE/////////////////////////////////
                            var LastMessageID = $("#chat_window_1 .panel-body.msg_container_base").find('.row.msg_container').last().data('chatid');
                            //////////////////////////////////////////////////////////////////////////////////////

                            socket.emit('chat message', { id: RequiredID, CurrentSessionID: CurrentSessionID, LastMessageID: LastMessageID });
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert('sent url= ' + this.url);
                            alert(xhr.status);
                            alert(xhr.responseText);
                            alert(thrownError);
                            document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                        }
                    });
                    ///////////////////////////////////////////////////////
                    $('.row.chat-window .panel.panel-default .panel-footer input[type=text][id=btn-input-chat]').val('');
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, set_up_VisitsImages = function () {
        $('.visit-image-description').each(function (index, element) {
            var canvas = document.createElement("canvas");

            var self = $(this);
            
            $(element).on('load',function () {

                canvas.width = element.width;
                canvas.height = element.height;
                canvas.getContext("2d").drawImage(element, 0, 0);

                self.parent('.visit-image-description-container').append($(canvas));

                element.outerHTML = "";
                delete element;

            });
            
        });
    };


    function manageprofile() {

        var setupProfilePage = function () {

            $("#LoadingImage").css('display', 'block');

            $.ajax({
                type: "GET",
                url: "/Staff/getProfilePage",
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $("#LoadingImage").css('display', 'none');

                    $(".container-fluid .side-body").html(data);

                    setupProfileFrm();

                    $(".container-fluid .side-body form.profileFrm input[name='userprofileimg']").off('change').on('change',updateProfileImg );

                    $(".container-fluid .side-body form.profileFrm button[type='submit']").off('click').on('click', saveProfile);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, saveProfile = function (event) {

            event.preventDefault();

            var form = $(".container-fluid .side-body form.profileFrm").eq[0];

            var formData = new FormData();
            var img = $(".container-fluid .side-body form.profileFrm input[name='userprofileimg']")[0].files[0];
            if ($(".container-fluid .side-body form.profileFrm input[name='userprofileimg']")[0].files[0]) {
                formData.append('profileImg', $(".container-fluid .side-body form.profileFrm input[name='userprofileimg']")[0].files[0]);
            }
            formData.append('name', $(".container-fluid .side-body form.profileFrm input[name='name']").val());
            formData.append('password', $(".container-fluid .side-body form.profileFrm input[name='password']").val());

            $.ajax({
                type: "POST",
                url: "/Staff/saveProfile",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    //MapCreationConfirmMsg
                    if (data == "1") {
                        $(".MessageContainer").css('display', 'block');
                        $(".MessageContainer input[type=button]").off().on('click', function () {
                            //alert('Handle the click event');
                            $(".MessageContainer").css('display', 'none');

                        });
                    } else {
                        alert("Something error occured!");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });


        }, setupProfileFrm = function () {

            $(".container-fluid .side-body form.profileFrm img.avatar").off('click').on('click', uploadImgHandler);

        }, uploadImgHandler = function (event) {
            event.preventDefault();
            $(".container-fluid .side-body form.profileFrm input[name='userprofileimg']").trigger('click');
        },updateProfileImg = function(){ 
            $(".container-fluid .side-body form.profileFrm img.avatar").attr('src', $(".container-fluid .side-body form.profileFrm input[name='userprofileimg']").val());
        };

        setupProfilePage();
    };

    $(document).ready(function () {
        setup();
    });


    //alert("the script is ready!");

})();