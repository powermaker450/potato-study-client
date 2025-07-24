# Potato Study Client

The official client for [Potato Study](https://github.com/powermaker450/potato-study)

## Hosting

1. Follow the instructions for setting up the [server](https://github.com/powermaker450/potato-study)

2. Clone the repo and install the dependencies:

```bash
git clone https://github.com/powermaker450/potato-study-client
cd potato-study-client
pnpm i
```

3. Start a dev server to test out the client:

```bash
pnpm web
```

4. When finished testing the client, create a `.env` file with EXPO_PUBLIC_BASE_URL defined to your public URL:

```
EXPO_PUBLIC_BASE_URL=https://study.example.com
```

5. Build the project and observe the files in the `dist` directory

```
pnpm expo export -p web
```
