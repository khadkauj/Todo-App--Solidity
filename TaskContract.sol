// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TodoApp {

    struct Task{
        uint id;
        address userAddress;
        string taskText;
        bool completed;
        bool deleted;
    }

    Task[] private tasksList;

    event taskCreated(uint id,address sender);
    event taskCompleted(uint id);
    event taskDeleted(uint id);

    function createTask(string memory taskText) external  {
        uint id = tasksList.length;
        Task memory newTask = Task(id, msg.sender, taskText, false, false);
        tasksList.push(newTask);
        emit taskCreated(id, msg.sender);
    }

    function getAllTasks() external view returns(Task[] memory ){
        Task[] memory myTask = new Task[](tasksList.length);
        uint counter = 0;
        for(uint i = 0; i < tasksList.length ; i++){
            if(tasksList[i].userAddress == msg.sender && tasksList[i].deleted == false){
                myTask[counter++] = tasksList[i];
            }
        }

        Task[] memory result = new Task[](counter);
        for(uint i = 0; i < counter; i++){
            result[i] = myTask[i];
        }

        return result;
    }

    function markTaskCompleted(uint id) external {
        require(tasksList[id].userAddress == msg.sender, 'Unauthorized transaction!');
        tasksList[id].completed = true;
        emit taskCompleted(id);
    }
    
    function markTaskDeleted(uint id) external {
        require(tasksList[id].userAddress == msg.sender, 'Unauthorized transaction!');
        tasksList[id].deleted = true;
        emit taskDeleted(id);
    }

}