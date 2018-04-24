let moment = require('moment');

let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt = 1234;
let date = moment(createdAt);
console.log(date.format('h:mm a'));


// 6:01 am
// let date = moment();
// console.log(date.format('h:mm a'));

//let date = moment();
// date.add(100,'years').subtract(9,'months');//subtracting 9 mth from.
// console.log(date.format('MMM Do, YYYY '));//pass pattern to format()

// Jan 1st 1970 00:00:00 am is 0 timestamp in unix epic UTC timezone => timezone independent
// Dec 31st 1969 23:59:59 is -1000 timestamp in millisecond
// In JS timestamp represents as millisecond.

//new Date().getTime();// getting timestamp
// let date = new Date();
// console.log(date.getMonth());//returns 0 to 11, jan to dec


