function BarLine() {

    $('.mycontainer').html("");

    var canvasParent = $("<div></div>");
    canvasParent.css({
        "position": "absolute",
        "width": "1000px",
        "left":"300px"
    });

    canvasParent.appendTo('.mycontainer');

    $("<canvas id='myChart' style='position:absolute;'></canvas>").appendTo(canvasParent);

    var ctx = document.getElementById('myChart').getContext('2d');

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
            labels = [];
            for (var i = 0; i < array.length; i++) {
                labels.push(array[i].Name);
            }
            visits = [];
            for (var i = 0; i < array.length; i++) {
                visits.push(array[i].NumberOfVisits);
            }

            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [{
                        label: "# of visits",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: visits,
                    }]
                },

                // Configuration options go here
                options: {}
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
}