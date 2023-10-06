// ViewModel KnockOut
var vm = function () {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  var self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/Countries/");
  self.displayName = "Olympic Countries edition Details";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  //--- Data Record
  self.Id = ko.observable("");
  self.Name = ko.observable("");
  self.IOC = ko.observable("");
  self.Flag = ko.observable("");
  self.Events = ko.observableArray([]);
  self.modalities = ko.observableArray([]);
  self.lenModalidade = ko.computed(function () {
    self.modalities(
      self.Events().reduce((acc, event) => {
        if (!acc.includes(event.Modality)) {
          acc.push(event.Modality);
        }
        return acc;
      }, [])
    );
    return self.modalities().length;
  });

  //* Favorites
  self.loadFavorites = ko.observableArray(
    JSON.parse(localStorage.getItem("countries")) || []
  );
  self.isFavorite = function (id) {
    return self.loadFavorites().includes(id);
  };
  self.toggleFavorite = function (id) {
    if (self.isFavorite(id)) {
      self.loadFavorites.remove(id);
    } else {
      self.loadFavorites.push(id);
    }
    localStorage.setItem("countries", JSON.stringify(self.loadFavorites()));
    console.log(localStorage.getItem("countries"));
  };

  //* End of Favorites

  self.Participant = ko.observable("");
  self.lenParticipant = ko.computed(function () {
    return self.Participant().length;
  });
  self.Organizer = ko.observableArray([]);
  self.lenOrganizer = ko.computed(function () {
    console.log("Organizer", self.Organizer());
    return self.Organizer().length;
  });

  self.atletas = ko.observableArray([]);
  self.lenAtletas = ko.computed(function () {
    return self.atletas().length;
  });
  self.bestAtletas = ko.observableArray([]);

  self.Url = ko.observable("");

  self.positions = ko.observableArray([{}]);
  let listaFinal = [{}];
  function getBestPositions(records) {
    // Cria uma lista vazia para armazenar os IDs

    var check = [];

    var top1 = [];
    var top2 = [];
    var top3 = [];
    var top4 = [];

    for (let i = 0; i < records.length; i++) {
      if (records[i].BestPosition == 1) {
        top1.push(records[i].Id);
      }
      if (records[i].BestPosition == 2) {
        top2.push(records[i].Id);
      }
      if (records[i].BestPosition == 3) {
        top3.push(records[i].Id);
      }
      if (records[i].BestPosition == 4) {
        top4.push(records[i].Id);
      }
    }
    console.log("Top1", top1);
    console.log("Top2", top2);
    console.log("Top3", top3);
    console.log("Top4", top4);
    console.log("Check", check);

    if (top1.length >= 5) {
      for (let i = 0; i < top1.length; i++) {
        console.log(self.verfotoById(top1[i]));
        if (self.verfotoById(top1[i]) != null) {
          console.log("com foto", top1[i]);
          check.push(top1[i]);
          if (check.length == 5) {
            break;
          }
        }
      }
      console.log("Com foto: ", check.length);
      if (check.length < 5) {
        for (let i = 0; i < top1.length; i++) {
          if (self.verfotoById(top1[i]) == null) {
            check.push(top1[i]);
            if (check.length == 5) {
              break;
            }
          }
        }
      }
    } else if (top1.length + top2.length >= 5) {
      lista = top1.concat(top2);
      for (let i = 0; i < lista.length; i++) {
        if (self.verfotoById(lista[i]) != null) {
          check.push(lista[i]);
          if (check.length == 5) {
            break;
          }
        }
      }
      console.log("Com foto: ", check.length);
      if (check.length < 5) {
        for (let i = 0; i < lista.length; i++) {
          if (self.verfotoById(lista[i]) == null) {
            check.push(lista[i]);
            if (check.length == 5) {
              break;
            }
          }
        }
      }
    } else if (top1.length + top2.length + top3.length >= 5) {
      lista = top1.concat(top2, top3);
      for (let i = 0; i < lista.length; i++) {
        if (self.verfotoById(lista[i]) != null) {
          check.push(lista[i]);
          if (check.length == 5) {
            break;
          }
        }
      }
      console.log("Com foto: ", check.length);
      if (check.length < 5) {
        for (let i = 0; i < lista.length; i++) {
          if (self.verfotoById(lista[i]) == null) {
            check.push(lista[i]);
            if (check.length == 5) {
              break;
            }
          }
        }
      }
    } else {
      var n = 5 - top1.length - top2.length - top3.length;
      check = top1.concat(top2, top3);
      for (let i = 0; i < top4.length; i++) {
        if (self.verfotoById(top4[i]) != null) {
          check.push(top4[i]);
          if (check.length == n) {
            break;
          }
        }
      }
      console.log("Com foto: ", check.length);
      if (check.length < 5) {
        for (let i = 0; i < top4.length; i++) {
          if (self.verfotoById(top4[i]) == null) {
            check.push(top4[i]);
            if (check.length == n + 1) {
              break;
            }
          }
        }
      }
    }

    for (let i = 0; i < check.length; i++) {
      if (self.verfotoById(check[i]) != null) {
        foto = self.verfotoById(check[i]);
      } else {
        foto = "https://cdn-icons-png.flaticon.com/512/1695/1695213.png";
      }
      nome = self.vernameById(check[i]);
      posicao = self.verposicaoById(check[i]);

      listaFinal.push({
        Id: check[i],
        Foto: foto,
        Nome: nome,
        Posicao: posicao,
      });
    }

    listaFinal.shift();
    return listaFinal;
  }

  self.records = ko.observableArray([]);

  self.atletas.subscribe(function (newValue) {
    self.bestAtletas(getBestPositions(self.atletas()));
    console.log(self.bestAtletas());
  });

  self.ouro = ko.observable(0);
  self.prata = ko.observable(0);
  self.bronze = ko.observable(0);

  self.checkOuro = ko.computed(function () {
    var composedUri = "http://192.168.160.58/Olympics/api/Statistics/Medals_Games?id=" + self.Id();
    console.log(composedUri);
    ajaxHelper(composedUri, "GET").done(function (data) {
      var ouro = 0;
      var prata = 0;
      var bronze = 0;
      data.map(function (item) {
        ouro += item.Medals[0].Counter;
        prata += item.Medals[1].Counter;
        bronze += item.Medals[2].Counter;
      });
      self.ouro(ouro)
      self.prata(prata)
      self.bronze(bronze)
    });
  });

  self.verOuro = function (id) {
    if (self.ouro()[id()] != null) return self.ouro()[id()];
    else return 0;
  };

  self.verPrata = function (id) {
    if (self.prata()[id()] != null) return self.prata()[id()];
    else return 0;
  };

  self.verBronze = function (id) {
    if (self.bronze()[id()] != null) return self.bronze()[id()];
    else return 0;
  };

  self.nameById = ko.observable({});
  self.fotoById = ko.observable({});
  self.posicaoById = ko.observable({});

  self.vernameById = function (id) {
    if (self.nameById()[id] != null) return self.nameById()[id];
    else return null;
  };

  self.verfotoById = function (id) {
    if (self.fotoById()[id] != null) return self.fotoById()[id];
    else return null;
  };

  self.verposicaoById = function (id) {
    if (self.posicaoById()[id] != null) return self.posicaoById()[id];
    else return null;
  };

  self.IOC.subscribe(function (newValue) {
    var composedUri2 =
      "http://192.168.160.58/Olympics/api/Athletes/ByIOC?ioc=" +
      self.IOC() +
      "&page=1&pagesize=100000";
    ajaxHelper(composedUri2, "GET").done(function (data) {
      for (let i = 0; i < data.Records.length; i++) {
        self.nameById()[data.Records[i].Id] = data.Records[i].Name;
        self.fotoById()[data.Records[i].Id] = data.Records[i].Photo;
        self.posicaoById()[data.Records[i].Id] = data.Records[i].BestPosition;
      }
      self.records(data.Records);

      self.atletas(data.Records);
    });
  });

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getCountrie...");
    var composedUri = self.baseUri() + id;
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.Id(data.Id);
      self.Name(data.Name);
      self.IOC(data.IOC);
      self.Flag(data.Flag);
      self.Events(data.Events);
      self.Participant(data.Participant);
      self.Organizer(data.Organizer);
    });
  };

  self.lenAtletas.subscribe(function (newValue) {
    $("#scroll-button4").click(function () {
      // Scroll to the element with the ID "target-element"
      $("html, body").animate(
        {
          scrollTop: $("#target-element4").offset().top,
        },
        1000
      );
    });
  });

  self.lenParticipant.subscribe(function (newValue) {
    $("#scroll-button1").click(function () {
      // Scroll to the element with the ID "target-element"
      $("html, body").animate(
        {
          scrollTop: $("#target-element1").offset().top,
        },
        1000
      );
    });
  });

  self.lenOrganizer.subscribe(function (newValue) {
    $("#scroll-button3").click(function () {
      // Scroll to the element with the ID "target-element"
      $("html, body").animate(
        {
          scrollTop: $("#target-element3").offset().top,
        },
        1000
      );
    });
  });

  self.lenModalidade.subscribe(function (newValue) {
    $("#scroll-button2").click(function () {
      // Scroll to the element with the ID "target-element"
      $("html, body").animate(
        {
          scrollTop: $("#target-element2").offset().top,
        },
        1000
      );
    });
  });

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
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;

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
  var pg = getUrlParameter("id");
  console.log(pg);
  if (pg == undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
};

$(document).ready(function () {~
  $('#BackTop-button').click(function() {
    // Scroll to the element with the ID "target-element"
    $('html, body').animate({
      scrollTop: $('#target-element').offset().top
    }, 1000);
  });
  console.log("document.ready!");
  ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});
