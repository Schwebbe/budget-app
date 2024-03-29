// This is an Immediately Invoked Function Expression (IIFE)
//IIFE 1 (BUDGET CONTROLLER)
var budgetController = (function () {

    //These variables are private 
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    //Ends here
    
    
   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       },
       budget: 0,
       percentage: -1
   };
    //Returns an object after variables are declared
    //Only here can we use the add function because this object is public
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            //ID = last ID + 1
            
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure - we don't need an if-else statement to determine which array we want to push the data
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            //This indexOf method returns the index number of the element of the array that is input

            index = ids.indexOf(id);

            if(index !== -1) {
                                            //The first arguement is to position the number we want to start deleting
                                            //this will start removing elements at the number "index". It will remove exactly 1 id.
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate total budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that is spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
            
        },
        getBudget: function() {
            return {
                budget: data.budget + " SEK",
                totalInc: data.totals.inc + " SEK",
                totalExp: data.totals.exp + " SEK",
                percentage: data.percentage
            };
        },
        testing: function() {
            console.log(data);
        }
        
    };

})();


//IIFE 2 (BUDGET CONTROLLER)
var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // WIll be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat takes a string and turns it into a number
            };

        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text

            // If it's an income, add the following html
            if (type === 'inc') {
                
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div>'
                + '<div class="right clearfix"> <div class="item__value">%value% SEK</div>' + '<div class="item__delete">'
                + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' + 
                    '</div></div></div>';
                    //If it's an expense, do the same
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'
                + '<div class="right clearfix"><div class="item__value">- %value% SEK</div>'
                + '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>'
                + '</button></div></div></div>';
            }
            
            
            
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },


        //With this we can loop over the array and clear all fields that were selected
        clearFields: function() {
            //This fields variable holds the result of the selection
           var fields, fieldsArr;
           
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            //This will trick the slice method into thinking fields will be an array  so it will return an array
            fieldsArr =  Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();



//IIFE 3 (This controlls IIFE 1 and 2 in parameters)
//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener("keypress", function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    // This function is called whenever we add a new item

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetController.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetController.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    // Tells the item modules what it should do and then gets data back
    var ctrlAddItem = function () {
        var input, newItem;
        
        
        // 1. Get the field input data
        var input = UICtrl.getInput();
        
        //this if statement checks if the description is an empty string, and if the input value is not a number or and greater than 0.

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the input fields
            UICtrl.clearFields();

            // 5. Calculate and update budget

            updateBudget();
        }

       
    
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        //This itemID will check for the fourth parent node in the container.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            //This splits strings that contain an - into an array -> example: inc-1 => ["inc", "1"]
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete an item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete an item from the UI

            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget

            updateBudget();

        }
    };
    
    return {
        init: function() {
            console.log("Application has started.");
            //This will display the budget as 0, and percentage as -1, because default will have no values
            UICtrl.displayBudget({
                budget: 0 + " SEK",
                totalInc: 0 + " SEK",
                totalExp: 0 + " SEK",
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();