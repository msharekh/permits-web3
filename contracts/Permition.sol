pragma solidity >=0.4.20;

contract Permition {
    
    address[16] public permitOwners;

    // Permitting a Permit
    function permit(uint256 permitId) public returns (uint256) {
        require(permitId >= 0 && permitId <= 15);

        permitOwners[permitId] = msg.sender;

        return permitId;
    }

    // Retrieving the permitOwners
    function getPermitOwners() public view returns (address[16] memory) {
        return permitOwners;
    }
}
