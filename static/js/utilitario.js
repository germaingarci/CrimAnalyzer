function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }

function DateToString(d){
  var r=parseInt(d.getMonth())+1;
  return d.getFullYear()+"-"+r+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":00";
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function arrayObjectIndexOf_Date(myArray, searchTerm, property) {
	let intermedio=(new Date(searchTerm)).getTime();
    for(var i = 0, len = myArray.length; i < len; i++) {
    	let newx= (new Date(myArray[i][property])).getTime();
        if (newx == intermedio) return i;
    }
    return -1;
}