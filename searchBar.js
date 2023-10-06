{/* <div class="ms-auto">
            <input class="search_input" type="text" placeholder="Search" id="searchBar" data-bind="value: texto, valueUpdate: 'afterkeydown', event: { input: search}">
          </div> */}

function ViewModel() {
    var self = this;
    self.texto = ko.observable();
    self.athletes = ko.observableArray();
  
    // cria uma variável para armazenar o timeout
  
    self.search = function() {
      
      if(self.texto().length > 3){
        var searchUrl = "http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=" + self.texto();
        $.ajax({
          url: searchUrl,
          dataType: "json",
          success: function(data) {
            var names = data.map(function(athlete) {
              return athlete.Name;
            });
            // atualiza o atributo 'athletes' com o novo array de nomes
            self.athletes(names);
          }
        });
      }
      else{
        self.athletes([]);
      }
      console.log(self.texto().length);
      $( "#searchBar" ).autocomplete({
        minLength: 3,
        source: self.athletes()
      });
    ;
    }
  }
  


    //--- Page Events
    // self.activate = function (q) {
    //     console.log("CALL: getData...");
    //     var composedUri = self.baseUri()
    //     ajaxHelper(composedUri, "GET").done(function (data) {
    //         self.Athletes = ko.computed(function(){
    //             return data.Records.map(function(item){
    //                 return item.Name
    //             })
    //         })
    //         $("#searchBar").autocomplete({
    //             minLength: 4,
    //             selectFirst: true,
    //             source: self.Athletes()
    //         });
    //         })
    //         hideLoading();
    //         //self.SetFavourites();
    // };
  
    // //--- Internal functions
    // function ajaxHelper(uri, method, data) {
    //   self.error(""); // Clear error message
    //   return $.ajax({
    //     type: method,
    //     url: uri,
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: data ? JSON.stringify(data) : null,
    //     error: function (jqXHR, textStatus, errorThrown) {
    //       console.log("AJAX Call[" + uri + "] Fail...");
    //       hideLoading();
    //       self.error(errorThrown);
    //     },
    //   });
    // }
  
    // function sleep(milliseconds) {
    //   const start = Date.now();
    //   while (Date.now() - start < milliseconds);
    // }
  
    // function showLoading() {
    //   $("#myModal").modal("show", {
    //     backdrop: "static",
    //     keyboard: false,
    //   });
    // }
    // function hideLoading() {
    //   $("#myModal").on("shown.bs.modal", function (e) {
    //     $("#myModal").modal("hide");
    //   });
    // }
  
    // function getUrlParameter(sParam) {
    //   var sPageURL = window.location.search.substring(1),
    //     sURLVariables = sPageURL.split("&"),
    //     sParameterName,
    //     i;
    //   console.log("sPageURL=", sPageURL);
    //   for (i = 0; i < sURLVariables.length; i++) {
    //     sParameterName = sURLVariables[i].split("=");
  
    //     if (sParameterName[0] === sParam) {
    //       return sParameterName[1] === undefined
    //         ? true
    //         : decodeURIComponent(sParameterName[1]);
    //     }
    //   }
    // }
  
    // //--- start ....
    // showLoading();
    // // self.activate(self.texto)
    
    // console.log("VM initialized!");
    
// };


$("document").ready(function () {
    
  ko.applyBindings(new ViewModel());

});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal('hide');
})