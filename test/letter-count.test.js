import { expect } from "chai";
// const { expect } =  require("chai")
import { getLetterCount } from "./letter-count";
// const {getLetterCount} = require("./letter-count")

describe("getLetterCount - basic functionality", () => {
	it("returns an empty object when passed an empty string", () => {
		const expected = {};
		const actual = getLetterCount("");
		expect(actual).to.deep.equal(expected);
	});
});
