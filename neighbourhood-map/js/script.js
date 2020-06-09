var self;
var ViewModel = function () {
  self = this;
  this.inputValue=ko.observable("");
  this.side=ko.observable(">");
  this.locations = ko.observableArray([
  {"name" : "Warszawa", "hidden" : true},
  {"name" : "Kraków", "hidden" : true},
  {"name" : "Szczecin", "hidden" : true},
  {"name" : "Wrocław", "hidden" : true},
  {"name" : "Białystok", "hidden" : true},
  {"name" : "Gdańsk", "hidden" : true}
  ]);
  this.openMarker = function() {
    //console.log(this);
    //console.log(this.name);
    for (var i=0; i<googlePins.length; i++)
    {
      if (googlePins[i].name==this.name)
      {
        mapFunctions[i]();
      }
    }
  },
  this.add = function() {
    var text = self.inputValue();
    if (text==="")
      return;
    var pom = self.locations();
    for (var one in pom)
    {
      if (text==pom[one].name)
      {
        alert("This location already used");
        return;
      }
    }
    self.inputValue("");
    self.filter();
    self.locations().push({"name" : text, "hidden" : true});
    self.locations(self.locations());
    //console.log(self.locations());
    initializeMap();
  };
  this.filter = function() {
    var text = self.inputValue();
    var pom=self.locations();
    for (var one in pom) {
      var slo=pom[one].name;
      pom[one].hidden=true;
      if (text.length>slo.length)
      {
        pom[one].hidden=false;
        continue;
      }
      for (var i=0; i<text.length; i++)
      {
        if (text[i].toUpperCase()!=slo[i].toUpperCase())
        {
          pom[one].hidden=false;
          break;
        }
      }
    }
    self.locations([]);
    self.locations(pom);
    initializeMap();
    //console.log(self.locations());
  };
  this.erase = function() {
    //console.log(this);
    //console.log(googlePins);
    //console.log(mapFunctions);
    var imie=this.name;
    var pom=self.locations();
    for (var one=0; one<pom.length; one++)
    {
      if (pom[one].name==imie)
      {
        num=one;
        break;
      }
    }
    while (num<pom.length-1)
    {
      pom[num]=pom[num+1];
      num++;
    }
    for (var obiekty in googlePins)
    {
      if (googlePins[obiekty].name==imie)
      {
        googlePins[obiekty]=googlePins[googlePins.length-1];
        mapFunctions[obiekty]=mapFunctions[mapFunctions.length-1];
        contentStrings[obiekty]=contentStrings[contentStrings.length-1];
        break;
      }
    }
    //console.log(googlePins);
    //console.log(mapFunctions);
    pom.pop();
    googlePins.pop();
    mapFunctions.pop();
    contentStrings.pop();
    self.locations([]);
    self.locations(pom);
    initializeMap();
    //console.log(self.locations());
  };
  this.buttonClick = function() {
    var str="=320";
    if (self.side()==="<")
    {
      str = "-" + str;
      self.side(">");
    }
    else
    {
      str = "+" + str;
      self.side("<");
    }
    //I can't get the sideBar selector and that's why I use the query selector
    //If using that query selector still fails my project, I'd be really grateful for a hint how to avoid using even that one
    $("#sideBar").animate({
      left: str
    }, 2000);
  };
  this.sideBarInit = function() {
    console.log(this);
    return true;
  };
};
ViewModel();
ko.applyBindings(new ViewModel());