# webpack-bundler

### configure `webpack.options.json`
```json
{
    "title": "Webpack Bundler",
    "public": "/webpack-bundler/",
    "src": "./src/",
    "dist": "./docs/",
    "icon": "./src/img/logo.png",
    "entry": {
        "app": "./src/app/app.ts"
    },
    "alias": {
        "jquery": "jquery/src/jquery"
    },
    "devServer": {
        "port": 9000
    }
}
```

### installation
* `npm install`

### development
* `npm run serve -- -d`
* `npm run watch -- -d`
* `npm run build -- -d`

### production
* `npm run serve -- -p`
* `npm run watch -- -p`
* `npm run build -- -p`
