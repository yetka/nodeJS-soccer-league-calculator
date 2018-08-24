const path = require('path');
const fs = require('fs'); // uses 'fs' node module to manipulate on files system
const TeamResult = require('./TeamResultModel.js');
const GameResult = require('./GameResultModel.js');

// validates of user's input
const nodeFilenamePath = process.argv[1];
const nodeFilename = path.basename(nodeFilenamePath);

if (nodeFilename === '_mocha') {
    console.log('testing with mocha');
} else {
    if ((process.argv.length < 3) || (process.argv.length > 3)) {
        console.log('Invalid input. Type: node ' + nodeFilename + ' FILENAME');
        process.exit(1);
    }

    const userFilename = process.argv[2]; // extracts userFilename from ARGV to use it in readFile method
    processGameData(userFilename);
}

// reads data from file using async readFile method
function processGameData(userFilename) {
    fs.readFile(userFilename, 'utf8', function(err, data) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Processed file: ' + userFilename);
            const games = fileProcessor(data);
            const ranking = gamePointsCalculator(games);
            const groups = groupsConstructor(ranking);
            groupsSortPrint(groups);
        }
    });
}


// function to parse string into TeamResult object
function teamStringParse(team) {
    team = team.trim();
    const teamArray = team.split(' ');
    const teamScore = parseInt(teamArray.pop()); // scores (number)
    const teamName = teamArray.join(' '); // name
    return new TeamResult(teamName, teamScore);
}

// function to extract data from file and transform it into array of objects (GameResult class instances)
function fileProcessor(data) {
    let games = [];
    const fileLines = data.split('\n');
    fileLines.forEach(function(line) {
        const [team1, team2] = line.split(',');
        const game = new GameResult(teamStringParse(team1), teamStringParse(team2));
        games.push(game);
    });
    return games;
}

// function to calculate points for each game, return value is map
function gamePointsCalculator(games) {
    let gameRanking = {};
    games.forEach(function(game) {
        let {
            team1,
            team2
        } = game;
        if (team1.teamPoints === team2.teamPoints) { // change scores into points
            team1.teamPoints = 1;
            team2.teamPoints = 1;
        } else if (team1.teamPoints > team2.teamPoints) {
            team1.teamPoints = 3;
            team2.teamPoints = 0;
        } else {
            team1.teamPoints = 0;
            team2.teamPoints = 3;
        }

        if (gameRanking[team1.teamName] === undefined) {
            gameRanking[team1.teamName] = team1;
        } else { // cumulate points from games
            const tempPoints = team1.teamPoints;
            gameRanking[team1.teamName].teamPoints += tempPoints;
        }

        if (gameRanking[team2.teamName] === undefined) {
            gameRanking[team2.teamName] = team2;
        } else { // cumulate points from games
            const tempPoints = team2.teamPoints;
            (gameRanking[team2.teamName]).teamPoints += tempPoints;
        }
    })
    return gameRanking;
}

// function to create groups of teams with the same amount of points
function groupsConstructor(teamRanking) {
    const ranking = Object.values(teamRanking);
    let teamsOrder = {};
    ranking.forEach(function(team) {
        if (teamsOrder[team.teamPoints] === undefined) {
            teamsOrder[team.teamPoints] = [team.teamName];
        } else {
            teamsOrder[team.teamPoints].push(team.teamName);
        }
    });
    return teamsOrder;
}

function groupsSortPrint(groups) {
    const sortedPointsArray = (Object.keys(groups)).sort().reverse();
    let position = 1;
    sortedPointsArray.forEach(function(point) {
        const group = (groups[point]).sort();
        group.forEach(function(team) {
            console.log(position + '. ' + team + ', ' + pointsToString(point));
        });
        position = position + group.length;
    })
}

// checks point value and convert it into proper string
function pointsToString(point) {
    if (point == 1) {
        point = '1 pt';
    } else {
        point = point + ' pts';
    }
    return point;
}

module.exports.teamStringParse = teamStringParse;
module.exports.fileProcessor = fileProcessor;
module.exports.gamePointsCalculator = gamePointsCalculator;
module.exports.groupsConstructor = groupsConstructor;
module.exports.groupsSortPrint = groupsSortPrint;
module.exports.TeamResult = TeamResult;
module.exports.GameResult = GameResult;
module.exports.pointsToString = pointsToString;