# Sort example

Using order and before together.

```javascript
module.exports = {
    inputBase: "input",
    outputBase: "output",
    output: {
        "entry1.txt": {
            use: async function (entry) {  
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "entry2.txt": {
            use: async function (entry) {      
                entry.content = new Date().getTime(); 
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        },
        "entry3.txt": {
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ],
            order: 3
        },
        "entry4.txt": {
            use: async function (entry) {             
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "entry5.txt": {
            use: async function (entry) {   
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "entry6.txt": {
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "entry7.txt": [{
            use: async function (entry) { 
                entry.content = new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt"
        }, {
            use: async function (entry) {    
                entry.content = new Date().getTime();  
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        }],
        "entry8.txt": {
            id:"8",
            use: async function (entry) {         
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before: "9"
        },
        "entry9.txt": {
            id:"9",
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "entry10.txt": [{
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before: "8"
        }, {
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        }],
        "entry11.txt": {
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before:"8"
        }
    }
}
```
