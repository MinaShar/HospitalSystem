function SystemMailPatients() {

    var PageSetup = function () {

        $.ajax({
            type: "GET",
            url: "/Booking/SystemMail",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $('.main-content').html(data);

                setupMailViewer();

                setUPHeadBar();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, setUPHeadBar = function () {

        var HeaderItems = $("#floating_menubar .menucontainer#topmenucontainer ul").find("li");

        HeaderItems.off('click').on('click', HandleHeaderItemsClick);

    }, HandleHeaderItemsClick = function (event) {
        event.preventDefault();

        $(this).toggleClass('active').prevAll().removeClass('active').end().nextAll().removeClass('active');

        $(this).parents('ul#topmenu').find('li').each(function (index, element) {
            $(element).find('a').removeClass('tabactive').addClass('tab');
        });

        $(this).find('a').addClass('tabactive');

        switch ($(this).data("listitem")) {
            case 'inbox':
                getInbox();
                break;
            case 'sent':
                getSentMail();
                break;
            case 'compose':
                ComposeNewMail();
                break;
        }

    }, getSentMail = function () {

        $.ajax({
            type: "GET",
            url: "/Booking/GetPatientSentMail",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#page_content').html(data);

                setupMailViewer();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, getInbox = function () {

        $.ajax({
            type: "GET",
            url: "/Booking/GetPatientInbox",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#page_content').html(data);

                setupMailViewer();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, ComposeNewMail = function () {

        $.ajax({
            type: "GET",
            url: "/Booking/GetComposeMailForm",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $("form#composeMailPatients").remove();

                $('.main-content').append(data);

                setupComposeMailForm();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, setupComposeMailForm = function () {

        var form = $("form#composeMailPatients").eq(0);

        form.find("input[name='files']").off('change').on('change', function (event) {
            event.preventDefault();
            form.find('.FilesToUploadContainer').eq(0).find('ul').html("");

            var files = $(this)[0].files;

            for (var i = 0; i < files.length; i++) {
                form.find('.FilesToUploadContainer').eq(0).find('ul').append("<li>"+files[i].name+"</li>");
            }

        });

        form.find(".close span").off('click').on('click', function (event) {
            event.preventDefault();
            form.remove();
        });

        form.find("button[type='submit']").off('click').on('click', SendNewMail);

    }, SendNewMail = function (event) {
        event.preventDefault();

        var formData = new FormData(document.getElementById("composeMailPatients"));

        var form = $("form#composeMailPatients").eq(0);

        $.ajax({
            type: "POST",
            url: "/Booking/SaveNewMessage",
            data: formData,
            //data: jQuery.param({ staff_id: form.find("input[name='StaffID']").eq(0).val(), title: form.find("input[name='title']").eq(0).val(), message: form.find("textarea#MessageTxt").val() }),
            processData: false,
            contentType: false,
            success: function (data) {
                //MapCreationConfirmMsg
                if (data == "1") {

                    $(".MessageContainer").css('display', 'block');
                    $("#deactivateBackground").toggleClass('active');

                    form.remove();

                    $(".MessageContainer").find("input[type='button']").eq(0).off('click').on('click', function (event) {
                        event.preventDefault();

                        $(".MessageContainer").css('display', 'none');
                        $("#deactivateBackground").toggleClass('active');

                    });

                } else {
                    $("#ErrorCredentials").css('display', 'block');
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

    }, setupMailViewer = function () {

        $("#page_content form#usersForm tbody tr").off('click').on('click', function (event) {
            event.preventDefault();

            var MailID = $(this).data('mailid');

            $.ajax({
                type: "GET",
                url: "/Booking/GetMail?mailid="+MailID,
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    $("#page_content").html(data);

                    //setupDownloadAttachementsFrm();

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

    }, setupDownloadAttachementsFrm = function () {
        $("#MailViewerContainer form.DownloadAttachements input[type='submit']").off('click').on('click', function (event) {
            event.preventDefault();

            var MailID = $(this).data('mailid');

            $.ajax({
                type: "GET",
                url: "/Booking/DownloadAttachements?mailid=" + MailID,
                // data: formData ,
                processData: false,
                contentType: false,
                success: function (data) {

                    //var RecievedData = $.parseJSON(data);
                    var test = data;

                    var blob = new Blob([recievedData], { type: "application/octet-stream" });
                    var fileName = "test.zip";
                    saveAs(blob, fileName);

                    //for (var i = 0; i < RecievedData.length; i++) {
                    //    var blob = new Blob( [RecievedData[i].BinaryData] , { type: "application/octet-stream" });
                    //    var fileName = RecievedData[i].OldName;
                    //    saveAs(blob, fileName);
                    //}

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
    }, saveAs = function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);

        var anchorElem = document.createElement("a");
        anchorElem.style = "display: none";
        anchorElem.href = url;
        anchorElem.download = fileName;

        document.body.appendChild(anchorElem);
        anchorElem.click();

        document.body.removeChild(anchorElem);

        // On Edge, revokeObjectURL should be called only after
        // a.click() has completed, atleast on EdgeHTML 15.15048
        setTimeout(function() {
            window.URL.revokeObjectURL(url);
        }, 1000);
    };


    PageSetup();

}