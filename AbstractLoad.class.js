NGS.AbstractLoad = NGS.Class({
  _package: "",
  _name: "",
  _action: "",
  params: {},
  _args: {},
  permalink: null,
  _parentLoadName: null,
  _abort: false,

  /**
   * The main method, which invokes load operation, i.e. ajax call to the backend and then updates corresponding container with the response
   *
   * @param  params  http parameters which will be sent to the serverside Load, these parameters will be added to the ajax loader's default parameters
   * @param  replace indicates should container be replaced itself(true) with the load response or should be replaced container's content(false)

   */
  service: function (params) {
    if(this.getPermalink() != null){
      NGS.events.onUrlUpdate.data = {
        "load": this
      };
      document.dispatchEvent(NGS.events.onUrlUpdate);
    }
    this.afterLoad(params);
    //fire after load event
    NGS.events.onAfterLoad.data = {
      "load": this
    };
    document.dispatchEvent(NGS.events.onAfterLoad);
    var laodsArr = NGS.getNestedLoadByParent(this.getAction());
    if (laodsArr == null) {
      return;
    }
    for (var i = 0; i < laodsArr.length; i++) {
      NGS.nestLoad(laodsArr[i].load, laodsArr[i].params, this.getAction());
    }
  },

  /**
   * The main method, which invokes load operation, i.e. ajax call to the backend and then updates corresponding container with the response
   *
   * @param  params  http parameters which will be sent to the serverside Load, these parameters will be added to the ajax loader's default parameters
   * @param  replace indicates should container be replaced itself(true) with the load response or should be replaced container's content(false)

   */
  load: function (params, replace) {
    this.params = params;
    this.beforeLoad();
    if (this.abort) {
      return false;
    }
    this.runLoad();
  },

  runLoad: function () {
    NGS.Dispatcher.load(this, this.params);
  },

  /**
   * The main method, which invokes load operation without ajax sending
   *
   * @param  loadName  loadName that will calling
   * @param  params http parameters which will be sent to the serverside Load, these parameters will be added to the ajax loader's default parameters

   */
  nestLoad: function (parent, params) {
    this.beforeLoad();
    this.setParentLoadName(parent);
    this.setArgs(params);
    this.service(params);

  },

  getMethod: function () {
    return "POST";
  },

  getPageTitle: function () {
    return "";
  },

  /**
   * Abstract method for returning container of the load, Children of the AbstractLoad class should override this method
   *
   * @return  The container of the load.

   */
  getContainer: function () {
    return "";
  },

  /**
   * In case of the pagging framework uses own containers, for indicating the container of the main content,
   * without pagging panels
   * @return  The own container of the load

   */
  getOwnContainer: function () {
    return "";
  },

  /**
   * Abstract function, Child classes should be override this function,
   * and should return the name of the server load, formated with framework's URL nameing convention
   * @return The name of the server load, formated with framework's URL nameing convention

   */
  setAction: function (action) {
    this._action = action;
  },

  /**
   * Returns the server side package of the load, if there are included packages, "_" delimiter should be used
   *
   * @return  The server side package of the load

   */
  getAction: function () {
    return this._action;
  },

  /**
   * Abstract function, Child classes should be override this function,
   * and should return the name of the server load, formated with framework's URL nameing convention
   * @return The name of the server load, formated with framework's URL nameing convention

   */
  setName: function (name) {
    this._name = name;
  },

  /**
   * Returns the server side package of the load, if there are included packages, "_" delimiter should be used
   *
   * @return  The server side package of the load

   */
  getName: function () {
    return this._name;
  },

  /**
   * Abstract function, Child classes should be override this function,
   * and should return the name of the server load, formated with framework's URL nameing convention
   * @return The name of the server load, formated with framework's URL nameing convention

   */
  setPackage: function (_package) {
    this._package = _package;
  },

  /**
   * Returns the server side package of the load, if there are included packages, "_" delimiter should be used
   *
   * @return  The server side package of the load

   */
  getPackage: function () {
    return this._package;
  },

  /**
   * Abstract function, Child classes should be override this function,
   * and should return the name of the server load, formated with framework's URL nameing convention
   * @return The name of the server load, formated with framework's URL nameing convention

   */
  getUrl: function () {
    return "";
  },
  /**
   * Method returns Load's http parameters
   *
   * @return  http parameters of the load

   */
  getUrlParams: function () {
    return false;
  },

  /**
   * Method is used for setting load's response parameters
   *
   * @param  args  The http parameters of the load, which will be sent to the server side load

   */
  setArgs: function (args) {
    this._args = args;
  },

  /**
   * Method is used for setting load's http parameters
   *
   * @param  params  The http parameters of the load, which will be sent to the server side load

   */
  setParams: function (params) {
    this.params = params;
  },

  /**
   * Method is used for setting error indicator if it was sent from the server. Intended to be used internally
   *
   * @param  wasError boolean parameter, shows existence of the error

   */
  setError: function (wasError) {
    this.wasError = wasError;
  },

  /**
   * Method returns Load's http parameters
   *
   * @return  http parameters of the load

   */
  getParams: function () {
    return this.params;
  },

  /**
   * Method returns Load's response parameters
   *
   * @return  http parameters of the load

   */
  getArgs: function () {
    return this._args;
  },

  setPermalink: function (permalink) {
    this.permalink = permalink;
  },

  getPermalink: function () {
    return this.permalink;
  },

  setParentLoadName: function (parent) {
    this._parentLoadName = parent;
  },

  getParentLoadName: function () {
    return this._parentLoadName;
  },

  _updateContent: function (html, params) {
    var containerElem = document.getElementById(this.getContainer());
    if (!containerElem) {
      containerElem = document.querySelector(this.getContainer());
    }
    if (!containerElem) {
      throw new Error("please return correct container element id or class");
    }
    this.onUpdateConent(containerElem, html, function () {
      this.service(params);
    }.bind(this));
  },

  onUpdateConent: function (elem, content, callback) {
    elem.innerHTML = content;
    callback();
  },

  /**
   * Function, which is called before ajax request of the load. Can be overridden by the children of the class
   *

   */
  beforeLoad: function () {
    NGS.events.onBeforeLoad.data = {
      "load": this
    };
    document.dispatchEvent(NGS.events.onBeforeLoad);
  },

  /**
   * Function, which is called after load is done. Can be overridden by the children of the class
   * @transport  Object of the HttpXmlRequest class

   */
  afterLoad: function (params) {

  },

  onComplate: function (params) {

  },

  pauseLoad: function () {
    this.abort = true;
  },

  onNoAccess: function (response) {
    if(response.redirect_to){
      window.location.href = response.redirect_to;
      return;
    }
    if(response.redirect_to_load){
      NGS.load(response.redirect_to_load, {});
      return;
    }
  },
  onInvalidUser: function (response) {
    if(response.redirect_to){
      window.location.href = response.redirect_to;
      return;
    }
    if(response.redirect_to_load){
      NGS.load(response.redirect_to_load, {});
      return;
    }
  }
});
