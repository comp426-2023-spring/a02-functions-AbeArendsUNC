#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));
    if (args.h) {
        console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
    }
    
    let latitude;
    let longitude;
    let timezone;
    let day;
    let output;

    if(args.t) {
        timezone = args.t;
    } else {
        timezone = moment.tz.guess();
    }
    
    if(args.n) {
        latitude = args.n;
    } else if(args.s) {
        latitude = args.s * -1;
    } else {
        process.exit(0);
    }

    if(args.e) {
        longitude = args.e;
    } else if(args.w) {
        longitude = args.w * -1;
    } else {
        process.exit(0);
    }

    if("d" in args) {
        day = args.d;
    } else {
        day = 1;
    }

    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&timezone=" + timezone;
    const response = await fetch(url);
    const data = await response.json();

    // If -j was used, return the json
    if(args.j) {
        console.log(data);
        process.exit(0);
    }

    // else, print our information

    if(data.daily.precipitation_hours[day] > 0) {
        output = "It will rain ";
    } else {
        output = "It will NOT rain ";
    }

    if (day == 0) {
        output += "today.";
    } else if (day > 1) {
        output += "in " + day + " days.";
    } else {
        output += "tomorrow.";
    }

    console.log(output);
    process.exit(0);

    