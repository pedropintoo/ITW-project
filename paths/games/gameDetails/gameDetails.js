// ViewModel KnockOut
function vm() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  const self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/Games/");
  self.displayName = "Olympic Games edition Details";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  //--- Data Record
  self.Id = ko.observable("");
  self.Country = ko.observable("");
  self.City = ko.observable("");
  self.Logo = ko.observable("");
  self.Name = ko.observable("");
  self.Photo = ko.observable("");
  self.Season = ko.observable("");
  self.Year = ko.observableArray("");
  self.Athletes = ko.observableArray([]);
  self.Modalities = ko.observableArray([]);
  self.Competitions = ko.observableArray([]);
  self.Medals = ko.observableArray([]);
  self.Url = ko.observable("");

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getGame...");
    const composedUri = `${self.baseUri()}fulldetails?id=${id}`;
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.Id(data.Id);
      self.Country(data.CountryName);
      self.City(data.City);
      self.Logo(data.Logo);
      self.Name(data.Name);
      self.Photo(data.Photo);
      self.Season(data.Season);
      self.Year(data.Year);
      self.Athletes(data.Athletes);
      self.Modalities(data.Modalities);
      self.Competitions(data.Competitions);
      self.Medals(data.Medals);
    });
  };

  //--- Internal functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  function showLoading() {
    $("#myModal").modal("show", {
      backdrop: "static",
      keyboard: false,
    });
  }
  function hideLoading() {
    $("#myModal").on("shown.bs.modal", function (e) {
      $("#myModal").modal("hide");
    });
  }

  function getUrlParameter(sParam) {
    const sURLVariables = window.location.search.substring(1).split("&");

    for (let variable of sURLVariables) {
      const sParameterName = variable.split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? null
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //! start
  showLoading();
  const id = getUrlParameter("id");
  console.log(id);
  id == undefined ? self.activate(1) : self.activate(id);
  console.log("VM initialized!");
}

$(document).ready(function () {
  	
	$('#BackTop-button').click(function() {
    // Scroll to the element with the ID "target-element"
    $('html, body').animate({
      scrollTop: $('#target-element').offset().top
    }, 1000);
  });
  console.log("document.ready!");
  ko.applyBindings(new vm());
});

$(document).ajaxComplete(function () {
  $("#myModal").modal("hide");
});
