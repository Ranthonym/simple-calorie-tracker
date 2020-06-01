// Storage controller

// Item controller
const ItemCtrl = (() => {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data Structure / State
  const stateData = {
    items: [
      // { id: 0, name: "Steak", calories: 1200 },
      // { id: 0, name: "Cake", calories: 500 },
      // { id: 0, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: () => {
      return stateData.items;
    },
    addItem: (name, calories) => {
      let ID;
      // Create ID
      if (stateData.items.length > 0) {
        ID = stateData.items[stateData.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = Number(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      stateData.items.push(newItem);

      return newItem;
    },
    logData: () => {
      return stateData;
    },
  };
})();

// UI controller
const UICtrl = (() => {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
  };
  // Public Methods
  return {
    populateItemList: (items) => {
      let html = "";

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: (item) => {
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    getSelectors: () => {
      return UISelectors;
    },
  };
})();

// App controller
const App = ((ItemCtrl, UICtrl) => {
  // Load event listeners
  const loadEventListerners = () => {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  // Add Item SUbmit
  const itemAddSubmit = (e) => {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for non-empty input field
    if (input.name && input.calories) {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Public methods
  return {
    init: () => {
      const items = ItemCtrl.getItems();

      //Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListerners();
    },
  };
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
