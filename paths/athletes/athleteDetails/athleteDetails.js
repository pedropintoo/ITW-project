function ViewModel() {
  console.log("ViewModel initiated...");
  //* KnockoutJS Variables
  const self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/athletes/");
  self.baseUriModality = ko.observable(
    "http://192.168.160.58/Olympics/api/modalities/searchbyname?q="
  );
  self.error = ko.observable("");
  self.id = ko.observable("");
  self.name = ko.observable("");
  self.medals = ko.observableArray([]);
  self.bornPlace = ko.observable("");
  self.bornDate = ko.observable("");
  self.deathPlace = ko.observable("");
  self.deathDate = ko.observable("");
  self.games = ko.observableArray([]);
  self.modalities = ko.observableArray([]);
  self.modality = ko.observable("");
  self.modalityLogo = ko.observable("");
  self.competitions = ko.observableArray([]);
  self.photo = ko.observable("");
  self.sex = ko.observable("");
  self.height = ko.observable("");
  self.weight = ko.observable("");

  //* Internal functions
  self.activate = function (id) {
    console.log("CALL: getAthlete...");
    const composedUri = `${self.baseUri()}fulldetails?id=${id}`;
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.id(data.Id);
      self.name(data.Name);
      self.medals(data.Medals);
      self.bornPlace(data.BornPlace);
      self.bornDate(data.BornDate ? data.BornDate.slice(0, 4) : "No Data");
      self.deathPlace(data.DiedPlace);
      self.deathDate(data.DiedDate ? data.DiedDate.slice(0, 4) : "No Data");
      self.games(data.Games);
      self.modalities(data.Modalities);
      self.modality(data.Modalities[0].Name);
      ajaxHelper(
        `${self.baseUriModality()}${data.Modalities[0].Name}`,
        "GET"
      ).done(function (data) {
        self.modalityLogo(data[0].Photo);
      });
      self.competitions(data.Competitions);
      self.photo(data.Photo);
      self.height(data.Height);
      self.weight(data.Weight);
    });
  };

  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(`AJAX Call[${uri}] Fail...`);
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  function getUrlParamater(parameter) {
    const pageUrlVariables = window.location.search.substring(1).split("&");

    for (let variable of pageUrlVariables) {
      const parameterName = variable.split("=");
      if (parameterName[0] === parameter) {
        return parameterName[1] === undefined
          ? null
          : decodeURIComponent(parameterName[1]);
      }
    }
  }

  function hideLoading() {
    $("#myModal").on("shown.bs.modal", function (e) {
      $("#myModal").modal("hide");
    });
  }

  function showLoading() {
    $("#myModal").modal("show", {
      backdrop: "static",
      keyboard: false,
    });
  }

  //* End of internal functions

  //! Start
  showLoading();
  const pageId = getUrlParamater("id");
  console.log(`Athlete Id: ${pageId || 1}`);
  pageId === undefined ? self.activate(1) : self.activate(pageId);
  console.log("ViewModel initialized!");
}

$(document).ready(function () {
  	
	$('#BackTop-button').click(function() {
    // Scroll to the element with the ID "target-element"
    $('html, body').animate({
      scrollTop: $('#target-element').offset().top
    }, 1000);
  });
  console.log("Document ready...");
  ko.applyBindings(new ViewModel());
});

$(document).ajaxComplete(function () {
  console.log("Ajax complete...");
  $("#myModal").modal("hide");
});
