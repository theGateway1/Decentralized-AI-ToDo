// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TaskContract {
    event TaskCreated(uint id, address recipient);
    event TaskUpdated(uint id, address recipient);
    event TaskDeleted(uint id, bool deleted);

    struct Task {
        uint id;
        string taskText;
        address ownerAddress;
        bool completed;
        bool deleted;
    }

    Task[] private tasks;

    // Mapping from task index to owner address - allows efficient check whether task belongs to the caller
    mapping(uint256 => address) taskIndexToOwnerAddressMap;


    function addTask(string memory _taskText, address _ownerAddress) external {
        uint curTaskId = tasks.length;
        tasks.push(Task(curTaskId, _taskText, _ownerAddress, false, false));
        taskIndexToOwnerAddressMap[curTaskId] = _ownerAddress; // Add mapping from task index to owner address
        emit TaskCreated(curTaskId, _ownerAddress);
    }

    function toggleTodoStatus(uint _taskId, address _ownerAddress) external {
        // Check if task at index _taskId belongs to the caller
        if(taskIndexToOwnerAddressMap[_taskId] == _ownerAddress) {
            bool completed = tasks[_taskId].completed;
            tasks[_taskId].completed = !completed;
        }
    }

    function deleteTask(uint _taskId, address _ownerAddress) external {
        // Check if task at index _taskId belongs to the caller
        if(taskIndexToOwnerAddressMap[_taskId] == _ownerAddress) {
            tasks[_taskId].deleted = true;
            emit TaskDeleted(_taskId, true);
        }
    }

    function updateTask(uint _taskId, string memory _taskText, address _ownerAddress) external {
        // Check if task at index _taskId belongs to the caller
        if(taskIndexToOwnerAddressMap[_taskId] == _ownerAddress) {
            tasks[_taskId].taskText = _taskText;
            emit TaskUpdated(_taskId, _ownerAddress);
        }
    }

    function getUserTasks(address _ownerAddress) external view returns (Task[] memory) {
        Task[] memory temp = new Task[](tasks.length);
        uint count = 0;
        for (uint i = 0; i < tasks.length; i++) {
            if (taskIndexToOwnerAddressMap[i] == _ownerAddress && !tasks[i].deleted) {
                temp[count] = tasks[i];
                count++;
            }
        }
        Task[] memory userTasks = new Task[](count);
        for (uint i = 0; i < count; i++) {
            userTasks[i] = temp[i];
        }
        return userTasks;
    }
}