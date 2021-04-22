(function () {

    var set_up = function () {

        var form = $('#RequiredForm');
        var input = $('#RequiredForm input[type=submit]');

        $('#RequiredForm input[type=submit]').off('click').on('click', function (event) {

            event.preventDefault();

            var submit_from = true;

            $(".required1").each(function (index, element) {
                if ($(element).val() == "") {
                    submit_from = false;
                    $("#ErrorMessage").css('display', 'block');
                    return;
                }
            });
           

            //if (submit_from == true) {
            //    if ($("#RequiredForm input[name=type]:checked").val() == null) {
            //        submit_from = false;
            //        $("#ErrorMessage").css('display', 'block');
            //    }
            //}

            if (submit_from == true) {

                $.ajax({
                    type: "POST",
                    url: "/BookingAuth/TestLogin",
                    data: jQuery.param({ id: $("#RequiredForm input[name='patientid']").val(), password: $("#RequiredForm input[name='password']").val() }),
                    processData: false,
                    // contentType: false,
                    success: function (data) {
                        //MapCreationConfirmMsg
                        if (data == "1") {
                            $("#RequiredForm").submit();
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

            }
        });

    };

    $(document).ready(function () {
        set_up();
    });

})();