// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TradeLogger {

    struct Trade {
        address user;
        string action;
        uint256 price;
        string strategy;
        string symbol;
        uint256 timestamp;
    }

    Trade[] private trades;

    event TradeAdded(
        address indexed user,
        string action,
        uint256 price,
        string strategy,
        string symbol,
        uint256 timestamp
    );

    // Add a trade
    function addTrade(
        string memory _action,
        uint256 _price,
        string memory _strategy,
        string memory _symbol
    ) public {

        trades.push(Trade({
            user: msg.sender,
            action: _action,
            price: _price,
            strategy: _strategy,
            symbol: _symbol,
            timestamp: block.timestamp
        }));

        emit TradeAdded(
            msg.sender,
            _action,
            _price,
            _strategy,
            _symbol,
            block.timestamp
        );
    }

    // Get all trades
    function getTrades() public view returns (Trade[] memory) {
        return trades;
    }

    // Get total trades count
    function getTradeCount() public view returns (uint256) {
        return trades.length;
    }

    // Get trade by index
    function getTrade(uint256 index)
        public
        view
        returns (Trade memory)
    {
        require(index < trades.length, "Invalid index");

        return trades[index];
    }
}