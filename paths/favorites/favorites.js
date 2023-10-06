function ViewModel() {
  const self = this;

  self.favAthletes = ko.observableArray(
    JSON.parse(localStorage.getItem("athletes"))
  );
  self.favCountries = ko.observableArray(
    JSON.parse(localStorage.getItem("countries"))
  );
  self.favModalities = ko.observableArray(
    JSON.parse(localStorage.getItem("modalities"))
  );
  self.favGames = ko.observableArray(JSON.parse(localStorage.getItem("games")));

  self.toggleFavAthletes = function (data) {
    self.favAthletes.remove(data);
    localStorage.setItem("athletes", JSON.stringify(self.favAthletes()));
    console.log(localStorage.getItem("athletes"));
  };

  self.toggleFavCountries = function (data) {
    self.favCountries.remove(data);
    localStorage.setItem("countries", JSON.stringify(self.favCountries()));
    console.log(localStorage.getItem("countries"));
  };

  self.toggleFavModalities = function (data) {
    self.favModalities.remove(data);
    localStorage.setItem("modalities", JSON.stringify(self.favModalities()));
    console.log(localStorage.getItem("modalities"));
  };

  self.toggleFavGames = function (data) {
    self.favGames.remove(data);
    localStorage.setItem("games", JSON.stringify(self.favGames()));
    console.log(localStorage.getItem("games"));
  };
}

$().ready(function () {
  ko.applyBindings(new ViewModel());
  console.log("Viewmodel initiated!");
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
