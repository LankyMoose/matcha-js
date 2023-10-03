build:
	pnpm run -r build

test:
	make build & pnpm run -r --parallel test
