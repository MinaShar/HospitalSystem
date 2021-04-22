function CheckBookings() {

    var getWeeks = function () {

        $.ajax({
            type: "GET",
            url: "/Staff/getWeeks",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $(".container-fluid .side-body").css({
                    "width": "1390px"
                });

                $(".container-fluid .side-body").html(data);

                SetupCardViews();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, SetupCardViews = function () {

        $(".container-fluid .side-body .card").off('click').on('click', function (event) {
            event.preventDefault();
            SelectedWeekID = $(this).data('weekid');

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

                    PrintTable();

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

    }, SelectedWeekID
    , PriorPrintingTable = function () {
        var table = $(".container-fluid .side-body table");
        table.find('.table-data').each(function (index, element) {
            $(element).html("").css({
                "background": "#ffffff"
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

                var table = $(".container-fluid .side-body table");

                var tableData = jQuery.parseJSON(data);

                for (var i = 0; i < tableData.length; i++) {
                    table.find('.table-data').each(function (index, element) {
                        if ($(element).data("day") == tableData[i].Day && $(element).data("period") == tableData[i].Period) {
                            $(element).html("Show Reserves");
                            $(element).off('click').on('click', ViewReservers);
                            $(element).css({
                                "background": "#f4b342"
                            });
                        }
                    });
                }

                //$('#NewPeriodModal').modal('hide')

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

    }, ViewReservers = function (event) {
        event.preventDefault();

        var Day = $(this).data('day');
        var Period = $(this).data('period');
        var WeekID = SelectedWeekID;

        var formData = new FormData();
        formData.append("day", Day);
        formData.append("period", Period);
        formData.append("weekid", WeekID);


        $.ajax({
            type: "POST",
            url: "/Staff/ViewReservers",
            data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $(".container-fluid .side-body").css({
                    "width": "1390px"
                });

                $(".container-fluid .side-body").html(data);

                $(".ReturnBackBtn").off('click').on('click', function (event) {
                    event.preventDefault();
                    getWeeks();
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
    };

    getWeeks();
}