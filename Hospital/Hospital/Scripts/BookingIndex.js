(function () {

    var setup = function () {
        $('.menuitem').off('click').on('click', function (event) {
            event.preventDefault();
            switch ($(this).data('sidemenu')) {
                case 'booktime':
                    bookTime();
                    break;
                case 'reminder':
                    Reminder();
                    break;
                case 'systemmail':
                    SystemMailPatients();
                    break;
            }
        });

        getEntranceMessage();

    }, getEntranceMessage = function () {

        $.ajax({
            type: "GET",
            url: "/Booking/GetEntranceMessage",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                if (data=="null") {
                    return;
                }

                var requiredMessage = $.parseJSON(data);
                var Message = "Don't forget that you have today <br>";
                for (var i = 0; i < requiredMessage.Records.length; i++) {
                    Message += "from : " + requiredMessage.Records[i].from + " meeting with Dr." + requiredMessage.Records[i].staff + "<br>";
                }

                $(".MessageCard .container p").html(Message);
                $(".MessageCard").css({
                    "display": "block"
                });

                $(".MessageCard .close").off('click').on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('.MessageCard').css({
                        "display": "none"
                    });
                });

                //setTimeout(function () {

                //    $(".MessageCard").css({
                //        "display": "none"
                //    });

                //}, 10000);

                $('.MessageCard').off('click').on('click', HandleMessageClick);

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, HandleMessageClick = function (event) {
        event.preventDefault();
        $("[data-sidemenu='reminder']").trigger('click');
    };

    function Reminder() {

        var setupPage = function () {

            $.ajax({
                type: "GET",
                url: "/Booking/GetReminder",
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $('.main-content').html(data);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        };

        setupPage();
    }

    function bookTime() {

        var setupPage = function () {

            $.ajax({
                type: "GET",
                url: "/Booking/bookTimePage",
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $('.main-content').html(data);

                    $('.card').off('click').on('click', moveToSecondStep);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, StaffIDSelected, WeekIDSelected, DaySelected, PeriodSelected
        , moveToSecondStep = function (event) {
            event.preventDefault();
            StaffIDSelected = $(this).attr('data-staffid');


            $.ajax({
                type: "GET",
                url: "/Booking/getWeeks",
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $('.main-content').html(data);

                    $('.card').off('click').on('click', moveToThirdStep);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, moveToThirdStep = function (event) {
            event.preventDefault();
            WeekIDSelected = $(this).attr('data-weekid');

            setupTable();


        }, setupTable = function () {

            $.ajax({
                type: "GET",
                url: "/Booking/getPeriodicTable",
                // data: formData ,
                processData: false,
                async: false,
                contentType: false,
                success: function (data) {

                    $('.main-content').html(data);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

            $.ajax({
                type: "GET",
                url: "/Booking/getStaffPeriodicTable?staffid=" + StaffIDSelected,
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    var BookingsOnly;

                    ///////////////////////////GET THE BOOKINGS IN THE CURRENT TABLE////////////////////////////////
                    $.ajax({
                        type: "GET",
                        url: "/Booking/getBookingsInCurrentTable?staffid=" + StaffIDSelected + "&weekid=" + WeekIDSelected,
                        // data: formData ,
                        processData: false,
                        async: false,
                        contentType: false,
                        success: function (data2) {

                            BookingsOnly = data2;

                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert('sent url= ' + this.url);
                            alert(xhr.status);
                            alert(xhr.responseText);
                            alert(thrownError);
                            document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                        }
                    });
                    ////////////////////////////////////////////////////////////////////////////////////////////////

                    var table = $(".main-content table").eq(0);

                    var tableData = $.parseJSON(data);
                    var BookingsData = $.parseJSON(BookingsOnly);

                    for (var i = 0; i < tableData.length; i++) {
                        table.find('.table-data').each(function (index, element) {
                            if ($(element).data("day") == tableData[i].Day && $(element).data("period") == tableData[i].Period) {
                                $(element).html("Click here to Book!");
                                $(element).css({
                                    "background": "#f4b342"
                                });
                            }
                        });
                    }

                    ///////////////////////////PRINT BOOKINGS/////////////////////////////
                    for (var i = 0; i < BookingsData.length; i++) {
                        table.find('.table-data').each(function (index, element) {
                            if ($(element).data("day") == BookingsData[i].Day && $(element).data("period") == BookingsData[i].Period) {
                                $(element).html("Click to remove your booking!");
                                $(element).css({
                                    "background": "#d11238"
                                });
                            }
                        });
                    }
                    //////////////////////////////////////////////////////////////////////

                    /////////////////////////////////BIND EVENTS////////////////////////////////////
                    var table = $(".main-content table").eq(0);

                    table.find('.table-data').off('click').on('click', tableDataClickHandler);
                    ////////////////////////////////////////////////////////////////////////////////

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, tableDataClickHandler = function (event) {
            event.preventDefault();

            if ($(this).html() == "") {
                return;
            }

            DaySelected = $(this).attr("data-day");
            PeriodSelected = $(this).attr("data-period");

            $.ajax({
                type: "GET",
                url: "/Booking/checkThisPeriodIsBookedOrNot?staffid=" + StaffIDSelected + "&weekid=" + WeekIDSelected + "&day=" + DaySelected + "&period=" + PeriodSelected,
                // data: formData ,
                processData: false,
                async: false,
                contentType: false,
                success: function (data2) {
                    if (data2 == 1) {
                        //alert("Aha , you are booking");

                        $("#UnBookingConfirmation").modal("show");

                        $("#UnBookingConfirmation .btn.btn-primary").off('click').on('click', deleteBook);


                    } else if (data2 == -1) {
                        //alert("You are not booking");

                        $("#BookingConfirmation").modal("show");

                        $("#BookingConfirmation .btn.btn-primary").off('click').on('click', saveNewBook);

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
        }, saveNewBook = function () {

            var formData = new FormData();

            formData.append("weekid", WeekIDSelected);
            formData.append("day", DaySelected);
            formData.append("period", PeriodSelected);
            formData.append("staffid", StaffIDSelected);

            $.ajax({
                type: "POST",
                url: "/Booking/saveNewBook",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    //MapCreationConfirmMsg
                    if (data == "1") {
                        setupTable();
                    } else {
                        alert("Something error happened");
                    }

                    $("#BookingConfirmation").modal("hide");
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, deleteBook = function () {

            var formData = new FormData();

            formData.append("weekid", WeekIDSelected);
            formData.append("day", DaySelected);
            formData.append("period", PeriodSelected);
            formData.append("staffid", StaffIDSelected);

            $.ajax({
                type: "POST",
                url: "/Booking/deleteBook",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    //MapCreationConfirmMsg
                    if (data == "1") {
                        setupTable();
                    } else {
                        alert("Something error happened");
                    }

                    $("#UnBookingConfirmation").modal("hide");
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        };

        setupPage();
    }

    $(document).ready(function () {
        setup();
    })
})();