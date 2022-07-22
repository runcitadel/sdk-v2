# Citadel SDK

<small>Lightweight, type-safe wrapper around the Citadel API.</small>

The Citadel SDK allows you to easily interact with a Citadel node on the local network in your app.
It can power your app, but will also be used in the new Citadel dashboard and mobile app.


### Simple example

```JavaScript
import {Citadel} from "https://deno.land/x/citadel/mod.ts";

console.log("Initializing testing...");
// Try to discover a Citadel
let node = await Citadel.discover() || "http://localhost";
let citadel = new Citadel(node);
console.log("Checking online state...");
console.log(await citadel.isOnline());
console.log("Logging in...");
await citadel.login("password123!", true);
console.log("Testing connection...");
await citadel.manager.auth.test();
```
