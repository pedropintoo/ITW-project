// ViewModel KnockOut
function ViewModel() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  let self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/athletes");
  self.displayName = "Olympic Athletes";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.athletes = ko.observableArray([]);
  self.records = ko.observableArray([]);
  self.currentSlice = ko.observable(0);

  self.loadFavorites = ko.observableArray(
    JSON.parse(localStorage.getItem("athletes")) || []
  );
  self.isFavorite = function (id) {
    return self
      .loadFavorites()
      .map((item) => item.Id)
      .includes(id);
  };
  self.toggleFavorite = function (data) {
    console.log(data);
    data.Details.Medals = data.Details.Medals();
    data.Details.Country = data.Details.Country();
    data.Details.Modality = data.Details.Modality();
    if (self.isFavorite(data.Id)) {
      self.loadFavorites.remove(data);
    } else {
      self.loadFavorites.push(data);
    }
    localStorage.setItem("athletes", JSON.stringify(self.loadFavorites()));
    console.log(localStorage.getItem("athletes"));
  };

  self.loadAthletes = function () {
    let athletes = self
      .athletes()
      .slice(self.currentSlice(), self.currentSlice() + 12);

    self.currentSlice(self.currentSlice() + 12);

    athletes = $.map(athletes, function (athlete) {
      const name = athlete.Name.split(" ");
      athlete.Name = `${name[0]} ${name[name.length - 1]
        .toUpperCase()
        .replaceAll("(", "")
        .replaceAll(")", "")
        .split("-")
        .filter((item) => item.length > 1)
        .join("-")}`;
      athlete.Details = {
        Country: ko.observable(""),
        Modality: ko.observable(""),
        Medals: ko.observableArray([]),
      };
      return ko.observable(athlete);
    });
    for (let athlete of athletes) {
      let composedUri = `${self.baseUri()}/fulldetails?id=${athlete().Id}`;
      ajaxHelper(composedUri, "GET")
        .done(function (data) {
          athlete().Details.Country(
            data.BornPlace
              ? data.BornPlace.split(" ")
                  [data.BornPlace.split(" ").length - 1].replaceAll(")", "")
                  .replaceAll("(", "")
                  .slice(-3)
              : "<br>"
          );
          athlete().Details.Modality(data.Modalities[0].Name);
          athlete().Details.Medals(data.Medals);
        })
        .then(function () {
          self.records.push(athlete);
          addShadow();
        });
      sleep(100);
    }
  };
  self.activate = function () {
    console.log("CALL: getAthletes...");
    let composedUri = `${self.baseUri()}?page=1&pageSize=135571`;
    console.log(composedUri);
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      //* Load Athletes
      self.athletes(
        shuffleArray(
          data.Records.filter(
            (item) =>
              item.BestPosition < 4 &&
              item.Photo &&
              !item.Photo.includes("th.bing")
          )
        )
      );
      self.loadAthletes(self.currentSlice(), self.athletes());
      hideLoading();
      console.log(self.records());
    });
  };

  //* Internal functions
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

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

  //! Start
  showLoading();
  self.activate();
  console.log("VM initialized!");
}

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
  ko.applyBindings(new ViewModel());
});

$(document).ajaxComplete(function () {
  $("#myModal").modal("hide");
});

$("body").click(function () {
  addShadow();
});

function addShadow() {
  $(".gold").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-gold");
  });
  $(".silver").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-silver");
  });
  $(".bronze").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-bronze");
  });
}
