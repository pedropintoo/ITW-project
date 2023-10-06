// ViewModel KnockOut
var vm = function () {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  var self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/Countries");
  //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
  self.displayName = "Olympic Countries editions List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(20);
  self.totalRecords = ko.observable(50);
  self.hasPrevious = ko.observable(false);
  self.hasNext = ko.observable(false);
  self.previousPage = ko.computed(function () {
    return self.currentPage() * 1 - 1;
  }, self);
  self.nextPage = ko.computed(function () {
    return self.currentPage() * 1 + 1;
  }, self);
  self.fromRecord = ko.computed(function () {
    return self.previousPage() * self.pagesize() + 1;
  }, self);
  self.toRecord = ko.computed(function () {
    return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
  }, self);
  self.totalPages = ko.observable(0);
  self.pageArray = function () {
    var list = [];
    var size = Math.min(self.totalPages(), 9);
    var step;
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (var i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

  //* Favorites
  self.loadFavorites = ko.observableArray(
    JSON.parse(localStorage.getItem("countries")) || []
  );
  self.isFavorite = function (id) {
    return self
      .loadFavorites()
      .map((item) => item.Id)
      .includes(id);
  };
  self.toggleFavorite = function (data) {
    console.log(data);
    if (self.isFavorite(data.Id)) {
      self.loadFavorites.remove(data);
    } else {
      self.loadFavorites.push(data);
    }
    localStorage.setItem("countries", JSON.stringify(self.loadFavorites()));
    console.log(localStorage.getItem("countries"));
  };

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getCountries...");
    var composedUri =
      self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.records(data.Records);
      self.currentPage(data.CurrentPage);
      self.hasNext(data.HasNext);
      self.hasPrevious(data.HasPrevious);
      self.pagesize(data.PageSize);
      self.totalPages(data.TotalPages);
      self.totalRecords(data.TotalRecords);
      //self.SetFavourites();
    });
  };

  self.ouro = ko.observable({});
  self.prata = ko.observable({});
  self.bronze = ko.observable({});

  self.checkOuro = ko.computed(function () {
    var composedUri = "medalhas.json";
    ajaxHelper(composedUri, "GET").done(function (data) {
      data.map(function (item) {
        self.ouro()[item.CountryId] = item.Medals[0].Counter;
      });
    });
  });

  self.checkPrata = ko.computed(function () {
    var composedUri = "medalhas.json";
    ajaxHelper(composedUri, "GET").done(function (data) {
      data.map(function (item) {
        self.prata()[item.CountryId] = item.Medals[1].Counter;
      });
    });
  });

  self.checkBronze = ko.computed(function () {
    var composedUri = "medalhas.json";
    ajaxHelper(composedUri, "GET").done(function (data) {
      data.map(function (item) {
        self.bronze()[item.CountryId] = item.Medals[2].Counter;
      });
    });
  });

  self.verOuro = function (id) {
    if (self.ouro()[id] != null) return self.ouro()[id];
    else return 0;
  };

  self.verPrata = function (id) {
    if (self.prata()[id] != null) return self.prata()[id];
    else return 0;
  };

  self.verBronze = function (id) {
    if (self.bronze()[id] != null) return self.bronze()[id];
    else return 0;
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

  function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
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
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //--- start ....
  showLoading();
  var pg = getUrlParameter("page");
  console.log(pg);
  if (pg == undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
};

$(document).ready(function () {
  $("#BackTop-button").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#target-element").offset().top,
      },
      1000
    );
  });
  console.log("ready!");
  ko.applyBindings(new vm());
  //on click event
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});
