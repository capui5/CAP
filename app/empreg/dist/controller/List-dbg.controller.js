sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent,History) {
    "use strict";
   
    return Controller.extend("empreg.controller.List", {
        onInit: function () {
            this.oList = this.byId("employeelist");
           this.oDataModel = this.getOwnerComponent().getModel();
            this.getView().setModel(this.oDataModel);
            // this._sPreviousEmployeeId = null;
           },
        
        //Nav Back start//
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("View1", {}, true);
            }
        },
        //nav back end//
        //search start//
        onAdvancedSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = this.getView().byId("employeelist");
            var oBinding = oList.getBinding("items");
            if (oBinding) {
                var aFilters = [];
                var sNormalizedQuery = sQuery.toLowerCase();
                var aSearchData = [
                    { term: ["cloud", "cloud development", "cloud application programming", "cloud application programming model", "capm"], matches: ["cloud", "cloud development", "cloud application programming", "cloud application programming model", "capm"] },
                    { term: ["javascript"], matches: ["react","node.js"] },
                    { term: ["azure"], matches: ["devops", "aws","azure"] },
                    { term: ["frontend developer"], matches: ["html","css","Angular","Fullstack","react.js","vue.js","javascript","wordpress","Fiori"] },
                    { term: ["backend developer"], matches: ["ABAP","node js","java","Fullstack","python","c","capm","cap","cloud", "cloud development", "cloud application programming", "cloud application programming model","sql","hana database","php"] },
                    { term: ["data science"], matches: ["Phyton","Data engineer"] },
                    { term: ["solution Architect"], matches: ["agile","cloud computing"] },

                    // Add more terms as needed
                ];
                aSearchData.forEach(function (searchItem) {
                    if (searchItem.term.includes(sNormalizedQuery)) {
                        searchItem.matches.forEach(function (match) {
                            var oFilter = new sap.ui.model.Filter({
                                path: "skills",
                                operator: sap.ui.model.FilterOperator.Contains,
                                value1: match,
                                caseSensitive: false,
                            });
                            aFilters.push(oFilter);
                        });
                    }
                });
                if (aFilters.length === 0) { // Only apply the regular search if no specific term match is found
                    var oRegularFilter = new sap.ui.model.Filter({
                        path: "skills",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false,
                    });
                    aFilters.push(oRegularFilter);
                }
                var oFNameFilter = new sap.ui.model.Filter({
                    path: "fname",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oLNameFilter = new sap.ui.model.Filter({
                    path: "lname",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oDesigFilter = new sap.ui.model.Filter({
                    path: "desig",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oEmailFilter = new sap.ui.model.Filter({
                    path: "email",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oCountryFilter = new sap.ui.model.Filter({
                    path: "country/name",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                aFilters.push(oFNameFilter, oLNameFilter, oDesigFilter, oEmailFilter,oCountryFilter);
                var combinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // All filters must match for the condition to be met
                });
                oBinding.filter(combinedFilter);
            }
        },
        //search end//
        //Add new employee start//
        onaddnewemployee: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View5");
        },
        //Add new employee end//
                //Binding data//
                onListItemPress: function (e) {
                    var listItem = e.getSource(); 
            
                    if (listItem) {
                      var bindingContext = listItem.getBindingContext("MainModel");
                      if (bindingContext) {
                        var employeeId = bindingContext.getProperty("ID");
                        var router = sap.ui.core.UIComponent.getRouterFor(this);
                        router.navTo("View6", { SEmployeeId: employeeId });
                      } else {
                        console.error("Binding context is not available.");
                      }
                    } else {
                      console.error("List item is not available.");
                    }
                  },
      
        
    });
});