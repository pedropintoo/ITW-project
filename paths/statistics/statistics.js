function ViewModel(){
    var self = this;

    self.Competitions



    //For the tabs
    self.tabs = ko.observable(1)
    self.tabs.subscribe(function (id) {
        $('#myChart').remove();
        $('#myChart2').remove();
        $('#graph').append('<canvas id="myChart"></canvas>');
        $('#graph2').append('<canvas id="myChart2"></canvas>');
        if(id == 1){
            $("#tab1").addClass("active");
            $("#tab2").removeClass("active");
            $("#tab3").removeClass("active");
            $("#tab4").removeClass("active");
            $("#tab1").removeClass("text-dark");
            $("#tab1").addClass("text-danger");
            $("#tab2").addClass("text-dark");
            $("#tab2").removeClass("text-danger");
            $("#tab3").addClass("text-dark");
            $("#tab3").removeClass("text-danger");
            $("#tab4").addClass("text-dark");
            $("#tab4").removeClass("text-danger");
        }else if(id == 2){
            $("#tab2").addClass("active");
            $("#tab1").removeClass("active");
            $("#tab3").removeClass("active");
            $("#tab4").removeClass("active");
            $("#tab2").removeClass("text-dark");
            $("#tab2").addClass("text-danger");
            $("#tab1").addClass("text-dark");
            $("#tab1").removeClass("text-danger");
            $("#tab3").addClass("text-dark");
            $("#tab3").removeClass("text-danger");
            $("#tab4").addClass("text-dark");
            $("#tab4").removeClass("text-danger");
        }else if(id == 3){
            $("#tab3").addClass("active");
            $("#tab1").removeClass("active");
            $("#tab2").removeClass("active");
            $("#tab4").removeClass("active");
            $("#tab3").removeClass("text-dark");
            $("#tab3").addClass("text-danger");
            $("#tab1").addClass("text-dark");
            $("#tab1").removeClass("text-danger");
            $("#tab2").addClass("text-dark");
            $("#tab2").removeClass("text-danger");
            $("#tab4").addClass("text-dark");
            $("#tab4").removeClass("text-danger");

        }else if(id == 4){
            $("#tab4").addClass("active");
            $("#tab1").removeClass("active");
            $("#tab2").removeClass("active");
            $("#tab3").removeClass("active");
            $("#tab4").removeClass("text-dark");
            $("#tab4").addClass("text-danger");
            $("#tab1").addClass("text-dark");
            $("#tab1").removeClass("text-danger");
            $("#tab2").addClass("text-dark");
            $("#tab2").removeClass("text-danger");
            $("#tab3").addClass("text-dark");
            $("#tab3").removeClass("text-danger");
        }
        self.activate(id);
    }); 
    self.data = ko.observableArray([]);
    self.data.subscribe(function (newValue) {
        var name;
        if(self.tabs() == 1){
            name = "Competitions"
        }else if(self.tabs() == 2){
            name = "Athletes"
        }else if(self.tabs() == 3){
            name = "Countries"
        }else if(self.tabs() == 4){
            name = "Modalities"
        }
        const data = [];
        newValue.forEach(game => {
        const year = game.Year;
        const counter = game.Counter;
        let obj = data.find(o => o.year === year);
        if (!obj) {
            obj = { year };
            data.push(obj);
        }
        if (game.Name.includes("Summer")) {
            obj.summer = counter;
        } else {
            obj.winter = counter;
        }
        });
        const options = {
            scales: {
                xAxes: [{
                stacked: true
                }],
                yAxes: [{
                stacked: true
                }]
            }
            };
        const labels = data.map(d => d.year);
        const summerData = {
        label: "Jogos de Verão - " + name,
        data: data.map(d => d.summer),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
        };
        const winterData = {
        label: "Jogos de Inverno - " + name,
        data: data.map(d => d.winter),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
        };
        const ctx = document.getElementById("myChart").getContext("2d");
        const myChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
            labels: labels,
            datasets: [winterData,summerData]
        },
        options: options,
        responsive: true
        });

        //myChar2


        

        const data2 = newValue.map(game => ({
            x: game.Year,
            y: game.Counter,
            r: (game.Counter - Math.min(...newValue.map(d => d.Counter))) / (Math.max(...newValue.map(d => d.Counter)) - Math.min(...newValue.map(d => d.Counter))) * 60,
            type: game.Name,
            }));

            const options2 = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                    return "Year: " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x + "\nCounter: " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
                    }
                }
                },
            scales: {
                xAxes: [{
                type: "linear",
                position: "bottom",
                ticks: {
                    max: Math.max(...data2.map(d => d.x))+20
                    }
                }],
                yAxes: [{
                ticks: {
                    max: Math.max(...data2.map(d => d.y))+40
                }
                }]
            }
            };
        
            
            const chartData = {
            datasets: [{
                label: "Olympic Games - " + name,
                data: data2,
                backgroundColor: data2.map(d => d.type.includes("Summer") ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)"),
                borderColor: "rgba(0, 0, 0, 0.2)",
                borderWidth: 1
            }]
            };

            const ctx2 = document.getElementById("myChart2").getContext("2d");
            const myChart2 = new Chart(ctx2, {
            type: "bubble",
            data: chartData,
            options: options2,
            responsive: true,
            
            });
    });
    self.activate = function (id) {
        if(id == 1){
            name = "Competitions"
        }else if(id == 2){
            name = "Athletes"
        }else if(id == 3){
            name = "Countries"
        }else if(id == 4){
            name = "Modalities"
        }
        console.log("CALL: getGames...");
        var composedUri = "http://192.168.160.58/Olympics/api/Statistics/Games_"+name;
        ajaxHelper(composedUri, "GET").done(function (data) {
          console.log(data)
          self.data(data);
          //self.SetFavourites();
        });
    };
    self.activate(1)
    

    


    

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: "json",
        contentType: "application/json",
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        },
    });
    }
    self.TotalAtletas = ko.observable(0); 
    self.TotalCompeticoes = ko.observable(0);
    self.TotalModalidades = ko.observable(0);
    self.TotalPaises = ko.observable(0);
    self.TotalJogos = ko.observable(0);


    ajaxHelper("http://192.168.160.58/Olympics/api/Athletes?page=1&pagesize=1","GET").done(function (data) {
        self.TotalAtletas(data.TotalRecords); 
    });

    ajaxHelper("http://192.168.160.58/Olympics/api/Competitions?page=1&pagesize=1","GET").done(function (data) {
        self.TotalCompeticoes(data.TotalRecords); 
    });

    ajaxHelper("http://192.168.160.58/Olympics/api/Modalities?page=1&pagesize=1","GET").done(function (data) {
        self.TotalModalidades(data.TotalRecords); 
    });

    ajaxHelper("http://192.168.160.58/Olympics/api/Countries?page=1&pagesize=1","GET").done(function (data) {
        self.TotalPaises(data.TotalRecords);
    });

    ajaxHelper("http://192.168.160.58/Olympics/api/Games?page=1&pagesize=1","GET").done(function (data) {
        self.TotalJogos(data.TotalRecords);
        console.log("Total Jogos: " + data.TotalRecords)
    });

    

}

$(document).ready(function() {
    
    $('#BackTop-button').click(function() {
        // Scroll to the element with the ID "target-element"
        $('html, body').animate({
          scrollTop: $('#target-element').offset().top
        }, 1000);
      });


    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: "json",
            contentType: "application/json",
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            },
        });
        }
    
    let myChart0;

   ajaxHelper("http://192.168.160.58/Olympics/api/Statistics/Medals_Country", "GET").done(function (data) {
        var graph0Data = data;

        Countries = graph0Data.map(function(d) { return d.CountryName; });
        lenCountries = Countries.length;
        GoldMedals = graph0Data.map(function(d) { return d.Medals[0].Counter; });
        SilverMedals = graph0Data.map(function(d) { return d.Medals[1].Counter; });
        BronzeMedals = graph0Data.map(function(d) { return d.Medals[2].Counter; });
        CountriesId = graph0Data.map(function(d) { return d.CountryId; });

        var i = 5;

        var dataMedals = {
            labels: Countries.slice(0,i),
            datasets: [{
                label: 'Gold Medals',
                data: GoldMedals.slice(0,i),
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }, {
                label: 'Silver Medals',
                data: SilverMedals.slice(0,i),
                backgroundColor: 'rgba(192, 192, 192, 0.2)',
                borderColor: 'rgba(192, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Bronze Medals',
                data: BronzeMedals.slice(0,i),
                backgroundColor: 'rgba(205, 127, 50, 0.2)',
                borderColor: 'rgba(205, 127, 50, 1)',
                borderWidth: 1
            }]
        }

        $('#add-button').click(function() {
            if(i == 3){
                $('#remove-button').prop('disabled', false);
            }
            if(i == lenCountries){
                $('#add-button').prop('disabled', true);
            }
            console.log("Add button clicked");
            console.log("Countries --> ",Countries.slice(0,i))
            console.log("GoldMedals --> ",GoldMedals.slice(0,i))
            console.log("SilverMedals --> ",SilverMedals.slice(0,i))
            console.log("BronzeMedals --> ",BronzeMedals.slice(0,i))
            i += 1;
            dataMedals.labels = Countries.slice(0,i);
            dataMedals.datasets[0].data = GoldMedals.slice(0,i);
            dataMedals.datasets[1].data = SilverMedals.slice(0,i);
            dataMedals.datasets[2].data = BronzeMedals.slice(0,i);
            myChart0.update();
        });

        $('#remove-button').click(function() {
            if(i == 4){
                $('#remove-button').prop('disabled', true);
            };
            if(i == lenCountries - 1){
                $('#add-button').prop('disabled', false);
            }
            console.log("Remove button clicked");
            console.log("Countries --> ",Countries.slice(0,i))
            console.log("GoldMedals --> ",GoldMedals.slice(0,i))
            console.log("SilverMedals --> ",SilverMedals.slice(0,i))
            console.log("BronzeMedals --> ",BronzeMedals.slice(0,i))
            i -= 1;
            dataMedals.labels = Countries.slice(0,i);
            dataMedals.datasets[0].data = GoldMedals.slice(0,i);
            dataMedals.datasets[1].data = SilverMedals.slice(0,i);
            dataMedals.datasets[2].data = BronzeMedals.slice(0,i);
            myChart0.update();
        });             

        var ctx0 = document.getElementById('myChart0').getContext('2d');
        var myChart0 = new Chart(ctx0, {
            type: 'bar',
            data: dataMedals,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });

    ajaxHelper("http://192.168.160.58/Olympics/api/Athletes?page=1&pagesize=140000", "GET").done(function (data) {
        var graph1Data = data.Records;
        var numberMale = graph1Data.filter(function(d) { return d.Sex=="M"; }).length;
        var numberFemale = ((data.TotalRecords - numberMale)/data.TotalRecords).toFixed(2) * 100;
        numberMale = ((numberMale/data.TotalRecords).toFixed(2) * 100);
        
        console.log(numberFemale,"and male -->",numberMale)
        var percMaleTop1 = graph1Data.filter(function(d) { return d.BestPosition==1 && d.Sex=="M"; }).length
        var percFemaleTop1 = graph1Data.filter(function(d) { return d.BestPosition==1 && d.Sex=="F"; }).length
        soma = percMaleTop1 + percFemaleTop1
        percMaleTop1 = (percMaleTop1/soma).toFixed(2) * 100
        percFemaleTop1 = (percFemaleTop1/soma).toFixed(2) * 100
        console.log("percMaleTop1 -->",percMaleTop1)
        console.log("percFemaleTop1 -->",percFemaleTop1)
        var percMaleTop2 = graph1Data.filter(function(d) { return d.BestPosition==2 && d.Sex=="M"; }).length
        var percFemaleTop2 = graph1Data.filter(function(d) { return d.BestPosition==2 && d.Sex=="F"; }).length
        soma = percMaleTop2 + percFemaleTop2
        percMaleTop2 = (percMaleTop2/soma).toFixed(2) * 100
        percFemaleTop2 = (percFemaleTop2/soma).toFixed(2) * 100
        console.log("percMaleTop2 -->",percMaleTop2)
        console.log("percFemaleTop2 -->",percFemaleTop2)
        var percMaleTop3 = graph1Data.filter(function(d) { return d.BestPosition==3 && d.Sex=="M"; }).length
        var percFemaleTop3 = graph1Data.filter(function(d) { return d.BestPosition==3 && d.Sex=="F"; }).length
        soma = percMaleTop3 + percFemaleTop3
        percMaleTop3 = (percMaleTop3/soma).toFixed(2) * 100
        percFemaleTop3 = (percFemaleTop3/soma).toFixed(2) * 100
        console.log("percMaleTop3 -->",percMaleTop3)
        console.log("percFemaleTop3 -->",percFemaleTop3)

        var ctxSex0 = document.getElementById('ChartSex0').getContext('2d');
        data0 = {
            labels: ['Atletas Masculinos', 'Atletas Femininos'],
            datasets: [{
                data: [numberFemale,numberMale],
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
            }]}
        var chartsex0 = new Chart(ctxSex0, {
            type: 'doughnut',
            data: {
                labels: ['Atletas Masculinos', 'Atletas Femininos'],
                datasets: [{
                    data: [numberFemale,numberMale],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
                }]},
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            console.log("Data",data)
                            console.log("este",data.datasets[0].data[tooltipItem.index])
                            var label = data.datasets[0].data[tooltipItem.index] || '';

                            return data.labels[tooltipItem.index] + ": " + label + '%';
                        }
                    }
                }
            
            }    
        });

        var ctxSex1 = document.getElementById('ChartSex1').getContext('2d');
        var ctxSex1 = document.getElementById('ChartSex1').getContext('2d');
        var chartsex1 = new Chart(ctxSex1, {
            type: 'doughnut',
            data: {
                labels: ['Atletas Masculinos', 'Atletas Femininos'],
                datasets: [{
                    data: [percFemaleTop1, percMaleTop1],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            console.log("Data",data)
                            console.log("este",data.datasets[0].data[tooltipItem.index])
                            var label = data.datasets[0].data[tooltipItem.index] || '';

                            return data.labels[tooltipItem.index] + ": " + label + '%';
                        }
                    }
                },
                legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false
                    }]
                  }
            
            } 
            
        });

        var ctxSex2 = document.getElementById('ChartSex2').getContext('2d');
        var chartsex2 = new Chart(ctxSex2, {
            type: 'doughnut',
            data: {
                labels: ['Atletas Masculinos', 'Atletas Femininos'],
                datasets: [{
                    data: [percFemaleTop2,percMaleTop2],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            console.log("Data",data)
                            console.log("este",data.datasets[0].data[tooltipItem.index])
                            var label = data.datasets[0].data[tooltipItem.index] || '';

                            return data.labels[tooltipItem.index] + ": " + label + '%';
                        }
                    }
                },
                legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false
                    }]
                  }
            
            }
        });

        var ctxSex3 = document.getElementById('ChartSex3').getContext('2d');
        var chartsex3 = new Chart(ctxSex3, {
            type: 'doughnut',
            data: {
                labels: ['Atletas Masculinos', 'Atletas Femininos'],
                datasets: [{
                    data: [percFemaleTop3,percMaleTop3],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            console.log("Data",data)
                            console.log("este",data.datasets[0].data[tooltipItem.index])
                            var label = data.datasets[0].data[tooltipItem.index] || '';

                            return data.labels[tooltipItem.index] + ": " + label + '%';
                        }
                    }
                },
                legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false
                    }]
                  }
            
            }    
        });

    });


    
    ko.applyBindings(new ViewModel());
});
