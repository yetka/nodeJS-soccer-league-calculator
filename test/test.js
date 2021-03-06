const expect = require('chai').expect;
const TeamResult = require('../TeamResultModel.js');
const GameResult = require('../GameResultModel.js');
const testingFunc = require('../app.js');
const teamStringParse = testingFunc.teamStringParse;
const fileProcessor = testingFunc.fileProcessor;
const gamePointsCalculator = testingFunc.gamePointsCalculator;
const groupsConstructor = testingFunc.groupsConstructor;
const pointsToString = testingFunc.pointsToString;


const data = `Lions 3, Snakes 3
Tarantulas 1, FC Awesome 0
Lions 1, FC Awesome 1
Tarantulas 3, Snakes 1
Lions 4, Grouches 0`;

describe('teamStringParse()', function() {
    it('should parse string into TeamResult object', function() {
        const teamString1 = 'FC Awesome 1';
        const teamString2 = 'Snakes 3'
        expect(teamStringParse(teamString1)).to.be.an.instanceof(TeamResult);
        expect(teamStringParse(teamString1)).to.deep.equal(new TeamResult('FC Awesome', 1))
        expect(teamStringParse(teamString2)).to.deep.equal(new TeamResult('Snakes', 3))
    });
});

describe('fileProcessor()', function() {
    it('should extract data from file and transform it into array of GameResult objects', function() {
        expect(fileProcessor(data)).to.be.an('array');
        (fileProcessor(data)).forEach(function(gameResult) {
          expect(gameResult).to.be.an.instanceof(GameResult);
        })
    });
});

describe('gamePointsCalculator', function() {
    it('should calculate points for each game and return map', function() {
        const games = fileProcessor(data);
        expect(gamePointsCalculator(games)).to.be.an('object');
        expect(gamePointsCalculator(games)).to.have.all.keys('Tarantulas', 'Lions', 'FC Awesome', 'Snakes', 'Grouches');
        Object.values(gamePointsCalculator(games)).forEach(function(result) {
          expect(result).to.be.an.instanceof(TeamResult);
        })
    });
});

describe('groupsConstructor', function() {
    it('should create groups of teams with the same amount of points', function() {
        const games = fileProcessor(data);
        const gameRanking = gamePointsCalculator(games);
        expect(groupsConstructor(gameRanking)).to.be.an('object');
        expect(groupsConstructor(gameRanking)).to.have.all.keys('0', '1', '5', '6');
        expect(Object.values(groupsConstructor(gameRanking))).to.deep.include(['Snakes', 'FC Awesome']);
    });
});

describe('pointsToString', function() {
    it('should check point value and convert it into proper string', function() {
        const zeroPoint = 0;
        const onePoint = 1;
        const twoPoint = 2;
        expect(pointsToString(zeroPoint)).to.equal('0 pts');
        expect(pointsToString(onePoint)).to.equal('1 pt');
        expect(pointsToString(twoPoint)).to.equal('2 pts');
    });
});