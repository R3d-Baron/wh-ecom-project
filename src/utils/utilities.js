const crypto = require('crypto');
const axios = require('axios');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

const dateFormat = (date) => {
    return new Date(date).getFullYear()+'-'+(new Date(date).getMonth() + 1).toString().padStart(2,'0')+'-'+new Date(date).getDate().toString().padStart(2,'0')
}
const dateFormatDDMMYYYY = (dateToBeFormatted) => {
    let date =
        new Date().getDate().toString().padStart(2, "0") +
        "-" +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date().getFullYear();

    if (dateToBeFormatted != "") {
        date =
            new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
            "-" +
            (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            new Date(dateToBeFormatted).getFullYear();
    }
    return date;
};
const dateFormatYYYYMMDD = (dateToBeFormatted) => {
    let date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date().getDate().toString().padStart(2, "0");

    if (dateToBeFormatted != "") {
        date =
            new Date(dateToBeFormatted).getFullYear() +
            "-" +
            (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            new Date(dateToBeFormatted).getDate().toString().padStart(2, "0");
    }
    return date;
};
const fullDatetimeFormat = (dateToBeFormatted) => {
    var date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date().getDate().toString().padStart(2, "0") +
        " " +
        new Date().getHours().toString().padStart(2, "0") +
        ":" +
        new Date().getMinutes().toString().padStart(2, "0") +
        ":" +
        new Date().getSeconds().toString().padStart(2, "0");

    if (dateToBeFormatted != "") {
        date =
            new Date(dateToBeFormatted).getFullYear() +
            "-" +
            (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
            " " +
            new Date(dateToBeFormatted).getHours().toString().padStart(2, "0") +
            ":" +
            new Date(dateToBeFormatted).getMinutes().toString().padStart(2, "0") +
            ":" +
            new Date(dateToBeFormatted).getSeconds().toString().padStart(2, "0");
    }
    return date;
};
const fullDatetimeFormatYYYYMMDDHHMMSS = (dateToBeFormatted) => {
    var date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date().getDate().toString().padStart(2, "0") +
        " " +
        new Date().getHours().toString().padStart(2, "0") +
        ":" +
        new Date().getMinutes().toString().padStart(2, "0") +
        ":" +
        new Date().getSeconds().toString().padStart(2, "0");

    if (dateToBeFormatted != "") {
        date =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            new Date().getDate().toString().padStart(2, "0") +
            " " +
            new Date().getHours().toString().padStart(2, "0") +
            ":" +
            new Date().getMinutes().toString().padStart(2, "0") +
            ":" +
            new Date().getSeconds().toString().padStart(2, "0");
    }
    return date;
};
const fullDatetimeFormatDDMMYYYYHHIIAA = (dateToBeFormatted) => {
    var date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date().getDate().toString().padStart(2, "0") +
        " " +
        new Date().getHours().toString().padStart(2, "0") +
        ":" +
        new Date().getMinutes().toString().padStart(2, "0") +
        ":" +
        new Date().getSeconds().toString().padStart(2, "0");

    if (dateToBeFormatted != "") {
        date =
            new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
            "-" +
            (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            new Date(dateToBeFormatted).getFullYear() +
            " " +
            convertTime24To12(
                new Date(dateToBeFormatted).getHours().toString().padStart(2, "0") +
                ":" +
                new Date(dateToBeFormatted).getMinutes().toString().padStart(2, "0") +
                ":" +
                new Date(dateToBeFormatted).getSeconds().toString().padStart(2, "0")
            );
    }
    return date;
};
const convertTime24To12 = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
        time,
    ];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
};
const convertTime12To24 = (time12h) => {
    var [time, modifier] = time12h.split(" ");

    var [hours, minutes] = time.split(":");

    if (hours === "12") {
        hours = "00";
    }

    if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
    }
    return hours + ":" + minutes;
};

const convertDateToIst12Time = (dateformet) => {
    const utcTimestamp = dateformet; // Replace with your UTC timestamp

    // Create a Date object from the UTC timestamp
    const date = new Date(utcTimestamp);

    // Define options for formatting
    const options = {
        timeZone: "Asia/Kolkata", // IST timezone
        hour12: true, // Use 12-hour format
        hour: "numeric", // Display hours
        minute: "numeric", // Display minutes
    };

    // Format the date in IST 12-hour format
    const istTime = date.toLocaleString("en-IN", options);

    return istTime;
}

const generateOTP = (length) => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

const isTimeBefore = (time1, time2) => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const date1 = new Date();
    date1.setHours(hours1);
    date1.setMinutes(minutes1);

    const date2 = new Date();
    date2.setHours(hours2);
    date2.setMinutes(minutes2);

    return date1.getTime() < date2.getTime();
}
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
}

function calculateTimeInKilometers(distanceInKm, speedInMph) {
    // Convert speed from mph to km/h (1 mph is approximately 1.60934 km/h)
    const speedInKmh = speedInMph * 1.60934;
    // Calculate the duration in hours
    const durationHours = distanceInKm / speedInKmh;
    const durationMinutes = durationHours * 60;
    return durationMinutes;
}

// function convertMinutesToHours(minutes) {
//     const hours = minutes / 60;
//     const roundedHours = hours.toFixed(1);
//     return roundedHours;
// }

function convertMinutesToHours(minutes) {
    if (minutes < 60) {
        minutes = Math.round(minutes);
        return `${minutes} min`;

    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${Math.round(hours)} hrs`;
        } else {
            return `${hours} hrs ${Math.round(remainingMinutes)} min`;
        }
    }
}

function getDateRangeForWeeks(weeksAgo) {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDayOfWeek);

    // Calculate the end date of the current week (today)
    const endDate = new Date(currentDate);

    // Adjust the start date and end date for the specified number of weeks ago
    startDate.setDate(startDate.getDate() - (weeksAgo * 7));
    endDate.setDate(endDate.getDate() - (weeksAgo * 7));

    // Format the dates as strings in "YYYY-MM-DD" format
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    return { startDate: startDateString, endDate: endDateString };
}

function getDateRangeForPreviousDays(endDate, daysAgo) {
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysAgo);

    // Format the dates as strings in "YYYY-MM-DD" format
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    return { startDate: startDateString, endDate: endDateString };
}

function calculateTimeDifferenceInMinutes(givenDateStr) {
    // The given date
    const givenDate = new Date(givenDateStr);

    // Current date and time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = currentDate - givenDate;

    // Convert milliseconds to minutes
    const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

    return timeDifferenceMinutes;
}

function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const pointInPolygonWithRadius = (point, polygon, radius) => {
    const x = point.lat;
    const y = point.lng;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat;
        const yi = polygon[i].lng;
        const xj = polygon[j].lat;
        const yj = polygon[j].lng;

        // Check if the point is within the bounding box of the polygon with a radius
        const withinBoundingBox = x >= Math.min(xi, xj) - radius &&
            x <= Math.max(xi, xj) + radius &&
            y >= Math.min(yi, yj) - radius &&
            y <= Math.max(yi, yj) + radius;

        if (withinBoundingBox) {
            // Check if the point is within the radius of any line segment of the polygon
            const distance = Math.abs(
                (yj - yi) * x - (xj - xi) * y + xj * yi - yj * xi
            ) / Math.sqrt((yj - yi) ** 2 + (xj - xi) ** 2);

            if (distance <= radius) {
                return true;
            }
        }
    }

    return false;
};

// Function to calculate the central point
function calculateCentralPoint(coordinates) {
    if (coordinates.length === 0) {
        return null; // No coordinates to calculate
    }

    // Calculate average latitude and longitude
    const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const avgLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

    return { lat: avgLat, lng: avgLng };
}

function getTimeLabel(timeDifferenceHours) {
    if (timeDifferenceHours < 24) {
        return "Today";
    } else if (timeDifferenceHours < 48) {
        return "Yesterday";
    } else {
        return `${Math.ceil(timeDifferenceHours)} hours ago`;
    }
}

module.exports = {
    dateFormat,
    dateFormatDDMMYYYY,
    fullDatetimeFormat,
    convertTime24To12,
    convertTime12To24,
    fullDatetimeFormatDDMMYYYYHHIIAA,
    fullDatetimeFormatYYYYMMDDHHMMSS,
    dateFormatYYYYMMDD,
    convertDateToIst12Time,
    generateOTP,
    getTimeLabel,
    isTimeBefore,
    calculateDistance,
    calculateTimeInKilometers,
    calculateTimeDifferenceInMinutes,
    sumArray,
    calculateCentralPoint,
    pointInPolygonWithRadius,
};
