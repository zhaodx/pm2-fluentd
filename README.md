# pm2-fluentd
PM2 Fluentd Plugin

## Install
```javascript
    pm2 install zhaodx/pm2-fluentd
```

## Configuration 
Replace below {{}} with your own variables.
```javascript
    pm2 conf pm2-fluentd:FLUENTD_HOST {{YOUR_FLUENT_HOST}}
    pm2 conf pm2-fluentd:FLUENTD_PORT {{YOUR_FLUENT_PORT}}
    pm2 conf pm2-fluentd:FLUENTD_TAG {{YOUR_FLUENT_TAG}}
```

## Uninstall
```javascript
    pm2 uninstall pm2-fluentd
```