function PeriodsTable() {

    $(document).on('contextmenu', function (ev) {
        ev.preventDefault();
    });

    var table = $(".container-fluid .side-body").find('table').eq(0),
        daySelected,periodSelected,is_right_menue_opened = false,
        setup_each_period = function () {
            table.find('.table-data').off('mousedown').on('mousedown', function (ev) {
                ev.preventDefault();

                if ($(this).html() == "" && ev.button == 0 ) {
                    $('#NewPeriodModal').modal('show');

                    daySelected = $(this).data('day');
                    periodSelected = $(this).data('period');

                    $("#NewPeriodModal .saveData").off('click').on('click', save_new_period);
                } else if (ev.button == 2 && $(this).html() != "") {
                    daySelected = $(this).data("day");
                    periodSelected = $(this).data("period");
                    offer_removing_period(ev);
                }
            });
        }, offer_removing_period = function (event) {

            is_right_menue_opened = true;

            $('.OfferRemovingPeriod').css({
                "left": event.pageX + "px",
                "top": event.pageY + "px",
                "display":"block"
            });

            $('.OfferRemovingPeriod .remove').off('click').on('click', function (event) {
                event.preventDefault();

                $.ajax({
                    type: "POST",
                    url: "/Staff/deletePeriod",
                    data: jQuery.param({ Day: daySelected, Period: periodSelected }),
                    processData: false,
                    // contentType: false,
                    success: function (data) {
                        //MapCreationConfirmMsg
                        if (data == "1") {
                            PrintTable();
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

        },save_new_period = function (event) {
            event.preventDefault();

            
            $.ajax({
                type: "POST",
                url: "/Staff/saveNewPeriod",
                data: jQuery.param({ Day: daySelected, Period: periodSelected }),
                processData: false,
                // contentType: false,
                success: function (data) {
                    //MapCreationConfirmMsg
                    if (data == "1") {
                        PrintTable();
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

        }, PriorPrintingTable = function () {
            table.find('.table-data').each(function (index, element) {
                $(element).html("").css({
                    "background":"#ffffff"
                });
            });
        }, PrintTable = function () {

            $("#LoadingImage").css('display', 'block');

            $.ajax({
                type: "GET",
                url: "/Staff/GetStaffTable",
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {
                    PriorPrintingTable();

                    var tableData = jQuery.parseJSON(data);

                    for (var i = 0; i < tableData.length; i++) {
                        table.find('.table-data').each(function (index, element) {
                            if ($(element).data("day") == tableData[i].Day && $(element).data("period") == tableData[i].Period) {
                                $(element).html("Reserved");
                                $(element).css({
                                    "background": "#f4b342"
                                });
                            }
                        });
                    }

                    $('#NewPeriodModal').modal('hide')

                    $("#LoadingImage").css('display', 'none');

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('sent url= ' + this.url);
                    alert(xhr.status);
                    alert(xhr.responseText);
                    alert(thrownError);
                    document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
                }
            });

        }, close_right_menu = function () {
            $('.OfferRemovingPeriod').css({
                "display": "none"
            });
            is_right_menue_opened = false;
        };

    setup_each_period();
    PrintTable();

    $(document).on('click', function (event) {
        if (is_right_menue_opened == true) {
            close_right_menu();
        }
    });
}