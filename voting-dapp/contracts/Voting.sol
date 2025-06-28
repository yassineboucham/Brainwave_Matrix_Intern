// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    constructor(string[] memory _candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], 0));
        }
    }

    function vote(uint index) public {
        require(!hasVoted[msg.sender], "You already voted!");
        require(index < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[index].voteCount += 1;
    }

    function getCandidate(uint index) public view returns (string memory, uint) {
        require(index < candidates.length, "Invalid index");
        Candidate memory cand = candidates[index];
        return (cand.name, cand.voteCount);
    }

    function totalCandidates() public view returns (uint) {
        return candidates.length;
    }
}
