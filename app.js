// Storage Controller
  const StorageCtrl = (function(){

    // Public Method
    return {
      storeItem: function(item){
        let items = [];

        // Checking for Local Storage.
        if(localStorage.getItem('items') === null) {
          items = [];

            // Pushing Item to Items.
          items.push(item);

          // Setting Local Storage.
         localStorage.setItem('items', JSON.stringify(items))

        } else {

          // Get What is in LS
          items = JSON.parse(localStorage.getItem('items'));

          // Push Item to Items.
          items.push(item);

          // Re Set LS
          localStorage.setItem('items', JSON.stringify(items));
        };
      },

      getItemsFromLs: function(){
        let items = [];

        if(localStorage.getItem('items') === null){
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        };

        return items;
      },

      updateItemFromStorage : function(updatedItem){
        const items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){
          if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },

      deleteItemFromStorage: function(id){
        const items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },

      clearItemsFromStorage : function(){
        localStorage.removeItem('items');
      }

      
    };

})();


// Item Controller

  const ItemCtrl = (function(){

    
    //Item Constructor

    const Item = function(id, name, calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
    }


    // Data Structure / State
    const data = {
      // items : [
        // {id: 0, name:'Steak Dinner', calories: '1200'},
        // {id: 1, name:'Cookies ', calories: '400'},
        // {id: 2, name:'Eggs', calories: '300'}
      // ],

      items: StorageCtrl.getItemsFromLs(),
      currentItem: null,
      totalCalories: 0
    };

    // Public Methods
    return {
      getItems: function(){
        return data.items
      },

      addItem: function(name, calories){
        
        // Creating IDs
        let ID;
        if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        };

        
        // Calories to number
        calories = parseInt(calories);

        //Creating new item
        newItem = new Item(ID, name, calories);

        // Add Items array.
        data.items.push(newItem);

        return newItem;
      }, 

      getItemById: function(id){
        let found = null;

        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          };
        });
        return found;
      },

      updateItem: function(name, calories){

        //calories to number
        calories = parseInt(calories);

        let found = null;

        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },

      deleteItem: function(id){
        ids = data.items.map(function(item){
          return item.id;
        });

        // Get index
        const index = ids.indexOf(id);

        // Remove Item
        data.items.splice(index, 1);
      },

      clearAllItems: function(){
        data.items = [];
      },

      setCurrentItem: function(item){
        data.currentItem = item;
      },

      getCurrentItem: function(){
        return data.currentItem;
      },

      getTotalCalories: function(){
        let total = 0;

        // Loop through items and add calories.
        data.items.forEach(function(item){
          total += item.calories;
        });

        // Set total calories in data structure 
        data.totalCalories = total;

        return data.totalCalories;
      },

      logData: function(){
        return data;
        
      }
    }
})();



// UI Controller
  const UICtrl = (function(){

    // UI Selectors
    const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      itemNameInput:'#item-name',
      itemCaloriesInput:'#item-calories',
      totalCalories: '.total-calories',
      editItem: 'edit-item',
      clearBtn : '.clear-btn',
    };  

    // Public Methods
    return{
      populateItemList: function(items){
        let html = '';

        items.forEach(function(item){
          html += `
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}:</strong> <em> ${item.calories} Calories</em>
          <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          </li>
          `
        });

        // Insert list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },

      getItemInput: function(){
        return {
          name: document.querySelector(UISelectors.itemNameInput).value,
          calories: document.querySelector(UISelectors.itemCaloriesInput).value,
        };
      },

      addListItem: function(item){

        document.querySelector(UISelectors.itemList).style.display = 'block'

        // Creating li
        const li = document.createElement('li')
        li.className = 'collection-item'
        li.id = `item-${item.id}`

        // Add HTML
        li.innerHTML = `
        <strong>${item.name}:</strong> <em> ${item.calories} Calories</em>
        <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `;
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
      },
      
      updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        listItems = Array.from(listItems)

        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');

          if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML =`
            <strong>${item.name}:</strong> <em> ${item.calories} Calories</em>
            <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `
          };
          
        });
      },

      deleteListItem: function(id){
        const itemId = `#item-${id}`;
        const item = document.querySelector(itemId);
        item.remove();
      },

      clearInputs: function(){
       document.querySelector(UISelectors.itemNameInput).value = '';
       document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },

      removeItems: function(){
   
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // Convert Node to Array
      listItems =Array.from(listItems)

      // Loop through the list items
      listItems.forEach(function(item){
        item.remove();
      });
      },

      hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
      },
      
      showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
      },

      clearEditState: function(){
        UICtrl.clearInputs();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';

      },

      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },

      addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      },

      getSelectors: function(){
        return UISelectors;
      },
    };
      
})();




// App Controller
  const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    
    // load event listeners
    const loadEventListeners = function(){

      // Getting UI Selectors
      let UISelectors = UICtrl.getSelectors();

      // Add Item Events
      document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

      // Disable submit on enter
      document.addEventListener('keypress', function(e){

        if(e.keyCode === 13 || e.which === 13){
          e.preventDefault();
          return false;
        }
      });


      // Item edit Events
      document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

      // Update Item Events
      document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

      // Back Button Events
      document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

      // Delete Button Events
      document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

      //Clear Button Event
      document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
      
      

    };

    // Add Item Submit
    const itemAddSubmit = function(e){
      
      //Get form input from UICtrl
      const input = UICtrl.getItemInput();
      

      // Checking for name and calories input.

      if(input.name !== '' && input.calories !== ''){
        
        // Add Item
        let newItem = ItemCtrl.addItem(input.name, input.calories);

     

        //Add item to UI list 
        UICtrl.addListItem(newItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI list.
        UICtrl.showTotalCalories(totalCalories);

        // Store in Local Storage.
        StorageCtrl.storeItem(newItem);

        // Clear fields
        UICtrl.clearInputs();

      };
      e.preventDefault();
    };

    // Click edit item
    const itemEditClick = function(e){

      let UISelectors = UICtrl.getSelectors();
      
      if(e.target.classList.contains('edit-item')){
        // Get list item id
        const listId = e.target.parentNode.parentNode.id;

        // Break into an array
        const listIdArr = listId.split('-');

        // Get the actual id
        const id = parseInt(listIdArr[1]);

        // Get item
        const itemToEdit = ItemCtrl.getItemById(id);

        // Set Current Item.
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add Item to Form.
        UICtrl.addItemToForm();
       
      } 

      e.preventDefault();
    };
    

    const itemUpdateSubmit = function(e){
      // Get item input
      const input = UICtrl.getItemInput();

      // Update item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      UICtrl.updateListItem(updatedItem);
    
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI list.
      UICtrl.showTotalCalories(totalCalories);

      // Update Local Storage
      StorageCtrl.updateItemFromStorage(updatedItem);

      // Clear Edit State.
      UICtrl.clearEditState();

      // UICtrl.clearInputs();

      e.preventDefault();
    };


    // Delete button event.
    const itemDeleteSubmit = function(e){

      // Get Current Item.
      const currentItem = ItemCtrl.getCurrentItem();

      // Delete from data structure
      ItemCtrl.deleteItem(currentItem.id)

      // Delete from UI
      UICtrl.deleteListItem(currentItem.id);

     // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();

     // Add total calories to UI list.
     UICtrl.showTotalCalories(totalCalories);

     // Delete from Local Storage
     StorageCtrl.deleteItemFromStorage(currentItem.id);

     // Clear Edit State.
     UICtrl.clearEditState();

      e.preventDefault();
    };

    // Clear All Item Click
    const clearAllItemsClick = function(){

      // Delete All Items From Data Structure
      ItemCtrl.clearAllItems();

      // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();

     // Add total calories to UI list.
     UICtrl.showTotalCalories(totalCalories);

      // Remove from UI
      UICtrl.removeItems()

      // Clear From Local Storage
      StorageCtrl.clearItemsFromStorage();

      UICtrl.hideList();
    }
    

    // Public Methods
    return{
      init: function(){

        // Clear edit state
        UICtrl.clearEditState();

       // Fetching Items from (ItemCtrl data structure)
       const items = ItemCtrl.getItems();

       // Check for items
       if(items.length === 0){
        UICtrl.hideList();

       } else {

       // Populating list with items.
       UICtrl.populateItemList(items);
      };

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI list.
      UICtrl.showTotalCalories(totalCalories);
       

       // Load event listener 
       loadEventListeners();
      },

    };
      
})(ItemCtrl, StorageCtrl, UICtrl);
  App.init()