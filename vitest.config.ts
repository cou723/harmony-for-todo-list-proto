import type { Config } from "vitest";

const config: Config = {
	// Specify the test files or directories to include
	include: ["src/**/*.test.ts"],

	// Specify any additional test runner options
	runnerOptions: {
		// Example: Set the timeout for each test case to 5000 milliseconds
		timeout: 5000,
	},

	// Specify any additional TypeScript compiler options
	compilerOptions: {
		// Example: Enable strict mode
		strict: true,
	},

	// Specify any additional Jest configuration options
	jestConfig: {
		// Example: Set the test environment to 'node'
		testEnvironment: "node",
	},
};

export default config;
