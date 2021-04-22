(function () {

    var setup = function () {
        $('.collapse.navbar-collapse .sidelink').off().on('click', function (event) {
            event.preventDefault();
            $(this).parent('li').addClass('active').prevAll().removeClass('active').end().nextAll().removeClass('active');
            switch ($(this).data('link')) {
                case 'currentworks':
                    $('.mycontainer').html('');
                    currentworks();
                    break;
                case 'addnewuser':
                    $('.mycontainer').html('');
                    getAddNewUserfrm();
                    break;
                case 'currentworksinbarline':
                    BarLine();
                    break;
                case 'createpatientaccount':
                    CreatePatientAccount();
                    break;
            }
        });
    }, currentworks = function () {

        $('#LoadingImage').css({
            "display": "block"
        });
        
        $.ajax({
            type: "GET",
            url: "/Admin/StaffWorks",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                //alert(data);

                $('#LoadingImage').css({
                    "display": "none"
                });

                var array = $.parseJSON(data);

                var allNumberOfVisists = [];
                var allLabels = [];

                for (var i = 0; i < array.length; i++) {
                    allNumberOfVisists.push(array[i].NumberOfVisits);
                    allLabels.push(array[i].Name);
                }

                Pie(allLabels, allNumberOfVisists);

                
                ///////////////////////////////THE OLD CHART//////////////////////////////////////
                //var mychart = new Piechart({
                //    data : array,
                //    colors: ["#fde23e", "#f16e23", "#57d9ff", "#937e88"]
                //});
                //mychart.draw();
                //////////////////////////////////////////////////////////////////////////////////



                print_current_works_table(array);
                //$.each(array, function (index,item) {
                //    alert(index + ' => ' + item.Name + ' , ' + item.NumberOfVisits);
                //});

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, print_current_works_table = function (data) {
        var table = $("<div style='position: absolute;left: 1200px;top: 85px;width:380px;'>" +
                        "<div class='row'>" +
                            "<div class='col-sm-4' style='width:100%;'>" +
	                            "<div class='single category'>" +
		                            "<h3 class='side-title'>Number of visits</h3>" +
		                            "<ul class='list-unstyled'>" +
                                    "</ul>" +
                                 "</div>" +
                            "</div>" +
                         "</div>" +
                     "</div>");

        $.each(data, function (index, element) {
            table.find('.list-unstyled').append("<li><a href='' onclick='return void(0);' title=''>" + element.Name + "<span class='pull-right'>" + element.NumberOfVisits + "</span></a></li>");
        });

        $('.mycontainer').append(table);

    }, getAddNewUserfrm = function () {

        $('#LoadingImage').css({
            "display": "block"
        });

        $.ajax({
            type: "GET",
            url: "/Admin/AddNewUserFrm",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#LoadingImage').css({
                    "display": "none"
                });

                $('.mycontainer').html(data);

                SetupAddNewUserFrm();

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


    $(document).ready(function () {
        setup();
    });

})();