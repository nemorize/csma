# CSMA
Centralized SSH Management Application.<br />
Server side project can be found at [nemorize/csma-server](https://github.com/nemorize/csma-server).

## Installation
```bash
npm install -g csma
csma help
```

## Usage
All commands below can be found at the result of `csma help` command.

### Auth
Make authenticated to the central server.
```bash
csma auth https://csma.domain.org/
```

### Key
Generate a new key and upload the public key to authenticated central server.<br />
You can generate a key with a specific passphrase, or leave empty with `--preserve-empty` option.
```bash
csma key PaSsPhRaSeToEnCrYpT

# Or you can...
csma key --preserve-empty
```

### Connect
Connect to an SSH server immediately.
```bash
csma connect aliasname
```

### Ready
Ready to connect an SSH server.<br />
After running this command, you can connect to the SSH server with custom SSH client like VSC SSH extension.
```bash
csma ready aliasname
```

### List
Get all available SSH servers that you can connect into.
```bash
csma list
```

### Reset
Remove authentication information and a generated key.
```bash
csma reset
```

## License
MIT license.