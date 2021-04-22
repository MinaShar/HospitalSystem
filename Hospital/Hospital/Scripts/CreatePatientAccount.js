function CreatePatientAccount() {

    var setup_page = function () {

        $('#LoadingImage').css({
            "display": "block"
        });

        $.ajax({
            type: "GET",
            url: "/Admin/GetCreatePatientAccount",
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                //alert(data);

                $('#LoadingImage').css({
                    "display": "none"
                });

                $(".mycontainer").html(data);

                $(".mycontainer form input[type='submit']").off('click').on('click', search);

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    }, search = function (event) {
        event.preventDefault();

        $('#LoadingImage').css({
            "display": "block"
        });

        var patientid=$(".mycontainer form input[name='patientid']").eq(0).val();


        $.ajax({
            type: "GET",
            url: "/Admin/SearchPatientByID?ID="+patientid,
            // data: formData ,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#LoadingImage').css({
                    "display": "none"
                });

                try{
                    var obj = jQuery.parseJSON(data);

                    if (obj.code) {
                        if (obj.code == -1) {
                            $('.mycontainer form .form-group.error-message').css({
                                "display": "block"
                            });
                        }
                    }
                } catch (ex) {
                    $('.mycontainer form .form-group.error-message').css({
                        "display": "none"
                    });
                    $(".mycontainer").append(data);

                    setupForm();
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

    }, setupForm = function () {
        $('.mycontainer form.example button').off('click').on('click', function (ev) {
            ev.preventDefault();
            $(".mycontainer form.example input[name='password']").val(generatePassword(8));
        });

        $(".mycontainer form.example input[name='savepassword']").off('click').on('click', saveNewPassword);
    }, generatePassword = function (length) {
        var chars = "abcdefghijklmnopqrstuvwxyz!@ABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < length; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }, saveNewPassword = function (event) {

        event.preventDefault();

        var form = $(".mycontainer form.example").eq(0);

        $.ajax({
            type: "POST",
            url: "/Admin/savePatientPassword",
            data: jQuery.param({ PatientID: form.find("input[name='patientid']").eq(0).val(), Password: form.find("input[name='password']").eq(0).val() }),
            processData: false,
            // contentType: false,
            success: function (data) {
                //MapCreationConfirmMsg
                if (data == "1") {

                    $("#deactivateBackground").toggleClass('active');
                    $(".MessageContainer").css('display', 'block');

                    $(".MessageContainer input[type=button]").off().on('click', function () {
                        //alert('Handle the click event');
                        $(".MessageContainer").css('display', 'none');
                        $("#deactivateBackground").toggleClass('active');
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

    };



    setup_page();
}