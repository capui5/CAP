sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
  ],
  function (e,UIComponent, History) {
    "use strict";
    return e.extend("empreg.controller.AllEmployees", {
      onInit: function () {
        this.oList = this.byId("employeelist");
        this.oDataModel = this.getOwnerComponent().getModel();
        this.getView().setModel(this.oDataModel);
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
            {
              term: [
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "capm",
              ],
              matches: [
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "capm",
              ],
            },
            { term: ["javascript"], matches: ["react", "node.js"] },
            { term: ["azure"], matches: ["devops", "aws", "azure"] },
            {
              term: ["frontend developer"],
              matches: [
                "html",
                "css",
                "Angular",
                "Fullstack",
                "react.js",
                "vue.js",
                "javascript",
                "wordpress",
                "Fiori",
              ],
            },
            {
              term: ["backend developer"],
              matches: [
                "ABAP",
                "node js",
                "java",
                "Fullstack",
                "python",
                "c",
                "capm",
                "cap",
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "sql",
                "hana database",
                "php",
              ],
            },
            { term: ["data science"], matches: ["Phyton", "Data engineer"] },
            {
              term: ["solution Architect"],
              matches: ["agile", "cloud computing"],
            },

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
          if (aFilters.length === 0) {
            // Only apply the regular search if no specific term match is found
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
          aFilters.push(
            oFNameFilter,
            oLNameFilter,
            oDesigFilter,
            oEmailFilter,
            oCountryFilter
          );
          var combinedFilter = new sap.ui.model.Filter({
            filters: aFilters,
            and: false, // All filters must match for the condition to be met
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
      // formatPhoto: function (employeeID) {
      //   console.log("Employee ID:", employeeID);

      //   if (employeeID) {
      //     var employeeImageUrl = "images/" + employeeID + ".jpg";
      //     console.log("Employee Image URL:", employeeImageUrl);

      //     var img = new Image();
      //     img.src = employeeImageUrl;

      //     return new Promise(function (resolve, reject) {
      //       img.onload = function () {
      //         console.log("Image loaded successfully");
      //         resolve(employeeImageUrl);
      //       };

      //       img.onerror = function () {
      //         console.error("Image not found, using default");
      //         resolve("images/default-boy.jpg");
      //       };
      //     });
      //   } else {
      //     console.log("Employee ID not provided, using default");
      //     return "images/default-boy.jpg";
      //   }
      // },
      formatPhoto: function (employeeID, gender) {
        console.log("Employee ID:", employeeID);
      
        if (employeeID) {
          var employeeImageUrl = "images/" + employeeID + ".jpg";
          console.log("Employee Image URL:", employeeImageUrl);
      
          var img = new Image();
          img.src = employeeImageUrl;
      
          return new Promise(function (resolve, reject) {
            img.onload = function () {
              console.log("Image loaded successfully");
              resolve(employeeImageUrl);
            };
      
            img.onerror = function () {
              console.error("Image not found, using default");
              var defaultImage = "images/default-" + (gender === "male" ? "girl" : "boy") + ".jpg";
              resolve(defaultImage); 
            };
          });
        } else {
          console.log("Employee ID not provided, using default");
          var defaultImage = "images/default-" + (gender === "female" ? "girl" : "boy") + ".jpg";
          return defaultImage;
        }
      },      
      //Log out//
      onLogout:function () {
        window.location.href = "/do/logout";
      },
      //Log out end//
      // HandleSelectionChange
      handleSelectionChange: async function (oEvent) {
        try {
          var oMultiComboBox = oEvent.getSource();
          var aSelectedItems = oMultiComboBox.getSelectedItems();
          var aSelectedSkills = aSelectedItems.map(function (oItem) {
            return oItem.getKey();
          });

          console.log("Selected Skills: ", aSelectedSkills);

          var oList = this.getView().byId("employeelist");
          var oBinding = oList.getBinding("items");

          if (!oBinding) {
            console.error("Binding is undefined.");
            return;
          }

          var aFilters = [];

          // Loop through each selected skill and create a filter
          aSelectedSkills.forEach(function (sSkill) {
            if (sSkill) {
              console.log("Filtering for skill: " + sSkill);

              // Split the selected skill into individual skills
              var individualSkills = sSkill.split(",");

              // Loop through each individual skill and create a filter
              var skillFilters = individualSkills.map(function (
                individualSkill
              ) {
                return new sap.ui.model.Filter({
                  path: "skills",
                  operator: sap.ui.model.FilterOperator.Contains,
                  value1: individualSkill.trim(),
                  caseSensitive: false,
                });
              });

              // Combine the filters for individual skills using "OR" logic
              var combinedFilter = new sap.ui.model.Filter(skillFilters, false);
              aFilters.push(combinedFilter);

              console.log("Added filter for skill: " + sSkill);
            }
          });

          console.log("Applied Filters: ", aFilters);

          // Combine the filters with "OR" logic
          var oCombinedFilter = new sap.ui.model.Filter(aFilters, true); // true for "OR" logic

          console.log("Combined Filter: ", oCombinedFilter);

          // Apply the filter to the binding
          oBinding.filter(oCombinedFilter);

          // Get the filtered items asynchronously
          var aFilteredItems = await this._getFilteredItems(oBinding);

          console.log("Filtered Data: ", aFilteredItems);

          // Clear the filter when no skills are selected
          if (aSelectedSkills.length === 0) {
            oBinding.filter([]);
          }
        } catch (error) {
          console.error("Error: ", error);
        }
      },

      // Helper function to get filtered items asynchronously
      _getFilteredItems: function (oBinding) {
        return new Promise(function (resolve, reject) {
          oBinding.attachEventOnce("dataReceived", function () {
            var aFilteredItems = oBinding
              .getCurrentContexts()
              .map(function (oContext) {
                if (oContext && oContext.getObject) {
                  var item = oContext.getObject();
                  return item;
                }
                return null;
              });
            resolve(aFilteredItems);
          });
        });
      },

      // Handle selection finish in the MultiComboBox
      handleSelectionFinish: function (oEvent) {
        var selectedItems = oEvent.getParameter("selectedItems");

        // Check if any items are selected
        if (selectedItems.length > 0) {
          // Iterate through the selected items
          for (var i = 0; i < selectedItems.length; i++) {
            var selectedItem = selectedItems[i];
            var key = selectedItem.getKey();
            var text = selectedItem.getText();

            // Perform actions for each selected item (e.g., display key and text)
            console.log("Selected Key: " + key);
            console.log("Selected Text: " + text);
          }
        } else {
          // Handle the case where no items are selected
          console.log("No items selected.");
        }
      },
    });
  }
);
