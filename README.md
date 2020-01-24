# 👷 Universal React (with Workers!)

## Making your own `wrangler.toml`

For security reasons, the `wrangler.toml` that is required to build this project is not included in the git repository. Your config file should look similar to this template.

```toml
name = "uni_worker"
type = "webpack"
webpack_config="webpack.worker.js"
account_id = "__YOUR_WORKERS_ACCOUNT_ID__"
workers_dev = true
route = ""
zone_id = ""

kv-namespaces = [
  { binding = "__YOUR_KV_NAME__", id = "__YOUR_KV_ID__" }
]
```

## Building

### Development

To start developing, run the following command to start up the development server. We won't have the worker script running in development so
there should be handling for cases that remote data is not present.

```shell
$ yarn start:dev
```

This will start up `webpack-dev-server` @ `http://locahost:8080` and watch for changes.

### Production

When building for production we run 2 webpack builds. One, for the worker script that cloudflare will use to generate our initial HTML markup and the other to emit our browser side JS.

We achieved through two separate webpack configs due to the distinctness of both environments.

For the worker, we emit a single, unminified JavaScript file @ `dist/worker`.
For the browser, we split our JavaScript into multiple bundles & apply `terser` minification @ `dist/browser/js`.

We have `scripts` to automate this process. If this is your first time cloning the project, ensure that these scripts are executable.

```shell
$ chmod -R u+x ./scripts
```

The main `scripts/build_prod.sh` will clean up any old files, build the `worker` and `browser` with webpack, publish our browser JS assets to KV, then do a final `wrangler publish` to finish the deploy.

> There has got to be a better way to handle publishing. `wrangler publish` re-runs our webpack build for the worker

Run the script like so at the root of the project.

```shell
$ ./scripts/build_prod.sh
```
