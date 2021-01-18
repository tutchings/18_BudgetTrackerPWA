let db;

// create indexedDB for database called "budget"
const request = indexedDB.open("budget", 1);

// create object store called pending
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

// check if app is online, if so, read from db
request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

// if error, console log error
request.onerror = function(event) {
    console.log("Error: " + event.target.errorCode);
};


function saveRecord(record) {
    // create transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");

    // access objectStore and save in store variable
    const store = transaction.objectStore("pending");

    // add record to objectStore
    store.add(record);
}


function checkDatabase() {
    // create transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");

    // access objectStore and save in store variable
    const store = transaction.objectStore("pending");

    // retrieve all records from the store and store in getAll variable
    const getAll = store.getAll();

    // once records are retrieved from store, run /api/transaction/bulk POST request to transfer offline data to mongodb
    //if successful, clear store data so the same data is pushed to mongodb again next time the function runs
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {

                const transaction = db.transaction(["pending"], "readwrite");

                const store = transaction.objectStore("pending");

                store.clear();
            });
        }
    };
}

// event listener for when app is online
window.addEventListener("online", checkDatabase);