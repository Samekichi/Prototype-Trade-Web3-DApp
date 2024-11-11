// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract MCPropertyMarketplace {
    address public owner;
    uint public nextItemId = 1;
    uint public toyNumber = 0;

    struct Item {
        uint id;
        string name;
        string itemType;
        string description;
        address seller;
        uint256 price;
        bool isOnSale;
    }

    // arrays to store items
    mapping (uint => Item) public items;
    mapping (address => mapping (uint => bool)) public sellerItems;
    mapping (address => mapping (uint => bool)) public buyerItems;

    // events for app to monitor
    event ItemAdded(uint indexed id, string name, string itemType, string description, address seller, uint256 price, bool isOnSale);
    event ItemRemoved(uint indexed id, address seller);
    
    event ItemPutOnSale(uint indexed id, address seller);
    event ItemTakenOffSale(uint indexed id, address seller);
    event ItemPurchased(uint indexed id, address seller, address buyer);

    constructor() {
        owner = msg.sender;
    }
    // toy events for testing
    event toyAmountAdded(uint toyNum);
    event paid(uint value, address receiver, address sender);
    // toy function for testing connectin w/ contract
    function addToyAmount(uint amount) public returns (uint) {
        assert(amount >= 0);
        toyNumber += amount;
        emit toyAmountAdded(toyNumber);
        return toyNumber;
    }
    function getSender() public view returns (address) {
        return msg.sender;
    }
    function getOwner() public view returns (address) {
        return owner;
    }
    function getNextItemId() public view returns (uint) {
        return nextItemId;
    }
    function payToOwner() public payable {
        require(msg.value >= 0, "Insufficient payment amount,");

        payable(owner).transfer(msg.value);
        emit paid(msg.value, owner, msg.sender);
    }

    // basic functions of the marketplace
    function addItem(string memory _name, string memory _itemType, string memory _description, uint256 _price) public returns (uint) {
        assert(_price >= 0);  // price cannot be negative
        
        items[nextItemId] = Item(nextItemId, _name, _itemType, _description, msg.sender, _price, false);
        sellerItems[msg.sender][nextItemId] = true;
        nextItemId++;
        emit ItemAdded(nextItemId - 1, _name, _itemType, _description, msg.sender, _price, false);
        return nextItemId;
    }

    function putItemOnSale(uint _itemId) public {
        require(sellerItems[msg.sender][_itemId] || buyerItems[msg.sender][_itemId], "You don't have the right to put this item on sale.");
        require(!items[_itemId].isOnSale, "This item is already on sale.");

        items[_itemId].isOnSale = true;
        emit ItemPutOnSale(_itemId, msg.sender);
    }

    function takeItemOffSale(uint _itemId) public {
        require(sellerItems[msg.sender][_itemId] || buyerItems[msg.sender][_itemId], "You don't have the right to take this item off sale.");
        require(items[_itemId].isOnSale, "This item is not on sale.");

        items[_itemId].isOnSale = false;
        emit ItemTakenOffSale(_itemId, msg.sender);
    }

    function buyItem(uint _itemId) public payable {
        require(items[_itemId].isOnSale, "This item is not on sale.");
        require(msg.value >= items[_itemId].price, "Insufficient payment amount,");

        items[_itemId].isOnSale = false;
        if (sellerItems[items[_itemId].seller][_itemId]) {
            sellerItems[items[_itemId].seller][_itemId] = false;
        } else if (buyerItems[items[_itemId].seller][_itemId]) {
            buyerItems[items[_itemId].seller][_itemId] = false;
        }
        buyerItems[msg.sender][_itemId] = true;
        payable(items[_itemId].seller).transfer(msg.value);
        emit ItemPurchased(_itemId, items[_itemId].seller, msg.sender);
        items[_itemId].seller = msg.sender;
    }

    // for displaying all on sale items / owned items
    function getItemById(uint256 itemId) public view returns (string memory name, string memory itemType, string memory description, address seller, uint256 price, bool isOnSale) {
        require(itemId < nextItemId, "Item w/ this id does not exist.");

        Item storage item = items[itemId];
        return (
            item.name,
            item.itemType,
            item.description,
            item.seller,
            item.price,
            item.isOnSale
        );
    }

    function getAllOnSaleItems() public view returns (uint[] memory) {
        uint[] memory itemIds = new uint[](nextItemId - 1);
        uint itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (items[i].isOnSale) {
                itemIds[itemCount] = items[i].id;
                itemCount++;
            }
        }
        uint[] memory result = new uint[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            result[i] = itemIds[i];
        }
        return result;
    }

        function getSellerItems(address _seller) public view returns (uint[] memory) {
        uint itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (items[i].seller == _seller) {
                itemCount++;
            }
        }
        uint[] memory itemIds = new uint[](itemCount);
        itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (items[i].seller == _seller) {
                itemIds[itemCount] = items[i].id;
                itemCount++;
            }
        }
        return itemIds;
    }

    function getBuyerItems(address _buyer) public view returns (uint[] memory) {
        uint itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (buyerItems[_buyer][i]) {
                itemCount++;
            }
        }
        uint[] memory itemIds = new uint[](itemCount);
        itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (buyerItems[_buyer][i]) {
                itemIds[itemCount] = items[i].id;
                itemCount++;
            }
        }
        return itemIds;
    }

    function getInventory(address _owner) public view returns (uint[] memory) {
        uint unsoldItemCount = 0;
        uint boughtItemCount = 0;
        uint itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (sellerItems[_owner][i]) {
                unsoldItemCount++;
                itemCount++;
            }
        }
        for (uint i = 1; i < nextItemId; i++) {
            if (buyerItems[_owner][i]) {
                boughtItemCount++;
                itemCount++;
            }
        }
        uint[] memory itemIds = new uint[](itemCount);
        itemCount = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (sellerItems[_owner][i]) {
                itemIds[itemCount] = items[i].id;
                itemCount++;
            }
        }
        for (uint i = 1; i < nextItemId; i++) {
            if (buyerItems[_owner][i]) {
                itemIds[itemCount] = items[i].id;
                itemCount++;
            }
        }
        return itemIds;
    }
}