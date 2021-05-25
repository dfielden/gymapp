import {ajaxTimeoutMillis} from './_constsAndEls.js';

const timeout = function (millis) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long. Timeout after ${millis} milliseconds`));
        }, millis);
    });
};

// define get vs post dependent on whether upload data added to method call
export const AJAX = async function(url, uploadData = undefined) {
    try {
        // POST if uploadData added to argument
        const fetchPromise = uploadData ?
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadData)
            })
            // GET by default
            : fetch(url);

        const res = await Promise.race([fetchPromise, timeout(ajaxTimeoutMillis)]); // two promises will race - timeout returns reject after time argument - i.e. we can add a timeout for load failure
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        // throw err to deal with at point where function is called
        throw err;
    }
};