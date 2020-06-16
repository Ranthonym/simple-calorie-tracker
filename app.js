// Storage controller
const StorageCtrl = (() => {
  // public methods
  return {
    storeItem: (item) => {
      let items;
      // check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new item
        items.push(item);
        // set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get current ls
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        //reset ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromLocalStorage: () => {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemLocalStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromLocalStorage: (id) => {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromLocalStorage: () => {
      localStorage.removeItem("items");
    },
  };
})();

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
    items: StorageCtrl.getItemsFromLocalStorage(),
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
    getItemById: (id) => {
      let found = null;
      //loop through the items
      stateData.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {
      // calories to number
      calories = parseInt(calories);
      let found = null;
      stateData.items.forEach((item) => {
        if (item.id === stateData.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: (id) => {
      // get all item ids
      ids = stateData.items.map((item) => {
        return item.id;
      });
      // get index
      const index = ids.indexOf(id);
      //remove item
      stateData.items.splice(index, 1);
    },
    clearAllItems: () => {
      stateData.items = [];
    },
    setCurrentItem: (item) => {
      stateData.currentItem = item;
    },
    getCurrentItem: () => {
      return stateData.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;
      stateData.items.forEach((item) => {
        total += item.calories;
      });

      // Set total cal in data structure
      stateData.totalCalories = total;

      // Return total
      return stateData.totalCalories;
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
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
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
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
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
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to an array
      listItems = Array.from(listItems);
      // loop through listItems
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: (id) => {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: () => {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to an array
      listItems = Array.from(listItems);
      // loop through listItems
      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors: () => {
      return UISelectors;
    },
  };
})();

// App controller
const App = ((ItemCtrl, STorageCtrl, UICtrl) => {
  // Load event listeners
  const loadEventListerners = () => {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable submit on enter
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // actual update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // clear all items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add Item Submit
  const itemAddSubmit = (e) => {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for non-empty input field
    if (input.name && input.calories) {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // click edit item
  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      // Get list item ID
      const listId = e.target.parentNode.parentNode.id;
      // break into an array
      const listIdArray = listId.split("-");
      // get actual id
      const id = parseInt(listIdArray[1]);
      // get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // update item submit
  const itemUpdateSubmit = (e) => {
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update local storage
    StorageCtrl.updateItemLocalStorage(updatedItem);

    UICtrl.clearEditState();
    e.preventDefault();
  };

  // delete item event
  const itemDeleteSubmit = (e) => {
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();
    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete item from ui
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete item from local storage
    StorageCtrl.deleteItemFromLocalStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // clear all items event
  const clearAllItemsClick = () => {
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //remove items from ui
    UICtrl.removeItems();
    // hide ul
    UICtrl.hideList();

    StorageCtrl.clearItemsFromLocalStorage();
  };

  // Public methods
  return {
    init: () => {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListerners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
