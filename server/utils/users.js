[{
    id:'',
    name: '',
    room: ''
}]

class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        let user = this.get(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    get(id){
        return this.users.filter((user) => user.id===id)[0];
    }

    getUserList(room){
        let users = this.users.filter((user) =>user.room === room);
        let namesArray = users.map((user) =>user.name);

        return namesArray;
    }
}

module.exports = {Users};

// Below is the class and creating instance of it.
// class Person{
//     constructor(name,age){
//         this.name = name;
//         this.age = age;

//     }

//     getUserDescription(){
//         return `${this.name} is ${this.age} year(s) old.`;        
//     }
// }

// let me = new Person('Phyo', 25);
// let description = me.getUserDescription();
// console.log(description);