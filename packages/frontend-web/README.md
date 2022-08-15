## Getting Started

Requirement:

- NodeJS 11.10.1

Set Environmental Variables:

```
source ./.env
```

Install dependencies:

```
./bin/install
```

## Running Storybook

```
./bin/storybook
```

Visit [http://localhost:9001/](http://localhost:9001/).

## Interactive Storybook Testing

```
cd packages/frontend-web
npm run storybook:test -- -u
```

## Running front-end development server

Run webpack dev server:

```
./bin/watch
```

Vist [http://localhost:80](http://localhost:80).

### Linting

To run linters, use:

```
./bin/lint
```

### Testing

To run tests, use:

```
./bin/test
```
