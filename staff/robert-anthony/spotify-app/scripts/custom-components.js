"use strict"
// my custom components
/*
*
*
*
* */


function SearchPanel(title, cssClass, tag) {
  Panel.call(this, title, "form");

  this.$searchInput = $("<input type='search' autofocus placeholder='Search term' class='search-panel__input' >");
  this.$element.append(this.$searchInput);
  $("<button type='submit'>Submit</button>").appendTo(this.element);

  this.$element.addClass(cssClass);

  this._onSearch = function () {
  };

  $(this.element).find('button').on('focus', function () {
    this.$searchInput.val("");
  }.bind(this));

  this.$element.on('submit', function (event) {
    event.preventDefault();
    var query = this.$searchInput.val();
    this._onSearch(query);
    this.$searchInput.val("");

  }.bind(this));
}

SearchPanel.prototype = Object.create(Panel.prototype);
SearchPanel.prototype.constructor = SearchPanel;
SearchPanel.prototype.onSearch = function (callback) {
  this._onSearch = callback;
};


/**/
function ResultsList(cssClass) {

  Panel.call(this, "", "ul");
  this.$element.addClass(cssClass);

  this._elementClick = function () {

  };

  this.$element.on('click', function (event) {
    if (event.target === this.element) return null;
    this._elementClick({id: event.target.getAttribute('data-id'), text: event.target.innerHTML});

  }.bind(this))
}


ResultsList.prototype = Object.create(Component.prototype);
ResultsList.prototype.constructor = ResultsList;
ResultsList.prototype.onElementClick = function (callback) {
  this._elementClick = callback;
};
ResultsList.prototype.setData = function (data) {
  this.$element.empty();

  data.forEach(function (element, index) {
    var $li = $("<li><a>" + element.name + "</a></li>" );
    $li.find("a").attr("data-id",element.id).attr("href","#/" + index).addClass("detail-panel__link");
    this.$element.append($li);
  }.bind(this));
};


function TrackDetailPanel(cssClass,linkToggle) {
  ResultsList.call(this, cssClass);
  this.$element.on('click', function (event) {
    if (event.target === this.element) return null;
    if (linkToggle) {
      $(event.target).toggleClass(linkToggle);
    }
    this._elementClick({id: event.target.getAttribute('data-id'), text: event.target.innerHTML});

  }.bind(this))
}

TrackDetailPanel.prototype = Object.create(ResultsList.prototype);
TrackDetailPanel.prototype.constructor = TrackDetailPanel;


TrackDetailPanel.prototype.setData = function (title, data, imageSrc) {
  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }

  this.$element.append($("<h1>" + title + "</h1>"));

  var $img = $("<img>")
  $img.attr("src",imageSrc);
  this.$element.append($img);
  data.forEach(function (element, index) {
    var $li = $("<li><a>" + element.name + "</a></li>" );
    $li.find("a").attr("data-id",element.id).attr("href","#/" + index).addClass("detail-panel__link");
    this.$element.append($li);
  }.bind(this));
};
