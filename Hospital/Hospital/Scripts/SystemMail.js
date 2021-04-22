function SystemMail() {
    var setupPage = function () {

        $.ajax({
            type: "GET",
            url: "/Staff/MailPage",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                //$(".container-fluid").css({
                //    "width": "100%"
                //});
                //$(".container-fluid .side-body").css({
                //    "width": "84.8%"
                //});

                //$(".container-fluid .side-body").css({
                //    "margin-left": "285px"
                //});

                $(".container-fluid .side-body").html(data);

                $("#floating_menubar").css({
                    "margin-left": "300px"
                });

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
            url: "/Staff/GetStaffSentMail",
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
            url: "/Staff/getInbox",
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
            url: "/Staff/GetComposeMailFrm",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $("form#composeMailStaff").remove();

                $('body .row').append(data);

                SetupComposeForm();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, SetupComposeForm = function () {

        var form = $("form#composeMailStaff");

        form.find("input[name='files']").off('change').on('change', function (event) {
            event.preventDefault();
            form.find('.FilesToUploadContainer').eq(0).find('ul').html("");

            var files = $(this)[0].files;

            for (var i = 0; i < files.length; i++) {
                form.find('.FilesToUploadContainer').eq(0).find('ul').append("<li>" + files[i].name + "</li>");
            }

        });

        form.find('button.close').off('click').on('click', function (event) {
            event.preventDefault();
            form.remove();
        });

        form.find("button[type='submit']").off('click').on('click', SaveNewMessage);

    }, SaveNewMessage = function (event) {
        event.preventDefault();

        var form = $("form#composeMailStaff");

        var formData = new FormData(document.getElementById("composeMailStaff"));

        $.ajax({
            type: "POST",
            url: "/Staff/SaveNewMessage",
            data: formData,
            //data: jQuery.param({ patient_id: form.find("input[name='PatientID']").eq(0).val(), title: form.find("input[name='title']").eq(0).val(), message: form.find("textarea#MessageTxt").val() }),
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
                url: "/Staff/GetMail?mailid=" + MailID,
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

    };

    setupPage();
}