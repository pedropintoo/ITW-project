// ViewModel KnockOut
function ViewModel() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  const self = this;
  console.log(self);
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/games");
  self.displayName = "Olympic Game Editions List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(21);
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
    let list = [];
    const size = Math.min(self.totalPages(), 9);
    let step;
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (let i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

  //* Favorites

  self.loadFavorites = ko.observableArray(
    JSON.parse(localStorage.getItem("games")) || []
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
    localStorage.setItem("games", JSON.stringify(self.loadFavorites()));
    console.log(localStorage.getItem("games"));
  };

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getGames...");
    const composedUri =
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
    const sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&");
    console.log("sPageURL=", sPageURL);
    for (let urlVar of sURLVariables) {
      let sParameterName = urlVar.split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? null
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //! start
  showLoading();
  const pg = getUrlParameter("page");
  console.log(pg);
  if (pg === undefined) self.activate(1);
  else {
    self.activate(pg);
  }
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

  function ajaxHelper(uri, method, data) { // Clear error message
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
  ko.applyBindings(new ViewModel());
  ajaxHelper("http://192.168.160.58/Olympics/api/Games?page=1&pagesize=60", "GET").done(function (data) {
      var Names = data.Records.map(function (item) {
        return item.Name;
      });
      var Cities = data.Records.map(function (item) {
        return item.CityName;
      });
      var Logos = data.Records.map(function (item) {
        return item.Logo;
      });
      var Coords = data.Records.map(function (item) {
        return [item.Lat, item.Lon];
      });
      var ids = data.Records.map(function (item) {
        return item.Id;
      });

      var summerIcon = L.icon({
        iconUrl: '../../images/summer.svg',
        iconSize: [32, 32]
      });
      
      var winterIcon = L.icon({
        iconUrl: '../../images/winter.svg',
        iconSize: [32, 32]
      });

      var map = L.map('map').setView([51.505, -0.09], 13);
        

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; &nbsp;',
          maxZoom: 18,
          wrapLatLng: true
      }).addTo(map);

      L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');
    
            img.src = '../../images/watermark.png';
            img.style.width = '15rem';
    
            return img;
        },
    
        onRemove: function(map) {
            // Nothing to do here
          }
      });
      map.addControl(new L.Control.Watermark());

            // Cria os ícones de verão e inverno
      var summerIcon = L.icon({
        iconUrl: '../../images/summer.png',
        iconSize: [32, 32]
      });

      var winterIcon = L.icon({
        iconUrl: '../../images/winter.png',
        iconSize: [32, 32]
      });

      // Itera sobre as coordenadas e cria marcadores com os ícones apropriados
      var markers = [];
      for (var i = 0; i < Coords.length; i++) {
        var coord = Coords[i];
        var name = Names[i];
        var id = ids[i];

        var marker;
        if (name.includes("Summer")) {
          marker = L.marker(coord, {icon: summerIcon}).addTo(map);
        } else if (name.includes("Winter")) {
          marker = L.marker(coord, {icon: winterIcon}).addTo(map);
        } else {
          marker = L.marker(coord).addTo(map);
        }
        //http://127.0.0.1:5500/paths/games/gameDetails/gameDetails.html?id=3
        marker.bindPopup("<div type='button' onclick='window.location.href=\"gameDetails/gameDetails.html?id="+id+"\"'>"+"<b>" + name + '</b>' + "<br>" + Cities[i] + "<br>" + "<img src='" + Logos[i] + "' width='300rem' height='100rem' />"+"</div>");
        markers.push(marker);
      }

            // Cria um array para armazenar os limites do mapa
      var bounds = new L.LatLngBounds();

      // Itera sobre os marcadores e adiciona cada coordenada aos limites do mapa
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getLatLng());
      }

      // Ajusta o mapa para que todos os marcadores fiquem visíveis e define os limites do mapa
      map.fitBounds(bounds);
      map.setMaxBounds([
        [-90, -180], // limite mínimo de latitude e longitude
        [90, 180] // limite máximo de latitude e longitude
      ]);
      map.setMinZoom(2);
      map.setMaxZoom(18);

            



  });

  


  
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});
