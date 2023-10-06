function vm() {
  const self = this;
  self.error = ko.observable("");
  self.nome = ko.observable("");
  self.email = ko.observable("");
  self.telemovel = ko.observable("");
  self.nomeValido = ko.computed(function () {
    return self.nome().length > 3;
  });
  self.emailValido = ko.computed(function () {
    return self
      .email()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  });

  self.telemovelValido = ko.computed(function () {
    return self.telemovel().length > 8;
  });

  self.activeNovidades = ko.computed(function () {
    return self.nomeValido() && self.emailValido() && self.telemovelValido();
  });

  self.clearAll = function () {
    self.nome("");
    self.email("");
    self.telemovel("");
  };

  //* Internal Functions

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
        self.error(errorThrown);
      },
    });
  }

  //* End of Internal Functions

  //! Search Functionality
  self.countriesURL = ko.observable(
    "http://192.168.160.58/olympics/api/countries"
  );
  self.athletesURL = ko.observable(
    "http://192.168.160.58/olympics/api/athletes"
  );
  self.gamesURL = ko.observable("http://192.168.160.58/olympics/api/games");
  self.modalitiesURL = ko.observable(
    "http://192.168.160.58/olympics/api/modalities"
  );
  self.minInputSize = ko.observable(3);
  self.searchInput = ko.observable("");
  self.searched = ko.observable(false);
  self.searchCountries = ko.observableArray([]);
  self.searchAthletes = ko.observableArray([]);
  self.searchGames = ko.observableArray([]);
  self.searchModalities = ko.observableArray([]);
  self.lastSearch = ko.observable(Date.now());
  self.expandSearch = function () {
    $(".search input").focus();
    if (!$(".search input")[0].classList.contains("active")) {
      $(".search input").toggleClass("active");
      $(".search").toggleClass("active");
      $(".search-results").toggleClass("active");
    }
  };
  self.collapseSearch = function () {
    if ($(".search input")[0].classList.contains("active")) {
      $(".search input").toggleClass("active");
      $(".search").toggleClass("active");
      $(".search-results").toggleClass("active");
    }
    // $(".search input").val("");
    self.searchInput("");
    self.activateSearch();
  };

  self.activateSearch = function () {
    self.searched(false);
    let timeElapsed = Date.now() - self.lastSearch();
    console.log("time elapsed:", timeElapsed);
    console.log(self.searchInput().length);
    if (timeElapsed > 200) {
      if (self.searchInput().length > self.minInputSize()) {
        console.log("searching");
        self.searchAthletes([{ Name: "Loading...", Id: 0 }]);
        self.searchCountries([{ Name: "Loading...", Id: 0 }]);
        self.searchGames([{ Name: "Loading...", Id: 0 }]);
        self.searchModalities([{ Name: "Loading...", Id: 0 }]);

        let countriesURL = `${self.countriesURL()}/searchbyname?q=${self.searchInput()}`;
        ajaxHelper(countriesURL, "GET").done(function (data) {
          console.log(data);
          self.searchCountries(
            data.length > 0 ? data : [{ Name: "No results found", Id: 0 }]
          );
          console.log("countries:", self.searchCountries());
        });
        let athletesURL = `${self.athletesURL()}/searchbyname?q=${self.searchInput()}`;
        ajaxHelper(athletesURL, "GET").done(function (data) {
          self.searchAthletes(
            data.length > 0 ? data : [{ Name: "No results found", Id: 0 }]
          );
          console.log("athletes:", self.searchAthletes());
        });
        let gamesURL = `${self.gamesURL()}/searchbyname?q=${self.searchInput()}`;
        ajaxHelper(gamesURL, "GET").done(function (data) {
          self.searchGames(
            data.length > 0 ? data : [{ Name: "No results found", Id: 0 }]
          );
          console.log("games:", self.searchGames());
        });
        let modalitiesURL = `${self.modalitiesURL()}/searchbyname?q=${self.searchInput()}`;
        ajaxHelper(modalitiesURL, "GET").done(function (data) {
          self.searchModalities(
            data.length > 0 ? data : [{ Name: "No results found", Id: 0 }]
          );
          console.log("modalities:", self.searchModalities());
        });
        self.searched(true);
      } else {
        self.searchCountries([]);
        self.searchAthletes([]);
        self.searchGames([]);
        self.searchModalities([]);
      }
      self.lastSearch(Date.now());
    }
    console.log("searched");
  };
  //! End of Search Functionality
}
//* Carousel
$("document").ready(function () {
  ko.applyBindings(new vm());

  const carousel = new bootstrap.Carousel("#myCarousel", {
    interval: 10000,
  });

  $(".navbarButton").hover(function () {
    $(this).toggleClass("border-white border-bottom border-2 active");
  });

  $(".navbarButton2").hover(function () {
    $(this).toggleClass("btn btn-primary ");
  });
  //* End of Carousel

  //* Map
  // Cria um mapa e define a posição inicial e o zoom
  const map = L.map("map").setView([40.633062, -8.659224], 20);

  // Adiciona uma camada de base (tiles) ao mapa
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const coords = [
    [40.63322921159137, -8.65928649902344],
    [40.6332332826146, -8.659125566482546],
    [40.63280989486929, -8.659109473228456],
    [40.63280175277096, -8.65928113460541],
    [40.63307206988017, -8.659291863441469],
    [40.63306962729764, -8.659399151802065],
    [40.63313232115286, -8.659409880638124],
    [40.63313639218198, -8.659474253654482],
    [40.63308536863199, -8.659479618072512],
    [40.63308753981594, -8.659651279449465],
    [40.63351092580074, -8.659656643867494],
    [40.63351906781259, -8.659495711326601],
    [40.63325038089704, -8.659479618072512],
    [40.63325038089704, -8.659356236457826],
    [40.63325038089704, -8.659350872039797],
    [40.633185244512255, -8.659350872039797],
    [40.63318931553818, -8.65928113460541],
  ];

  const polygon = L.polygon(coords).addTo(map);
  //Adiciona um marcador na Avenida João Jacinto Magalhães
  L.marker([40.633062, -8.659224])
    .addTo(map)
    .bindPopup("We are here!")
    .openPopup();

  map.on("click", function (event) {
    const coords = event.latlng;
    console.log(coords.lat, coords.lng);
  });

  $("#scroll-button1").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#target-element1").offset().top,
      },
      1000
    );
  });

  $("#BackTop-button").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#myCarousel").offset().top,
      },
      1000
    );
  });

  $("#scroll-button2").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#target-element2").offset().top,
      },
      1000
    );
  });

  const navbar = document.querySelector("#neubar");
  const car = document.querySelector("#myCarousel");

  const handleScroll = () => {
    if (window.scrollY > car.offsetTop + car.offsetHeight) {
      navbar.classList.add("navbarBG");
    } else {
      navbar.classList.remove("navbarBG");
    }
  };

  document.addEventListener("scroll", handleScroll);

  handleScroll();
});

//* End of Map
